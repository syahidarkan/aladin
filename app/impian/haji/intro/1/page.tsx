'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function ImpianHajiIntro1() {
  return (
    <div
      className="relative w-[414px] h-[896px] bg-white overflow-hidden select-none"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. iOS Status Bar */}
      <StatusBar time="22.25" batteryLevel={3} dark={false} />

      {/* 2. Top Header Title with Back Button */}
      <div className="absolute left-[20px] top-[60px] flex items-center gap-3">
        <Link
          href="/impian"
          className="w-8 h-8 rounded-full flex items-center justify-center p-1 active:opacity-60 transition-opacity"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={16}
            height={16}
            style={{ width: '15.5px', height: '15.5px' }}
            priority
          />
        </Link>
        <h1
          className="font-extrabold text-[#313131]"
          style={{
            fontSize: '17px',
            lineHeight: '21px',
            letterSpacing: '-0.3px',
          }}
        >
          Perkenalan dengan Impian Haji
        </h1>
      </div>

      {/* 3-Step Progress Bar at y=105pt (native y=210) */}
      <div className="absolute left-[24px] top-[105px] w-[365.5px] flex items-center justify-between">
        <div className="w-[116.5px] h-[4.5px] rounded-full bg-[#7DAEFB]" />
        <div className="w-[117px] h-[4.5px] rounded-full bg-[#E7E8F7]" />
        <div className="w-[116.5px] h-[4.5px] rounded-full bg-[#E7E8F7]" />
      </div>

      {/* 3. Illustration at y=203.5pt (native y=407..831, w=669, h=424) */}
      <div
        className="absolute left-[40px] pointer-events-none"
        style={{
          top: '203.5px',
          width: '334.5px',
          height: '212px',
        }}
      >
        <Image
          src="/assets/illustrations/haji_intro_1_native.png"
          alt="Haji Intro 1"
          width={335}
          height={212}
          style={{ width: '334.5px', height: '212px' }}
          priority
        />
      </div>

      {/* 4. Headline at y=462.5pt (native y=925) */}
      <h2
        className="absolute left-[24px] font-extrabold text-[#313131]"
        style={{
          top: '462.5px',
          fontSize: '23px',
          lineHeight: '30px',
          letterSpacing: '-0.3px',
          maxWidth: '366px',
        }}
      >
        Persiapkan ke tanah suci lebih awal
      </h2>

      {/* 5. Description at y=546pt (native y=1092) */}
      <p
        className="absolute left-[24px] font-normal text-[#6C737E]"
        style={{
          top: '546px',
          fontSize: '13.5px',
          lineHeight: '19.5px',
          letterSpacing: '-0.1px',
          maxWidth: '366px',
        }}
      >
        Mulai niat baikmu untuk pergi berhaji lebih cepat
        <br />
        dengan menabung di Ala Impian Haji.
      </p>

      {/* 6. High-Visibility Primary Navigation Button */}
      <div className="absolute left-[24px] right-[24px] bottom-[75px] z-30">
        <Link
          href="/impian/haji/intro/2"
          className="w-full h-[48px] rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-lg active:scale-98 transition-all cursor-pointer"
        >
          Lanjut ke Langkah 2 →
        </Link>
      </div>
    </div>
  )
}
