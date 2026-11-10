'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, executeDonation } from '@/lib/bankState'

export default function DonasiPage() {
  const { alaDompet } = useBankState()
  const [activeCategory, setActiveCategory] = useState<'semua' | 'subuh' | 'jumat' | 'zakat' | 'wakaf'>('semua')
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null)
  const [customNominal, setCustomNominal] = useState('25.000')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [prayerNote, setPrayerNote] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [donatedAmount, setDonatedAmount] = useState(0)

  const quickNominals = [
    { label: 'Rp10 Rb', value: 10000 },
    { label: 'Rp25 Rb', value: 25000 },
    { label: 'Rp50 Rb', value: 50000 },
    { label: 'Rp100 Rb', value: 100000 },
  ]

  const campaigns = [
    {
      id: 1,
      category: 'subuh',
      title: 'Sedekah Subuh Berkah',
      institution: 'BAZNAS RI',
      verified: true,
      desc: 'Rutinkan sedekah di waktu mustajab subuh hari untuk membantu dhuafa dan anak yatim.',
      collected: 18450000,
      target: 25000000,
      donorsCount: 428,
      badge: 'Paling Dicari',
      color: '#059669',
    },
    {
      id: 2,
      category: 'jumat',
      title: 'Jumat Berkah Makan Siang Santri',
      institution: 'Dompet Dhuafa',
      verified: true,
      desc: 'Paket makanan bergizi halal untuk santri penghafal Al-Qur’an di pesantren pelosok.',
      collected: 34200000,
      target: 50000000,
      donorsCount: 890,
      badge: 'Rutin Mingguan',
      color: '#1C20C4',
    },
    {
      id: 3,
      category: 'zakat',
      title: 'Zakat Penghasilan & Maal Resmi',
      institution: 'BAZNAS RI',
      verified: true,
      desc: 'Penyaluran zakat 2,5% resmi ke 8 asnaf penerima sesuai ketentuan syariat dan Kemenag.',
      collected: 89100000,
      target: 100000000,
      donorsCount: 1240,
      badge: 'ZISWAF',
      color: '#081D48',
    },
    {
      id: 4,
      category: 'wakaf',
      title: 'Wakaf Sumur Air Bersih',
      institution: 'Rumah Zakat',
      verified: true,
      desc: 'Pembangunan sumur bor dan sarana sanitasi bersih berkelanjutan di wilayah kekeringan.',
      collected: 42000000,
      target: 65000000,
      donorsCount: 315,
      badge: 'Pahala Jariyah',
      color: '#0284C7',
    },
  ]

  const filteredCampaigns = campaigns.filter((c) => {
    if (activeCategory === 'semua') return true
    return c.category === activeCategory
  })

  const handleOpenDonate = (campaign: any) => {
    setSelectedCampaign(campaign)
    setCustomNominal('25.000')
    setPrayerNote('')
    setIsAnonymous(false)
  }

  const handleConfirmDonate = () => {
    const amount = parseInt(customNominal.replace(/\D/g, '') || '0', 10)
    const res = executeDonation({
      title: selectedCampaign?.title || 'Sedekah Subuh Berkah',
      category: selectedCampaign?.category || 'infaq',
      amount,
      institution: selectedCampaign?.institution || 'BAZNAS RI',
      isAnonymous,
    })
    if (!res.success) {
      alert(res.error || 'Saldo Ala Dompet tidak mencukupi.')
      return
    }
    setDonatedAmount(amount)
    setSelectedCampaign(null)
    setIsSuccess(true)
  }

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

      {/* 2. Top Header Bar */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <Link
          href="/beranda"
          data-back="true"
          className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Donasi &amp; ZISWAF
        </h1>

        <button
          onClick={() => alert('Riwayat Donasi: Anda telah menyalurkan 3 donasi total Rp150.000 melalui Bank Aladin Syariah.')}
          className="text-[12px] font-extrabold text-[#1C20C4] bg-[#EEF2FF] px-2.5 py-1 rounded-full hover:bg-[#E0E7FF] transition-colors cursor-pointer"
        >
          Riwayat
        </button>
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {/* Banner: Donasi Berkah Aladin */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #047857 55%, #059669 100%)',
            borderRadius: '24px',
            padding: '22px 20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '165px',
            flexShrink: 0,
            marginBottom: '16px',
          }}
        >
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                100% AMANAH & TERSALURKAN
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#A7F3D0' }}>
                Bebas Potongan
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 900, margin: '4px 0 2px 0' }}>
              Kebaikan Kecil Berdampak Besar
            </h2>

            <p style={{ fontSize: '11.5px', color: '#D1FAE5', margin: 0, lineHeight: 1.4, maxWidth: '280px' }}>
              Salurkan sedekah subuh, infaq jumat, dan zakat melalui mitra amil resmi terverifikasi Kemenag RI.
            </p>
          </div>
        </div>

        {/* Source of Funds Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '14px 18px',
            border: '1px solid #ECEEF2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#EEF2FF',
                color: '#1C20C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '11.5px',
              }}
            >
              IDR
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#6C737E', display: 'block' }}>Sumber Dana</span>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1D26' }}>
                Ala Dompet • Rp{alaDompet.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <Link href="/bayar-beli" style={{ fontSize: '11.5px', fontWeight: 800, color: '#1C20C4', textDecoration: 'none' }}>
            Isi Saldo →
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }} className="no-scrollbar">
          {[
            { id: 'semua', label: 'Semua Program' },
            { id: 'subuh', label: 'Sedekah Subuh' },
            { id: 'jumat', label: 'Jumat Berkah' },
            { id: 'zakat', label: 'Zakat Maal' },
            { id: 'wakaf', label: 'Wakaf' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                style={{
                  height: '34px',
                  padding: '0 16px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  border: isActive ? 'none' : '1px solid #ECEEF2',
                  backgroundColor: isActive ? '#1C20C4' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#6C737E',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 2px 6px rgba(28, 32, 196, 0.2)' : 'none',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Campaign Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredCampaigns.map((c) => {
            const percent = Math.min(100, Math.round((c.collected / c.target) * 100))

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 800,
                        backgroundColor: '#EEF2FF',
                        color: '#1C20C4',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {c.badge}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#6C737E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {c.institution}
                      {c.verified && <span style={{ color: '#059669', fontWeight: 900, fontSize: '11px' }}></span>}
                    </span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 600 }}>{c.donorsCount} Donatur</span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '0 0 4px 0' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                  {c.desc}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#1A1D26' }}>
                      Rp{c.collected.toLocaleString('id-ID')}
                    </span>
                    <span style={{ color: '#9CA3AF' }}>
                      Target: Rp{c.target.toLocaleString('id-ID')} ({percent}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: c.color, borderRadius: '999px' }} />
                  </div>
                </div>

                {/* Action button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #F4F5F9' }}>
                  <button
                    onClick={() => handleOpenDonate(c)}
                    style={{
                      height: '38px',
                      padding: '0 24px',
                      borderRadius: '999px',
                      backgroundColor: '#1C20C4',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(28, 32, 196, 0.25)',
                    }}
                    className="active:opacity-80 transition-opacity"
                  >
                    Salurkan Donasi →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL 1: DONATE INPUT SHEET */}
      {selectedCampaign && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              padding: '24px',
              paddingBottom: '36px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  SALURKAN KEBAIKAN
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26', margin: 0 }}>
                  {selectedCampaign.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                style={{ width: '32px', height: '32px', borderRadius: '999px', backgroundColor: '#F4F5F9', border: 'none', cursor: 'pointer', fontWeight: 800, color: '#6C737E' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '4px' }}>
                Nominal Donasi:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1C20C4', paddingBottom: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#1A1D26', marginRight: '6px' }}>Rp</span>
                <input
                  type="text"
                  value={customNominal}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setCustomNominal(raw ? Number(raw).toLocaleString('id-ID') : '')
                  }}
                  style={{ width: '100%', fontSize: '22px', fontWeight: 900, border: 'none', outline: 'none', background: 'transparent', color: '#1A1D26' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              {quickNominals.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setCustomNominal(q.value.toLocaleString('id-ID'))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid #ECEEF2',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmDonate}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                backgroundColor: '#1C20C4',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
              }}
            >
              Konfirmasi & Salurkan
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: SUCCESS DIALOG */}
      {isSuccess && (
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
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#1A1D26', margin: '0 0 6px 0' }}>
              Alhamdulillah, Donasi Diterima!
            </h4>
            <p style={{ fontSize: '12px', color: '#6C737E', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              Donasi sebesar Rp{donatedAmount.toLocaleString('id-ID')} telah disalurkan langsung ke amil resmi. Semoga menjadi amal jariyah yang penuh berkah.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '999px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
