'use client'

import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, convertIdrToSar, paySaudiMerchant } from '@/lib/bankState'

export default function BayarSaudiPage() {
  const { dompetSar, alaImpianUmroh, alaDompet, sarHistory } = useBankState()

  // Top-Up / Move funds state
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [fundingSource, setFundingSource] = useState<'ala_impian' | 'ala_dompet'>('ala_impian')
  const [topupNominalIdr, setTopupNominalIdr] = useState('1.000.000')

  // Payment Modals state
  const [showScannerModal, setShowScannerModal] = useState(false)
  const [showCustomerQrModal, setShowCustomerQrModal] = useState(false)
  const [showNfcModal, setShowNfcModal] = useState(false)
  const [nfcState, setNfcState] = useState<'waiting' | 'reading' | 'success'>('waiting')

  // Merchant payment flow state
  const [selectedMerchant, setSelectedMerchant] = useState<{
    name: string
    category: string
    terminalId: string
    amountSar: number
    location: string
  } | null>(null)
  const [showPin, setShowPin] = useState(false)
  const [lastReceipt, setLastReceipt] = useState<{
    merchant: string
    terminalId: string
    amountSar: number
    amountIdr: number
    refNumber: string
    date: string
    method: string
  } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // QR timer
  const [qrCountdown, setQrCountdown] = useState(60)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showCustomerQrModal && qrCountdown > 0) {
      timer = setInterval(() => setQrCountdown((prev) => prev - 1), 1000)
    } else if (qrCountdown === 0) {
      setQrCountdown(60)
    }
    return () => clearInterval(timer)
  }, [showCustomerQrModal, qrCountdown])

  const sarRate = 4220 // 1 SAR = 4.220 IDR (Guaranteed Zero Markup)
  const idrNum = parseInt(topupNominalIdr.replace(/\D/g, '') || '0', 10)
  const sarEstimate = (idrNum / sarRate).toFixed(2)

  const merchants = [
    {
      id: 1,
      name: 'Al Baik Restaurant',
      category: 'Kuliner Halal',
      location: 'Ajyad Makkah (150m dari Haram)',
      terminalId: 'GEIDEA-POS #GD-9842',
      price: 32.0,
    },
    {
      id: 2,
      name: 'Nahdi Pharmacy',
      category: 'Farmasi & Medis',
      location: 'Clock Tower Lt. 2 Zamzam',
      terminalId: 'GEIDEA-POS #GD-1024',
      price: 45.0,
    },
    {
      id: 3,
      name: 'Bin Dawood Supermarket',
      category: 'Supermarket',
      location: 'Abraj Al Bait Makkah',
      terminalId: 'GEIDEA-POS #GD-5519',
      price: 120.0,
    },
    {
      id: 4,
      name: 'Jarir Bookstore',
      category: 'Kitab & Buku',
      location: 'Madinah Central (Masjid Nabawi)',
      terminalId: 'GEIDEA-POS #GD-7731',
      price: 85.0,
    },
  ]

  const handleConfirmMoveFunds = () => {
    if (idrNum <= 0) return

    const res = convertIdrToSar({
      fundingSource,
      idrAmount: idrNum,
      sarRate,
    })

    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi')
      return
    }

    setShowTopupModal(false)

    setLastReceipt({
      merchant: 'Konversi Saldo ke SAR',
      terminalId: 'WADZPAY-RAIL #WP-7721',
      amountSar: res.sarAdded,
      amountIdr: idrNum,
      refNumber: res.refNumber,
      date: 'Baru saja',
      method: fundingSource === 'ala_impian' ? 'Ala Impian Umroh' : 'Ala Dompet IDR',
    })
    setShowSuccessModal(true)
  }

  const handlePinSubmit = () => {
    if (!selectedMerchant) return

    const res = paySaudiMerchant({
      merchantName: selectedMerchant.name,
      terminalId: selectedMerchant.terminalId,
      amountSar: selectedMerchant.amountSar,
      method: 'D360 Saudi Network',
      sarRate,
    })

    if (!res.success) {
      alert(res.error || 'Saldo SAR tidak mencukupi')
      return
    }

    setShowPin(false)

    setLastReceipt({
      merchant: selectedMerchant.name,
      terminalId: selectedMerchant.terminalId,
      amountSar: selectedMerchant.amountSar,
      amountIdr: Math.round(selectedMerchant.amountSar * sarRate),
      refNumber: res.refNumber,
      date: 'Baru saja',
      method: 'D360 Saudi Network',
    })
    setShowSuccessModal(true)
    setSelectedMerchant(null)
  }

  const handleSimulateNfcTap = () => {
    setNfcState('reading')
    setTimeout(() => {
      setNfcState('success')
      setTimeout(() => {
        setShowNfcModal(false)
        setNfcState('waiting')
        const nfcAmount = 25.0

        const res = paySaudiMerchant({
          merchantName: 'Bin Dawood (Contactless NFC)',
          terminalId: 'GEIDEA-NFC #GD-5519',
          amountSar: nfcAmount,
          method: 'Geidea Contactless NFC',
          sarRate,
        })

        if (!res.success) {
          alert(res.error || 'Saldo SAR tidak mencukupi')
          return
        }

        setLastReceipt({
          merchant: 'Bin Dawood (Contactless NFC)',
          terminalId: 'GEIDEA-NFC #GD-5519',
          amountSar: nfcAmount,
          amountIdr: Math.round(nfcAmount * sarRate),
          refNumber: res.refNumber,
          date: 'Baru saja',
          method: 'Geidea Contactless NFC',
        })
        setShowSuccessModal(true)
      }, 700)
    }, 1200)
  }

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-clip relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Top Header */}
      <header className="shrink-0 w-full bg-white border-b border-[#ECEEF2] z-30">
        <StatusBar />
        <div
          className="w-full h-14 flex items-center justify-between bg-white px-4"
        >
          <Link
            href="/beranda"
            data-back="true"
            className="w-9 h-9 -ml-1 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Bayar di Saudi (SAR)
        </h1>

        <Link
          href="/beranda"
          className="flex items-center justify-center p-1 active:opacity-60 transition-opacity text-[#1C20C4]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {/* HERO SAR BALANCE CARD (3D Aesthetic Emerald Card) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #047857 55%, #059669 100%)',
            borderRadius: '24px',
            padding: '24px 20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '205px',
            flexShrink: 0,
            marginBottom: '16px',
          }}
        >
          {/* Subtle watermarked crescent */}
          <div
            style={{
              position: 'absolute',
              right: '-15px',
              bottom: '-20px',
              width: '140px',
              height: '140px',
              opacity: 0.12,
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="flex justify-between items-center mb-1">
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#A7F3D0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                DOMPET RIYAL SAUDI (SAR)
              </span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#064E3B', backgroundColor: '#A7F3D0', padding: '2px 8px', borderRadius: '999px' }}>
                0% KURS MARKUP
              </span>
            </div>

            <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', margin: '6px 0 2px 0' }}>
              SAR {dompetSar.toFixed(2)}
            </div>

            <p style={{ fontSize: '12px', color: '#D1FAE5' }}>
              ≈ Rp{(dompetSar * sarRate).toLocaleString('id-ID')} • Kurs: 1 SAR = Rp{sarRate.toLocaleString('id-ID')}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                onClick={() => setShowTopupModal(true)}
                style={{
                  flex: 1,
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  color: '#064E3B',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
                className="active:scale-95 transition-all"
              >
                + Beli Saldo SAR
              </button>

              <button
                onClick={() => setShowScannerModal(true)}
                style={{
                  flex: 1,
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#00F3AD',
                  color: '#081D48',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
                className="active:scale-95 transition-all"
              >
                Bayar di Terminal →
              </button>
            </div>
          </div>
        </div>

        {/* 3 Quick Payment Options (Scan QR, Show QR, Tap NFC) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 16px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '14px', paddingLeft: '4px' }}>
            Cara Bayar di Merchant Saudi (Geidea Network)
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* 1. Scan QR Kasir */}
            <div
              onClick={() => setShowScannerModal(true)}
              className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '20px',
                  backgroundColor: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                  <rect x="7" y="7" width="10" height="10" rx="1" />
                </svg>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                Scan QR Kasir
              </span>
            </div>

            {/* 2. Tampilkan QR */}
            <div
              onClick={() => {
                setQrCountdown(60)
                setShowCustomerQrModal(true)
              }}
              className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '20px',
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                Tampilkan QR
              </span>
            </div>

            {/* 3. Tap NFC Mesin */}
            <div
              onClick={() => {
                setNfcState('waiting')
                setShowNfcModal(true)
              }}
              className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '20px',
                  backgroundColor: '#FAF5FF',
                  border: '1.5px solid #E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18h12M6 14h12M6 10h12" />
                  <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" />
                </svg>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                Tap NFC POS
              </span>
            </div>
          </div>
        </div>

        {/* Sumber Dana Indonesia Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 18px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
            marginBottom: '16px',
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                SUMBER DANA DARI INDONESIA
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', marginTop: '2px' }}>
                Konversi Bebas Biaya Admin
              </h4>
            </div>
            <button
              onClick={() => setShowTopupModal(true)}
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#1C20C4',
                backgroundColor: '#EEF2FF',
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + Pindahkan Saldo
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>Ala Impian Umroh</span>
                <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Kantong persiapan ibadah</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26' }}>
                Rp{alaImpianUmroh.toLocaleString('id-ID')}
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>Ala Dompet (IDR Utama)</span>
                <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Saldo rekening utama</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26' }}>
                Rp{alaDompet.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Merchant Geidea di Makkah & Madinah */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 18px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
            marginBottom: '16px',
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#1C20C4', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                MERCHANT GEIDEA RESMI
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', marginTop: '2px' }}>
                Merchant Sekitar Masjidil Haram &amp; Nabawi
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {merchants.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26', display: 'block' }}>
                    {m.name}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    {m.location}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#064E3B', display: 'block' }}>
                      SAR {m.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>
                      ≈ Rp{(m.price * sarRate).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMerchant({
                        name: m.name,
                        category: m.category,
                        terminalId: m.terminalId,
                        amountSar: m.price,
                        location: m.location,
                      })
                      setShowPin(true)
                    }}
                    style={{
                      height: '34px',
                      padding: '0 16px',
                      backgroundColor: '#1C20C4',
                      color: 'white',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      borderRadius: '999px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    className="active:scale-95 transition-all"
                  >
                    Bayar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Transaksi SAR */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 18px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '12px' }}>
            Riwayat Transaksi SAR
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sarHistory.map((h) => (
              <div key={h.id} className="flex justify-between items-center py-2 border-b border-[#F1F5F9] last:border-none">
                <div>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A1D26', display: 'block' }}>
                    {h.merchant}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    {h.date} • {h.terminalId}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: h.type === 'debit' ? '#DC2626' : '#16A34A',
                      display: 'block',
                    }}
                  >
                    {h.type === 'debit' ? '-' : '+'}SAR {h.amountSar.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                    Rp{h.amountIdr.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Partner Footer */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 16px',
            border: '1px solid #ECEEF2',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Infrastruktur Pembayaran Lintas Batas Berlisensi
          </span>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#1A1D26' }}>
            Powered by D360 × BPKH • Bank Aladin Syariah
          </p>
        </div>
      </div>

      {/* TOP UP / PINDAHKAN SALDO MODAL */}
      {showTopupModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '24px', paddingBottom: '36px' }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                Pindahkan Saldo ke Riyal (SAR)
              </h3>
              <button
                onClick={() => setShowTopupModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Source choices */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setFundingSource('ala_impian')}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: fundingSource === 'ala_impian' ? '2px solid #059669' : '1px solid #ECEEF2',
                  backgroundColor: fundingSource === 'ala_impian' ? '#ECFDF5' : '#FFFFFF',
                  textAlign: 'left',
                }}
              >
                <span className="text-[10px] font-bold text-gray-500 block">DARI KANTONG:</span>
                <span className="text-[12px] font-bold text-gray-900 block mt-0.5">Ala Impian Umroh</span>
                <span className="text-[11px] font-extrabold text-emerald-700 block mt-1">
                  Rp{alaImpianUmroh.toLocaleString('id-ID')}
                </span>
              </button>

              <button
                onClick={() => setFundingSource('ala_dompet')}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: fundingSource === 'ala_dompet' ? '2px solid #1C20C4' : '1px solid #ECEEF2',
                  backgroundColor: fundingSource === 'ala_dompet' ? '#EEF2FF' : '#FFFFFF',
                  textAlign: 'left',
                }}
              >
                <span className="text-[10px] font-bold text-gray-500 block">DARI REKENING:</span>
                <span className="text-[12px] font-bold text-gray-900 block mt-0.5">Ala Dompet IDR</span>
                <span className="text-[11px] font-extrabold text-blue-700 block mt-1">
                  Rp{alaDompet.toLocaleString('id-ID')}
                </span>
              </button>
            </div>

            {/* Nominal input */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #ECEEF2',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>Nominal Rupiah (IDR):</span>
              <input
                type="text"
                value={topupNominalIdr}
                onChange={(e) => setTopupNominalIdr(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#1A1D26',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  marginTop: '4px',
                }}
              />
              <div className="flex justify-between items-center pt-2 border-t border-[#ECEEF2] mt-2">
                <span style={{ fontSize: '11px', color: '#64748B' }}>Dikonversi Menjadi:</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#064E3B' }}>
                  SAR {sarEstimate}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmMoveFunds}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '48px',
                padding: '0 24px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Konfirmasi &amp; Isi Saldo SAR
            </button>
          </div>
        </div>
      )}

      {/* SCANNER MODAL */}
      {showScannerModal && (
        <div
          className="absolute inset-0 z-[100] bg-black/95 flex flex-col justify-between"
          style={{
            paddingTop: '54px',
            paddingBottom: '36px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          <div className="flex justify-between items-center text-white shrink-0">
            <span style={{ fontSize: '16px', fontWeight: 800 }}>Scan QR Terminal Geidea</span>
            <button
              onClick={() => setShowScannerModal(false)}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white cursor-pointer active:scale-95"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col items-center my-auto">
            <div
              style={{
                width: '240px',
                height: '240px',
                border: '3px solid #00F3AD',
                borderRadius: '24px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(0, 243, 173, 0.3)',
              }}
            >
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00F3AD] to-transparent animate-pulse" />
            </div>
            <p className="text-white text-[12.5px] font-medium mt-5 text-center">
              Arahkan kamera ke layar POS Geidea merchant
            </p>
          </div>

          <button
            onClick={() => {
              setShowScannerModal(false)
              setSelectedMerchant({
                name: 'Al Baik Express Ajyad',
                category: 'Kuliner Halal',
                terminalId: 'GEIDEA-POS #GD-9842',
                amountSar: 32.0,
                location: 'Ajyad Makkah',
              })
              setShowPin(true)
            }}
            style={{
              height: '48px',
              backgroundColor: '#00F3AD',
              color: '#081D48',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
            className="active:scale-98 transition-transform shadow-lg shrink-0"
          >
            Simulasikan Scan Berhasil (SAR 32.00)
          </button>
        </div>
      )}

      {/* SHOW QR MODAL */}
      {showCustomerQrModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px',
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26' }}>Tampilkan ke Kasir Geidea</span>
              <button onClick={() => setShowCustomerQrModal(false)} className="text-gray-400 font-bold">×</button>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '16px' }}>
              Kasir akan scan barcode ini di terminal POS Geidea
            </p>

            {/* QR Mockup */}
            <div
              style={{
                width: '180px',
                height: '180px',
                backgroundColor: '#F8FAFC',
                border: '2px dashed #CBD5E1',
                borderRadius: '16px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#1A1D26" strokeWidth="1.5">
                <rect x="2" y="2" width="8" height="8" />
                <rect x="14" y="2" width="8" height="8" />
                <rect x="14" y="14" width="8" height="8" />
                <rect x="2" y="14" width="8" height="8" />
              </svg>
            </div>

            <p style={{ fontSize: '11px', color: '#1C20C4', fontWeight: 700, marginTop: '12px' }}>
              Memperbarui otomatis dalam {qrCountdown} detik
            </p>
          </div>
        </div>
      )}

      {/* NFC TAP MODAL */}
      {showNfcModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18h12M6 14h12M6 10h12" />
                <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" />
              </svg>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1A1D26' }}>
              {nfcState === 'waiting' ? 'Dekatkan ke Terminal Geidea' : nfcState === 'reading' ? 'Membaca Sensor...' : 'Transaksi Berhasil!'}
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
              Pastikan fitur NFC pada smartphone Anda aktif.
            </p>

            <button
              onClick={handleSimulateNfcTap}
              style={{
                marginTop: '20px',
                width: '100%',
                height: '42px',
                backgroundColor: '#9333EA',
                color: 'white',
                fontSize: '12.5px',
                fontWeight: 700,
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Simulasikan Tempel NFC
            </button>
            <button
              onClick={() => setShowNfcModal(false)}
              style={{
                marginTop: '8px',
                width: '100%',
                height: '36px',
                backgroundColor: 'transparent',
                color: '#64748B',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* PIN CONFIRMATION */}
      {showPin && selectedMerchant && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '24px 20px 40px 20px' }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                Konfirmasi Pembayaran SAR
              </h3>
              <button onClick={() => setShowPin(false)} className="text-gray-400 font-bold p-1 cursor-pointer">×</button>
            </div>
            <p className="text-[12.5px] text-[#64748B] mb-2 leading-relaxed">
              Pembayaran ke <strong>{selectedMerchant.name}</strong> sebesar <strong>SAR {selectedMerchant.amountSar.toFixed(2)}</strong> (≈ Rp{(selectedMerchant.amountSar * sarRate).toLocaleString('id-ID')}).
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '14px',
                marginTop: '22px',
                marginBottom: '32px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <div key={d} className="w-4 h-4 rounded-full bg-[#064E3B]" />
              ))}
            </div>

            <button
              onClick={handlePinSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '48px',
                padding: '0 24px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
              className="active:scale-98 transition-transform shadow-md"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS RECEIPT MODAL */}
      {showSuccessModal && lastReceipt && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
            }}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26' }}>Transaksi Berhasil!</h4>
            <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Pembayaran via jaringan Geidea telah tervalidasi SAMA.
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '12px 14px',
                border: '1px solid #ECEEF2',
                textAlign: 'left',
                marginTop: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="flex justify-between text-[11px] py-0.5">
                <span className="text-[#64748B]">Merchant:</span>
                <span className="font-bold text-[#1A1D26]">{lastReceipt.merchant}</span>
              </div>
              <div className="flex justify-between text-[11px] py-0.5">
                <span className="text-[#64748B]">Total SAR:</span>
                <span className="font-extrabold text-[#064E3B]">SAR {lastReceipt.amountSar.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] py-0.5 border-t border-[#ECEEF2] mt-1 pt-1">
                <span className="text-[#64748B]">Ekuivalen IDR:</span>
                <span className="font-bold text-[#1A1D26]">Rp{lastReceipt.amountIdr.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#064E3B',
                color: 'white',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '13px',
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
