"use server"

import { redirect } from "next/navigation"
import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"
import { getUser } from "./actionsUser"

export const getAllNotes = async (userId:string)=>{
  const data = await prisma.notes.findMany({
    where :{userId:userId},
    orderBy:{createdAt:"desc"}
  });
  return data
}

export const createNote = async (formData:FormData) => {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const completed = formData.get('completed')
    const user = await getUser();
    const userId = user?.id as string
  await prisma.notes.create({
    data:{
      userId:userId,
      title:title,
      description:description,
      completed:completed ==="on",
    }
  });
  redirect('../dashboard/notes')
}

export const deletNote = async(formData:FormData)=>{
  const id = formData.get('id') as string
  await prisma.notes.delete({
    where:{id}
  });
  revalidatePath('../dashboard/notes')
}

//**********single note function */

export const getNote = async(id:string)=>{
  const note = await prisma.notes.findUnique({
    where:{id}
  });
  return note;
}

export const updateNote = async (formData: FormData) => {
  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const completed = formData.get('completed'); // ✅ Convertir en booléen

    if (title && description) { // ✅ Vérification correcte
      await prisma.notes.update({
        where: { id },
        data: { title, description, completed: completed === "on" }
      });
      // redirect('/dashboard/notes');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note', error);
  }finally{
    redirect('/dashboard/notes');
  }
};