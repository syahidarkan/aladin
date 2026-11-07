'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import BottomNav from '@/components/BottomNav'
import FeatureGuideModal from '@/components/FeatureGuideModal'
import { useBankState } from '@/lib/bankState'

export default function BerandaPage() {
  const { alaDompet, alaImpianUmroh, alaDeposito, pockets = [] } = useBankState()
  const [showBalance, setShowBalance] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % 6)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const totalInPockets = pockets.reduce((acc, p) => acc + (p.balance || 0), 0)

  const banners = [
    {
      id: 'transaksi-nabung-banner',
      type: 'card',
      bg: 'linear-gradient(135deg, #091E42 0%, #162477 55%, #1C20C4 100%)',
      tag: '#PAKAIALADIN TRANSAKSI',
      title: 'Buat Transaksi dan Nabung',
      sub: '50 Transaksi Gratis Setiap Bulan',
      desc: 'Bebas transfer BI-FAST, top up e-wallet, dan tarik tunai tanpa biaya admin di ribuan Alfamart.',
      href: '/rewards/referral',
    },
    {
      id: 'wealth-banner',
      type: 'card',
      bg: 'linear-gradient(135deg, #081D48 0%, #1E3A8A 100%)',
      tag: '#PAKAIALADIN WEALTH',
      title: 'Grow Your Wealth',
      sub: 'Bagi Hasil hingga 8,5% p.a.',
      desc: 'Investasi Reksa Dana & Emas Syariah dengan talangan likuiditas Qardh T+0 instan.',
      href: '/wealth',
    },
    {
      id: 'haji-banner',
      type: 'card',
      bg: 'linear-gradient(135deg, #022C22 0%, #064E3B 55%, #047857 100%)',
      tag: '#PAKAIALADIN IBADAH',
      title: 'Buat Berangkat Haji',
      sub: 'Tabungan Ibadah Terhubung BPKH',
      desc: 'Kalkulator cerdas porsi haji reguler & estimasi keberangkatan dengan bagi hasil syariah.',
      href: '/impian/haji/buat',
    },
    {
      id: 'hijrah-banner',
      type: 'card',
      bg: 'linear-gradient(135deg, #091E42 0%, #1C20C4 55%, #00B392 100%)',
      tag: 'LIFESTYLE & EKOSISTEM SYARIAH',
      title: 'Ala Hijrah Hub',
      sub: 'Presale Tiket Kajian & Kuliner Halal',
      desc: 'Dapatkan diskon presale eksklusif hingga 35% khusus nasabah Bank Aladin.',
      href: '/hijrah',
    },
    {
      id: 'haramain-banner',
      type: 'card',
      bg: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
      tag: 'POWERED BY D360 × BPKH',
      title: 'Ala Haramain Wallet (SAR)',
      sub: 'Dual Saldo IDR & SAR di Arab Saudi',
      desc: 'Bayar via Tap NFC di seluruh merchant Makkah & Madinah dengan 0% markup kurs.',
      href: '/ala-haramain',
    },
    {
      id: 'wrapped-banner',
      type: 'card',
      bg: 'linear-gradient(135deg, #831843 0%, #BE185D 55%, #DB2777 100%)',
      tag: 'KILAS BALIK #PAKAIALADIN 2026',
      title: 'Aladin Wrapped 2026',
      sub: 'Kilas Balik Transaksi Berkah Setahun',
      desc: 'Lihat rangkuman transaksi berkah, pos pengeluaran, dan total biaya admin yang kamu hemat.',
      href: '/wrapped',
    },
  ]

  // 8 Core Innovation Shortcuts in 2 Balanced Rows of 4 Columns
  const shortcuts = [
    // ROW 1
    {
      label: 'Ala Pocket',
      href: '/pocket',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      isNew: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Ala Impian',
      href: '/impian',
      iconBg: '#EEF2FF',
      borderColor: '#E0E7FF',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: 'Ala Deposito',
      href: '/simulasi-bagi-hasil',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Ala Hijrah',
      href: '/hijrah',
      iconBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      isNew: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },

    // ROW 2
    {
      label: 'Wealth Hub',
      href: '/wealth',
      iconBg: '#FAF5FF',
      borderColor: '#F3E8FF',
      isNew: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      label: 'Bayar Saudi',
      href: '/ala-haramain',
      iconBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      isNew: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M8 10h8" />
        </svg>
      ),
    },
    {
      label: 'Kartu Visa',
      href: '/kartu',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      isNew: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Pilgrim Bundle',
      href: '/pilgrim-bundle',
      iconBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      isNew: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
          <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1A2E]"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Scrollable Container wrapping ENTIRE page content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Navy to Teal Starry Header Section */}
        <div
          className="relative text-white overflow-hidden shrink-0"
          style={{
            height: '148px',
            background: 'linear-gradient(180deg, #081D48 0%, #06264D 65%, #024856 100%)',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {/* iOS Status Bar */}
          <StatusBar dark time="22.25" batteryLevel={33} />

          {/* Top Bar: Brand Logo & Navigation Icons */}
          <div className="flex items-center justify-between relative z-10" style={{ marginTop: '4px' }}>
            {/* Authentic White Aladin Logo */}
            <div className="relative" style={{ width: '80px', height: '24px' }}>
              <Image
                src="/assets/icons/aladin-logo-header.png"
                alt="Aladin"
                fill
                unoptimized
                className="object-contain object-left"
              />
            </div>

            {/* Notification & Profile Icons */}
            <div className="flex items-center gap-3">
              <Link href="/notifikasi" className="relative p-1.5 active:opacity-70 transition-opacity" aria-label="Notifikasi">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" />
                  <path d="M13.73 21A2 2 0 0 1 10.27 21" />
                </svg>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-[#081D48]" />
              </Link>

              <Link href="/profil" className="p-1.5 active:opacity-70 transition-opacity" aria-label="Profil">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Ala Dompet Primary Balance Card */}
        <div style={{ marginTop: '-42px', paddingLeft: '20px', paddingRight: '20px', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '18px 16px',
              boxShadow: '0 8px 24px rgba(10, 37, 64, 0.08)',
              border: '1px solid #ECEEF2',
            }}
          >
            {/* Balance container */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Saldo Ala Dompet</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#1A1D26', letterSpacing: '-0.5px' }}>
                    {showBalance ? `Rp${alaDompet.toLocaleString('id-ID')}` : 'Rp••••••••'}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="cursor-pointer text-[#64748B] hover:text-[#1C20C4]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showBalance ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-4.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <Link
                href="/keuangan"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1C20C4',
                  backgroundColor: '#EEF2FF',
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                Detail →
              </Link>
            </div>

            {/* Quick Action Pills: Transfer, Bayar, Tarik, Setor */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '14px' }}>
              {[
                { label: 'Transfer', href: '/transfer', icon: 'M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2Z' },
                { label: 'Bayar & Beli', href: '/bayar-beli', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
                { label: 'Tarik Tunai', href: '/rewards/alfa', icon: 'M12 3v12M12 15l-4-4M12 15l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2' },
                { label: 'Setor Tunai', href: '/rewards/alfa', icon: 'M12 15V3M12 3l-4 4M12 3l4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2' },
              ].map((act) => (
                <Link
                  key={act.label}
                  href={act.href}
                  className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '14px',
                      backgroundColor: '#1C20C4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 2px 6px rgba(28, 32, 196, 0.25)',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={act.icon} />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A1D26', marginTop: '6px', textAlign: 'center' }}>
                    {act.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 10 Core Shortcuts Grid - 2 Balanced Rows of 5 Columns (Livin' Beranda Style) */}
        <div style={{ padding: '20px 20px 0 20px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px 12px',
              boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
              border: '1px solid #ECEEF2',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px 8px',
              }}
            >
              {shortcuts.map((sc) => (
                <Link
                  key={sc.label}
                  href={sc.href}
                  className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: sc.iconBg,
                      border: `1.5px solid ${sc.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      position: 'relative',
                    }}
                  >
                    {sc.icon}
                    {sc.isNew && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          backgroundColor: '#00F3AD',
                          color: '#081D48',
                          fontSize: '8px',
                          fontWeight: 900,
                          padding: '2px 5.5px',
                          borderRadius: '999px',
                          letterSpacing: '0.4px',
                          boxShadow: '0 2px 6px rgba(0, 243, 173, 0.45)',
                          textTransform: 'uppercase',
                          lineHeight: 1,
                          border: '1.5px solid #FFFFFF',
                          zIndex: 2,
                        }}
                      >
                        BARU
                      </span>
                    )}
                  </div>
                  <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E293B', lineHeight: 1.1, textAlign: 'center' }}>
                      {sc.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Temukan Berkah Carousel (Controlled Smooth Slide, Absolutely Zero Sliver) */}
        <div style={{ padding: '24px 20px 0 20px' }}>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1A1D26]">Temukan Berkah</h2>
              <p className="text-[11px] text-[#64748B]">Lifestyle &amp; Program Inovasi Terkini</p>
            </div>
            <Link href="/hijrah" className="text-[12px] font-bold text-[#1C20C4] hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {/* Controlled 100% Width Slide Wrapper */}
          <div className="relative overflow-hidden rounded-[24px] shadow-sm border border-black/5">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeBanner * 100}%)` }}
            >
              {banners.map((b) => (
                <Link
                  key={b.id}
                  href={b.href}
                  className="w-full shrink-0 min-w-full rounded-[24px] overflow-hidden"
                  style={{
                    minHeight: '148px',
                    background: b.bg,
                    padding: '20px',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#00F3AD', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {b.tag}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px', letterSpacing: '-0.3px' }}>
                      {b.title}
                    </h3>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginTop: '2px' }}>
                      {b.sub}
                    </p>
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.35, marginTop: '8px' }}>
                    {b.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Dots Indicator with Click to Change */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveBanner(i)}
                className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: activeBanner === i ? '20px' : '6px',
                  background: activeBanner === i ? '#1C20C4' : '#CBD5E1',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Section: Tabungan & Deposito (Livin' Mandiri Style Card List) */}
        <div style={{ padding: '24px 20px 100px 20px' }}>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1A1D26]">Tabungan &amp; Deposito</h2>
              <p className="text-[11px] text-[#64748B]">Akun simpanan syariah Anda</p>
            </div>
            <Link href="/keuangan" className="text-[12px] font-bold text-[#1C20C4] hover:underline">
              Kelola →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Card 1: Ala Dompet */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#1C20C4', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  TABUNGAN UTAMA
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', marginTop: '2px' }}>
                  Ala Dompet (Wadiah)
                </h4>
                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  No. Rek: 0812-3456-7890
                </p>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26', display: 'block', marginTop: '6px' }}>
                  {showBalance ? `Rp${alaDompet.toLocaleString('id-ID')}` : 'Rp••••••••'}
                </span>
              </div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: '#081D48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00F3AD',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            {/* Card: Ala Pocket (Sub-wallets / Kantong Pengeluaran) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    KANTONG HARIAN • {pockets.length} POCKET AKTIF
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', marginTop: '2px' }}>
                    Ala Pocket (Sub-Wallets)
                  </h4>
                </div>
                <Link
                  href="/pocket"
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#D97706',
                    backgroundColor: '#FEF3C7',
                    padding: '5px 12px',
                    borderRadius: '999px',
                  }}
                >
                  Kelola Pocket →
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26' }}>
                  {showBalance ? `Rp${totalInPockets.toLocaleString('id-ID')}` : 'Rp••••••••'}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Terhubung ke Transfer
                </span>
              </div>
            </div>

            {/* Card 2: Ala Impian Umroh */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    TABUNGAN TARGET • NISBAH 8,0%
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', marginTop: '2px' }}>
                    Ala Impian Umroh Akbar 1448 H
                  </h4>
                </div>
                <Link
                  href="/impian"
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '5px 12px',
                    borderRadius: '999px',
                  }}
                >
                  Detail →
                </Link>
              </div>

              {/* Progress */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                  <span>Terkumpul: <strong style={{ color: '#1A1D26' }}>Rp{alaImpianUmroh.toLocaleString('id-ID')}</strong></span>
                  <span>Target: Rp35.000.000</span>
                </div>
                <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((alaImpianUmroh / 35000000) * 100))}%`, height: '100%', borderRadius: '999px', backgroundColor: '#059669' }} />
                </div>
              </div>
            </div>

            {/* Card 3: Ala Deposito */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  DEPOSITO MUDHARABAH • 8,5% P.A.
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', marginTop: '2px' }}>
                  Ala Deposito Berjangka
                </h4>
                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Tenor 12 Bulan • Pokok Rp{alaDeposito.toLocaleString('id-ID')}
                </p>
              </div>

              <Link
                href="/simulasi-bagi-hasil"
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#D97706',
                  backgroundColor: '#FEF3C7',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}
              >
                Simulasi →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Guide Modal on Homepage (Matching Otbee Reference) */}
      <FeatureGuideModal />
    </div>
  )
}
