'use client'

import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function ImpianUmrahIntro2() {
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
          href="/impian/umrah/intro/1"
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

      {/* 2-Step Progress Bar at y=105pt (native y=210) */}
      <div className="absolute left-[24px] top-[105px] w-[365.5px] flex items-center justify-between">
        <div className="w-[178.5px] h-[4.5px] rounded-full bg-[#7DAEFB]" />
        <div className="w-[178.5px] h-[4.5px] rounded-full bg-[#E7E8F7]" />
      </div>

      {/* 3. Illustration */}
      <div
        className="absolute left-[72px] pointer-events-none"
        style={{
          top: '165px',
          width: '260px',
          height: '190px',
        }}
      >
        <Image
          src="/assets/illustrations/umrah_intro_2_native.png"
          alt="Umrah Partner Mitra"
          width={260}
          height={190}
          style={{ width: '260px', height: '190px', objectFit: 'contain' }}
          priority
        />
      </div>

      {/* 4. Headline */}
      <h2
        className="absolute left-[24px] font-extrabold text-[#313131]"
        style={{
          top: '375px',
          fontSize: '21px',
          lineHeight: '27px',
          letterSpacing: '-0.3px',
          maxWidth: '366px',
        }}
      >
        Yuk, kenalan lebih dekat dengan
        <br />
        mitra pilihan kami!
      </h2>

      {/* 5. Lavender Card */}
      <div
        className="absolute left-[24px] w-[365.5px] rounded-[16px] bg-[#EFF0FC] p-[16px] overflow-hidden"
        style={{
          top: '438px',
          height: '210px',
        }}
      >
        {/* Bullet Item 1 */}
        <div className="flex items-start gap-[10px] mb-3">
          <Image
            src="/assets/icons/umrah_bullet_check.png"
            alt="Check"
            width={16}
            height={20}
            style={{ width: '16px', height: '20px', marginTop: '1px' }}
            priority
          />
          <p
            className="text-[#1A1D26] font-medium"
            style={{
              fontSize: '13px',
              lineHeight: '17px',
              letterSpacing: '-0.1px',
            }}
          >
            Target tabungan realistis dengan nominal Rp30 juta
          </p>
        </div>

        {/* Bullet Item 2 */}
        <div className="flex items-start gap-[10px] mb-3">
          <Image
            src="/assets/icons/umrah_bullet_check.png"
            alt="Check"
            width={16}
            height={20}
            style={{ width: '16px', height: '20px', marginTop: '1px' }}
            priority
          />
          <p
            className="text-[#1A1D26] font-medium"
            style={{
              fontSize: '13px',
              lineHeight: '17px',
              letterSpacing: '-0.1px',
            }}
          >
            Pilih paket yang sesuai kebutuhan dan keinginanmu
          </p>
        </div>

        {/* Bullet Item 3 */}
        <div className="flex items-start gap-[10px] mb-3">
          <Image
            src="/assets/icons/umrah_bullet_check.png"
            alt="Check"
            width={16}
            height={20}
            style={{ width: '16px', height: '20px', marginTop: '1px' }}
            priority
          />
          <p
            className="text-[#1A1D26] font-medium"
            style={{
              fontSize: '13px',
              lineHeight: '17px',
              letterSpacing: '-0.1px',
            }}
          >
            Tabungan aman dan terpercaya di Aladin
          </p>
        </div>

        {/* Disclaimer */}
        <p
          className="text-[#6C737E] font-normal mt-2"
          style={{
            fontSize: '11px',
            lineHeight: '15px',
            letterSpacing: '-0.1px',
          }}
        >
          *Syarat &amp; ketentuan berlaku
        </p>
      </div>

      {/* 6. High-Visibility Bottom Button */}
      <div className="absolute left-[24px] right-[24px] bottom-[75px] z-30">
        <Link
          href="/impian/umrah/buat"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('aladin_has_opened_umrah', 'true')
            }
          }}
          className="w-full h-[48px] rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-lg active:scale-98 transition-all cursor-pointer"
        >
          Mulai Menabung Umrah Sekarang →
        </Link>
      </div>
    </div>
  )
}
