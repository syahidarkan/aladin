'use client'

import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { ArrowLeft } from 'lucide-react'

export default function ImpianHajiIntro2() {
  return (
    <div
      className="flex flex-col h-full bg-white select-none text-[#1A1D26] overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Seamless White Header with ArrowLeft Back Button */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shrink-0">
        <StatusBar className="bg-white" />
        <div className="w-full h-14 bg-white flex items-center gap-3 px-4">
          <Link
            href="/impian/haji/intro/1"
            className="w-9 h-9 rounded-full bg-gray-100/90 hover:bg-gray-200 border border-gray-200/80 flex items-center justify-center text-[#1A1D26] active:scale-95 transition-all cursor-pointer shadow-2xs"
            aria-label="Kembali ke Langkah 1"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1D26] stroke-[2.4]" />
          </Link>
          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            Setoran Awal Ringan
          </h1>
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4 pb-28 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#1B21CC]" />
            <div className="flex-1 h-1.5 rounded-full bg-[#1B21CC]" />
            <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
          </div>

          {/* Illustration */}
          <div className="relative w-full h-[200px] pointer-events-none flex items-center justify-center">
            <Image
              src="/assets/illustrations/haji_intro_2_native.png"
              alt="Haji Intro 2"
              width={232}
              height={200}
              className="object-contain"
              priority
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h2 className="text-[21px] font-black text-[#1A1D26] leading-tight">
              Setoran Awal Ringan Mulai Rp10.000
            </h2>
            <p className="text-[13.5px] text-[#6C737E] leading-relaxed">
              Buka tabungan haji dengan setoran awal yang sangat ringan untuk mempermudah niat baikmu melangkah ke Baitullah.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/impian/haji/intro/3"
            className="w-full h-12 rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-md active:scale-98 transition-all cursor-pointer"
          >
            Lanjut ke Langkah 3 →
          </Link>
        </div>
      </div>
    </div>
  )
}
