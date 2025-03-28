import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOption";

// Récupérer toutes les notes de l'utilisateur (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.notes.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Créer une nouvelle note (POST)
// Créer une nouvelle note (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, completed } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }

    // Transformer "completed" en booléen si nécessaire
    const note = await prisma.notes.create({
      data: {
        userId: session.user.id,
        title,
        description,
        completed: completed === true, // Assurez-vous de recevoir un booléen
      },
    });

    // Retourner la note créée dans la réponse
    return NextResponse.json({ message: "Note created", note });
  } catch (error) {
    console.error("Erreur lors de la création de la note :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// Supprimer une note (DELETE)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Note ID required" }, { status: 400 });
    }

    await prisma.notes.delete({ where: { id } });

    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Mettre à jour une note (PUT)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description, completed } = await req.json();
    if (!id || !title || !description) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const updatedNote = await prisma.notes.update({
      where: { id },
      data: { title, description, completed: completed === "on" },
    });

    return NextResponse.json({ message: "Note updated", note: updatedNote });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
