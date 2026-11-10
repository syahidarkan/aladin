'use client'

import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ImpianUmrahIntro2() {
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
            href="/impian/umrah/intro/1"
            data-back="true"
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Langkah 1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>
          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            Kenalan dengan Mitra Pilihan
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
          </div>

          {/* Illustration */}
          <div className="relative w-full h-[180px] pointer-events-none flex items-center justify-center">
            <Image
              src="/assets/illustrations/umrah_intro_2_native.png"
              alt="Umrah Partner Mitra"
              width={260}
              height={180}
              className="object-contain"
              priority
            />
          </div>

          {/* Headline */}
          <h2 className="text-[20px] font-black text-[#1A1D26] leading-tight">
            Yuk, kenalan lebih dekat dengan mitra pilihan kami!
          </h2>

          {/* Benefits Card */}
          <div className="rounded-2xl bg-[#EFF0FC] p-4.5 space-y-3 border border-blue-100">
            {[
              'Target tabungan realistis dengan paket mulai Rp30 jutaan.',
              'Pilih paket yang sesuai kebutuhan dan durasi keberangkatanmu.',
              'Tabungan aman terproteksi LPS & diawasi Dewan Pengawas Syariah MUI.',
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#1B21CC] shrink-0 mt-0.5" />
                <p className="text-[13px] text-gray-800 leading-snug">{text}</p>
              </div>
            ))}
            <p className="text-[11px] text-gray-500 pt-1">*Syarat &amp; ketentuan syariah berlaku</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/impian/umrah/buat"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('aladin_has_opened_umrah', 'true')
              }
            }}
            className="w-full h-12 rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-md active:scale-98 transition-all cursor-pointer"
          >
            Mulai Menabung Umrah Sekarang →
          </Link>
        </div>
      </div>
    </div>
  )
}
