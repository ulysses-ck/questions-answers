'use client'

import { ReactNode } from 'react'
import { GeminiProvider } from '@/providers/gemini-provider'

interface GenerateLayoutProps {
  children: ReactNode
}

export default function GenerateLayout({ children }: GenerateLayoutProps) {
  return (
    <GeminiProvider>
      {children}
    </GeminiProvider>
  )
}
