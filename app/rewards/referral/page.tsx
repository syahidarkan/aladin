'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const freeTransaksi = 18
  const maxFree = 50
  const referralCode = 'ALADIN2026'

  const referrals = [
    { name: 'Budi Santoso', date: '05 Nov 2026', status: 'Aktif', reward: '+Rp25.000' },
    { name: 'Rina Wati', date: '03 Nov 2026', status: 'Aktif', reward: '+Rp25.000' },
    { name: 'Dani Prasetyo', date: '28 Okt 2026', status: 'Daftar', reward: 'Menunggu' },
  ]

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Top Header with Navy Starry Gradient */}
      <div
        className="shrink-0 text-white"
        style={{
          background: 'linear-gradient(180deg, #081D48 0%, #0A2558 100%)',
          paddingBottom: '24px',
        }}
      >
        <StatusBar dark={true} />

        {/* Header App Bar */}
        <div
          className="flex items-center justify-between"
          style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            <Image
              src="/assets/icons/header_back_clean.png"
              alt="Kembali"
              width={16}
              height={16}
              style={{ width: '15.5px', height: '15.5px', filter: 'brightness(0) invert(1)' }}
              priority
            />
          </Link>

          <h1 className="text-[17px] font-bold text-white tracking-tight">
            Ajak Teman &amp; Bebas Biaya
          </h1>

          <div style={{ width: '36px' }} />
        </div>

        {/* Free Transaction Counter Hero Card */}
        <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '6px' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', display: 'block', marginBottom: '4px' }}>
              Program 50 Transaksi Gratis Bulanan
            </span>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                  {freeTransaksi}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)' }}>
                  /{maxFree}
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#081D48',
                  backgroundColor: '#00F3AD',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                {maxFree - freeTransaksi} Tersisa
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '999px', overflow: 'hidden', padding: '1px' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#00F3AD',
                  borderRadius: '999px',
                  width: `${(freeTransaksi / maxFree) * 100}%`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>

            <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '8px', lineHeight: 1.4, margin: '8px 0 0 0' }}>
              Bebas transfer BI-FAST, top-up e-wallet, dan tarik tunai di ribuan gerai Alfamart.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Main Content (20px Padding, Block Flow) */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {/* Referral Code Box (Generous Margins, No Overlap) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#1C20C4', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            KODE REFERRAL KAMU
          </span>

          {/* Referral Code Container with explicit flex and zero button overlap */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1.5px dashed #C7D2FE',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '2.5px',
                color: '#1C20C4',
                whiteSpace: 'nowrap',
              }}
            >
              {referralCode}
            </span>

            <button
              onClick={handleCopy}
              style={{
                height: '36px',
                padding: '0 18px',
                borderRadius: '999px',
                backgroundColor: '#1C20C4',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(28, 32, 196, 0.25)',
              }}
              className="active:scale-95 transition-all"
            >
              {copied ? 'Tersalin! ✓' : 'Salin'}
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
            Dapatkan saldo Ala Dompet Rp25.000 untuk setiap teman yang mendaftar dan verifikasi KYC menggunakan kodemu.
          </p>
        </div>

        {/* History of Invites Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '12px' }}>
            Teman yang Bergabung
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {referrals.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '10px',
                  borderBottom: i === referrals.length - 1 ? 'none' : '1px solid #F1F5F9',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                    {r.name}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                    {r.date} • Status: {r.status}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: r.status === 'Aktif' ? '#059669' : '#D97706',
                  }}
                >
                  {r.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
