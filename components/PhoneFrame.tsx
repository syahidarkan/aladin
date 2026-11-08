'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import CarpetFloatingBuddy from '@/components/mascot/CarpetFloatingBuddy'
import CarpetPageTransition from '@/components/mascot/CarpetPageTransition'
import CarpetLoader from '@/components/mascot/CarpetLoader'
import CarpetReactionToast from '@/components/mascot/CarpetReactionToast'
import { useMascot } from '@/context/MascotContext'

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { startTransition, isTransitioning } = useMascot()
  const [showSplash, setShowSplash] = useState(false)
  const [fading, setFading] = useState(false)

  // Global Page Navigation Interceptor for Mascot Transition
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      // Only internal routes (starts with / and not hash or external or download)
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('/#') &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        const cleanHref = href.split('?')[0].replace(/\/$/, '') || '/'
        const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/'
        if (cleanHref === cleanPath || isTransitioning) return

        e.preventDefault()
        startTransition(href)
      }
    }

    document.addEventListener('click', handleGlobalClick, { capture: true })
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true })
  }, [pathname, isTransitioning, startTransition])

  useEffect(() => {
    // Only show splash on very first session load; do NOT show every time user navigates back to home
    const hasSeenSplash = typeof window !== 'undefined' ? sessionStorage.getItem('aladin_has_seen_splash') : 'true'
    
    if (!hasSeenSplash) {
      setShowSplash(true)
      const timer = setTimeout(() => {
        setFading(true)
        setTimeout(() => {
          setShowSplash(false)
          sessionStorage.setItem('aladin_has_seen_splash', 'true')
          if (pathname === '/') {
            router.replace('/beranda')
          }
        }, 350)
      }, 2000)

      return () => clearTimeout(timer)
    } else if (pathname === '/') {
      // If already seen and at root, redirect straight to beranda
      router.replace('/beranda')
    }
  }, [pathname, router])

  const handleSkip = () => {
    setFading(true)
    setTimeout(() => {
      setShowSplash(false)
      sessionStorage.setItem('aladin_has_seen_splash', 'true')
      if (pathname === '/') {
        router.replace('/beranda')
      }
    }, 200)
  }

  return (
    <div className="phone-wrapper">
      <div className="phone-screen relative flex flex-col overflow-hidden">
        {/* Universal Splash Screen on Every Reload / Entry */}
        {showSplash && (
          <div
            onClick={handleSkip}
            className={`absolute inset-0 z-[9999] bg-white overflow-hidden select-none cursor-pointer flex flex-col justify-between transition-opacity duration-300 ${
              fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {/* Top Safe Spacing */}
            <div className="w-full h-8" />

            {/* Center Bank Aladin Logo & Slogan */}
            <div className="flex flex-col items-center justify-center -mt-16 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative w-[150px] h-[64px] mb-3">
                <Image
                  src="/assets/icons/splash_logo.png"
                  alt="Bank Aladin Syariah"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[13px] font-semibold text-[#64748B] tracking-wide">
                Bikin Berkah Setiap Hari
              </p>

              {/* Subtle Loading Spinner Indicator */}
              <div className="flex items-center gap-1.5 mt-8">
                <div
                  className="w-2 h-2 rounded-full bg-[#1C20C4] animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#1C20C4] animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#00F3AD] animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>

            {/* Bottom Illustration (Original high-fidelity PNG crop) */}
            <div className="relative w-full h-[240px] pointer-events-none">
              <Image
                src="/assets/illustrations/splash_bottom.png"
                alt="Aladin Illustration"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        )}

        {/* Scrollable Active Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Global Floating Mascot Companion & Relationship Desk (Available Across All Pages) */}
        {!showSplash && <CarpetFloatingBuddy />}

        {/* Global Bottom Navigation Bar (Always Present Across All Pages) */}
        {!showSplash && <BottomNav />}

        {/* Global 3D Mascot Transition & Overlays - Covers ENTIRE phone screen including BottomNav */}
        <CarpetPageTransition />
        <CarpetLoader />
        <CarpetReactionToast />
      </div>
    </div>
  )
}
