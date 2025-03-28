"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar" 
import { ThemeToggle } from "../components/ThemeToggle"
import DashboardSidebar from "@/components/dashboard/sidebar"
import type { User } from "next-auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Type explicit de l'état user
  const { data: session, status } = useSession(); // Utilisation de next-auth pour la session
  const router = useRouter(); // Initialisation du hook de redirection

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirection vers la page d'accueil si l'utilisateur n'est pas connecté
    } else if (session) {
      setUser(session.user); // Affecte correctement l'utilisateur authentifié
    }
  }, [status, session, router]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <DashboardSidebar user={user} />
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
