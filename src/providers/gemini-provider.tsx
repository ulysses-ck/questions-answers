'use client'

import { type ReactNode } from 'react'
import { useGeminiStore } from '@/stores/gemini-store'

interface GeminiProviderProps {
  children: ReactNode
}

export function GeminiProvider({ children }: GeminiProviderProps) {
  return children
}

// Export store hooks for convenience
export const useGeminiConfig = () => useGeminiStore((state) => state.config)
export const useGeminiQuestions = () => useGeminiStore((state) => state.questions)
export const useGeminiLoading = () => useGeminiStore((state) => state.isLoading)
export const useGeminiError = () => useGeminiStore((state) => state.error)
export const useGeminiProgress = () => useGeminiStore((state) => state.progress)

// Export store actions
export const useGeminiActions = () => useGeminiStore((state) => ({
  setConfig: state.setConfig,
  setQuestions: state.setQuestions,
  clearQuestions: state.clearQuestions,
  setLoading: state.setLoading,
  setError: state.setError,
  setProgress: state.setProgress,
}))
