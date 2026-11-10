'use client'

import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { ArrowLeft } from 'lucide-react'

export default function ImpianUmrahIntro1() {
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
            href="/impian"
            data-back="true"
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Ala Impian"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>
          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            Perkenalan Partner Umrah
          </h1>
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-28 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Illustration */}
          <div className="relative w-full h-[220px] pointer-events-none flex items-center justify-center">
            <Image
              src="/assets/illustrations/umrah_intro_1_native.png"
              alt="Umrah Partner"
              width={312}
              height={220}
              className="object-contain"
              priority
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-black text-[#1A1D26] leading-tight">
              Persiapkan ke tanah suci bersama partner Aladin pilihanmu
            </h2>
            <p className="text-[13.5px] text-[#6C737E] leading-relaxed">
              Niatkan untuk memberangkatkan diri sendiri atau keluarga tercinta ke tanah suci bersama partner travel resmi terverifikasi Kemenag &amp; HIMPUH.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/impian/umrah/intro/2"
            className="w-full h-12 rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-md active:scale-98 transition-all cursor-pointer"
          >
            Lanjut ke Langkah 2 →
          </Link>
        </div>
      </div>
    </div>
  )
}
