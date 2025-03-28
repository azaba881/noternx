import React from 'react'
import { Card } from '@/components/ui/card'
import { BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SuccessPage() { 
  return (
    <section className='w-full h-auto pt-0 text-center'>
        <Card className='w-[400px] mx-auto p-4'>
            <BadgeCheck className='mb-3 size-20 text-green-500 text-center w-full'/>
            <h1 className='text-xl font-black mb-2 text-center uppercase'>Paiement réussi</h1> 
            <p className='text-muted-foreground text-sm mb-2'>Vous etes maintenant premium</p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/dashboard/payment">Retour vers le dashboard</Link>
            </Button>
        </Card>
    </section>
  )
}
