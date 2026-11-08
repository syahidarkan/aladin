'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, buyHijrahItem } from '@/lib/bankState'

type CategoryId =
  | 'hub'
  | 'ormas'
  | 'ziswaf'
  | 'kajian'
  | 'umroh'
  | 'investasi'
  | 'fashion'
  | 'kuliner'
  | 'kesehatan'
  | 'pendidikan'

export default function AlaHijrahPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('hub')
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string
    category: string
    price: number
    discountPrice: number
    location: string
    date: string
    time: string
    organizer: string
  } | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Dynamic header title matching current view
  const getHeaderTitle = () => {
    switch (activeCategory) {
      case 'hub':
        return 'Ala Hijrah'
      case 'kajian':
        return 'Kajian & Event'
      case 'ormas':
        return 'Ormas Islam'
      case 'ziswaf':
        return 'ZISWAF'
      case 'umroh':
        return 'Tour & Umroh'
      case 'investasi':
        return 'Investasi Emas'
      case 'fashion':
        return 'Modest Wear'
      case 'kuliner':
        return 'Kuliner Halal'
      case 'kesehatan':
        return 'Kesehatan Syariah'
      case 'pendidikan':
        return 'Pendidikan Anak'
      default:
        return 'Ala Hijrah'
    }
  }

  // 9 Categories - Livin' Sukha Authentic Clean Squircle Matrix (Zero Badges, Zero Clutter)
  const sukhaCategories = [
    {
      id: 'ormas',
      label: 'Ormas Islam',
      iconBg: '#F0FDF4',
      borderColor: '#DCFCE7',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: 'ziswaf',
      label: 'ZISWAF',
      iconBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 'kajian',
      label: 'Kajian Event',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <line x1="7" y1="9" x2="17" y2="9" />
          <line x1="7" y1="13" x2="17" y2="13" />
          <line x1="7" y1="17" x2="13" y2="17" />
        </svg>
      ),
    },
    {
      id: 'umroh',
      label: 'Tour & Umroh',
      iconBg: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'investasi',
      label: 'Investasi Emas',
      iconBg: '#EEF2FF',
      borderColor: '#C7D2FE',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: 'fashion',
      label: 'Modest Wear',
      iconBg: '#FAF5FF',
      borderColor: '#E9D5FF',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      id: 'kuliner',
      label: 'Kuliner Halal',
      iconBg: '#FFF7ED',
      borderColor: '#FED7AA',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="2" x2="6" y2="5" />
          <line x1="10" y1="2" x2="10" y2="5" />
        </svg>
      ),
    },
    {
      id: 'kesehatan',
      label: 'Kesehatan',
      iconBg: '#F0FDF4',
      borderColor: '#BBF7D0',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      id: 'pendidikan',
      label: 'Pendidikan Anak',
      iconBg: '#F5F3FF',
      borderColor: '#DDD6FE',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
  ]

  // Event Kajian Data
  const kajianEvents = [
    {
      id: 1,
      title: 'Hijrah & Mental Health: Menemukan Ketenangan Jiwa',
      category: 'Kajian Gen Z Akbar',
      speaker: 'Ustadz Populer Gen Z & Psikolog Muslim',
      date: 'Sabtu, 21 Nov 2026',
      time: '09:00 - 12:00 WIB',
      location: 'Grand Ballroom Jakarta & Live Streaming',
      normalPrice: 125000,
      discountPrice: 85000,
      badge: 'Presale Aladin -32%',
      partner: 'Komunitas Pemuda Hijrah',
    },
    {
      id: 2,
      title: 'Parenting Nabawiyah: Mendidik Generasi Berkarakter',
      category: 'Seminar Keluarga',
      speaker: 'Pakar Parenting Islami Nasional',
      date: 'Ahad, 29 Nov 2026',
      time: '13:30 - 16:30 WIB',
      location: 'Auditorium Syariah Bandung',
      normalPrice: 150000,
      discountPrice: 105000,
      badge: 'Diskon 30%',
      partner: 'Sahabat Parenting Indonesia',
    },
    {
      id: 3,
      title: 'Kelas Intensif Tahsin Bersanad Online (4 Sesi)',
      category: 'Kelas Sertifikasi',
      speaker: 'Lembaga Tahfidz Bersanad Internasional',
      date: 'Mulai 05 Des 2026',
      time: 'Setiap Sabtu & Ahad',
      location: 'Interactive Video Room',
      normalPrice: 350000,
      discountPrice: 280000,
      badge: 'E-Certificate',
      partner: 'Markaz Al-Qur’an Syariah',
    },
  ]

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Safe Area Spacer */}
      <StatusBar />

      {/* 2. Top Header Bar */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <button
          onClick={() => {
            if (activeCategory !== 'hub') {
              setActiveCategory('hub')
            } else {
              window.location.href = '/beranda'
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={16}
            height={16}
            style={{ width: '15.5px', height: '15.5px' }}
            priority
          />
        </button>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          {getHeaderTitle()}
        </h1>

        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C20C4] hover:bg-blue-50 active:scale-95 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>

      {/* 3. SCROLLABLE MAIN BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* ========================================================================= */}
        {/* VIEW 0: MAIN ALA HIJRAH HUB (LIVIN' SUKHA MODEL)                          */}
        {/* ========================================================================= */}
        {activeCategory === 'hub' && (
          <div>
            {/* HERO BANNER: 3D "HIJRAH" STYLED BANNER (Exact Sukha Visual Match) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #091E42 0%, #1C20C4 50%, #00B392 100%)',
                height: '185px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 20px',
              }}
            >
              {/* Dynamic Fluid Art Silk Waves (Matches Livin' Sukha background art) */}
              <svg
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                viewBox="0 0 390 185"
                fill="none"
              >
                <path
                  d="M-20 60 C80 120, 200 10, 410 80 L410 -20 L-20 -20 Z"
                  fill="url(#wave1)"
                  opacity="0.25"
                />
                <path
                  d="M-20 140 C120 70, 260 160, 410 90 L410 200 L-20 200 Z"
                  fill="url(#wave2)"
                  opacity="0.35"
                />
                <defs>
                  <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00F3AD" />
                    <stop offset="100%" stopColor="#1C20C4" />
                  </linearGradient>
                  <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1C20C4" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Bold 3D Block Text "HIJRAH" mirroring "SUKHA" */}
              <div
                className="relative text-center select-none z-10"
                style={{
                  transform: 'perspective(500px) rotateX(8deg) rotateY(-2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <span
                  style={{
                    fontSize: '54px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '3px',
                    lineHeight: '1',
                    color: '#FFFFFF',
                    textShadow:
                      '0 2px 0 #00B48A, 0 4px 0 #00936F, 0 6px 0 #007355, 0 8px 0 #00563E, 0 10px 18px rgba(0,0,0,0.4)',
                    display: 'block',
                  }}
                >
                  HIJRAH
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '3.5px',
                    color: '#00F3AD',
                    marginTop: '8px',
                    textTransform: 'uppercase',
                    display: 'block',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  Lifestyle &amp; Ekosistem Syariah
                </span>
              </div>
            </div>

            {/* THE SUKHA ICON GRID CONTAINER (Mirrors Livin' Sukha White Card) */}
            <div style={{ padding: '0 20px', marginTop: '-24px', position: 'relative', zIndex: 10 }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px 16px 20px 16px',
                  boxShadow: '0 8px 24px rgba(10, 37, 64, 0.08)',
                  border: '1px solid #ECEEF2',
                }}
              >
                {/* 3 COLUMNS X 3 ROWS BALANCED MATRIX (9 Categories - Zero Leftover Slots) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px 12px',
                  }}
                >
                  {sukhaCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'investasi') {
                          window.location.href = '/wealth'
                        } else if (item.id === 'umroh') {
                          window.location.href = '/pilgrim-bundle'
                        } else if (item.id === 'ziswaf') {
                          window.location.href = '/donasi'
                        } else {
                          setActiveCategory(item.id as CategoryId)
                        }
                      }}
                      className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
                    >
                      {/* Squircle Icon Box (Clean, Elegant, Zero Cluttered Badges) */}
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '20px',
                          backgroundColor: item.iconBg,
                          border: `1.5px solid ${item.borderColor}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                        className="flex items-center justify-center relative"
                      >
                        {item.icon}
                      </div>

                      {/* Clean Native Label (Livin' Sukha Style: Just The Clean Name) */}
                      <div className="h-[28px] flex items-center justify-center text-center mt-2 px-1">
                        <span className="text-[12px] font-bold text-[#1E293B] leading-tight text-center">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: "SEMUA ADA, SEMUA BERKAH" (Mirrors "Semua Ada, Semua Sukha") */}
            <div style={{ padding: '24px 20px 40px 20px' }}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-[16px] font-extrabold text-[#1C20C4]">
                    Semua Ada, Semua Berkah
                  </h3>
                  <p className="text-[11.5px] text-[#6C737E] truncate">
                    Presale tiket eksklusif &amp; kemitraan komunitas resmi
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory('kajian')}
                  className="text-[12px] font-bold text-[#1C20C4] hover:underline whitespace-nowrap shrink-0"
                >
                  Lihat Semua →
                </button>
              </div>

              {/* Promo Banner Card 1: Kajian Gen Z Presale (Livin' Sukha Promo Card Match) */}
              {/* Redesigned Card 1: Presale Kajian Eksklusif */}
              <div
                onClick={() => setActiveCategory('kajian')}
                style={{
                  background: 'linear-gradient(135deg, #081D48 0%, #0F2A66 60%, #163E99 100%)',
                  borderRadius: '24px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(8, 29, 72, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  marginBottom: '16px',
                  cursor: 'pointer',
                }}
                className="active:scale-[0.99] transition-all"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: '#00F3AD',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(0, 243, 173, 0.15)',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      border: '1px solid rgba(0, 243, 173, 0.3)',
                    }}
                  >
                    PRESALE EKSKLUSIF ALADIN
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>
                    Sisa 42 Tiket
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                    margin: '0 0 6px 0',
                  }}
                >
                  Kajian Akbar &amp; Mental Health Gen Z
                </h4>

                <p
                  style={{
                    fontSize: '11.5px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    margin: '0 0 16px 0',
                  }}
                >
                  21 Nov 2026 • Grand Ballroom Jakarta
                </p>

                {/* Pricing & Proportional CTA Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                      Harga Spesial Nasabah:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 900, color: '#00F3AD' }}>
                        Rp85.000
                      </span>
                      <span style={{ fontSize: '11px', textDecoration: 'line-through', color: 'rgba(255, 255, 255, 0.5)' }}>
                        Rp125.000
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{
                      height: '34px',
                      padding: '0 16px',
                      borderRadius: '999px',
                      backgroundColor: '#00F3AD',
                      color: '#081D48',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 243, 173, 0.35)',
                    }}
                  >
                    Beli Tiket →
                  </button>
                </div>
              </div>

              {/* Redesigned Card 2: Voucher Kuliner Halal */}
              <div
                onClick={() => {
                  alert('Voucher Kuliner Halal: Diskon 25% di merchant terverifikasi Halal BPJPH & MUI.')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '18px 20px',
                  border: '1.5px solid #FED7AA',
                  boxShadow: '0 4px 16px rgba(194, 65, 12, 0.06)',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
                className="active:scale-[0.99] transition-all"
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        color: '#C2410C',
                        backgroundColor: '#FFEDD5',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      VOUCHER HALAL 25%
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 800,
                      color: '#1A1D26',
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    Kuliner Halal Express Hemat 25%
                  </h4>

                  <p
                    style={{
                      fontSize: '11px',
                      color: '#64748B',
                      margin: '4px 0 0 0',
                    }}
                  >
                    Sertifikat Resmi BPJPH &amp; MUI
                  </p>
                </div>

                <button
                  type="button"
                  style={{
                    height: '34px',
                    padding: '0 16px',
                    borderRadius: '999px',
                    backgroundColor: '#EA580C',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)',
                  }}
                >
                  Klaim →
                </button>
              </div>

              {/* Redesigned Card 3: Kemitraan Resmi Ekosistem Syariah */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '18px 20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: '#64748B',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  KEMITRAAN RESMI EKOSISTEM SYARIAH
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                  {['Muhammadiyah', 'MUI', 'BAZNAS', 'HIMPUH'].map((partner) => (
                    <span
                      key={partner}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#081D48',
                        backgroundColor: '#F1F5F9',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED KAJIAN & EVENT TICKETING SUB-PAGE                       */}
        {/* ========================================================================= */}
        {activeCategory === 'kajian' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#1C20C4',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                TIKET KAJIAN &amp; WORKSHOP
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Event Syariah Pilihan
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Presale tiket lebih hemat khusus nasabah Bank Aladin Syariah.
              </p>
            </div>

            {/* List Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kajianEvents.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '18px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    border: '1px solid #ECEEF2',
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#B45309',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {ev.badge}
                    </span>
                    <span className="text-[10.5px] text-[#64748B]">{ev.category}</span>
                  </div>

                  <h4 className="text-[14px] font-extrabold text-[#1A1D26] mt-1 leading-snug">
                    {ev.title}
                  </h4>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">
                    {ev.speaker}
                  </p>
                  <p className="text-[11.5px] font-semibold text-[#1C20C4] mt-1">
                    {ev.date} • {ev.time}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    {ev.location}
                  </p>

                  <div
                    style={{
                      borderTop: '1px solid #F0F2F5',
                      paddingTop: '14px',
                      marginTop: '14px',
                    }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Harga Presale Aladin:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[16px] font-extrabold text-[#1C20C4]">
                          Rp{ev.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] line-through text-[#94A3B8]">
                          Rp{ev.normalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEvent({
                          title: ev.title,
                          category: ev.category,
                          price: ev.normalPrice,
                          discountPrice: ev.discountPrice,
                          location: ev.location,
                          date: ev.date,
                          time: ev.time,
                          organizer: ev.partner,
                        })
                        setShowCheckout(true)
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '36px',
                        padding: '0 18px',
                        borderRadius: '999px',
                        backgroundColor: '#1C20C4',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(28, 32, 196, 0.25)',
                        cursor: 'pointer',
                      }}
                      className="active:scale-95 transition-all"
                    >
                      Beli Tiket →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEDICATED ORMAS ISLAM SUB-PAGE                                    */}
        {/* ========================================================================= */}
        {activeCategory === 'ormas' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#16A34A',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                COMMUNITY PARTNERSHIP
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Program Ormas Islam Resmi
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Transaksi dan program sosial langsung bersama Muhammadiyah &amp; Majelis Ulama Indonesia (MUI).
              </p>
            </div>

            {/* Program 1: Qurban Terjadwal Lazismu */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: '#16A34A',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #DCFCE7',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}
                >
                  Lazismu • Muhammadiyah
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Tabungan Qurban
                </span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B', margin: '6px 0 0 0' }}>
                Program Qurban Terjadwal 1448 H
              </h4>

              {/* Clean feature tags instead of long text */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 16px 0' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  Daging Olahan Higienis
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  Distribusi Daerah 3T
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  Autodebet Bebas Riba
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Mulai Tabungan:</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A' }}>
                      Rp237.500
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>/bulan</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Pendaftaran Program Qurban Terjadwal Lazismu berhasil dibuka.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '38px',
                    padding: '0 20px',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                    border: 'none',
                  }}
                  className="active:scale-95 transition-all"
                >
                  Ikut Program →
                </button>
              </div>
            </div>

            {/* Program 2: Wakaf Madrasah MUI */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: '#1C20C4',
                    backgroundColor: '#EEF2FF',
                    border: '1px solid #E0E7FF',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}
                >
                  MUI &amp; Wakaf Nasional
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Wakaf Produktif
                </span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B', margin: '6px 0 0 0' }}>
                Wakaf Digital Pesantren &amp; Madrasah
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 16px 0' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  Laboratorium Santri
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  Pemberdayaan Umat
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  Sertifikat Wakaf BWI
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Nominal Donasi:</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#1C20C4' }}>
                    Mulai Rp50.000
                  </span>
                </div>

                <button
                  onClick={() => alert('Wakaf Tunai disalurkan ke rekening resmi Badan Wakaf Indonesia.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '38px',
                    padding: '0 20px',
                    backgroundColor: '#1C20C4',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(28, 32, 196, 0.25)',
                    border: 'none',
                  }}
                  className="active:scale-95 transition-all"
                >
                  Salurkan Wakaf →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: OTHER CATEGORIES (KEMITRAAN BERTAHAP)                             */}
        {/* ========================================================================= */}
        {activeCategory !== 'hub' && activeCategory !== 'kajian' && activeCategory !== 'ormas' && (
          <div style={{ padding: '28px 20px', textAlign: 'center' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '36px 24px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '22px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: '0 0 6px 0' }}>
                Katalog Kemitraan Bertahap
              </h3>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748B',
                  margin: '0 auto 24px auto',
                  maxWidth: '260px',
                  lineHeight: 1.5,
                }}
              >
                Kategori ini sedang dibuka secara bertahap bersama mitra resmi ekosistem syariah Indonesia.
              </p>

              {/* Generous, perfectly padded button (zero text touching border) */}
              <button
                onClick={() => setActiveCategory('hub')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '42px',
                  padding: '0 28px',
                  backgroundColor: '#1C20C4',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '999px',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(28, 32, 196, 0.25)',
                }}
                className="active:scale-95 transition-all"
              >
                Kembali ke Menu Utama
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL                                                            */}
      {/* ========================================================================= */}
      {showCheckout && selectedEvent && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '24px 20px 40px 20px' }}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#1C20C4] uppercase tracking-wider block">
                  KONFIRMASI PEMESANAN TIKET
                </span>
                <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #ECEEF2',
                marginBottom: '16px',
              }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] text-[#6C737E]">Penyelenggara:</span>
                <span className="text-[11px] font-bold text-[#1A1D26]">{selectedEvent.organizer}</span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] text-[#6C737E]">Jadwal:</span>
                <span className="text-[11px] font-semibold text-[#1A1D26]">{selectedEvent.date}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#ECEEF2]">
                <span className="text-[12.5px] font-bold text-[#1A1D26]">Total Pembayaran:</span>
                <div className="text-right">
                  <span className="text-[18px] font-extrabold text-[#1C20C4] block">
                    Rp{selectedEvent.discountPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Hemat Rp{(selectedEvent.price - selectedEvent.discountPrice).toLocaleString('id-ID')} (Presale Aladin)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const res = buyHijrahItem({
                  title: selectedEvent.title,
                  category: selectedEvent.category,
                  price: selectedEvent.discountPrice,
                  partner: selectedEvent.organizer,
                })
                if (!res.success) {
                  alert(res.error || 'Saldo tidak mencukupi.')
                  return
                }
                setShowCheckout(false)
                setShowSuccess(true)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '48px',
                padding: '0 24px',
                backgroundColor: '#1C20C4',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
                cursor: 'pointer',
              }}
              className="active:scale-98 transition-all"
            >
              Bayar via Ala Dompet
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TICKET SUCCESS MODAL                                                      */}
      {/* ========================================================================= */}
      {showSuccess && selectedEvent && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div
            className="w-full max-w-[320px] bg-white rounded-[24px] shadow-2xl text-center animate-in zoom-in-95 duration-200"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <h4 className="text-[17px] font-extrabold text-[#1A1D26]">E-Ticket Berhasil Diterbitkan!</h4>
              <p className="text-[11.5px] text-[#6C737E] mt-0.5">
                Tiket resmi acara telah dikirim ke email &amp; akun Aladin Anda.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '16px',
                padding: '12px 14px',
                border: '1px solid #ECEEF2',
                textAlign: 'left',
              }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10.5px] text-[#6C737E]">Kode Tiket:</span>
                <span className="text-[11px] font-mono font-extrabold text-[#1C20C4]">
                  ALD-TKT-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10.5px] text-[#6C737E]">Acara:</span>
                <span className="text-[11px] font-bold text-[#1A1D26] text-right truncate max-w-[170px]">
                  {selectedEvent.title}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-[#ECEEF2]">
                <span className="text-[11px] font-bold text-[#1A1D26]">Total:</span>
                <span className="text-[13px] font-extrabold text-[#064E3B]">
                  Rp{selectedEvent.discountPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccess(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '46px',
                padding: '0 24px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Selesai &amp; Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
