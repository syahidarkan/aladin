'use client'

import React from 'react'
import { useMascot } from '@/context/MascotContext'

/**
 * Global Loader & Dynamic Attraction Component
 * Displays the Aladin Carpet Mascot executing dynamic figure-8 / barrel-roll
 * maneuvers with turquoise star comet trails during transactions, currency conversions,
 * biometric verification, or async actions.
 */
export default function CarpetLoader() {
  const { isLoading, loadingText, hideLoader } = useMascot()

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={hideLoader}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[320px] rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0A1435 0%, #10266B 60%, #08153A 100%)',
          border: '1.5px solid rgba(0, 240, 160, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 160, 0.2)',
        }}
      >
        {/* Floating Background Stars */}
        <div className="absolute top-4 left-6 text-[#00F0A0] text-xs animate-ping">✦</div>
        <div className="absolute bottom-6 right-6 text-[#00F0A0] text-sm animate-pulse">✦</div>
        <div className="absolute top-12 right-8 text-emerald-300 text-xs animate-bounce">★</div>

        {/* Dynamic Flying Mascot Graphic with Loop Animation */}
        <div className="relative w-36 h-28 my-2 flex items-center justify-center animate-pulse">
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full overflow-visible drop-shadow-[0_10px_20px_rgba(0,240,160,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Comet Trail */}
            <path
              d="M90 22 Q 110 35 125 45"
              stroke="#00F0A0"
              strokeWidth="3"
              strokeDasharray="4 4"
              className="opacity-70 animate-pulse"
            />
            {/* Body */}
            <path
              d="M10 52 C 15 28, 30 22, 50 35 C 70 48, 85 30, 92 18 C 94 22, 90 42, 70 56 C 50 70, 25 66, 10 52 Z"
              fill="#154AD8"
            />
            <path
              d="M10 52 C 15 32, 28 26, 48 38 C 68 50, 82 34, 90 22"
              stroke="#00F0A0"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Front Lip */}
            <path
              d="M8 55 C 10 40, 22 36, 38 42 C 45 46, 44 60, 32 64 C 18 68, 8 62, 8 55 Z"
              fill="#1037A6"
              stroke="#00F0A0"
              strokeWidth="3"
            />
            {/* Eyes */}
            <circle cx="20" cy="48" r="3.5" fill="#0B0D17" />
            <circle cx="30" cy="49" r="3.5" fill="#0B0D17" />
            <circle cx="19" cy="47" r="1.2" fill="#FFFFFF" />
            <circle cx="29" cy="48" r="1.2" fill="#FFFFFF" />
            {/* Blush */}
            <ellipse cx="14" cy="52" rx="3.5" ry="2" fill="#00F0A0" />
            <ellipse cx="35" cy="53" rx="3.5" ry="2" fill="#00F0A0" />
            {/* Smile */}
            <path
              d="M23 53 Q 25 57 27 53"
              stroke="#0B0D17"
              strokeWidth="1.5"
              fill="#FF4D82"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Dynamic Status Title */}
        <h4 className="text-[16px] font-extrabold text-white mt-1">
          {loadingText}
        </h4>

        {/* Subtext info */}
        <p className="text-[12px] text-gray-300 mt-1 mb-4">
          Mohon tunggu, Bank Aladin Syariah sedang memproses permintaanmu...
        </p>

        {/* Progress Spinner Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00F0A0] border-t-transparent animate-spin" />
          <span className="text-[11px] font-bold text-[#00F0A0] uppercase tracking-wider">
            Memverifikasi Sistem
          </span>
        </div>
      </div>
    </div>
  )
}

