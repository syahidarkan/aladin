'use client'

import React from 'react'
import { useMascot, MascotReaction } from '@/context/MascotContext'

const REACTION_CONFIG: Record<
  MascotReaction,
  {
    icon: string
    title: string
    bgGradient: string
    borderColor: string
    soundDesc: string
  }
> = {
  success: {
    icon: '🎉',
    title: 'Alhamdulillah, Berhasil!',
    bgGradient: 'linear-gradient(135deg, #064E3B 0%, #047857 60%, #00F0A0 100%)',
    borderColor: '#00F0A0',
    soundDesc: 'Takbir & Confetti',
  },
  'lock-action': {
    icon: '🔒',
    title: 'Dana Aman Terkunci!',
    bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4338CA 100%)',
    borderColor: '#818CF8',
    soundDesc: 'Proteksi Syariah',
  },
  'copy-success': {
    icon: '📋',
    title: 'Nomor Berhasil Disalin!',
    bgGradient: 'linear-gradient(135deg, #1037A6 0%, #1D4ED8 60%, #60A5FA 100%)',
    borderColor: '#93C5FD',
    soundDesc: 'Tersimpan di Clipboard',
  },
  'shake-warning': {
    icon: '⚠️',
    title: 'Periksa Kembali Input Anda',
    bgGradient: 'linear-gradient(135deg, #881337 0%, #BE123C 60%, #FB7185 100%)',
    borderColor: '#FDA4AF',
    soundDesc: 'Peringatan Validasi',
  },
}

export default function CarpetReactionToast() {
  const { activeReaction, reactionMessage } = useMascot()

  if (!activeReaction) return null

  const config = REACTION_CONFIG[activeReaction]

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9998] w-[90%] max-w-[380px] pointer-events-none select-none animate-in slide-in-from-top-4 duration-300">
      <div
        className="rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 border text-white backdrop-blur-md"
        style={{
          background: config.bgGradient,
          borderColor: config.borderColor,
          boxShadow: `0 10px 30px rgba(0,0,0,0.35)`,
        }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
          {config.icon}
        </div>

        <div className="flex-1">
          <span className="text-[13.5px] font-extrabold block leading-tight">
            {config.title}
          </span>
          <span className="text-[11.5px] text-white/90 font-medium block mt-0.5">
            {reactionMessage || config.soundDesc}
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/80">
          🧞‍♂️
        </div>
      </div>
    </div>
  )
}

