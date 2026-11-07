'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'

export default function ProfilPage() {
  const router = useRouter()
  // Interactive toggle states
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [copiedRekening, setCopiedRekening] = useState(false)

  // Interactive modal states
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [showDataDiriModal, setShowDataDiriModal] = useState(false)
  const [showAkunModal, setShowAkunModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinStep, setPinStep] = useState<'current' | 'new' | 'confirm'>('current')
  const [showBiFastModal, setShowBiFastModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyRekening = () => {
    navigator.clipboard?.writeText?.('081234567890')
    setCopiedRekening(true)
    showToast('Nomor rekening 0812-3456-7890 berhasil disalin!')
    setTimeout(() => setCopiedRekening(false), 2000)
  }

  const handlePinKey = (digit: string) => {
    if (pinInput.length < 6) {
      const next = pinInput + digit
      setPinInput(next)
      if (next.length === 6) {
        setTimeout(() => {
          if (pinStep === 'current') {
            setPinStep('new')
            setPinInput('')
          } else if (pinStep === 'new') {
            setPinStep('confirm')
            setPinInput('')
          } else {
            setShowPinModal(false)
            setPinInput('')
            setPinStep('current')
            showToast('PIN transaksi syariah Anda berhasil diperbarui!')
          }
        }, 300)
      }
    }
  }

  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1))
  }

  const handleLogout = () => {
    setShowLogoutModal(false)
    showToast('Berhasil keluar. Mengalihkan ke splash screen...')
    setTimeout(() => {
      window.location.href = '/'
    }, 800)
  }

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
        className="w-full h-[46px] flex items-center justify-between bg-white border-b border-[#ECEEF2] shrink-0"
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/beranda"
          className="flex items-center justify-center p-1 -ml-1 active:opacity-60 transition-opacity"
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

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Profil Saya
        </h1>

        <Link
          href="/bantu"
          className="flex items-center justify-center p-1 active:opacity-60 transition-opacity text-[#1C20C4]"
        >
          <span className="text-[12px] font-bold">Bantuan</span>
        </Link>
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 100px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* User Profile Card */}
        <div
          onClick={() => setShowDataDiriModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          className="active:scale-[0.99] transition-transform"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #081D48 0%, #1C20C4 50%, #00F3AD 100%)',
                padding: '2.5px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1C20C4',
                  fontWeight: 900,
                  fontSize: '17px',
                }}
              >
                SA
              </div>
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Syahid Arkan F.
                </h2>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    flexShrink: 0,
                  }}
                >
                  KYC Aktif ✓
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
                No. Rek: 0812-3456-7890
              </p>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1C20C4', display: 'block', marginTop: '4px' }}>
                Lihat data diri &amp; detail akun →
              </span>
            </div>
          </div>

          <div style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700, marginLeft: '8px', flexShrink: 0 }}>
            ›
          </div>
        </div>

        {/* Kuota Gratismu Card (Exact 1:1 to 05-profil.png & item_my_profile_header.xml) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            overflow: 'hidden',
          }}
        >
          {/* Lavender Header Strip */}
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: '#EBF1FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #DCE6FD',
            }}
          >
            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1D26' }}>
              Kuota gratismu
            </span>
            <button
              onClick={() => setShowTermsModal(true)}
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#1C20C4',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              Sahabatan ›
            </button>
          </div>

          {/* 3 Columns: ATM, Alfa Tarik, Alfa Setor */}
          <div style={{ padding: '16px 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 6px', borderRadius: '16px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#1A1D26', display: 'block' }}>
                  5/5
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.25 }}>
                  Tarik tunai di ATM
                </span>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 6px', borderRadius: '16px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#1A1D26', display: 'block' }}>
                  5/5
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.25 }}>
                  Tarik Tunai Alfa
                </span>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 6px', borderRadius: '16px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#1C20C4', display: 'block' }}>
                  5/5
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.25 }}>
                  Setor Tunai Alfa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: KEAMANAN & AKUN */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            Keamanan &amp; Akun
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Detail Akun Syariah */}
            <div
              onClick={() => setShowAkunModal(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Detail Akun Syariah
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Akad Mudharabah &amp; Wadiah Resmi
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 2. Login Biometrik Face ID */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    <circle cx="9" cy="9" r="1" fill="currentColor" />
                    <circle cx="15" cy="9" r="1" fill="currentColor" />
                    <path d="M10 13c.5.5 1.5.5 2 0" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Login Biometrik (Face ID)
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Autentikasi cepat &amp; aman
                  </span>
                </div>
              </div>

              {/* iOS Styled Toggle */}
              <button
                onClick={() => {
                  setBiometricEnabled(!biometricEnabled)
                  showToast(!biometricEnabled ? 'Biometrik Face ID diaktifkan ✓' : 'Biometrik Face ID dinonaktifkan')
                }}
                style={{
                  width: '46px',
                  height: '28px',
                  borderRadius: '14px',
                  backgroundColor: biometricEnabled ? '#1C20C4' : '#E2E8F0',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: biometricEnabled ? '21px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 3. Ubah PIN Transaksi */}
            <div
              onClick={() => {
                setPinStep('current')
                setPinInput('')
                setShowPinModal(true)
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Ubah PIN Transaksi
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    6 digit PIN keamanan transaksi
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 4. Pengaturan Kartu Debit Visa */}
            <Link
              href="/kartu"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Pengaturan Kartu Debit Visa
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Blokir kartu, limit belanja, &amp; reveal CVV
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 5. Pengaturan Proxy BI-FAST */}
            <div
              onClick={() => setShowBiFastModal(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333EA' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Pengaturan Proxy BI-FAST
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Koneksikan No. HP &amp; Email resmi
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: FITUR & PROGRAM */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            Fitur &amp; Program
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 0. Panduan Fitur Baru (#PakaiAladin Interactive Guide di Beranda) */}
            <div
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('aladin_feature_guide_seen')
                }
                router.push('/beranda?openGuide=true')
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26' }}>
                      Mulai Ulang Panduan Fitur
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#081D48', backgroundColor: '#00F3AD', padding: '1px 6px', borderRadius: '999px' }}>
                      BERANDA
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Buka tur panduan interaktif 6 inovasi di Beranda
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 1. Ala Hijrah Lifestyle Hub */}
            <Link
              href="/hijrah"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a9 9 0 0 1 9 9c0 3.5-2 6.5-5 8l-4 3-4-3c-3-1.5-5-4.5-5-8a9 9 0 0 1 9-9z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26' }}>
                      Ala Hijrah Lifestyle Hub
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#081D48', backgroundColor: '#00F3AD', padding: '1px 6px', borderRadius: '999px' }}>
                      BARU
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    9 Kategori Gaya Hidup Syariah
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 1.5 Aladin Wrapped 2026 */}
            <Link
              href="/wrapped"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DB2777' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M10 15l5-3-5-3v6z" />
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26' }}>
                      Aladin Wrapped 2026
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#FFFFFF', backgroundColor: '#DB2777', padding: '1px 6px', borderRadius: '999px' }}>
                      BARU
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Kilas Balik Transaksi Berkah Setahun
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 1.6 Maskot 3D Karpet Terbang Aladin */}
            <Link
              href="/mascot"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0A0' }}>
                  <span style={{ fontSize: '20px' }}>🧞‍♂️</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26' }}>
                      Maskot 3D Karpet Aladin
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#081D48', backgroundColor: '#00F0A0', padding: '1px 6px', borderRadius: '999px' }}>
                      3D RESMI
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Interaktif 3D &amp; Posing Real-Time
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 2. Ajak Teman Pakai Aladin */}
            <Link
              href="/rewards/referral"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Ajak Teman Pakai Aladin
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Dapatkan Rp25.000 per referral KYC
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 3. Aladin x Alfa Daily Loop */}
            <Link
              href="/rewards/alfa"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Aladin x Alfa Daily Loop
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Scan kasir &amp; klaim rewards belanja
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 4. Notifikasi Transaksi */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CA8A04' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Notifikasi Transaksi
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Push notification real-time mutasi
                  </span>
                </div>
              </div>

              {/* iOS Styled Toggle */}
              <button
                onClick={() => {
                  setNotifEnabled(!notifEnabled)
                  showToast(!notifEnabled ? 'Notifikasi transaksi diaktifkan ✓' : 'Notifikasi transaksi dinonaktifkan')
                }}
                style={{
                  width: '46px',
                  height: '28px',
                  borderRadius: '14px',
                  backgroundColor: notifEnabled ? '#1C20C4' : '#E2E8F0',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: notifEnabled ? '21px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: BANTUAN & INFORMASI */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            padding: '16px 20px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            Bantuan &amp; Informasi
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Pusat Bantuan & Live Agent */}
            <Link
              href="/bantu"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C20C4' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    <path d="M12 19v3" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Pusat Bantuan &amp; Live Agent
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Chat, panggilan video, &amp; concierge syariah
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </Link>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* 2. Syarat & Ketentuan Aladin */}
            <div
              onClick={() => setShowTermsModal(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              className="active:opacity-70 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    Syarat &amp; Ketentuan Aladin
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Perjanjian pembukaan rekening &amp; akad
                  </span>
                </div>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '18px', fontWeight: 700 }}>›</span>
            </div>
          </div>
        </div>

        {/* Destructive Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1.5px solid #FECACA',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
          }}
          className="active:scale-[0.99] transition-transform"
        >
          Keluar dari Aplikasi
        </button>

        {/* App Version Info */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', margin: '0 0 10px 0' }}>
          Bank Aladin Syariah v2.4.0 • Terdaftar &amp; Diawasi OJK
        </p>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: LIHAT DATA DIRI & DETAIL AKUN                                */}
      {/* ===================================================================== */}
      {showDataDiriModal && (
        <div
          className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowDataDiriModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar"
            style={{
              padding: '20px 24px 48px 24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                Data Diri Nasabah
              </h3>
              <button
                onClick={() => setShowDataDiriModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Nama Lengkap Sesuai KTP', value: 'Syahid Arkan Fashihurrohman' },
                { label: 'Nomor Induk Kependudukan (NIK)', value: '317102********0004' },
                { label: 'Nomor Rekening Utama (Ala Dompet)', value: '0812-3456-7890', canCopy: true },
                { label: 'Email Terdaftar', value: 'syahid.arkan@gmail.com' },
                { label: 'Nomor Handphone Terverifikasi', value: '+62 812-3456-7890' },
                { label: 'Status Verifikasi Identitas', value: 'Terverifikasi Penuh (KYC Level 2 - Biometrik)' },
                { label: 'Tanggal Pembukaan Rekening', value: '14 Januari 2024' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <span className="text-[11px] font-medium text-gray-500 block">
                      {item.label}
                    </span>
                    <span className="text-[13.5px] font-bold text-[#1A1D26] block mt-0.5">
                      {item.value}
                    </span>
                  </div>
                  {item.canCopy && (
                    <button
                      onClick={handleCopyRekening}
                      className="px-3 py-1.5 bg-[#1C20C4] text-white rounded-full text-[11px] font-extrabold cursor-pointer active:scale-95 transition-all shadow-xs"
                    >
                      {copiedRekening ? 'Tersalin ✓' : 'Salin'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDataDiriModal(false)}
              className="w-full py-3.5 bg-[#1C20C4] text-white rounded-full font-bold text-[14px] cursor-pointer shadow-md active:scale-98 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: DETAIL AKUN SYARIAH & AKAD                                   */}
      {/* ===================================================================== */}
      {showAkunModal && (
        <div
          className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowAkunModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar"
            style={{
              padding: '20px 24px 48px 24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Detail Akun Syariah
                </h3>
                <span className="text-[11px] text-gray-500">
                  Tersertifikasi Dewan Pengawas Syariah (DSN-MUI)
                </span>
              </div>
              <button
                onClick={() => setShowAkunModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 mb-6">
              {/* Wadiah Card */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                    TABUNGAN TITIPAN
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">Akad Wadiah</span>
                </div>
                <h4 className="text-[15px] font-extrabold text-[#1A1D26] mt-1">
                  Ala Dompet &amp; Ala Pocket (Wadiah Yad Dhamanah)
                </h4>
                <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
                  Titipan murni dana nasabah tanpa biaya administrasi bulanan, bebas riba, dan dana dapat ditarik sewaktu-waktu dengan jaminan keamanan utuh 100%.
                </p>
              </div>

              {/* Mudharabah Card */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                    BAGI HASIL INVESTASI
                  </span>
                  <span className="text-[11px] font-bold text-blue-700">Akad Mudharabah</span>
                </div>
                <h4 className="text-[15px] font-extrabold text-[#1A1D26] mt-1">
                  Ala Impian &amp; Ala Deposito (Mudharabah Muthlaqah)
                </h4>
                <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
                  Kemitraan investasi syariah dengan nisbah bagi hasil transparan hingga 8,5% p.a., dikelola pada portofolio produktif dan terverifikasi halal.
                </p>
              </div>

              {/* Legal Info */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 leading-snug">
                Bank Aladin Syariah berizin dan diawasi oleh <strong>OJK (Otoritas Jasa Keuangan)</strong> serta merupakan peserta penjaminan <strong>LPS (Lembaga Penjamin Simpanan)</strong>.
              </div>
            </div>

            <button
              onClick={() => setShowAkunModal(false)}
              className="w-full py-3.5 bg-[#1C20C4] text-white rounded-full font-bold text-[14px] cursor-pointer shadow-md active:scale-98 transition-all"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: UBAH PIN TRANSAKSI                                           */}
      {/* ===================================================================== */}
      {showPinModal && (
        <div
          className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowPinModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{
              padding: '20px 24px 48px 24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                {pinStep === 'current'
                  ? 'Masukkan PIN Saat Ini'
                  : pinStep === 'new'
                  ? 'Masukkan PIN Baru'
                  : 'Konfirmasi PIN Baru'}
              </h3>
              <button
                onClick={() => setShowPinModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-center text-[12px] text-gray-500 mb-6">
              {pinStep === 'current'
                ? 'Masukkan 6 digit PIN transaksi lama Anda untuk verifikasi identitas'
                : pinStep === 'new'
                ? 'Pilih 6 digit PIN baru yang aman dan tidak mudah ditebak'
                : 'Ketik ulang 6 digit PIN baru untuk memastikan kecocokan'}
            </p>

            {/* PIN Dots Display */}
            <div className="flex justify-center gap-3 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    i < pinInput.length
                      ? 'bg-[#1C20C4] scale-110'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto mb-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
                (k, idx) => {
                  if (k === '') return <div key={idx} />
                  return (
                    <button
                      key={idx}
                      onClick={() => (k === '⌫' ? handlePinDelete() : handlePinKey(k))}
                      className="h-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-[18px] font-bold text-[#1A1D26] active:scale-95 transition-transform flex items-center justify-center cursor-pointer border border-gray-100 shadow-2xs"
                    >
                      {k}
                    </button>
                  )
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: PROXY BI-FAST                                                */}
      {/* ===================================================================== */}
      {showBiFastModal && (
        <div
          className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowBiFastModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar"
            style={{
              padding: '20px 24px 48px 24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                Pengaturan Proxy BI-FAST
              </h3>
              <button
                onClick={() => setShowBiFastModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[12.5px] text-gray-600 mb-5 leading-relaxed">
              Terima transfer antar bank gratis cukup gunakan nomor handphone atau email tanpa perlu membagikan nomor rekening.
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-gray-500 block font-medium">Proxy Nomor Handphone</span>
                  <span className="text-[14px] font-extrabold text-[#1A1D26] mt-0.5 block">+62 812-3456-7890</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Terhubung ✓
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-gray-500 block font-medium">Proxy Alamat Email</span>
                  <span className="text-[14px] font-extrabold text-[#1A1D26] mt-0.5 block">syahid.arkan@gmail.com</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Terhubung ✓
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowBiFastModal(false)
                showToast('Pengaturan Proxy BI-FAST tersimpan!')
              }}
              className="w-full py-3.5 bg-[#1C20C4] text-white rounded-full font-bold text-[14px] cursor-pointer shadow-md active:scale-98 transition-all"
            >
              Simpan &amp; Tutup
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: SYARAT & KETENTUAN ALADIN                                    */}
      {/* ===================================================================== */}
      {showTermsModal && (
        <div
          className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar"
            style={{
              padding: '20px 24px 48px 24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                Syarat &amp; Ketentuan Aladin
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-[12.5px] text-gray-600 space-y-3.5 mb-6 leading-relaxed">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <strong className="text-[#1A1D26] block mb-1">1. Prinsip Akad Syariah</strong>
                Seluruh produk simpanan Bank Aladin Syariah berlandaskan Fatwa Dewan Syari’ah Nasional MUI. Rekening Ala Dompet menggunakan akad Wadiah Yad Dhamanah, sedangkan produk tabungan berjangka menggunakan akad Mudharabah Muthlaqah.
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <strong className="text-[#1A1D26] block mb-1">2. Bebas Biaya Administrasi</strong>
                Nasabah berhak atas pembebasan biaya administrasi bulanan, serta mendapatkan kuota bulanan gratis transfer BI-FAST (50x) dan tarik tunai Alfamart/ATM (5x).
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <strong className="text-[#1A1D26] block mb-1">3. Jaminan LPS &amp; Regulasi OJK</strong>
                Simpanan nasabah dijamin oleh Lembaga Penjamin Simpanan (LPS) hingga Rp2 Miliar per nasabah, dan seluruh operasional perbankan diawasi ketat oleh OJK.
              </div>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-3.5 bg-[#1C20C4] text-white rounded-full font-bold text-[14px] cursor-pointer shadow-md active:scale-98 transition-all"
            >
              Saya Telah Membaca &amp; Menyetujui
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 6: KONFIRMASI LOGOUT                                            */}
      {/* ===================================================================== */}
      {showLogoutModal && (
        <div
          className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 text-center"
            style={{
              padding: '24px 24px 48px 24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h3 className="text-[18px] font-extrabold text-[#1A1D26] mb-1">
              Keluar dari Akun Aladin?
            </h3>
            <p className="text-[13px] text-gray-500 mb-6 max-w-[280px] mx-auto leading-relaxed">
              Sesi Anda akan diakhiri secara aman. Anda dapat masuk kembali dengan mudah menggunakan Face ID atau PIN Anda.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleLogout}
                className="w-full py-3.5 bg-red-600 text-white rounded-full font-extrabold text-[14px] active:scale-[0.99] transition-transform cursor-pointer shadow-md shadow-red-200"
              >
                Ya, Keluar Sekarang
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-full font-bold text-[14px] cursor-pointer hover:bg-gray-200"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[200] bg-[#1A1D26] text-white text-[12px] font-bold px-4 py-2.5 rounded-full shadow-xl animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
