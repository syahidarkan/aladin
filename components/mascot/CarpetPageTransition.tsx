'use client'

import React from 'react'
import { useMascot } from '@/context/MascotContext'

/**
 * Cinematic Page Transition Overlay with Aladin Flying Carpet Maskot
 * Performs a dynamic swoop-and-zoom animation where the flying carpet
 * flies directly toward the camera, expands its royal blue velvet body to cover
 * the screen for route transition, and then swoops out smoothly.
 */
export default function CarpetPageTransition() {
  const { isTransitioning } = useMascot()

  if (!isTransitioning) return null

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A1020 0%, #1037A6 50%, #00F0A0 100%)',
        animation: 'carpetTransitionIn 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }}
    >
      {/* Dynamic 3D Flying Mascot Graphic during Zoom */}
      <div className="relative flex flex-col items-center justify-center scale-up-carpet">
        <div className="relative w-48 h-40 filter drop-shadow-[0_20px_35px_rgba(0,240,160,0.4)]">
          <svg
            viewBox="0 0 120 100"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Aerodynamic Body */}
            <path
              d="M12 60 C 18 30, 36 24, 60 40 C 84 56, 102 36, 110 20 C 112 25, 108 50, 84 66 C 60 82, 30 76, 12 60 Z"
              fill="#154AD8"
            />
            {/* Turquoise Border */}
            <path
              d="M12 60 C 18 34, 34 28, 58 42 C 82 56, 98 38, 108 24"
              stroke="#00F0A0"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Front Lip Curl */}
            <path
              d="M10 64 C 12 46, 26 40, 46 48 C 55 52, 54 70, 40 74 C 22 78, 10 72, 10 64 Z"
              fill="#1037A6"
              stroke="#00F0A0"
              strokeWidth="3.5"
            />
            {/* Eyes */}
            <circle cx="24" cy="56" r="4.5" fill="#0B0D17" />
            <circle cx="36" cy="57" r="4.5" fill="#0B0D17" />
            <circle cx="23" cy="55" r="1.6" fill="#FFFFFF" />
            <circle cx="35" cy="56" r="1.6" fill="#FFFFFF" />
            {/* Cheeks */}
            <ellipse cx="17" cy="61" rx="4.5" ry="2.5" fill="#00F0A0" />
            <ellipse cx="43" cy="62" rx="4.5" ry="2.5" fill="#00F0A0" />
            {/* Smile */}
            <path
              d="M28 62 Q 30 67 32 62"
              stroke="#0B0D17"
              strokeWidth="2"
              fill="#FF4D82"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Brand Tagline */}
        <div className="mt-4 text-center">
          <span className="text-[13px] font-black uppercase tracking-widest text-[#00F0A0] block">
            #PakaiAladin
          </span>
          <span className="text-[12px] text-white/80 font-medium">
            Terbang Menuju Halaman Berikutnya...
          </span>
        </div>
      </div>
    </div>
  )
}

