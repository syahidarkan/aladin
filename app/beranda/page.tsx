'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import FeatureGuideModal from '@/components/FeatureGuideModal'
import { useBankState } from '@/lib/bankState'

export default function BerandaPage() {
  const { alaDompet, alaImpianUmroh, alaDeposito } = useBankState()
  const [showBalance, setShowBalance] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const banners = [
    {
      id: 'alfagift',
      tag: 'PROMO ALADIN x ALFAGIFT',
      title: 'Belanja Hemat di Alfagift, Cashback s.d. Rp25.000',
      desc: 'Tarik & setor tunai bebas biaya admin di Alfamart seluruh Indonesia.',
      cta: 'Klaim Cashback',
      href: '/rewards/alfa',
      bg: 'linear-gradient(135deg, #0A256B 0%, #1037A6 60%, #1D4ED8 100%)',
      badgeColor: '#EF4444',
      iconEmoji: '🎁',
      iconBg: 'bg-red-500/20 text-red-300',
    },
    {
      id: 'jumat-berkah',
      tag: 'JUMAT BERKAH',
      title: 'Jumat Bermakna Dimulai dari Berbagi',
      desc: 'Salurkan donasi & sedekah tanpa biaya admin melalui Ala Berbagi.',
      cta: 'Salurkan Donasi',
      href: '/donasi',
      bg: 'linear-gradient(135deg, #064E3B 0%, #047857 60%, #00F0A0 120%)',
      badgeColor: '#00F0A0',
      iconEmoji: '🌿',
      iconBg: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'mascot-3d',
      tag: 'MASKOT 3D INTERAKTIF',
      title: 'Kenalan dengan Karpet Terbang Aladin',
      desc: 'Sahabat finansial ceria dengan atraksi 3D yang siap membimbingmu!',
      cta: 'Buka Studio 3D',
      href: '/mascot',
      bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4338CA 100%)',
      badgeColor: '#818CF8',
      iconEmoji: '🧞‍♂️',
      iconBg: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      id: 'deposito-promo',
      tag: 'NISBAH 85:15',
      title: 'Bagi Hasil Ala Deposito Hingga 8,5% p.a.',
      desc: 'Simpanan berjangka syariah aman, fleksibel, berkah dan menguntungkan.',
      cta: 'Buka Deposito',
      href: '/simulasi-bagi-hasil',
      bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0D3396 100%)',
      badgeColor: '#F59E0B',
      iconEmoji: '📈',
      iconBg: 'bg-amber-500/20 text-amber-300',
    },
  ]

  const shortcuts = [
    {
      id: 'deposito',
      label: 'Ala Deposito',
      href: '/simulasi-bagi-hasil',
      iconSrc: '/assets/icons/shortcut_deposito_clean.png',
    },
    {
      id: 'impian',
      label: 'Ala Impian',
      href: '/impian',
      iconSrc: '/assets/icons/shortcut_impian_clean.png',
    },
    {
      id: 'pocket',
      label: 'Ala Pocket',
      href: '/pocket',
      iconSrc: '/assets/icons/shortcut_pocket_v2.png',
      badge: 'Baru',
    },
    {
      id: 'haramain',
      label: 'Ala Haramain',
      href: '/ala-haramain',
      iconSrc: '/assets/icons/shortcut_haramain_v2.png',
      badge: 'Baru',
    },
    {
      id: 'hijrah',
      label: 'Ala Hijrah',
      href: '/hijrah',
      iconSrc: '/assets/icons/shortcut_hijrah_v2.png',
      badge: 'Baru',
    },
    {
      id: 'investasi',
      label: 'Ala Investasi',
      href: '/investasi',
      iconSrc: '/assets/icons/shortcut_investasi_v2.png',
      badge: 'Baru',
    },
    {
      id: 'kartu',
      label: 'Kartu Visa',
      href: '/kartu',
      iconSrc: '/assets/icons/shortcut_kartu_v2.png',
      badge: 'Baru',
    },
    {
      id: 'pilgrims',
      label: 'Ala Pilgrims',
      href: '/impian/haji/buat',
      iconSrc: '/assets/icons/shortcut_pilgrims_v2.png',
      badge: 'Baru',
    },
  ]

  return (
    <div
      className="flex flex-col h-full bg-[#FFFFFF] select-none text-[#1A1D26]"
      style={{
        fontFamily: 'var(--font-poppins), var(--font-inter), sans-serif',
      }}
    >
      {/* Scrollable Container wrapping ENTIRE page content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* ========================================================================= */}
        {/* TOP SECTION: STARRY NIGHT HEADER (EXACT 1:1 TO APK fragment_home.xml)     */}
        {/* ========================================================================= */}
        <div
          className="relative text-white overflow-hidden shrink-0"
          style={{
            height: '190px',
            background: 'linear-gradient(180deg, #051937 0%, #08214D 60%, #0A2E5C 100%)',
          }}
        >
          {/* Top Safe-Area Spacer */}
          <StatusBar dark />

          {/* Top Bar: Aladin Brand Logo & Notification/Profile Icons */}
          <div className="flex items-center justify-between px-6 pt-2 pb-3">
            {/* Authentic Aladin Wordmark Logo in Pure White Vector SVG */}
            <div className="relative w-[88px] h-[34px] flex items-center">
              <Image
                src="/assets/icons/ic_logo_aladin_white.svg"
                alt="Bank Aladin Syariah"
                width={88}
                height={34}
                className="object-contain object-left"
                priority
              />
            </div>

            {/* Right Icons: Bell with 9+ badge & Profile */}
            <div className="flex items-center gap-3">
              <Link
                href="/notifikasi"
                className="relative p-1 text-white hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                aria-label="Notifikasi"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {/* Authentic Red 9+ Badge */}
                <span
                  className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[9px] font-black rounded-full px-1.5 py-0.2 border border-[#08214D] shadow-xs"
                  style={{ minWidth: '16px', textAlign: 'center', lineHeight: '14px' }}
                >
                  9+
                </span>
              </Link>

              <Link
                href="/profil"
                className="p-1 text-white hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                aria-label="Profil Saya"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FLOATING BALANCE & ACTION CARD (EXACT item_balance.xml & item_action_menu)*/}
        {/* ========================================================================= */}
        <div className="px-5 -mt-16 relative z-20">
          <div
            className="bg-white rounded-[24px] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#ECEEF2]"
          >
            {/* Top Gray Sub-Card (item_balance.xml) */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium text-[#6B7280]">
                  Ala Dompet
                </span>
                <Link
                  href="/keuangan"
                  className="text-[13px] font-bold text-[#1C20C4] hover:underline cursor-pointer"
                >
                  Detail
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[24px] font-black text-[#1A1D26] tracking-tight">
                  {showBalance ? 'Rp69.000' : 'Rp•••••••'}
                </span>
                {showBalance && (
                  <span className="text-[14px] font-medium text-[#9CA3AF] -ml-1 mt-1">
                    ,37
                  </span>
                )}

                {/* Eye toggle icon */}
                <button
                  type="button"
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 text-[#6B7280] hover:text-[#1C20C4] cursor-pointer"
                  aria-label="Toggle Saldo"
                >
                  {showBalance ? (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 4 Action Buttons Row (item_action_menu.xml) */}
            <div className="grid grid-cols-4 gap-2 mt-4 px-1">
              <Link
                href="/transfer"
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-[50px] h-[50px] rounded-2xl overflow-hidden mb-1.5 shadow-sm">
                  <Image
                    src="/assets/icons/btn_action_transfer.png"
                    alt="Transfer"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-[12px] font-medium text-[#1A1D26] text-center">
                  Transfer
                </span>
              </Link>

              <Link
                href="/bayar-beli"
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-[50px] h-[50px] rounded-2xl overflow-hidden mb-1.5 shadow-sm">
                  <Image
                    src="/assets/icons/btn_action_bayar.png"
                    alt="Bayar & Beli"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-[12px] font-medium text-[#1A1D26] text-center">
                  Bayar &amp; Beli
                </span>
              </Link>

              <Link
                href="/rewards/alfa"
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-[50px] h-[50px] rounded-2xl overflow-hidden mb-1.5 shadow-sm">
                  <Image
                    src="/assets/icons/btn_action_tarik.png"
                    alt="Tarik"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-[12px] font-medium text-[#1A1D26] text-center">
                  Tarik
                </span>
              </Link>

              <Link
                href="/rewards/alfa"
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-[50px] h-[50px] rounded-2xl overflow-hidden mb-1.5 shadow-sm">
                  <Image
                    src="/assets/icons/btn_action_setor.png"
                    alt="Setor"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-[12px] font-medium text-[#1A1D26] text-center">
                  Setor
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHORTCUTS ROW: EXACT 1:1 APK item_explore_menu.xml                        */}
        {/* ========================================================================= */}
        <div className="mt-5 px-5">
          <div className="flex items-start gap-3 overflow-x-auto no-scrollbar py-1 px-1">
            {shortcuts.map((sc) => (
              <Link
                key={sc.id}
                href={sc.href}
                className="flex flex-col items-center shrink-0 active:scale-95 transition-transform cursor-pointer"
                style={{ width: '68px' }}
              >
                <div className="relative w-[50px] h-[50px] rounded-2xl overflow-visible mb-1 flex items-center justify-center">
                  <Image
                    src={sc.iconSrc}
                    alt={sc.label}
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                  {sc.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#00F0A0] text-[#064E3B] text-[8.5px] font-black px-1.5 py-0.5 rounded-full border border-emerald-300 leading-none shadow-xs">
                      {sc.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-[#1A1D26] text-center leading-tight">
                  {sc.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION: TEMUKAN BERKAH (FULL-BLEED NATIVE DESIGN, ZERO CROPPED ARTIFACTS)*/}
        {/* ========================================================================= */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
              Temukan Berkah
            </h2>
            <Link
              href="/rewards/referral"
              className="text-[13px] font-bold text-[#1C20C4] hover:underline cursor-pointer"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Banner Carousel */}
          <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {banners.map((b) => (
              <Link
                key={b.id}
                href={b.href}
                className="shrink-0 w-[300px] h-[150px] rounded-3xl overflow-hidden relative shadow-sm border border-white/10 snap-start active:scale-[0.99] transition-transform p-4 text-white flex flex-col justify-between"
                style={{
                  background: b.bg,
                }}
              >
                {/* Top Badge & Emoji Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block backdrop-blur-xs"
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {b.tag}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${b.iconBg}`}>
                    {b.iconEmoji}
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="my-auto pr-2">
                  <h3 className="text-[15px] font-black leading-snug line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-[11px] text-white/85 line-clamp-1 mt-0.5">
                    {b.desc}
                  </p>
                </div>

                {/* CTA Action Pill */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-extrabold text-[#00F0A0] flex items-center gap-1">
                    {b.cta} →
                  </span>
                  <span className="text-[9.5px] text-white/60 font-semibold tracking-wider uppercase">
                    #PakaiAladin
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dot === activeBanner % 4 ? 'w-4 bg-[#00F0A0]' : 'w-1.5 bg-[#E2E8F0]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION: BANYAK CARA NABUNG DI ALADIN (EXACT item_product_landing_content) */}
        {/* ========================================================================= */}
        <div className="mt-6 px-5 pb-6">
          <h2 className="text-[17px] font-bold text-[#1A1D26] tracking-tight mb-3">
            Banyak cara nabung di Aladin
          </h2>

          <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {/* Card 1: Ala Deposito */}
            <div
              className="shrink-0 w-[290px] bg-[#EBF2FE] border border-[#D2E1FC] rounded-[24px] p-4 flex flex-col justify-between shadow-xs snap-start relative overflow-hidden"
              style={{ minHeight: '165px' }}
            >
              <div>
                <h3 className="text-[16px] font-black text-[#1A1D26]">
                  Ala Deposito
                </h3>

                <div className="flex items-center gap-2 mt-1.5">
                  <div>
                    <span className="text-[9.5px] font-bold text-[#D97706] block">
                      Bagi Hasil
                    </span>
                    <span className="text-[13px] font-black text-[#D97706] leading-none">
                      8,5%p.a.*
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-gray-300 mx-1" />

                  <span className="text-[11.5px] font-medium text-[#1A1D26] leading-tight max-w-[95px]">
                    Maksimalkan bagi hasil
                  </span>
                </div>
              </div>

              {/* Safe Box 3D Floating Icon */}
              <div
                className="absolute right-2 top-3 w-[76px] h-[76px] pointer-events-none"
              >
                <Image
                  src="/assets/icons/prod-deposito.png"
                  alt="Ala Deposito Safe Box"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-4 pt-2">
                <Link
                  href="/simulasi-bagi-hasil"
                  className="inline-block bg-[#1C20C4] hover:bg-[#151AA8] text-white text-[12px] font-extrabold px-4 py-1.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Buka Deposito
                </Link>

                <p className="text-[8px] text-[#6C737E] mt-1.5 leading-tight">
                  *Sesuai realisasi pendapatan Bank berdasarkan nisbah nasabah:bank 85%:15%, sebelum dipotong pajak.
                </p>
              </div>
            </div>

            {/* Card 2: Ala Impian */}
            <div
              className="shrink-0 w-[290px] bg-[#EBF2FE] border border-[#D2E1FC] rounded-[24px] p-4 flex flex-col justify-between shadow-xs snap-start relative overflow-hidden"
              style={{ minHeight: '165px' }}
            >
              <div>
                <h3 className="text-[16px] font-black text-[#1A1D26]">
                  Ala Impian
                </h3>

                <div className="flex items-center gap-2 mt-1.5">
                  <div>
                    <span className="text-[9.5px] font-bold text-[#D97706] block">
                      Bagi Hasil
                    </span>
                    <span className="text-[13px] font-black text-[#D97706] leading-none">
                      8%p.a.*
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-gray-300 mx-1" />

                  <span className="text-[11.5px] font-medium text-[#1A1D26] leading-tight max-w-[95px]">
                    Nabung sesuai target &amp; capai impian
                  </span>
                </div>
              </div>

              {/* Jar with Gold Coins */}
              <div
                className="absolute right-2 top-3 w-[76px] h-[76px] pointer-events-none"
              >
                <Image
                  src="/assets/icons/prod-impian.png"
                  alt="Ala Impian Jar"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-4 pt-2">
                <Link
                  href="/impian"
                  className="inline-block bg-[#1C20C4] hover:bg-[#151AA8] text-white text-[12px] font-extrabold px-4 py-1.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Buka Impian
                </Link>

                <p className="text-[8px] text-[#6C737E] mt-1.5 leading-tight">
                  *Sesuai realisasi pendapatan Bank berdasarkan nisbah bagi hasil, sebelum dipotong pajak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Guide Tour Modal (Otbee Style) */}
      <FeatureGuideModal />
    </div>
  )
}
