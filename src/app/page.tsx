"use client"
import Footer from "@/components/root/footer"
import Header from "@/components/root/header"
import TitleHero from "./components/TitleHero"
import ButtonProvider from "./components/ButtonProvider"
import { useSession } from "next-auth/react";
import {redirect} from "next/navigation"

export default function Home() { 
  const {data:session} = useSession()
  if(session){
    redirect('/dashboard')
  }
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 dark:bg-black">
      <Header/>
      <main className="flex-1 flex items-center justify-center gap:4 ">
        <section className="w-full py-12 md:py-24 lg:py-10 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <TitleHero/>
                <p className="mx-auto mt-4 max-w-[700px] text-black md:text-xl">
                  Noternx vous permet de créer et accéder à <br/> vos notes depuis n&apos;importe où.
                </p>
              </div>
              <ButtonProvider/>              
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

