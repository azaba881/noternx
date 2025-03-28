"use server"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/AuthOption"
import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"
import { toast } from "react-toastify"

export const getUser = async () =>{
    const session = await getServerSession(authOptions);
    if(!session || !session.user || !session.user.id){
        redirect("/") 
    }
    const id = session.user.id as string
    const user = await prisma.user.findUnique({
        where :{id:id},
    })
    return user
}

export const updateUser = async (formData: FormData) => {
    try {
      const userName = formData.get("name") as string;
      const id = formData.get("id") as string;
  
      // Validation simple
      if (!userName || !id) {
        toast.error("Nom ou ID manquant");
        return; // Si une erreur est trouvée, on arrête la soumission
      }
  
      // Mise à jour dans la base de données
      await prisma.user.update({
        where: { id },
        data: { name: userName },
      });
  
      // Si la mise à jour réussit
      toast.success("Compte modifié avec succès");
  
      // Révalidation de la page après la mise à jour
      revalidatePath("/dashboard/settings");
  
    } catch (error) {
      // Gestion des erreurs
      console.error("Une erreur est survenue lors de la modification:", error);
    }
  };

  export const deleteUser = async () => {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session || !session.user || !session.user.id) {
        redirect("/");
        return;
      }
  
      const userId = session.user.id as string;
  
      // Supprimer les entités liées AVANT l'utilisateur
      await prisma.subscription.deleteMany({ where: { userId } });
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.account.deleteMany({ where: { userId } });
      await prisma.notes.deleteMany({ where: { userId } });
  
      // Supprimer l'utilisateur après avoir supprimé les dépendances
      await prisma.user.delete({ where: { id: userId } });
  
      redirect("/");

    } catch (error) {
      console.log("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };