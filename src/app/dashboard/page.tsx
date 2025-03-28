"use client"
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import "react-toastify/dist/ReactToastify.css";

interface Note {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null); // For editing
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/notes");
        const data = await response.json();
        if (response.ok) {
          setNotes(data);
        } else {
          setError(data.error || "Erreur lors de la récupération des notes");
        }
      } catch {
        setError("Une erreur est survenue lors de la récupération des notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // const handleSubmit = () => {
  //   if (error) {
  //     toast.error(`Error: ${error}`);
  //   } else {
  //     toast.success("Note added successfully!");
  //   }
  // };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNote.title,
          description: newNote.description,
          completed: newNote.completed,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotes((prevNotes) => [data.note, ...prevNotes]);
        setNewNote({ title: "", description: "", completed: false });
        setOpen(false);
      } else {
        setError(data.error || "Erreur lors de l'ajout de la note");
      }
    } catch {
      setError("Une erreur est survenue lors de l'ajout de la note");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit note click
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      description: note.description,
      completed: note.completed,
    });
    setOpen(true);
  };

  // Handle update note
  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingNote?.id,
          title: newNote.title,
          description: newNote.description,
          completed: newNote.completed,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNote?.id ? { ...note, ...newNote } : note
          )
        );
        setNewNote({ title: "", description: "", completed: false });
        setEditingNote(null);
        setOpen(false);
      } else {
        setError(data.error || "Erreur lors de la mise à jour de la note");
      }
    } catch {
      setError("Une erreur est survenue lors de la mise à jour de la note");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      } else {
        setError(data.error || "Erreur lors de la suppression de la note");
      }
    } catch {
      setError("Une erreur est survenue lors de la suppression de la note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes Notes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={editingNote ? handleUpdateNote : handleAddNote}>
              <DialogHeader>
                <DialogTitle>{editingNote ? "Modifier la note" : "Ajouter une nouvelle note"}</DialogTitle>
                <DialogDescription>
                  <span>{editingNote ? "Modifiez les détails de la note ci-dessous." : "Créez une nouvelle note en remplissant les champs ci-dessous."}</span>
                  <br />
                  {error && (
                    <span className="bg-red-500 text-white p-2 mt-4 mb-2 text-center">
                      {error}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    placeholder="Titre de la note"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description de la note"
                    value={newNote.description}
                    onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2 flex items-center gap-4">
                  <div className="mt-2">
                    <label htmlFor="completed">
                      <span className="font-bold text-green-500">Completed</span> /
                      <span className="font-bold text-red-500"> No completed</span>
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    id="completed"
                    checked={newNote.completed}
                    onChange={(e) => setNewNote({ ...newNote, completed: e.target.checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-blue-500" type="submit" disabled={loading}>
                  {loading ? (editingNote ? "Mise à jour..." : "Ajout en cours...") : (editingNote ? "Mettre à jour" : "Ajouter la note")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium">Aucune note</h3>
            <p className="text-sm text-muted-foreground">Commencez par ajouter une nouvelle note.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>{new Date(note.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{note.description}</p>
                <p className="text-sm mt-2">Status : {note.completed ? <span className="badge bg-red-500 p-1 rounded-full text-white">Traitée</span> : <span className="badge bg-green-500 p-1 rounded-full text-white">En cours</span>}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={loading}
                >
                  {loading ? "Suppression..." : "Supprimer"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
