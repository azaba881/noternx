import { handleSubmit } from "@/app/components/handleSubmit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getUser, updateUser } from "@/lib/actionsUser"

export default async function SettingsPage() {
  const user = await getUser()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Paramètres</h3>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte.</p>
      </div>
      <Separator />
      <div className="w-full">
      <form action={updateUser} onSubmit={handleSubmit} className="pt-2 w-full">
        <Input type="hidden" name="id" value={user?.id} />
        <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idUser">ID</Label>
                <Input type="text" name="idUser" disabled defaultValue={user?.id || ""} />
              </div>
              <div className="flex w-full  gap-2">
                <div className="flex-1">
                  <Label htmlFor="name" className="mb-2">Nom</Label>
                  <Input type="text" name="name" defaultValue={user?.name || ""}/>
                </div>
                <div className="flex-1">
                  <Label htmlFor="email" className="mb-2">Email</Label>
                  <Input type="text" name="email" disabled defaultValue={user?.email || ""}/>
                </div>
              </div>              
            </CardContent>
            <CardFooter>
              <Button type="submit">Enregistrer</Button>
            </CardFooter>
        </Card>
      </form>
      <form className="mt-2">
        <Input type="hidden" name="id" value="" />
        <Button className="bg-red-500 hover:bg-red-600 mx-1 my-2 text-white" type="submit">Supprimer mon compte</Button>
      </form>
      </div>
    </div>
  )
}

