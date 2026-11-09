'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function ImpianUmrahIntro1() {
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
          Perkenalan dengan Partner Aladin
        </h1>
      </div>

      {/* 3. Illustration at y=188pt (native y=376, w=623, h=459) */}
      <div
        className="absolute left-[51px] pointer-events-none"
        style={{
          top: '188px',
          width: '311.5px',
          height: '229.5px',
        }}
      >
        <Image
          src="/assets/illustrations/umrah_intro_1_native.png"
          alt="Umrah Partner"
          width={312}
          height={230}
          style={{ width: '311.5px', height: '229.5px' }}
          priority
        />
      </div>

      {/* 4. Headline at y=464.5pt (native y=929) */}
      <h2
        className="absolute left-[24px] font-extrabold text-[#313131]"
        style={{
          top: '464.5px',
          fontSize: '23px',
          lineHeight: '29px',
          letterSpacing: '-0.3px',
          maxWidth: '366px',
        }}
      >
        Persiapkan ke tanah suci bersama partner Aladin
        <br />
        pilihanmu
      </h2>

      {/* 5. Description at y=548pt (native y=1096) */}
      <p
        className="absolute left-[24px] font-normal text-[#6C737E]"
        style={{
          top: '548px',
          fontSize: '13.5px',
          lineHeight: '19.5px',
          letterSpacing: '-0.1px',
          maxWidth: '366px',
        }}
      >
        Niatkan untuk memberangkatkan diri sendiri atau keluarga
        <br />
        tercinta ke tanah suci bersama partner yang terpilih dan terpercaya.
      </p>

      {/* 6. High-Visibility Primary Navigation Button */}
      <div className="absolute left-[24px] right-[24px] bottom-[75px] z-30">
        <Link
          href="/impian/umrah/intro/2"
          className="w-full h-[48px] rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-lg active:scale-98 transition-all cursor-pointer"
        >
          Lanjut ke Langkah 2 →
        </Link>
      </div>
    </div>
  )
}
