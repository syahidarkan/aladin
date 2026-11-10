'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import FeatureGuideModal from '@/components/FeatureGuideModal'
import { useBankState } from '@/lib/bankState'
import {
  Gift,
  HeartHandshake,
  TrendingUp,
  Wallet,
  Target,
  Landmark,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  Lock,
  Compass,
} from 'lucide-react'

export default function BerandaPage() {
  const { alaDompet, alaImpianUmroh, alaDeposito } = useBankState()
  const [showBalance, setShowBalance] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const banners = [
    {
      id: 'alfagift',
      tag: 'PROMO ALADIN x ALFAMART',
      title: 'Belanja Hemat di Alfamart, Cashback s.d. Rp25.000',
      desc: 'Tarik & setor tunai bebas biaya admin di Alfamart seluruh Indonesia.',
      cta: 'Klaim Cashback',
      href: '/rewards/alfa',
      imageBg: '/assets/banners/banner_alfa_daily.png',
      bg: 'linear-gradient(135deg, #0A256B 0%, #1037A6 60%, #1D4ED8 100%)',
      badgeColor: '#EF4444',
      Icon: Gift,
      iconBg: 'bg-red-500/20 text-red-300',
    },
    {
      id: 'jumat-berkah',
      tag: 'KAJIAN & INFAQ BERKAH',
      title: 'Kajian Akbar Ustadz Adi Hidayat & Mental Health',
      desc: 'Dapatkan tiket presale hemat eksklusif nasabah Bank Aladin.',
      cta: 'Daftar Kajian',
      href: '/hijrah',
      imageBg: '/assets/banners/banner_kajian_akbar.png',
      bg: 'linear-gradient(135deg, #064E3B 0%, #047857 60%, #00F0A0 120%)',
      badgeColor: '#00F0A0',
      Icon: HeartHandshake,
      iconBg: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'ala-investasi-promo',
      tag: 'INVESTASI EMAS & SUKUK',
      title: 'Tumbuhkan Berkah Lewat 4 Instrumen Syariah',
      desc: 'Reksa dana syariah, emas fisik 24K, deposito mudharabah, & saham ISSI.',
      cta: 'Mulai Investasi',
      href: '/investasi',
      imageBg: '/assets/banners/banner_investasi_halal.png',
      bg: 'linear-gradient(135deg, #07194D 0%, #1037A6 60%, #1C20C4 100%)',
      badgeColor: '#00F0A0',
      Icon: Landmark,
      iconBg: 'bg-blue-500/20 text-blue-200',
    },
    {
      id: 'deposito-promo',
      tag: 'KULINER HALAL & CASHBACK',
      title: 'Voucher Kuliner Halal Hemat 25% Terverifikasi BPJPH',
      desc: 'Solaria, Kopi Kenangan, Bebek Kaleyo, & ratusan resto halal lainnya.',
      cta: 'Jelajah Kuliner',
      href: '/hijrah',
      imageBg: '/assets/banners/banner_kuliner_halal.png',
      bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0D3396 100%)',
      badgeColor: '#F59E0B',
      Icon: TrendingUp,
      iconBg: 'bg-amber-500/20 text-amber-300',
    },
  ]

  // Auto-scroll Carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => {
        const next = (prev + 1) % banners.length
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: next * 314,
            behavior: 'smooth',
          })
        }
        return next
      })
    }, 4500)
    return () => clearInterval(timer)
  }, [banners.length])

  // Exact 7 Shortcuts (Ala Pilgrims is integrated into Ala Haramain Hub)
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
      id: 'alfa-loop',
      label: 'Alfa Daily',
      href: '/rewards/alfa',
      iconSrc: '/assets/icons/shortcut_alfa_daily.png',
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
          <StatusBar dark className="bg-transparent" />

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
                <span className="text-[24px] font-black text-[#1A1D26] tracking-tight font-mono">
                  {showBalance ? `Rp${alaDompet.toLocaleString('id-ID')}` : 'Rp••••••••'}
                </span>
                {showBalance && (
                  <span className="text-[14px] font-medium text-[#9CA3AF] -ml-1 mt-1 font-mono">
                    ,00
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
                href="/tarik"
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
                href="/setor"
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
        {/* SHORTCUTS ROW: EXACT 1:1 APK item_explore_menu.xml (7 SHORTCUTS)          */}
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
        {/* SECTION: TABUNGAN & IMPIAN SAYA (CENTRAL HUB LIHAT SEMUA TABUNGAN)        */}
        {/* ========================================================================= */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
                Tabungan &amp; Impian Saya
              </h2>
              <span className="text-[11px] text-gray-500 font-medium">
                Pantau seluruh rekening &amp; target finansialmu
              </span>
            </div>
            <Link
              href="/keuangan"
              className="text-[12.5px] font-bold text-[#1C20C4] hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1">
            {/* Card 1: Ala Dompet */}
            <Link
              href="/keuangan"
              className="shrink-0 w-[240px] bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs snap-start hover:border-gray-300 transition-all flex flex-col justify-between"
              style={{ minHeight: '135px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-[#1A1D26]">Ala Dompet</h3>
                    <span className="text-[9.5px] text-gray-400 font-medium">Rekening Utama</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Aktif
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[18px] font-black text-[#1A1D26] tracking-tight block font-mono">
                  Rp{alaDompet.toLocaleString('id-ID')},00
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Bebas biaya admin &amp; transfer
                </span>
              </div>
            </Link>

            {/* Card 2: Ala Impian Umrah */}
            <Link
              href="/impian"
              className="shrink-0 w-[240px] bg-white rounded-2xl p-4 border border-emerald-200/80 bg-emerald-50/20 shadow-xs snap-start hover:border-emerald-300 transition-all flex flex-col justify-between"
              style={{ minHeight: '135px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-[#1A1D26]">Umroh Keluarga</h3>
                    <span className="text-[9.5px] text-emerald-700 font-bold">Ala Impian</span>
                  </div>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B]">
                  52%
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[16px] font-black text-[#064E3B]">
                    Rp18.500.000
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    / Rp35.000.000
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#00F0A0] rounded-full" style={{ width: '52%' }} />
                </div>
              </div>
            </Link>

            {/* Card 3: Ala Deposito */}
            <Link
              href="/simulasi-bagi-hasil"
              className="shrink-0 w-[240px] bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs snap-start hover:border-gray-300 transition-all flex flex-col justify-between"
              style={{ minHeight: '135px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-[#1A1D26]">Ala Deposito</h3>
                    <span className="text-[9.5px] text-amber-600 font-bold">Nisbah 85:15</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  8,5% p.a.
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[18px] font-black text-[#1A1D26] tracking-tight block">
                  Rp10.000.000
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Jatuh tempo: 12 Bulan (Otomatis)
                </span>
              </div>
            </Link>

            {/* Card 4: Ala Pocket */}
            <Link
              href="/pocket"
              className="shrink-0 w-[240px] bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs snap-start hover:border-gray-300 transition-all flex flex-col justify-between"
              style={{ minHeight: '135px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black text-[#1A1D26]">Ala Pocket</h3>
                    <span className="text-[9.5px] text-gray-400 font-medium">Jajan &amp; Harian</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Sub-Wallet
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[18px] font-black text-[#1A1D26] tracking-tight block">
                  Rp450.000
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Pos pengeluaran terpisah
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION: SOBAT ALADIN ACTIVATION HUB                                      */}
        {/* ========================================================================= */}
        <div className="mt-5 px-5">
          <Link
            href="/onboarding/tujuan-finansial"
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#07194D] via-[#1037A6] to-[#1C20C4] text-white flex items-center justify-between shadow-md active:scale-98 transition-all group border border-blue-400/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-[#00F0A0]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-[#00F0A0] bg-white/10 px-2 py-0.5 rounded-full">
                    Sobat Aladin
                  </span>
                  <span className="text-[10px] text-blue-200 font-bold">
                    Target 30-Day Active
                  </span>
                </div>
                <h3 className="text-[13.5px] font-black text-white mt-0.5 leading-snug">
                  Atur Fokus Finansial Pasca-KYC
                </h3>
                <p className="text-[11px] text-blue-100/80 leading-tight">
                  Pilih prioritas (Ibadah, Harian, Investasi, Anak) &amp; aksi berikutnya
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* SECTION: TEMUKAN BERKAH (AUTO-SCROLLING CAROUSEL WITH LUCIDE ICONS)        */}
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

          {/* Banner Carousel with auto-scroll ref */}
          <div
            ref={carouselRef}
            className="flex items-center gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
          >
            {banners.map((b) => {
              const IconComp = b.Icon
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className="shrink-0 w-[300px] h-[150px] rounded-3xl overflow-hidden relative shadow-sm border border-white/10 snap-start active:scale-[0.99] transition-transform p-4 text-white flex flex-col justify-between"
                  style={{
                    background: b.bg,
                  }}
                >
                  {/* Photo / Illustrated Card Background */}
                  {b.imageBg && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      <Image
                        src={b.imageBg}
                        alt={b.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    </div>
                  )}

                  {/* Top Badge & Vector Icon */}
                  <div className="flex items-center justify-between relative z-10">
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
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${b.iconBg}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="my-auto pr-2 relative z-10">
                    <h3 className="text-[15px] font-black leading-snug line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-white/85 line-clamp-1 mt-0.5">
                      {b.desc}
                    </p>
                  </div>

                  {/* CTA Action Pill */}
                  <div className="flex items-center justify-between pt-1 relative z-10">
                    <span className="text-[11px] font-extrabold text-[#00F0A0] flex items-center gap-1">
                      {b.cta} →
                    </span>
                    <span className="text-[9.5px] text-white/60 font-semibold tracking-wider uppercase">
                      #PakaiAladin
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {banners.map((_, dot) => (
              <span
                key={dot}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dot === activeBanner % banners.length ? 'w-4 bg-[#00F0A0]' : 'w-1.5 bg-[#E2E8F0]'
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
