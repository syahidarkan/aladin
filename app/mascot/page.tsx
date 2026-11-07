'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AladinCarpetMascot from '@/components/mascot/AladinCarpetMascot'
import { CarpetPose } from '@/components/mascot/CarpetModel'

export default function MascotDemoPage() {
  const [currentPose, setCurrentPose] = useState<CarpetPose>('idle')
  const [showStars, setShowStars] = useState(true)
  const [interactive, setInteractive] = useState(true)
  const [tapCount, setTapCount] = useState(0)

  const poses: { id: CarpetPose; label: string; desc: string }[] = [
    {
      id: 'idle',
      label: '🌊 Idle Melayang',
      desc: 'Gelombang kain sinusoidal lembut dengan bobbing vertikal dan kedipan mata otomatis.',
    },
    {
      id: 'fly-forward',
      label: '🚀 Fly Forward',
      desc: 'Menukik rata ke depan, gelombang lebih cepat, rumbai tertiup ke belakang.',
    },
    {
      id: 'happy-spin',
      label: '✨ Happy 360 Spin',
      desc: 'Putaran barrel roll 360 derajat riang gembira saat di-tap/klik.',
    },
    {
      id: 'curious',
      label: '👀 Curious Head-Up',
      desc: 'Lipatan depan menengadah lebih tinggi dan menoleh ingin tahu ke kursor.',
    },
  ]

  const handleCarpetClick = () => {
    setTapCount((prev) => prev + 1)
    setCurrentPose('happy-spin')
  }

  return (
    <div
      className="flex flex-col h-full bg-[#081D48] select-none text-white relative overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Top Header App Bar */}
      <div className="shrink-0 pt-4 pb-2 px-5 flex items-center justify-between border-b border-white/10 z-20">
        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={16}
            height={16}
            style={{ width: '15px', height: '15px', filter: 'brightness(0) invert(1)' }}
          />
        </Link>

        <div className="text-center">
          <span className="text-[10px] font-black tracking-widest text-[#00F0A0] uppercase block">
            OFFICIAL 3D MASCOT
          </span>
          <h1 className="text-[16px] font-black text-white tracking-tight">
            Karpet Terbang Aladin
          </h1>
        </div>

        <div className="w-9 h-9" />
      </div>

      {/* Main 3D Mascot Viewport */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[340px] px-4">
        {/* Ambient Radial Background Glow */}
        <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-[#1C20C4]/40 via-[#00F0A0]/20 to-transparent blur-3xl pointer-events-none" />

        {/* 3D Mascot Canvas */}
        <AladinCarpetMascot
          className="w-full h-[320px] max-w-[380px] z-10"
          pose={currentPose}
          interactive={interactive}
          showParticles={showStars}
          onClick={handleCarpetClick}
        />

        {/* Floating Tap Counter / Instruction Pill */}
        <div className="z-10 mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#00F0A0] animate-pulse" />
          <span className="text-[11.5px] font-bold text-white/90">
            {tapCount > 0 ? `Senang bertemu kamu! (${tapCount}x spin)` : 'Ketuk karpet untuk 360° Happy Spin!'}
          </span>
        </div>
      </div>

      {/* Bottom Pose Control Panel (BottomSheet style) */}
      <div className="shrink-0 bg-[#0A2558]/90 border-t border-white/15 rounded-t-[28px] p-5 pb-8 backdrop-blur-xl z-20">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-[14px] font-extrabold text-white">Kontrol Pose &amp; Animasi</h2>
            <p className="text-[11px] text-white/70">
              {poses.find((p) => p.id === currentPose)?.desc}
            </p>
          </div>

          {/* Quick particle toggle */}
          <button
            onClick={() => setShowStars(!showStars)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
              showStars
                ? 'bg-[#00F0A0] text-[#081D48] border-[#00F0A0]'
                : 'bg-white/10 text-white/70 border-white/20'
            }`}
          >
            {showStars ? '✦ Bintang ON' : '✦ Bintang OFF'}
          </button>
        </div>

        {/* Pose Switcher Grid */}
        <div className="grid grid-cols-2 gap-2">
          {poses.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentPose(p.id)}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                currentPose === p.id
                  ? 'bg-gradient-to-r from-[#1037A6] to-[#1C20C4] border-[#00F0A0] shadow-lg ring-1 ring-[#00F0A0]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
              }`}
            >
              <span className="text-[12.5px] font-black text-white">{p.label}</span>
              <span className="text-[9.5px] text-white/60 line-clamp-1 mt-1">
                {p.id === currentPose ? 'Aktif Sekarang' : 'Ketuk untuk coba'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
