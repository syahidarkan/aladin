'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { CarpetPose, MascotFace } from '@/components/mascot/CarpetModel'

export type MascotReaction = 'success' | 'lock-action' | 'copy-success' | 'shake-warning'
export type TransitionPhase = 'covering' | 'revealing'

interface MascotContextType {
  // Global Mascot Pose & Expression
  currentPose: CarpetPose
  currentFace: MascotFace
  setPose: (pose: CarpetPose, autoResetDurationMs?: number) => void
  setFace: (face: MascotFace, autoResetDurationMs?: number) => void
  activeAction: string | null
  triggerMascotAction: (actionName: string, durationMs?: number) => void

  // Navigation & Page Transitions
  isTransitioning: boolean
  transitionPhase: TransitionPhase
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

  // Dynamic Acting Pose & Face
  const [currentPose, setCurrentPoseState] = useState<CarpetPose>('idle')
  const [currentFace, setCurrentFaceState] = useState<MascotFace>('cheerful')
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const poseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const faceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const actionTimerRef = useRef<NodeJS.Timeout | null>(null)

  const setPose = useCallback((pose: CarpetPose, autoResetDurationMs?: number) => {
    if (poseTimerRef.current) clearTimeout(poseTimerRef.current)
    setCurrentPoseState(pose)

    if (autoResetDurationMs && autoResetDurationMs > 0) {
      poseTimerRef.current = setTimeout(() => {
        setCurrentPoseState('idle')
      }, autoResetDurationMs)
    }
  }, [])

  const setFace = useCallback((face: MascotFace, autoResetDurationMs?: number) => {
    if (faceTimerRef.current) clearTimeout(faceTimerRef.current)
    setCurrentFaceState(face)

    if (autoResetDurationMs && autoResetDurationMs > 0) {
      faceTimerRef.current = setTimeout(() => {
        setCurrentFaceState('cheerful')
      }, autoResetDurationMs)
    }
  }, [])

  const triggerMascotAction = useCallback((actionName: string, durationMs: number = 2500) => {
    if (actionTimerRef.current) clearTimeout(actionTimerRef.current)
    setActiveAction(actionName)

    actionTimerRef.current = setTimeout(() => {
      setActiveAction(null)
    }, durationMs)
  }, [])

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('covering')
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

  // Cinematic page transition execution (Cinematic Blanket Sweep per Animation Brief)
  const startTransition = useCallback((url: string) => {
    setTransitionTarget(url)
    setTransitionPhase('covering')
    setIsTransitioning(true)

    // Phase 1: Alan sweeps across camera diagonally and blankets the entire screen (650ms)
    setTimeout(() => {
      // Phase 2: Route swaps smoothly while camera is 100% blanketed by rich royal blue cloth
      router.push(url)
      setTransitionPhase('revealing')

      // Phase 3: Alan darts out towards top-right with star trail to reveal new page (420ms)
      setTimeout(() => {
        setIsTransitioning(false)
        setTransitionTarget(null)
      }, 420)
    }, 650)
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

    reactionTimerRef.current = setTimeout(() => {
      setActiveReaction(null)
      setReactionMessage(null)
    }, 2800)
  }, [])

  return (
    <MascotContext.Provider
      value={{
        currentPose,
        currentFace,
        setPose,
        setFace,
        activeAction,
        triggerMascotAction,
        isTransitioning,
        transitionPhase,
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
