import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOption";
import { prisma } from "@/lib/prisma";

// Récupérer l'utilisateur connecté (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Mettre à jour l'utilisateur (PUT)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name } = await req.json();
    
    if (!id || !name) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const userUpdate = await prisma.user.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ message: "User updated", user: userUpdate });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Supprimer l'utilisateur (DELETE)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Supprimer les dépendances avant l'utilisateur
    await prisma.subscription.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.notes.deleteMany({ where: { userId } });

    // Supprimer l'utilisateur
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
