"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deletNote } from "@/lib/actionsNotes"
import {toast} from "react-toastify"

interface DeleteButtonProps{
    id:string
}
export default function ButtonDelete({id}: DeleteButtonProps){   
    const handleSubmit = () =>{
        toast.success('Notes supprime avec succes')
    }
    return (
        <form action={deletNote} onClick={handleSubmit}>
            <Input type="hidden" name="id" value={id} />
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white mx-1">Delete</Button>
        </form>
    )
}
