'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SplashScreen() {
  const router = useRouter()
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // 2.3s show, then 300ms fade transition to beranda
    const timer = setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        router.push('/beranda')
      }, 350)
    }, 2400)

    return () => clearTimeout(timer)
  }, [router])

  const handleSkip = () => {
    setFading(true)
    setTimeout(() => {
      router.push('/beranda')
    }, 200)
  }

  return (
    <div
      onClick={handleSkip}
      className={`relative w-full h-full bg-white overflow-hidden select-none cursor-pointer flex flex-col justify-between transition-opacity duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Top Safe Spacing */}
      <div className="w-full h-8" />

      {/* Center Bank Aladin Logo & Slogan */}
      <div className="flex flex-col items-center justify-center -mt-16 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative w-[180px] h-[72px] mb-3">
          <Image
            src="/assets/icons/logo_splash_screen.svg"
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
          <div className="w-2 h-2 rounded-full bg-[#1C20C4] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#1C20C4] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#00F3AD] animate-bounce" style={{ animationDelay: '300ms' }} />
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
  )
}
