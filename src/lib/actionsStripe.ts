"use server"

import { PrismaClient } from "@prisma/client"
import { getStripeSession, stripe } from "./stripe"
import { redirect } from "next/navigation"
import { getUser } from "./actionsUser"

const prisma = new PrismaClient;

export const getDataStripeUser = async ( userId:string)=>{
    const data = await prisma.subscription.findUnique({
        where : {userId:userId},
        select:{
            status:true,
            user:{
                select:{
                    stripeCustomerId:true,
                }
            }
        }
    })
    return data;
}

export const createSubscription = async () =>{
    const user = await getUser();
    const dbUser = await prisma.user.findUnique({
        where:{
            id: user?.id
        },
        select:{
            stripeCustomerId:true,
        }
    })
    const subscriptionUrl = await getStripeSession({
        customerId: dbUser?.stripeCustomerId as string,
        domainUrl: "http://localhost:3000",
        priceId : process.env.STRIPE_APP_ID as string
    })
    return redirect(subscriptionUrl);
}

export const createCustomerPortal = async ()=>{
    const user = await getUser();
    const session = await stripe.billingPortal.sessions.create({
        customer: user?.stripeCustomerId as string,
        return_url : 'http://localhost:3000/dashboard/subscription'
    })
    redirect(session.url)
}