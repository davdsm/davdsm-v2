import { createContext, useContext, useRef, useState } from 'react'
import { translations } from './translations'

const STORAGE_KEY = 'davdsm-lang'
export const LANGUAGE_TRANSITION_MS = 260

const LanguageContext = createContext(null)

function readStoredLang() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'pt' ? 'pt' : 'en'
}

function lookup(dict, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), dict)
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)
  const [transitioning, setTransitioning] = useState(false)
  const timeoutRef = useRef(null)

  const setLanguage = (next) => {
    if (next === lang) return
    const commit = () => {
      setLang(next)
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* noop */
      }
    }
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      commit()
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTransitioning(true)
    timeoutRef.current = setTimeout(() => {
      commit()
      setTransitioning(false)
    }, LANGUAGE_TRANSITION_MS)
  }

  const toggle = () => setLanguage(lang === 'en' ? 'pt' : 'en')
  const t = (path) => {
    const value = lookup(translations[lang], path)
    if (value != null) return value
    const fallback = lookup(translations.en, path)
    return fallback != null ? fallback : path
  }

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggle, t, transitioning }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
