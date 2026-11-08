'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, investReksaDana, redeemReksaDana, tradeEmas } from '@/lib/bankState'

type ViewMode = 'hub' | 'reksadana' | 'emas' | 'deposito' | 'sukuk' | 'zakat'

export default function WealthEnginePage() {
  const { alaDompet, reksaDanaBalance, emasGrams, emasPricePerGram, totalPortfolio } = useBankState()
  const [currentView, setCurrentView] = useState<ViewMode>('hub')

  // Portfolio State
  const [totalProfit] = useState(1120000)
  const [profitPercentage] = useState('+8,15%')

  // Reksa Dana State
  const [reksaFilter, setReksaFilter] = useState<'semua' | 'pasar_uang' | 'pendapatan_tetap' | 'saham'>('semua')
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string
    manager: string
    type: string
    returnRate: string
    nav: string
    risk: string
  } | null>(null)
  const [buyNominal, setBuyNominal] = useState('1.000.000')
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showQardhInfo, setShowQardhInfo] = useState(false)

  // Emas State
  const [goldGrams, setGoldGrams] = useState('2.5')
  const [goldMode, setGoldMode] = useState<'beli' | 'jual'>('beli')
  const goldBuyPrice = 1345000
  const goldSellPrice = 1290000
  const goldGramsNum = parseFloat(goldGrams) || 0
  const goldTotalIdr = Math.round(goldGramsNum * (goldMode === 'beli' ? goldBuyPrice : goldSellPrice))

  // Deposito State
  const [depositoNominal, setDepositoNominal] = useState(25000000)
  const [depositoTenor, setDepositoTenor] = useState(12) // months
  const depositoRate = depositoTenor === 12 ? 8.5 : depositoTenor === 6 ? 7.5 : depositoTenor === 3 ? 6.5 : 5.5
  const depositoReturnEst = Math.round((depositoNominal * (depositoRate / 100) * (depositoTenor / 12)) * 0.8) // after 20% tax

  // Auto-Zakat State
  const [autoZakatActive, setAutoZakatActive] = useState(true)
  const [selectedAmil, setSelectedAmil] = useState('BAZNAS RI')

  // Global Feedback Modal
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Reksa Dana Products List
  const reksadanaProducts = [
    {
      id: 1,
      name: 'Trimegah Kas Syariah',
      manager: 'Trimegah Asset Management',
      type: 'Pasar Uang Syariah',
      category: 'pasar_uang',
      returnRate: '+6.25%',
      nav: 'Rp1.420,50',
      aum: 'Rp1.2 Triliun',
      risk: 'Risiko Rendah',
      qardhSupport: true,
    },
    {
      id: 2,
      name: 'Majoris Sukuk Negara Indonesia',
      manager: 'Majoris Asset Management',
      type: 'Pendapatan Tetap Syariah',
      category: 'pendapatan_tetap',
      returnRate: '+8.10%',
      nav: 'Rp1.890,20',
      aum: 'Rp850 Miliar',
      risk: 'Risiko Sedang',
      qardhSupport: true,
    },
    {
      id: 3,
      name: 'BNI-AM Dana Lancar Syariah',
      manager: 'BNI Asset Management',
      type: 'Pasar Uang Syariah',
      category: 'pasar_uang',
      returnRate: '+5.95%',
      nav: 'Rp1.150,00',
      aum: 'Rp640 Miliar',
      risk: 'Risiko Rendah',
      qardhSupport: true,
    },
    {
      id: 4,
      name: 'Sucorinvest Sharia Equity Fund',
      manager: 'Sucorinvest AM',
      type: 'Saham Syariah',
      category: 'saham',
      returnRate: '+11.80%',
      nav: 'Rp2.340,00',
      aum: 'Rp420 Miliar',
      risk: 'Risiko Tinggi',
      qardhSupport: false,
    },
  ]

  const filteredReksa = reksadanaProducts.filter((p) => {
    if (reksaFilter === 'semua') return true
    return p.category === reksaFilter
  })

  const handleConfirmInvestment = () => {
    if (!selectedProduct) return
    const buyNum = parseInt(buyNominal.replace(/\D/g, '') || '0', 10)

    const res = investReksaDana({
      productName: selectedProduct.name,
      manager: selectedProduct.manager,
      amount: buyNum,
    })

    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi')
      return
    }

    setShowBuyModal(false)
    setSuccessMessage(`Pembelian ${selectedProduct?.name} sebesar Rp${buyNominal} berhasil diproses. Saldo Ala Dompet terdebit dan unit masuk portofolio.`)
    setIsSuccess(true)
  }

  const handleGoldTransaction = () => {
    const action = goldMode === 'beli' ? 'Pembelian' : 'Penjualan'
    const gramsNum = parseFloat(goldGrams) || 0

    const res = tradeEmas({
      mode: goldMode,
      grams: gramsNum,
      pricePerGram: goldMode === 'beli' ? goldBuyPrice : goldSellPrice,
    })

    if (!res.success) {
      alert(res.error || 'Saldo atau gramasi tidak mencukupi')
      return
    }

    setSuccessMessage(`${action} emas fisik ${goldGrams} gram senilai Rp${goldTotalIdr.toLocaleString('id-ID')} berhasil diproses via Pegadaian Syariah. Saldo dan brankas terupdate.`)
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

      {/* 2. Top Header Bar (Clean Native Header) */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <button
          onClick={() => {
            if (currentView !== 'hub') {
              setCurrentView('hub')
            } else {
              window.location.href = '/beranda'
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={18}
            height={18}
            priority
          />
        </button>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight text-center">
          {currentView === 'hub' && 'Wealth Hub'}
          {currentView === 'reksadana' && 'Reksa Dana Syariah'}
          {currentView === 'emas' && 'Emas Digital Syariah'}
          {currentView === 'deposito' && 'Ala Deposito'}
          {currentView === 'sukuk' && 'Sukuk Negara (SBSN)'}
          {currentView === 'zakat' && 'Auto-Zakat Portofolio'}
        </h1>

        <button
          onClick={() => setShowQardhInfo(true)}
          className="text-[12.5px] font-extrabold text-[#1C20C4] hover:underline cursor-pointer"
        >
          Prinsip
        </button>
      </div>

      {/* 3. SCROLLABLE BODY */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '40px',
        }}
      >
        {/* ========================================================================= */}
        {/* VIEW 0: MAIN INVESTMENT HUB (LIVIN' SUKHA SQUIRCLE MATRIX)                */}
        {/* ========================================================================= */}
        {currentView === 'hub' && (
          <div>
            {/* PORTFOLIO SUMMARY CARD */}
            <div
              style={{
                background: 'linear-gradient(135deg, #071739 0%, #102A72 55%, #1C20C4 100%)',
                borderRadius: '24px',
                padding: '22px 20px',
                color: 'white',
                boxShadow: '0 8px 24px rgba(7, 23, 57, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '175px',
                marginBottom: '16px',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#A5B4FC', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  TOTAL PORTOFOLIO INVESTASI
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 243, 173, 0.2)',
                    color: '#00F3AD',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}
                >
                  {profitPercentage} YTD
                </span>
              </div>

              <div style={{ margin: '8px 0 4px 0' }}>
                <span style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.5px', display: 'block', lineHeight: 1.1 }}>
                  Rp{totalPortfolio.toLocaleString('id-ID')}
                </span>
                <p style={{ fontSize: '11.5px', color: '#E0E7FF', margin: '6px 0 0 0' }}>
                  Keuntungan Halal: <strong style={{ color: '#00F3AD' }}>+Rp{totalProfit.toLocaleString('id-ID')}</strong> (Bebas Riba)
                </p>
              </div>

              {/* Asset Allocation Badges */}
              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  color: '#C7D2FE',
                  fontWeight: 600,
                }}
              >
                <span>Reksa Dana: Rp{reksaDanaBalance.toLocaleString('id-ID')}</span>
                <span>•</span>
                <span>Emas: {emasGrams.toFixed(2)} gr</span>
                <span>•</span>
                <span>Auto-Zakat: Aktif</span>
              </div>
            </div>

            {/* SQUIRCLE MATRIX: PILIH JENIS INVESTASI (LIVIN' SUKHA STYLE) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px 16px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingLeft: '4px', paddingRight: '4px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    KATEGORI INSTRUMEN
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                    Pilih Jenis Investasi
                  </h3>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1C20C4' }}>
                  5 Pilihan Halal
                </span>
              </div>

              {/* 5-Item Symmetrical Squircle Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px 10px',
                }}
              >
                {/* 1. Reksa Dana Syariah */}
                <button
                  onClick={() => setCurrentView('reksadana')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  className="active:opacity-60 transition-opacity"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: '#EEF2FF',
                      color: '#1C20C4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', lineHeight: 1.2 }}>
                    Reksa Dana
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                    s.d. 8,10%
                  </span>
                </button>

                {/* 2. Emas Digital */}
                <button
                  onClick={() => setCurrentView('emas')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  className="active:opacity-60 transition-opacity"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: '#FEF3C7',
                      color: '#D97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', lineHeight: 1.2 }}>
                    Emas Digital
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>
                    Fisik LBMA
                  </span>
                </button>

                {/* 3. Ala Deposito */}
                <button
                  onClick={() => setCurrentView('deposito')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  className="active:opacity-60 transition-opacity"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: '#ECFDF5',
                      color: '#047857',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="7" y1="15" x2="11" y2="15" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', lineHeight: 1.2 }}>
                    Ala Deposito
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                    s.d. 8,5% p.a.
                  </span>
                </button>

                {/* 4. Sukuk Negara */}
                <button
                  onClick={() => setCurrentView('sukuk')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  className="active:opacity-60 transition-opacity"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: '#F3E8FF',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', lineHeight: 1.2 }}>
                    Sukuk Negara
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#7C3AED', marginTop: '2px' }}>
                    6,40% APBN
                  </span>
                </button>

                {/* 5. Auto-Zakat Portofolio */}
                <button
                  onClick={() => setCurrentView('zakat')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  className="active:opacity-60 transition-opacity"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', lineHeight: 1.2 }}>
                    Auto-Zakat
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                    Pembersihan 2,5%
                  </span>
                </button>

                {/* 6. RDN Saham Syariah (via Ajaib) - Segera Hadir */}
                <button
                  onClick={() => alert('RDN Saham Syariah (via Ajaib Sekuritas) sedang dalam tahap finalisasi integrasi API di Roadmap #PakaiAladin. Segera Hadir!')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    position: 'relative',
                  }}
                  className="active:opacity-60 transition-opacity"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                      position: 'relative',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    <span
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-8px',
                        backgroundColor: '#F59E0B',
                        color: 'white',
                        fontSize: '7.5px',
                        fontWeight: 900,
                        padding: '2px 5px',
                        borderRadius: '999px',
                        letterSpacing: '0.3px',
                      }}
                    >
                      SEGERA
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', lineHeight: 1.2 }}>
                    Saham Syariah
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#F59E0B', marginTop: '2px' }}>
                    via Ajaib
                  </span>
                </button>
              </div>
            </div>

            {/* CURATED FEATURED PRODUCTS (PILIHAN REKOMENDASI TERATAS) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TERPOPULER
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                    Pilihan Rekomendasi Teratas
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentView('reksadana')}
                  style={{ fontSize: '12px', fontWeight: 700, color: '#1C20C4', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Semua →
                </button>
              </div>

              {/* Product Cards with Vertical Structure & Spacious Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reksadanaProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    style={{
                      padding: '16px',
                      borderRadius: '18px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #ECEEF2',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: '#064E3B',
                          backgroundColor: '#D1FAE5',
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {prod.type}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: '#059669' }}>
                        {prod.returnRate} <span style={{ fontSize: '10px', fontWeight: 600, color: '#6C737E' }}>/ thn</span>
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#1A1D26', margin: '0 0 2px 0' }}>
                      {prod.name}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#6C737E', margin: '0 0 12px 0' }}>
                      {prod.manager} • {prod.risk} • AUM {prod.aum}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #ECEEF2' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#6C737E', display: 'block' }}>NAV / Unit:</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26' }}>{prod.nav}</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProduct(prod)
                          setShowBuyModal(true)
                        }}
                        style={{
                          height: '36px',
                          padding: '0 20px',
                          borderRadius: '999px',
                          backgroundColor: '#1C20C4',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(28, 32, 196, 0.25)',
                        }}
                        className="active:opacity-80 transition-opacity"
                      >
                        Beli Unit →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QARDH T+0 BANNER */}
            <div
              style={{
                backgroundColor: '#EFF0FC',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #C7D2FE',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  backgroundColor: '#1C20C4',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                T+0
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1C20C4', margin: 0 }}>
                  Talangan Likuiditas Qardh T+0
                </h4>
                <p style={{ fontSize: '11px', color: '#4B5563', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                  Cairkan reksa dana pasar uang seketika ke Ala Dompet tanpa menunggu 2 hari bursa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED REKSA DANA SYARIAH SUB-PAGE                             */}
        {/* ========================================================================= */}
        {currentView === 'reksadana' && (
          <>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
              {[
                { id: 'semua', label: 'Semua Produk' },
                { id: 'pasar_uang', label: 'Pasar Uang' },
                { id: 'pendapatan_tetap', label: 'Sukuk' },
                { id: 'saham', label: 'Saham Syariah' },
              ].map((f) => {
                const isSelected = reksaFilter === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setReksaFilter(f.id as any)}
                    style={{
                      height: '34px',
                      padding: '0 16px',
                      borderRadius: '999px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      border: isSelected ? 'none' : '1px solid #ECEEF2',
                      backgroundColor: isSelected ? '#1C20C4' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#6C737E',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            {/* Reksa Products List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredReksa.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '22px',
                    padding: '18px 20px',
                    border: '1px solid #ECEEF2',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#064E3B',
                        backgroundColor: '#D1FAE5',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {prod.type}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#059669' }}>
                      {prod.returnRate} <span style={{ fontSize: '10px', fontWeight: 600, color: '#6C737E' }}>1 Thn</span>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '0 0 2px 0' }}>
                    {prod.name}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '0 0 14px 0' }}>
                    {prod.manager} • {prod.risk} • AUM {prod.aum}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F4F5F9' }}>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#6C737E', display: 'block' }}>Nilai Aktiva Bersih (NAV):</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26' }}>{prod.nav}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProduct(prod)
                        setShowBuyModal(true)
                      }}
                      style={{
                        height: '38px',
                        padding: '0 22px',
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
                      Beli Unit →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEDICATED EMAS DIGITAL SYARIAH SUB-PAGE                           */}
        {/* ========================================================================= */}
        {currentView === 'emas' && (
          <>
            {/* GOLD PRICE BOARD */}
            <div
              style={{
                background: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
                borderRadius: '24px',
                padding: '20px',
                color: 'white',
                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  HARGA EMAS FISIK LBMA
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '999px' }}>
                  Pegadaian Syariah
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '8px 0' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px' }}>
                  <span style={{ fontSize: '10.5px', color: '#FEF3C7', display: 'block' }}>Harga Beli / gram:</span>
                  <span style={{ fontSize: '18px', fontWeight: 900, display: 'block', marginTop: '2px' }}>
                    Rp{goldBuyPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px' }}>
                  <span style={{ fontSize: '10.5px', color: '#FEF3C7', display: 'block' }}>Harga Jual / gram:</span>
                  <span style={{ fontSize: '18px', fontWeight: 900, display: 'block', marginTop: '2px' }}>
                    Rp{goldSellPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '10.5px', color: '#FEF3C7', margin: '4px 0 0 0', lineHeight: 1.35 }}>
                Fisik emas tersimpan aman di vault berstandar LBMA dan dapat dicetak menjadi emas batangan Antam/UBS.
              </p>
            </div>

            {/* BUY / SELL TRANSACT CARD */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#F4F5F9', padding: '4px', borderRadius: '999px', marginBottom: '16px' }}>
                <button
                  onClick={() => setGoldMode('beli')}
                  style={{
                    height: '36px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: goldMode === 'beli' ? '#1C20C4' : 'transparent',
                    color: goldMode === 'beli' ? '#FFFFFF' : '#6C737E',
                  }}
                >
                  Beli Emas
                </button>
                <button
                  onClick={() => setGoldMode('jual')}
                  style={{
                    height: '36px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: goldMode === 'jual' ? '#1C20C4' : 'transparent',
                    color: goldMode === 'jual' ? '#FFFFFF' : '#6C737E',
                  }}
                >
                  Jual Emas
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '6px' }}>
                  Jumlah Berat Emas:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ECEEF2', borderRadius: '16px', padding: '10px 14px' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(e.target.value)}
                    style={{ flex: 1, fontSize: '20px', fontWeight: 800, border: 'none', outline: 'none', background: 'transparent' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#6C737E' }}>Gram</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  {['0.5', '1', '2.5', '5', '10'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoldGrams(g)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: goldGrams === g ? 'none' : '1px solid #ECEEF2',
                        backgroundColor: goldGrams === g ? '#1C20C4' : '#F4F5F9',
                        color: goldGrams === g ? '#FFFFFF' : '#1A1D26',
                        cursor: 'pointer',
                      }}
                    >
                      {g} gr
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '12px', color: '#6C737E' }}>
                  {goldMode === 'beli' ? 'Total Pembayaran:' : 'Dana yang Diterima:'}
                </span>
                <span style={{ fontSize: '17px', fontWeight: 900, color: '#1C20C4' }}>
                  Rp{goldTotalIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={handleGoldTransaction}
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
                {goldMode === 'beli' ? 'Konfirmasi Beli Emas' : 'Konfirmasi Jual Emas'}
              </button>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: DEDICATED ALA DEPOSITO SUB-PAGE                                   */}
        {/* ========================================================================= */}
        {currentView === 'deposito' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '22px 20px',
              border: '1px solid #ECEEF2',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              SIMPANAN BERJANGKA MUDHARABAH
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1A1D26', margin: '4px 0 8px 0' }}>
              Kalkulator Bagi Hasil Ala Deposito
            </h3>
            <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Nisbah bagi hasil kompetitif s.d. 85:15 (setara 8,5% p.a.). Dijamin penuh oleh LPS hingga Rp2 Miliar.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '4px' }}>
                Nominal Penempatan Deposito:
              </span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#1A1D26', display: 'block' }}>
                Rp{depositoNominal.toLocaleString('id-ID')}
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {[10000000, 25000000, 50000000].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDepositoNominal(n)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: depositoNominal === n ? 'none' : '1px solid #ECEEF2',
                      backgroundColor: depositoNominal === n ? '#064E3B' : '#F4F5F9',
                      color: depositoNominal === n ? '#FFFFFF' : '#1A1D26',
                      cursor: 'pointer',
                    }}
                  >
                    {n === 10000000 ? 'Rp10 Jt' : n === 25000000 ? 'Rp25 Jt' : 'Rp50 Jt'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '8px' }}>
                Pilih Jangka Waktu (Tenor):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[1, 3, 6, 12].map((t) => (
                  <button
                    key={t}
                    onClick={() => setDepositoTenor(t)}
                    style={{
                      height: '38px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: depositoTenor === t ? 'none' : '1px solid #ECEEF2',
                      backgroundColor: depositoTenor === t ? '#064E3B' : '#F4F5F9',
                      color: depositoTenor === t ? '#FFFFFF' : '#1A1D26',
                      cursor: 'pointer',
                    }}
                  >
                    {t} Bln
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '18px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#064E3B', marginBottom: '4px' }}>
                <span>Indikasi Bagi Hasil:</span>
                <span style={{ fontWeight: 800 }}>{depositoRate}% p.a.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#064E3B', paddingTop: '8px', borderTop: '1px solid rgba(6,78,59,0.15)' }}>
                <span style={{ fontWeight: 700 }}>Estimasi Bagi Hasil Bersih:</span>
                <span style={{ fontSize: '16px', fontWeight: 900 }}>+Rp{depositoReturnEst.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessMessage(`Penempatan Ala Deposito Rp${depositoNominal.toLocaleString('id-ID')} tenor ${depositoTenor} bulan berhasil diproses.`)
                setIsSuccess(true)
              }}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(6, 78, 59, 0.25)',
              }}
            >
              Buka Ala Deposito Sekarang
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: DEDICATED SUKUK NEGARA SUB-PAGE                                   */}
        {/* ========================================================================= */}
        {currentView === 'sukuk' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '22px 20px',
              border: '1px solid #ECEEF2',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              SURAT BERHARGA SYARIAH NEGARA
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1A1D26', margin: '4px 0 8px 0' }}>
              Sukuk Ritel Seri SR021
            </h3>
            <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              100% aman dijamin Pemerintah Republik Indonesia melalui APBN dan UU SBSN. Kupon imbalan dibayarkan rutin tiap bulan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #ECEEF2', paddingTop: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#6C737E' }}>Tingkat Kupon:</span>
                <span style={{ fontWeight: 800, color: '#7C3AED' }}>6,40% p.a. (Fixed)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#6C737E' }}>Tanggal Pembayaran:</span>
                <span style={{ fontWeight: 800, color: '#1A1D26' }}>Tgl 10 Tiap Bulan</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#6C737E' }}>Minimal Pemesanan:</span>
                <span style={{ fontWeight: 800, color: '#1A1D26' }}>Rp1.000.000</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessMessage('Pemesanan Sukuk Ritel SR021 berhasil diajukan ke Kementerian Keuangan RI.')
                setIsSuccess(true)
              }}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
              }}
            >
              Pesan Sukuk Ritel Sekarang
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: DEDICATED AUTO-ZAKAT SUB-PAGE                                     */}
        {/* ========================================================================= */}
        {currentView === 'zakat' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '22px 20px',
              border: '1px solid #ECEEF2',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26', margin: 0 }}>
                  Status Auto-Zakat
                </h3>
                <p style={{ fontSize: '11px', color: '#6C737E', margin: '2px 0 0 0' }}>
                  Potong otomatis 2,5% saat hasil investasi cair
                </p>
              </div>

              <button
                onClick={() => setAutoZakatActive(!autoZakatActive)}
                style={{
                  width: '52px',
                  height: '28px',
                  borderRadius: '999px',
                  backgroundColor: autoZakatActive ? '#059669' : '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '999px',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: autoZakatActive ? '27px' : '3px',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '8px' }}>
                Pilih Lembaga Amil Terverifikasi:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['BAZNAS RI (Badan Amil Zakat Nasional)', 'Dompet Dhuafa', 'Rumah Zakat'].map((amil) => (
                  <div
                    key={amil}
                    onClick={() => setSelectedAmil(amil)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: selectedAmil === amil ? '1.5px solid #059669' : '1px solid #ECEEF2',
                      backgroundColor: selectedAmil === amil ? '#ECFDF5' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A1D26' }}>{amil}</span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: selectedAmil === amil ? '#059669' : 'transparent' }}>
                      
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessMessage(`Pengaturan Auto-Zakat berhasil disimpan untuk disalurkan ke ${selectedAmil}.`)
                setIsSuccess(true)
              }}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
              }}
            >
              Simpan Pengaturan
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: BUY REKSA DANA NOMINAL INPUT SHEET                                */}
      {/* ========================================================================= */}
      {showBuyModal && selectedProduct && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
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
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#1C20C4', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  PEMBELIAN UNIT
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26', margin: 0 }}>
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '999px',
                  backgroundColor: '#F4F5F9',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  color: '#6C737E',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '4px' }}>
                Nominal Pembelian:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1C20C4', paddingBottom: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#1A1D26', marginRight: '6px' }}>Rp</span>
                <input
                  type="text"
                  value={buyNominal}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setBuyNominal(raw ? Number(raw).toLocaleString('id-ID') : '')
                  }}
                  style={{ width: '100%', fontSize: '22px', fontWeight: 900, border: 'none', outline: 'none', background: 'transparent', color: '#1A1D26' }}
                />
              </div>
            </div>

            {/* Quick chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['100.000', '500.000', '1.000.000', '5.000.000'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setBuyNominal(chip)}
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
                  {chip === '100.000' ? '100 Rb' : chip === '500.000' ? '500 Rb' : chip === '1.000.000' ? '1 Jt' : '5 Jt'}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmInvestment}
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
              Konfirmasi & Beli Unit
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRINSIP & AKAD SYARIAH SHEET                                     */}
      {/* ========================================================================= */}
      {showQardhInfo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
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
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#1C20C4', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  KEPATUHAN SYARIAH
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#1A1D26', margin: 0 }}>
                  Prinsip Wealth Engine
                </h3>
              </div>
              <button
                onClick={() => setShowQardhInfo(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '999px',
                  backgroundColor: '#F4F5F9',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  color: '#6C737E',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', fontSize: '11.5px', color: '#4B5563', lineHeight: 1.4 }}>
              <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #ECEEF2' }}>
                <strong style={{ color: '#1C20C4', display: 'block', marginBottom: '2px' }}>1. Akad Qardh (Talangan T+0)</strong>
                Pencairan instan tanpa bunga atas reksa dana pasar uang tanpa menunggu 2 hari bursa.
              </div>
              <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #ECEEF2' }}>
                <strong style={{ color: '#047857', display: 'block', marginBottom: '2px' }}>2. Akad Mudharabah</strong>
                Bagi hasil simpanan deposito yang proporsional dan diawasi Dewan Pengawas Syariah.
              </div>
            </div>

            <button
              onClick={() => setShowQardhInfo(false)}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '999px',
                backgroundColor: '#1C20C4',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Tutup & Kembali
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: GLOBAL SUCCESS FEEDBACK                                          */}
      {/* ========================================================================= */}
      {isSuccess && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
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
              Transaksi Berhasil!
            </h4>
            <p style={{ fontSize: '12px', color: '#6C737E', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              {successMessage}
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '999px',
                backgroundColor: '#1C20C4',
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
