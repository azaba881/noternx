import { headers } from "next/headers";
import Stripe from "stripe"
import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error) {
        console.error("❌ Erreur de vérification du webhook Stripe :", error);
        return new Response('Erreur webhook stripe', { status: 400 });
    }

    console.log("✅ Webhook reçu :", event.type);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        console.log("✅ Paiement réussi, récupération de l'abonnement...");
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log("📌 Subscription ID :", subscription.id);

        const customerId = String(session.customer);
        const user = await prisma.user.findUnique({
            where: { stripeCustomerId: customerId }
        });

        if (!user) {
            console.error("❌ Utilisateur non trouvé pour le customerId :", customerId);
            return new Response('Utilisateur inexistant', { status: 400 });
        }

        console.log("✅ Utilisateur trouvé :", user.id);
        await prisma.subscription.create({
            data: {
                stripeSubscriptionId: subscription.id,
                userId: user.id,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                status: subscription.status,
                planId: subscription.items.data[0].plan.id,
                interval: String(subscription.items.data[0].plan.interval)
            }
        });

        console.log("✅ Abonnement enregistré dans la base de données !");
    }

    if (event.type === "invoice.payment_succeeded") {
        console.log("✅ Paiement d'une facture réussi, mise à jour de l'abonnement...");
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                planId: subscription.items.data[0].plan.id,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                status: subscription.status
            }
        });
        console.log("✅ Abonnement mis à jour !");
    }

    return new Response(null, { status: 200 });
}
