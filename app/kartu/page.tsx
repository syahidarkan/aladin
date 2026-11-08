'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useMascot } from '@/context/MascotContext'
import { Lock } from 'lucide-react'

export default function VirtualCardPage() {
  const { triggerReaction } = useMascot()
  const [isRevealed, setIsRevealed] = useState(false)
  const [showBiometricModal, setShowBiometricModal] = useState(false)
  const [cvvRevealed, setCvvRevealed] = useState(false)
  const [cvvTimer, setCvvTimer] = useState(30)
  const [isFrozen, setIsFrozen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'semua' | 'online' | 'saudi'>('semua')
  const [dailyLimit, setDailyLimit] = useState(5000000)

  // CVV Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (cvvRevealed && cvvTimer > 0) {
      interval = setInterval(() => {
        setCvvTimer((t) => t - 1)
      }, 1000)
    } else if (cvvTimer === 0) {
      setCvvRevealed(false)
      setCvvTimer(30)
    }
    return () => clearInterval(interval)
  }, [cvvRevealed, cvvTimer])

  const handleCopyCard = () => {
    navigator.clipboard?.writeText?.('4111223344557890')
    setCopied(true)
    triggerReaction('copy-success', 'Nomor kartu virtual berhasil disalin!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRevealClick = () => {
    if (isRevealed) {
      setIsRevealed(false)
    } else {
      setShowBiometricModal(true)
    }
  }

  const handleBiometricConfirm = () => {
    setShowBiometricModal(false)
    setIsRevealed(true)
  }

  const transactions = [
    {
      id: 1,
      merchant: 'Al Baik Express Makkah',
      category: 'saudi',
      date: '06 Nov 2026 • 21:14',
      amount: 'SAR 42.50',
      idr: 'Rp178.500',
      status: 'Berhasil',
      iconType: 'food',
      note: 'Geidea POS • Bebas Markup SAR',
    },
    {
      id: 2,
      merchant: 'Spotify Subscription',
      category: 'online',
      date: '03 Nov 2026 • 09:30',
      amount: 'Rp54.990',
      idr: 'Rp54.990',
      status: 'Berhasil',
      iconType: 'music',
      note: 'Langganan Otomatis',
    },
    {
      id: 3,
      merchant: 'Saudia Airlines Baggage',
      category: 'saudi',
      date: '28 Okt 2026 • 14:05',
      amount: 'SAR 120.00',
      idr: 'Rp504.000',
      status: 'Berhasil',
      iconType: 'flight',
      note: 'Tiket & Bagasi Tambahan',
    },
    {
      id: 4,
      merchant: 'Amazon Web Services',
      category: 'online',
      date: '25 Okt 2026 • 01:12',
      amount: 'USD 14.20',
      idr: 'Rp227.200',
      status: 'Berhasil',
      iconType: 'cloud',
      note: 'Cloud Hosting Syariah',
    },
  ]

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === 'semua') return true
    return tx.category === activeFilter
  })

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. iOS Status Bar */}
      <StatusBar time="22.25" batteryLevel={33} dark={false} />

      {/* 2. Top Header Bar (Clean Native Header) */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={18}
            height={18}
            priority
          />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight text-center">
          Kartu Visa Virtual
        </h1>

        <Link
          href="/ala-haramain"
          className="text-[12.5px] font-extrabold text-[#1C20C4] hover:underline"
        >
          Haramain →
        </Link>
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '40px',
        }}
      >
        {/* CARD 1: VIRTUAL CARD GRAPHIC (3D DEEP NAVY / EMERALD) */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            padding: '22px',
            color: 'white',
            background: isFrozen
              ? 'linear-gradient(135deg, #334155 0%, #0F172A 100%)'
              : 'linear-gradient(135deg, #071739 0%, #102A72 55%, #1C20C4 100%)',
            boxShadow: '0 10px 28px rgba(7, 23, 57, 0.28)',
            overflow: 'hidden',
            minHeight: '220px',
            height: '220px',
            marginBottom: '16px',
          }}
        >
          {/* Subtle silk glow background wave */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(0, 243, 173, 0.22) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Frozen State Overlay */}
          {isFrozen && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(4px)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  height: '32px',
                  padding: '0 16px',
                  borderRadius: '999px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>KARTU DIBEKUKAN SEMENTARA</span>
              </div>
              <p style={{ fontSize: '12px', color: '#CBD5E1', maxWidth: '260px', margin: 0 }}>
                Transaksi dinonaktifkan untuk keamanan. Buka kembali kapan pun melalui tombol di bawah.
              </p>
            </div>
          )}

          {/* Card Top: Aladin Brand & Contactless */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1 }}>
                Aladin
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#00F3AD', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginTop: '4px' }}>
                SYARIAH VIRTUAL CARD
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                0% Foreign Markup
              </span>

              {/* Contactless waves icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ opacity: 0.9 }}>
                <path d="M8.5 16.5C9.5 15.5 10 14 10 12C10 10 9.5 8.5 8.5 7.5" />
                <path d="M12 19C14 17 15 14.5 15 12C15 9.5 14 7 12 5" />
                <path d="M15.5 21.5C18.5 19 20 15.5 20 12C20 8.5 18.5 5 15.5 2.5" />
              </svg>
            </div>
          </div>

          {/* EMV Chip & Saudi Rail info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', marginBottom: '14px', position: 'relative', zIndex: 10 }}>
            {/* Metallic Gold Chip */}
            <div
              style={{
                width: '40px',
                height: '30px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '18px',
                  borderRadius: '3px',
                  border: '1px solid rgba(180, 83, 9, 0.45)',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(180, 83, 9, 0.45)' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(180, 83, 9, 0.45)' }} />
              </div>
            </div>

            <span style={{ fontSize: '10.5px', color: '#A5B4FC', fontWeight: 600 }}>
              Jaringan Visa Syariah Internasional
            </span>
          </div>

          {/* Card Number Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 10 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '17px', fontWeight: 800, letterSpacing: '0.12em', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              {isRevealed ? '4111  2233  4455  7890' : '••••  ••••  ••••  7890'}
            </span>

            <button
              onClick={handleCopyCard}
              style={{
                height: '28px',
                padding: '0 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              className="active:opacity-75 transition-opacity"
            >
              {copied ? 'Tersalin ' : 'Salin'}
            </button>
          </div>

          {/* Card Bottom: Holder, Expiry, CVV & Visa Wordmark */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
            <div>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px', display: 'block' }}>
                Pemegang Kartu
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Syahid Arkan F.
              </span>
            </div>

            <div>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px', display: 'block' }}>
                Berlaku s.d.
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'monospace' }}>
                11/29
              </span>
            </div>

            <div>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px', display: 'block' }}>
                CVV
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'monospace', color: '#00F3AD' }}>
                {cvvRevealed ? '832' : '•••'}
              </span>
            </div>

            {/* Visa Wordmark */}
            <div style={{ fontSize: '22px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '2px', color: '#FFFFFF', lineHeight: 1 }}>
              VISA
            </div>
          </div>
        </div>

        {/* CARD 2: QUICK ACTION SQUIRCLES (Livin' Sukha Style) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '22px',
            padding: '16px 14px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          {/* Action 1: Lihat Nomor */}
          <button
            onClick={handleRevealClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="active:opacity-60 transition-opacity"
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                backgroundColor: isRevealed ? '#1C20C4' : '#EEF2FF',
                color: isRevealed ? '#FFFFFF' : '#1C20C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
                transition: 'all 0.2s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1A1D26', textAlign: 'center' }}>
              {isRevealed ? 'Tutup No' : 'Lihat No'}
            </span>
          </button>

          {/* Action 2: Lihat CVV */}
          <button
            onClick={() => setCvvRevealed(!cvvRevealed)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="active:opacity-60 transition-opacity"
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                backgroundColor: cvvRevealed ? '#059669' : '#EEF2FF',
                color: cvvRevealed ? '#FFFFFF' : '#1C20C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
                position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {cvvRevealed && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '999px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cvvTimer}
                </span>
              )}
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1A1D26', textAlign: 'center' }}>
              {cvvRevealed ? `CVV (${cvvTimer}s)` : 'Lihat CVV'}
            </span>
          </button>

          {/* Action 3: Bekukan Kartu */}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="active:opacity-60 transition-opacity"
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                backgroundColor: isFrozen ? '#EF4444' : '#EEF2FF',
                color: isFrozen ? '#FFFFFF' : '#1C20C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
                transition: 'all 0.2s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: isFrozen ? '#EF4444' : '#1A1D26', textAlign: 'center' }}>
              {isFrozen ? 'Buka Beku' : 'Bekukan'}
            </span>
          </button>
        </div>

        {/* CARD 3: BATAS HARIAN TRANSAKSI CARD */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '22px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                KONTROL LIMIT
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Batas Harian Transaksi
              </h3>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#1C20C4' }}>
              Rp{dailyLimit.toLocaleString('id-ID')}
            </span>
          </div>

          <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '4px 0 14px 0', lineHeight: 1.4 }}>
            Membatasi belanja harian di merchant online internasional & POS Saudi Arabia.
          </p>

          <input
            type="range"
            min={1000000}
            max={25000000}
            step={1000000}
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#1C20C4', cursor: 'pointer', height: '6px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 600, color: '#9CA3AF', marginTop: '6px' }}>
            <span>Min Rp1.000.000</span>
            <span>Maks Rp25.000.000</span>
          </div>
        </div>

        {/* CARD 4: RIWAYAT TRANSAKSI KARTU (CLEAN LIST WITH GENEROUS SPACING) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '22px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AKTIVITAS KARTU
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Riwayat Transaksi
              </h3>
            </div>

            <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '999px' }}>
              0% Foreign Fee
            </span>
          </div>

          {/* Clean Segmented Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              backgroundColor: '#F4F5F9',
              padding: '4px',
              borderRadius: '999px',
              marginBottom: '16px',
            }}
          >
            {[
              { id: 'semua', label: 'Semua' },
              { id: 'online', label: 'Online' },
              { id: 'saudi', label: 'Saudi SAR' },
            ].map((f) => {
              const isSelected = activeFilter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  style={{
                    flex: 1,
                    height: '32px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                    color: isSelected ? '#1C20C4' : '#6C737E',
                    boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Clean List Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #F4F5F9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Clean SVG Icon by Category */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      backgroundColor: tx.category === 'saudi' ? '#ECFDF5' : '#EEF2FF',
                      color: tx.category === 'saudi' ? '#059669' : '#1C20C4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {tx.iconType === 'food' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
                      </svg>
                    )}
                    {tx.iconType === 'music' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="5.5" cy="17.5" r="3.5" />
                        <circle cx="17.5" cy="15.5" r="3.5" />
                        <path d="M9 17.5V5l12-2v12.5" />
                      </svg>
                    )}
                    {tx.iconType === 'flight' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    )}
                    {tx.iconType === 'cloud' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                      {tx.merchant}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#6C737E', margin: '2px 0 0 0' }}>
                      {tx.date}
                    </p>
                    <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                      {tx.note}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', display: 'block' }}>
                    {tx.idr}
                  </span>
                  {tx.category === 'saudi' && (
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', display: 'block', marginTop: '2px' }}>
                      Direct {tx.amount}
                    </span>
                  )}
                  {tx.status === 'Berhasil' && (
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#6C737E', display: 'block' }}>
                      Sukses 
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 5: REGULATORY COMPLIANCE FOOTER */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px 18px',
            border: '1px solid #ECEEF2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
              Keamanan Terjamin Visa & OJK
            </h4>
            <p style={{ fontSize: '10.5px', color: '#6C737E', margin: '2px 0 0 0' }}>
              Bank Aladin Syariah berizin dan diawasi oleh OJK & BI.
            </p>
          </div>

          <span style={{ fontSize: '11px', fontWeight: 900, color: '#1C20C4', flexShrink: 0 }}>
            OJK • LPS
          </span>
        </div>
      </div>

      {/* Biometric Face ID Confirmation Modal */}
      {showBiometricModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: '#EEF2FF',
                color: '#1C20C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
              Konfirmasi Biometrik
            </h3>
            <p style={{ fontSize: '12px', color: '#6C737E', margin: '6px 0 18px 0', lineHeight: 1.4 }}>
              Gunakan Face ID atau sidik jari untuk melihat nomor kartu lengkap Anda.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowBiometricModal(false)}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '999px',
                  border: '1px solid #ECEEF2',
                  backgroundColor: '#FFFFFF',
                  color: '#6C737E',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>

              <button
                onClick={handleBiometricConfirm}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: '#1C20C4',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(28, 32, 196, 0.25)',
                }}
              >
                Autentikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
