'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PageContextType {
  title: string
  subtitle: string
  setPageTitle: (title: string, subtitle?: string) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  const setPageTitle = (newTitle: string, newSubtitle?: string) => {
    setTitle(newTitle)
    setSubtitle(newSubtitle || '')
  }

  return (
    <PageContext.Provider value={{ title, subtitle, setPageTitle }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePageTitle() {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageProvider')
  }
  return context
}
