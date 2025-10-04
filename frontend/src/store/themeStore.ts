import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeType = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'red' | 'cyan'
export type BackgroundType = 'light' | 'dark'
export type CardColorType = 'white' | 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'gray' | 'gradient'

export interface Theme {
  name: string
  gradient: string
  bgGradient: string
  cardGradient: string
  buttonGradient: string
  hoverGradient: string
  textGradient: string
  accent: string
  light: string
}

export interface BackgroundTheme {
  name: string
  gradient: string
  description: string
  textColor: string
  isDark: boolean
  navbarBg: string
  navbarText: string
  navbarBorder: string
}

export interface CardColor {
  name: string
  bg: string
  border: string
  shadow: string
  hover: string
  description: string
}

export const themes: Record<ThemeType, Theme> = {
  blue: {
    name: 'Bleu Océan',
    gradient: 'from-blue-600 to-purple-600',
    bgGradient: 'from-blue-50 via-white to-purple-50',
    cardGradient: 'from-blue-500 to-blue-600',
    buttonGradient: 'from-blue-600 to-purple-600',
    hoverGradient: 'from-blue-700 to-purple-700',
    textGradient: 'from-blue-600 to-purple-600',
    accent: 'blue',
    light: 'blue-50',
  },
  purple: {
    name: 'Violet Mystique',
    gradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 via-white to-pink-50',
    cardGradient: 'from-purple-500 to-purple-600',
    buttonGradient: 'from-purple-600 to-pink-600',
    hoverGradient: 'from-purple-700 to-pink-700',
    textGradient: 'from-purple-600 to-pink-600',
    accent: 'purple',
    light: 'purple-50',
  },
  green: {
    name: 'Vert Nature',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 via-white to-emerald-50',
    cardGradient: 'from-green-500 to-green-600',
    buttonGradient: 'from-green-600 to-emerald-600',
    hoverGradient: 'from-green-700 to-emerald-700',
    textGradient: 'from-green-600 to-emerald-600',
    accent: 'green',
    light: 'green-50',
  },
  orange: {
    name: 'Orange Soleil',
    gradient: 'from-orange-600 to-red-600',
    bgGradient: 'from-orange-50 via-white to-red-50',
    cardGradient: 'from-orange-500 to-orange-600',
    buttonGradient: 'from-orange-600 to-red-600',
    hoverGradient: 'from-orange-700 to-red-700',
    textGradient: 'from-orange-600 to-red-600',
    accent: 'orange',
    light: 'orange-50',
  },
  pink: {
    name: 'Rose Douceur',
    gradient: 'from-pink-600 to-rose-600',
    bgGradient: 'from-pink-50 via-white to-rose-50',
    cardGradient: 'from-pink-500 to-pink-600',
    buttonGradient: 'from-pink-600 to-rose-600',
    hoverGradient: 'from-pink-700 to-rose-700',
    textGradient: 'from-pink-600 to-rose-600',
    accent: 'pink',
    light: 'pink-50',
  },
  red: {
    name: 'Rouge Passion',
    gradient: 'from-red-600 to-rose-600',
    bgGradient: 'from-red-50 via-white to-rose-50',
    cardGradient: 'from-red-500 to-red-600',
    buttonGradient: 'from-red-600 to-rose-600',
    hoverGradient: 'from-red-700 to-rose-700',
    textGradient: 'from-red-600 to-rose-600',
    accent: 'red',
    light: 'red-50',
  },
  cyan: {
    name: 'Cyan Cristal',
    gradient: 'from-cyan-600 to-blue-600',
    bgGradient: 'from-cyan-50 via-white to-blue-50',
    cardGradient: 'from-cyan-500 to-cyan-600',
    buttonGradient: 'from-cyan-600 to-blue-600',
    hoverGradient: 'from-cyan-700 to-blue-700',
    textGradient: 'from-cyan-600 to-blue-600',
    accent: 'cyan',
    light: 'cyan-50',
  },
}

export const backgrounds: Record<BackgroundType, BackgroundTheme> = {
  light: {
    name: 'Mode Clair',
    gradient: 'from-white via-gray-50 to-white',
    description: 'Interface claire et lumineuse',
    textColor: 'text-gray-900',
    isDark: false,
    navbarBg: 'bg-white',
    navbarText: 'text-gray-700',
    navbarBorder: 'border-gray-200',
  },
  dark: {
    name: 'Mode Sombre',
    gradient: 'from-gray-900 via-gray-800 to-gray-900',
    description: 'Interface sombre et élégante',
    textColor: 'text-gray-100',
    isDark: true,
    navbarBg: 'bg-gray-900',
    navbarText: 'text-gray-200',
    navbarBorder: 'border-gray-700',
  },
}

export const cardColors: Record<CardColorType, CardColor> = {
  white: {
    name: 'Blanc',
    bg: 'bg-white',
    border: 'border-gray-200',
    shadow: 'shadow-lg',
    hover: 'hover:shadow-2xl',
    description: 'Classique et épuré',
  },
  blue: {
    name: 'Bleu',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-200',
    shadow: 'shadow-lg shadow-blue-100',
    hover: 'hover:shadow-2xl hover:shadow-blue-200',
    description: 'Professionnel et calme',
  },
  purple: {
    name: 'Violet',
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-purple-200',
    shadow: 'shadow-lg shadow-purple-100',
    hover: 'hover:shadow-2xl hover:shadow-purple-200',
    description: 'Créatif et moderne',
  },
  green: {
    name: 'Vert',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-200',
    shadow: 'shadow-lg shadow-green-100',
    hover: 'hover:shadow-2xl hover:shadow-green-200',
    description: 'Naturel et apaisant',
  },
  pink: {
    name: 'Rose',
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
    border: 'border-pink-200',
    shadow: 'shadow-lg shadow-pink-100',
    hover: 'hover:shadow-2xl hover:shadow-pink-200',
    description: 'Doux et chaleureux',
  },
  orange: {
    name: 'Orange',
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    border: 'border-orange-200',
    shadow: 'shadow-lg shadow-orange-100',
    hover: 'hover:shadow-2xl hover:shadow-orange-200',
    description: 'Énergique et dynamique',
  },
  gray: {
    name: 'Gris',
    bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
    border: 'border-gray-300',
    shadow: 'shadow-lg shadow-gray-200',
    hover: 'hover:shadow-2xl hover:shadow-gray-300',
    description: 'Neutre et élégant',
  },
  gradient: {
    name: 'Dégradé',
    bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    border: 'border-purple-200',
    shadow: 'shadow-lg shadow-purple-100',
    hover: 'hover:shadow-2xl hover:shadow-purple-200',
    description: 'Coloré et vibrant',
  },
}

interface ThemeStore {
  currentTheme: ThemeType
  currentBackground: BackgroundType
  currentCardColor: CardColorType
  setTheme: (theme: ThemeType) => void
  setBackground: (background: BackgroundType) => void
  setCardColor: (color: CardColorType) => void
  getTheme: () => Theme
  getBackground: () => BackgroundTheme
  getCardColor: () => CardColor
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'blue',
      currentBackground: 'light',
      currentCardColor: 'white',
      setTheme: (theme: ThemeType) => set({ currentTheme: theme }),
      setBackground: (background: BackgroundType) => set({ currentBackground: background }),
      setCardColor: (color: CardColorType) => set({ currentCardColor: color }),
      getTheme: () => themes[get().currentTheme] || themes.blue,
      getBackground: () => backgrounds[get().currentBackground] || backgrounds.light,
      getCardColor: () => cardColors[get().currentCardColor] || cardColors.white,
    }),
    {
      name: 'theme-storage',
      version: 2,
    }
  )
)
