"use client"
import type { User } from "next-auth"
import Link from "next/link"
import { CreditCard, FileType, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import Image from "next/image"

export default function DashboardSidebar({ user }: { user: User | null }) {
  const handleSignOut = () => {
    signOut();
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 justify-center items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <FileType className='text-red-500 size-10'/>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent text-2xl font-bold">
            Noternx
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/subscription">
                <CreditCard className="h-4 w-4" />
                <span>Abonnement</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.image as string} alt="Avatar" />
            <AvatarFallback>
              <Image src={user?.image as string || "/next.svg"} width={100} height={100} alt="Avatar" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
          <Button onClick={handleSignOut} variant="ghost" size="icon" className="ml-auto cursor-pointer text-red-600">
            <LogOut className="h-4 w-4 text-red-600" />
            <span className="sr-only">Déconnexion</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
