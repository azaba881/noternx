"use client"

import Link from "next/link"
import Image from "next/image"

import React from 'react'
import { ThemeToggle } from "./ThemeToggle"

export default function Nav() {  
  return (
    <nav className="max-w-[1200px] w-full mx-auto h-[80px] flex items-center justify-between p-5 border-b border-gray-300">
        <div>
            <Link href="/">
                <Image src="/vercel.svg" alt="logo du site" width={30} height={30} className="w-12 h-12"/>
            </Link>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle/>
        </div>
    </nav>
  )
}