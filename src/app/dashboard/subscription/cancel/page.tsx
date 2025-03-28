import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CancelPage() {
  return (
    <section className='w-full h-auto pt-0 text-center'>
        <Card className='w-[400px] mx-auto p-4'>
            <BadgeCheck className='mb-3 size-20 text-red-500 text-center w-full'/>
            <h1 className='text-xl font-black mb-2 text-center uppercase'>Paiement échoué</h1> 
            <p className='text-muted-foreground text-sm mb-2'>Votre paiement a echoué premium</p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/dashboard/payment">Retour vers le dashboard</Link>
            </Button>
        </Card>
    </section>
  )
}
