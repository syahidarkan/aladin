'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export type MascotReaction = 'success' | 'lock-action' | 'copy-success' | 'shake-warning'

interface MascotContextType {
  // Navigation & Page Transitions
  isTransitioning: boolean
  transitionTarget: string | null
  startTransition: (url: string) => void

  // Global Loader
  isLoading: boolean
  loadingText: string
  showLoader: (text?: string) => void
  hideLoader: () => void

  // Floating Buddy State
  isBuddyVisible: boolean
  setBuddyVisible: (visible: boolean) => void
  isCsMenuOpen: boolean
  setIsCsMenuOpen: (open: boolean) => void

  // Contextual Reactions
  activeReaction: MascotReaction | null
  reactionMessage: string | null
  triggerReaction: (type: MascotReaction, message?: string) => void
}

const MascotContext = createContext<MascotContextType | undefined>(undefined)

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null)

  // Loader state
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Memproses...')

  // Buddy & CS Menu state
  const [isBuddyVisible, setBuddyVisible] = useState(true)
  const [isCsMenuOpen, setIsCsMenuOpen] = useState(false)

  // Reaction state
  const [activeReaction, setActiveReaction] = useState<MascotReaction | null>(null)
  const [reactionMessage, setReactionMessage] = useState<string | null>(null)
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cinematic page transition execution
  const startTransition = useCallback((url: string) => {
    setTransitionTarget(url)
    setIsTransitioning(true)

    // Phase 1 -> Phase 2 (380ms): Carpet zooms into screen covering camera
    setTimeout(() => {
      // Phase 3: Route Swap
      router.push(url)

      // Phase 4: Fly-out & reveal new page
      setTimeout(() => {
        setIsTransitioning(false)
        setTransitionTarget(null)
      }, 350)
    }, 420)
  }, [router])

  // Loader triggers
  const showLoader = useCallback((text: string = 'Memproses transaksi...') => {
    setLoadingText(text)
    setIsLoading(true)
  }, [])

  const hideLoader = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Reactive micro-interaction trigger
  const triggerReaction = useCallback((type: MascotReaction, message?: string) => {
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current)
    }

    setActiveReaction(type)
    setReactionMessage(message || null)

    // Auto-dismiss reaction after 2.8s
    reactionTimerRef.current = setTimeout(() => {
      setActiveReaction(null)
      setReactionMessage(null)
    }, 2800)
  }, [])

  return (
    <MascotContext.Provider
      value={{
        isTransitioning,
        transitionTarget,
        startTransition,
        isLoading,
        loadingText,
        showLoader,
        hideLoader,
        isBuddyVisible,
        setBuddyVisible,
        isCsMenuOpen,
        setIsCsMenuOpen,
        activeReaction,
        reactionMessage,
        triggerReaction,
      }}
    >
      {children}
    </MascotContext.Provider>
  )
}

export function useMascot() {
  const context = useContext(MascotContext)
  if (!context) {
    throw new Error('useMascot must be used within a MascotProvider')
  }
  return context
}

