import React from 'react'
import {  FileType } from 'lucide-react'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-black">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <FileType className='text-red-500 size-10'/>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent text-2xl font-bold">
            Noternx
            </span>
          </div>
          <ThemeToggle/>
        </div>
    </header>
  )
}
