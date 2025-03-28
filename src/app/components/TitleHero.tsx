"use client"
import React from 'react'
import { Cursor, Typewriter } from 'react-simple-typewriter'

export default function TitleHero() {
  return (
    <div className='w-full flex justify-center items-center'>
        <h1 className="text-4xl md:text-6xl font-black mb-2 text-center uppercase flex items-center">
        <Typewriter
                    words={['Bienvenu', 'Welcome', 'Bienvenudo', 'Wilkommen!']}
                    loop={0} //infini
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                  />
            <span><Cursor/></span>
        </h1>
    </div>
  )
}
