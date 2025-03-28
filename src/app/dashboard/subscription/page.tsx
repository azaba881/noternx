import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createCustomerPortal, createSubscription, getDataStripeUser } from "@/lib/actionsStripe";
import { getUser } from "@/lib/actionsUser";
import Image from "next/image";

export default async function SubscriptionPage() {
  const user = await getUser();
  const dataStripe = await getDataStripeUser(user?.id as string);

  // Vérifier si l'utilisateur a un abonnement actif
  if (dataStripe?.status === "active") {
    return (
      <div className="max-w-lg mx-auto space-y-4 my-3">
        <Card className="flex flex-col">
          <CardContent className="py-8">
            <div>
              <h3 className="text-md font-black uppercase bg-orange-900 bg-opacity-20 text-orange-500 p-3 rounded-md inline">
                Pass premium
              </h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Modifier votre abonnement premium
              </p>
              <Image src="/images/premium.png" width={100} height={100} alt="badge" className="block my-4" />
              <form className="w-full mt-4" action={createCustomerPortal}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full my-2">Modifier abonnement</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold">Abonnement</h3>
          <p className="text-muted-foreground">Gérez votre abonnement et vos options de paiement.</p>
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gratuit</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-green-500">0 €</span> / mois
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Jusqu&lsquo;à 10 notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Fonctionnalités de base</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Plan actuel
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-center">
                <h3 className="text-md font-black uppercase bg-green-500 bg-opacity-20 text-white p-3 rounded-md inline mb-4">
                  Pass premium
                </h3>
              </CardTitle>
              <CardDescription className="mt-3">
                <span className="text-3xl font-bold text-green-500">12 €</span> / mois
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Notes illimitées</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Support prioritaire</span>
              </div>
            </CardContent>
            <CardFooter>
              <form action={createSubscription}>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Passer au Premium</Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
}
