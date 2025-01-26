import { create } from 'zustand'
import { Question } from '@/types/gemini'
import { DEFAULT_SYSTEM_PROMPT } from '@/services/implementations/GeminiQuestionnaireService'

interface GeminiConfig {
  apiKey: string
  model: string
  temperature: number
  systemPrompt?: string
  safetySettings: Array<{
    category: string
    threshold: string
  }>
}

interface Progress {
  current: number
  total: number
}

interface GeminiState {
  config: GeminiConfig
  questions: Question[]
  generatedQuestions: Question[]
  isLoading: boolean
  error: string | null
  progress: Progress
  setConfig: (config: Partial<GeminiConfig>) => void
  setQuestions: (questions: Question[]) => void
  addGeneratedQuestion: (question: Question) => void
  clearQuestions: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setProgress: (progress: Progress) => void
}

const DEFAULT_CONFIG: GeminiConfig = {
  apiKey: '',
  model: '',
  temperature: 0.3,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE'
    }
  ]
}

const STORAGE_KEY = 'gemini-config'

const getInitialConfig = (): GeminiConfig => {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return DEFAULT_CONFIG

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse stored config:', error)
    return DEFAULT_CONFIG
  }
}

export const useGeminiStore = create<GeminiState>()((set) => ({
  config: getInitialConfig(),
  questions: [],
  generatedQuestions: [],
  isLoading: false,
  error: null,
  progress: {
    current: 0,
    total: 0,
  },
  setConfig: (newConfig) => 
    set((state) => {
      const updatedConfig = { ...state.config, ...newConfig }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig))
        } catch (error) {
          console.error('Failed to save config:', error)
        }
      }
      return { 
        config: updatedConfig,
        error: null // Clear any previous errors when config changes
      }
    }),
  setQuestions: (questions) => set({ questions }),
  addGeneratedQuestion: (question) => 
    set((state) => ({
      generatedQuestions: [...state.generatedQuestions, question],
      error: null // Clear any previous errors when adding questions
    })),
  clearQuestions: () => set({ 
    questions: [], 
    generatedQuestions: [],
    error: null // Clear any previous errors when clearing questions
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProgress: (progress) => set({ progress }),
}))
