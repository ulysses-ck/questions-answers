import { create } from 'zustand'
import { Question } from '@/types/gemini'

interface GeminiConfig {
  apiKey: string
  model: string
  temperature: number
}

interface Progress {
  current: number
  total: number
}

interface GeminiState {
  config: GeminiConfig
  questions: Question[]
  isLoading: boolean
  error: string | null
  progress: Progress
  setConfig: (config: Partial<GeminiConfig>) => void
  setQuestions: (questions: Question[]) => void
  clearQuestions: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setProgress: (progress: Progress) => void
}

export const useGeminiStore = create<GeminiState>()((set) => ({
  config: {
    apiKey: '',
    model: '',
    temperature: 0.7,
  },
  questions: [],
  isLoading: false,
  error: null,
  progress: {
    current: 0,
    total: 0,
  },
  setConfig: (newConfig) => 
    set((state) => ({ 
      config: { ...state.config, ...newConfig } 
    })),
  setQuestions: (questions) => set({ questions }),
  clearQuestions: () => set({ questions: [] }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProgress: (progress) => set({ progress }),
}))
