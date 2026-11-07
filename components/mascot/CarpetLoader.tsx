'use client'

import React from 'react'
import Image from 'next/image'
import { useMascot } from '@/context/MascotContext'

/**
 * Global Mascot Acrobatic Loader Component
 * Displays the Aladin Carpet Mascot executing dynamic 3D acrobatics & tricks
 * (loop-the-loop, barrel-roll, and levitation with turquoise star trails)
 * whenever transactions, biometric checks, or currency conversions load.
 */
export default function CarpetLoader() {
  const { isLoading, loadingText, hideLoader } = useMascot()

  if (!isLoading) return null

  return (
    <div
      className="absolute inset-0 z-[9990] flex items-center justify-center bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={hideLoader}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[310px] rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #07153D 0%, #0F2D84 55%, #081B4E 100%)',
          border: '1.5px solid rgba(0, 240, 160, 0.45)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 160, 0.25)',
        }}
      >
        {/* Floating Background Stars */}
        <div className="absolute top-4 left-6 text-[#00F0A0] text-xs animate-star-twinkle">✦</div>
        <div className="absolute bottom-6 right-6 text-[#00F0A0] text-sm animate-star-twinkle" style={{ animationDelay: '300ms' }}>✦</div>
        <div className="absolute top-10 right-8 text-emerald-300 text-xs animate-star-twinkle" style={{ animationDelay: '600ms' }}>★</div>
        <div className="absolute bottom-12 left-8 text-[#00F0A0] text-xs animate-star-twinkle" style={{ animationDelay: '900ms' }}>★</div>

        {/* Dynamic Flying Mascot Graphic Executing Acrobatics */}
        <div className="relative w-44 h-32 my-2 flex items-center justify-center">
          {/* Acrobatic Rotating Body */}
          <div
            className="relative w-full h-full animate-mascot-acrobatic"
            style={{
              filter: 'drop-shadow(0 12px 24px rgba(0, 240, 160, 0.55)) drop-shadow(0 4px 10px rgba(16, 55, 166, 0.6))',
            }}
          >
            <Image
              src="/assets/mascot/karpet_mascot_clean.png"
              alt="Atraksi Maskot Karpet Aladin"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Comet Particle Trail */}
          <span className="absolute -bottom-2 -left-3 text-[#00F0A0] text-lg animate-ping">✨</span>
          <span className="absolute -top-1 -right-2 text-emerald-200 text-base animate-pulse">💫</span>
        </div>

        {/* Dynamic Status Title */}
        <h4 className="text-[16px] font-black text-white mt-1 leading-snug">
          {loadingText}
        </h4>

        {/* Subtext info */}
        <p className="text-[12px] text-gray-300 mt-1 mb-4 leading-relaxed">
          Mohon tunggu sejenak, Maskot Aladin sedang menyiapkan berkah untukmu...
        </p>

        {/* Animated Progress Dots Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
          <div className="w-2 h-2 rounded-full bg-[#00F0A0] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#00F0A0] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-[11px] font-bold text-white/90 ml-1">
            Memproses
          </span>
        </div>
      </div>
    </div>
  )
}
