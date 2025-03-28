import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getStripeSession, stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOption";

const prisma = new PrismaClient();

// Récupérer les données Stripe de l'utilisateur (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: {
        status: true,
        user: { select: { stripeCustomerId: true } },
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données Stripe :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Créer une souscription Stripe (POST)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer found" }, { status: 400 });
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl: process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000",
      priceId: process.env.STRIPE_APP_ID as string,
    });

    return NextResponse.json({ url: subscriptionUrl });
  } catch (error) {
    console.error("Erreur lors de la création de la souscription :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Créer un portail client Stripe (PUT)
export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer found" }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_DOMAIN_URL + "/dashboard/payment",
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Erreur lors de la création du portail client Stripe :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
