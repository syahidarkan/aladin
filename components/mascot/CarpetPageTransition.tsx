'use client'

import React from 'react'
import Image from 'next/image'
import { useMascot } from '@/context/MascotContext'

/**
 * Cinematic Page Transition Overlay with 3D Aladin Flying Carpet Mascot
 * Executes user-specified animation:
 * 1. Flying from far away in the distance
 * 2. Swooping closer and expanding until its body completely blankets the entire screen
 * 3. Route swaps behind the covered screen
 * 4. Swoops out forward past camera, cleanly revealing the newly mounted page!
 */
export default function CarpetPageTransition() {
  const { isTransitioning, transitionPhase } = useMascot()

  if (!isTransitioning) return null

  const isCovering = transitionPhase === 'covering'

  return (
    <div
      className="absolute inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden select-none"
      style={{
        background: isCovering
          ? 'linear-gradient(135deg, #051230 0%, #0D2D8A 50%, #1037A6 100%)'
          : 'transparent',
        transition: 'background 0.35s ease',
      }}
    >
      {/* Flying Carpet Mascot Actor */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          animation: isCovering
            ? 'carpetFlyInCover 0.42s cubic-bezier(0.25, 0.9, 0.3, 1) forwards'
            : 'carpetFlyOutReveal 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}
      >
        {/* Mascot High-Res 3D Image */}
        <div
          className="relative w-64 h-52 pointer-events-none"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0, 240, 160, 0.6)) drop-shadow(0 8px 16px rgba(16, 55, 166, 0.5))',
          }}
        >
          <Image
            src="/assets/mascot/karpet_mascot_clean.png"
            alt="Maskot Karpet Terbang Aladin"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Dynamic Flying Star Particles */}
        <span className="absolute -top-6 -left-8 text-[#00F0A0] text-xl animate-star-twinkle">✦</span>
        <span className="absolute top-10 -right-10 text-emerald-300 text-lg animate-star-twinkle" style={{ animationDelay: '200ms' }}>★</span>
        <span className="absolute -bottom-4 right-4 text-[#00F0A0] text-sm animate-star-twinkle" style={{ animationDelay: '400ms' }}>✦</span>

        {/* Subtext info */}
        {isCovering && (
          <div className="mt-2 text-center animate-in fade-in duration-200">
            <span className="text-[12px] font-black uppercase tracking-widest text-[#00F0A0] block">
              #PakaiAladin
            </span>
            <span className="text-[11px] text-white/90 font-medium">
              Bikin Berkah Setiap Hari ✨
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
