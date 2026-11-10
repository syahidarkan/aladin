'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, executeBillPayment } from '@/lib/bankState'

export default function EWalletPage() {
  const { alaDompet } = useBankState()
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('081234567890')
  const [selectedNominal, setSelectedNominal] = useState('50.000')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const wallets = [
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      desc: 'Top up instan belanja Shopee',
      color: '#EE4D2D',
      bgLight: '#FFF5F1',
      badge: 'Promo',
      codePrefix: 'SPAY',
    },
    {
      id: 'gopay',
      name: 'GoPay',
      desc: 'Gojek, Tokopedia & QRIS',
      color: '#0081A0',
      bgLight: '#F0F9FF',
      badge: 'Favorit',
      codePrefix: 'GOPAY',
    },
    {
      id: 'ovo',
      name: 'OVO',
      desc: 'OVO Cash Grab & Merchant',
      color: '#4C3494',
      bgLight: '#FAF5FF',
      badge: 'Instan',
      codePrefix: 'OVO',
    },
    {
      id: 'dana',
      name: 'DANA',
      desc: 'Dompet digital bebas biaya',
      color: '#118EEA',
      bgLight: '#EFF6FF',
      badge: 'Populer',
      codePrefix: 'DANA',
    },
    {
      id: 'linkaja',
      name: 'LinkAja Syariah',
      desc: 'Uang elektronik BUMN & Syariah',
      color: '#E1251B',
      bgLight: '#FEF2F2',
      badge: 'Syariah',
      codePrefix: 'LAJA',
    },
    {
      id: 'astrapay',
      name: 'AstraPay',
      desc: 'Mobilitas & angsuran Astra',
      color: '#0284C7',
      bgLight: '#F0F9FF',
      badge: '',
      codePrefix: 'ASTRA',
    },
    {
      id: 'isaku',
      name: 'i.saku',
      desc: 'Belanja hemat di Indomaret',
      color: '#2563EB',
      bgLight: '#EFF6FF',
      badge: '',
      codePrefix: 'ISAKU',
    },
  ]

  const nominalOptions = [
    { value: '20.000', price: '20.000' },
    { value: '50.000', price: '50.000' },
    { value: '100.000', price: '100.000' },
    { value: '200.000', price: '200.000' },
    { value: '500.000', price: '500.000' },
    { value: '1.000.000', price: '1.000.000' },
  ]

  const filteredWallets = wallets.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirmTopUp = () => {
    setShowPin(true)
  }

  const handlePinSuccess = () => {
    const amountNum = parseInt(selectedNominal.replace(/\D/g, '') || '0', 10)
    const res = executeBillPayment({
      serviceName: 'Top Up ' + (selectedWallet?.name || 'e-Wallet'),
      itemTitle: `Nominal Rp${selectedNominal}`,
      customerId: phoneNumber,
      amount: amountNum,
      adminFee: 0,
    })
    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi.')
      return
    }
    setShowPin(false)
    setIsSuccess(true)
  }

  // ----------------------------------------------------------------------
  // SCENARIO 1: Dedicated Top Up Form for Selected E-Wallet
  // ----------------------------------------------------------------------
  if (selectedWallet) {
    return (
      <div
        className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* iOS Status Bar */}
        <StatusBar time="22.25" batteryLevel={33} dark={false} />

        {/* Header */}
        <div
          className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
          style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          <button
            onClick={() => {
              setSelectedWallet(null)
              setIsSuccess(false)
            }}
            data-back="true"
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </button>

          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            Top Up {selectedWallet.name}
          </h1>

          <div style={{ width: '36px' }} />
        </div>

        {/* Success Receipt */}
        {isSuccess ? (
          <div
            className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between"
            style={{ padding: '24px 20px' }}
          >
            <div className="text-center pt-4">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '999px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1A1D26', margin: '0 0 6px 0' }}>
                Top Up Berhasil!
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6C737E', margin: '0 0 20px 0' }}>
                Saldo {selectedWallet.name} telah berhasil ditambahkan.
              </p>

              {/* Struk Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#6C737E' }}>Dompet Tujuan:</span>
                  <span style={{ fontWeight: 800, color: '#1A1D26' }}>{selectedWallet.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#6C737E' }}>Nomor Akun:</span>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#1A1D26' }}>{phoneNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#6C737E' }}>Sumber Dana:</span>
                  <span style={{ fontWeight: 800, color: '#1A1D26' }}>Ala Dompet</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#6C737E' }}>Biaya Admin:</span>
                  <span style={{ fontWeight: 800, color: '#059669' }}>Rp0 (Gratis)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '10px', borderTop: '1px solid #ECEEF2' }}>
                  <span style={{ fontWeight: 800, color: '#1A1D26', fontSize: '13px' }}>Total Transaksi:</span>
                  <span style={{ fontWeight: 900, color: '#1C20C4', fontSize: '18px' }}>
                    Rp{selectedNominal}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false)
                setSelectedWallet(null)
              }}
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
              Selesai
            </button>
          </div>
        ) : (
          /* Form Content */
          <div
            className="flex-1 overflow-y-auto no-scrollbar"
            style={{
              padding: '16px 20px 100px 20px',
            }}
          >
            {/* Phone Number Input Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '22px',
                padding: '20px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                marginBottom: '16px',
              }}
            >
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '6px' }}>
                Nomor Ponsel Terdaftar {selectedWallet.name}:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1C20C4', paddingBottom: '6px' }}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ width: '100%', fontSize: '18px', fontWeight: 800, border: 'none', outline: 'none', background: 'transparent', color: '#1A1D26' }}
                />
              </div>
            </div>

            {/* Nominal Selection Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '22px',
                padding: '20px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                marginBottom: '16px',
              }}
            >
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '12px' }}>
                Pilih Nominal Top Up:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {nominalOptions.map((nom) => {
                  const isSelected = selectedNominal === nom.value
                  return (
                    <button
                      key={nom.value}
                      type="button"
                      onClick={() => setSelectedNominal(nom.value)}
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid #1C20C4' : '1px solid #ECEEF2',
                        backgroundColor: isSelected ? '#EEF2FF' : '#F8FAFC',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#6C737E', display: 'block' }}>Top Up Saldo</span>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#1A1D26', display: 'block', marginTop: '2px' }}>
                        Rp{nom.value}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669', display: 'block', marginTop: '4px' }}>
                        Biaya Admin Rp0
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Source of Funds */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #ECEEF2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '10.5px', color: '#6C737E', display: 'block' }}>Sumber Dana:</span>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1D26' }}>
                  Ala Dompet • Rp{alaDompet.toLocaleString('id-ID')}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '999px' }}>
                Bebas Biaya 
              </span>
            </div>
          </div>
        )}

        {/* Bottom CTA Button */}
        {!isSuccess && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #ECEEF2',
              padding: '16px 20px 24px 20px',
              zIndex: 20,
            }}
          >
            <button
              onClick={handleConfirmTopUp}
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
              Top Up Rp{selectedNominal} Sekarang
            </button>
          </div>
        )}

        {/* PIN Confirmation Modal */}
        {showPin && (
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
              <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#1A1D26', margin: '0 0 4px 0' }}>
                Masukkan PIN Aladin
              </h4>
              <p style={{ fontSize: '12px', color: '#6C737E', margin: '0 0 16px 0' }}>
                Konfirmasi Top Up {selectedWallet.name} Rp{selectedNominal}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ width: '12px', height: '12px', borderRadius: '999px', backgroundColor: '#1C20C4' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowPin(false)}
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
                  onClick={handlePinSuccess}
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
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ----------------------------------------------------------------------
  // SCENARIO 2: Main E-Wallet Selection Page
  // ----------------------------------------------------------------------
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
          Pilih e-Wallet
        </h1>

        <button
          onClick={() => alert('Riwayat transaksi e-Wallet')}
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
        {/* Search Bar Input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Cari e-wallet (ShopeePay, GoPay, OVO, DANA...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '46px',
              paddingLeft: '44px',
              paddingRight: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #ECEEF2',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1A1D26',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          />
          <div style={{ position: 'absolute', left: '16px', top: '14px', color: '#9CA3AF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Free Admin Banner Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #071739 0%, #102A72 55%, #1C20C4 100%)',
            borderRadius: '22px',
            padding: '18px 20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 6px 20px rgba(7, 23, 57, 0.2)',
            minHeight: '88px',
            flexShrink: 0,
            marginBottom: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#00F3AD', textTransform: 'uppercase', letterSpacing: '0.6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '999px' }}>
              GRATIS BIAYA ADMIN
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 900, margin: '6px 0 2px 0' }}>
              Top Up Semua e-Wallet
            </h3>
            <p style={{ fontSize: '11px', color: '#E0E7FF', margin: 0 }}>
              Bebas potongan admin dan terhubung langsung ke rekening
            </p>
          </div>

          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0, 243, 173, 0.18)',
              color: '#00F3AD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '15px',
              flexShrink: 0,
            }}
          >
            Rp0
          </div>
        </div>

        {/* E-Wallet Matrix (Top 4 Squircles) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '22px',
            padding: '18px 14px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '14px', paddingLeft: '6px' }}>
            FAVORIT CEPAT
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {wallets.slice(0, 4).map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWallet(w)}
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
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    backgroundColor: w.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '12px',
                    marginBottom: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  }}
                >
                  {w.codePrefix}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A1D26', textAlign: 'center' }}>
                  {w.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* E-Wallet Complete List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '4px' }}>
            SEMUA E-WALLET
          </span>

          {filteredWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => setSelectedWallet(wallet)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '14px 16px',
                border: '1px solid #ECEEF2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
              className="active:opacity-75 transition-opacity"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    backgroundColor: wallet.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  {wallet.codePrefix}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                      {wallet.name}
                    </h3>
                    {wallet.badge && (
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          backgroundColor: wallet.bgLight,
                          color: wallet.color,
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {wallet.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: '#6C737E', margin: '2px 0 0 0' }}>
                    {wallet.desc}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1C20C4' }}>
                  Top Up →
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#059669', display: 'block', marginTop: '2px' }}>
                  Admin Rp0
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
