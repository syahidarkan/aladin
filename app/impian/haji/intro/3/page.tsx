'use client'

import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function ImpianHajiIntro3() {
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
          href="/impian/haji/intro/2"
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

      {/* 3-Step Progress Bar at y=105pt (native y=210, all 3 active) */}
      <div className="absolute left-[24px] top-[105px] w-[365.5px] flex items-center justify-between">
        <div className="w-[116.5px] h-[4.5px] rounded-full bg-[#7DAEFB]" />
        <div className="w-[117px] h-[4.5px] rounded-full bg-[#7DAEFB]" />
        <div className="w-[116.5px] h-[4.5px] rounded-full bg-[#7DAEFB]" />
      </div>

      {/* 3. Illustration at y=189.5pt (native y=379..829, w=597, h=450) */}
      <div
        className="absolute left-[57.5px] pointer-events-none"
        style={{
          top: '189.5px',
          width: '298.5px',
          height: '225px',
        }}
      >
        <Image
          src="/assets/illustrations/haji_intro_3_native.png"
          alt="Haji Intro 3"
          width={299}
          height={225}
          style={{ width: '298.5px', height: '225px' }}
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
        Mulai tabungan haji sekarang!
      </h2>

      {/* 5. Lavender Card at y=525pt (native y=1050..1531), h=240.5pt */}
      <div
        className="absolute left-[24px] w-[365.5px] rounded-[16px] bg-[#EFF0FC] p-[16px] overflow-hidden"
        style={{
          top: '525px',
          height: '240.5px',
        }}
      >
        {/* Bullet Item 1 */}
        <div className="absolute left-[16px] top-[20px] flex items-start gap-[10px]">
          <Image
            src="/assets/icons/umrah_bullet_check.png"
            alt="Check"
            width={16}
            height={25}
            style={{ width: '16px', height: '24.5px', marginTop: '-3px' }}
            priority
          />
          <p
            className="text-[#1A1D26] font-medium"
            style={{
              fontSize: '13.5px',
              lineHeight: '18px',
              letterSpacing: '-0.1px',
            }}
          >
            Target saldo sebesar Rp25.012.000 untuk
            <br />
            mendapatkan porsi haji reguler
          </p>
        </div>

        {/* Bullet Item 2 */}
        <div className="absolute left-[16px] top-[80px] flex items-start gap-[10px]">
          <Image
            src="/assets/icons/umrah_bullet_check.png"
            alt="Check"
            width={16}
            height={25}
            style={{ width: '16px', height: '24.5px', marginTop: '-3px' }}
            priority
          />
          <p
            className="text-[#1A1D26] font-medium"
            style={{
              fontSize: '13.5px',
              lineHeight: '18px',
              letterSpacing: '-0.1px',
            }}
          >
            Bagi hasil kompetitif hingga 8% p.a.*
            <br />
            sesuai tiering saldo tabungan
          </p>
        </div>

        {/* Bullet Item 3 */}
        <div className="absolute left-[16px] top-[140px] flex items-start gap-[10px]">
          <Image
            src="/assets/icons/umrah_bullet_check.png"
            alt="Check"
            width={16}
            height={25}
            style={{ width: '16px', height: '24.5px', marginTop: '-3px' }}
            priority
          />
          <p
            className="text-[#1A1D26] font-medium"
            style={{
              fontSize: '13.5px',
              lineHeight: '18px',
              letterSpacing: '-0.1px',
            }}
          >
            Daftar haji resmi terhubung dengan SISKOHAT
            <br />
            Kemenag RI
          </p>
        </div>

        {/* Disclaimer */}
        <p
          className="absolute left-[16px] bottom-[14px] text-[#6C737E] font-normal"
          style={{
            fontSize: '11px',
            lineHeight: '15px',
            letterSpacing: '-0.1px',
          }}
        >
          *Syarat & ketentuan berlaku
        </p>
      </div>

      {/* 6. High-Visibility Bottom Button */}
      <div className="absolute left-[24px] right-[24px] bottom-[75px] z-30">
        <Link
          href="/impian/haji/buat"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('aladin_has_opened_haji', 'true')
            }
          }}
          className="w-full h-[48px] rounded-full bg-[#1B21CC] hover:bg-[#151AA8] flex items-center justify-center font-bold text-white text-[15px] shadow-lg active:scale-98 transition-all cursor-pointer"
        >
          Mulai Menabung Haji Sekarang →
        </Link>
      </div>
    </div>
  )
}
