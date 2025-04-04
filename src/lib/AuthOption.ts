import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {prisma} from "@/lib/prisma"

export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,  
            clientSecret: process.env.GITHUB_SECRET as string,  
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,  
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,  
        })
    ],
    callbacks: {    
        session : async({session,user})=>{
            if(session.user){
                session.user.id=user.id
            }
            return session
        },
        async redirect() {
          return "/dashboard"; // Redirige toujours vers /dashboard après la connexion
        },
    }
}