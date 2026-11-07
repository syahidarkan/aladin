'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, executeBillPayment } from '@/lib/bankState'

interface ServiceItem {
  id: string
  label: string
  category: 'isi_ulang' | 'tagihan'
  iconBg: string
  borderColor: string
  iconColor: string
  icon: React.ReactNode
  isEwallet?: boolean
}

export default function BayarBeliPage() {
  const { alaDompet } = useBankState()
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [targetNumber, setTargetNumber] = useState('081234567890')
  const [selectedNominal, setSelectedNominal] = useState('50.000')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Auto detect provider
  const getProviderName = (num: string) => {
    if (num.startsWith('0811') || num.startsWith('0812') || num.startsWith('0813') || num.startsWith('0821') || num.startsWith('0822')) return 'Telkomsel'
    if (num.startsWith('0817') || num.startsWith('0818') || num.startsWith('0819') || num.startsWith('0877') || num.startsWith('0878')) return 'XL Axiata'
    if (num.startsWith('0814') || num.startsWith('0815') || num.startsWith('0816') || num.startsWith('0855') || num.startsWith('0856') || num.startsWith('0857')) return 'Indosat'
    if (num.startsWith('0895') || num.startsWith('0896') || num.startsWith('0897') || num.startsWith('0898') || num.startsWith('0899')) return 'Tri (3)'
    return 'Telkomsel'
  }

  // 1. ISI ULANG & VOUCHER (Clean 4-column squircles)
  const isiUlangItems: ServiceItem[] = [
    {
      id: 'pulsa',
      label: 'Pulsa',
      category: 'isi_ulang',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      iconColor: '#2563EB',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
    },
    {
      id: 'paket-data',
      label: 'Paket Data',
      category: 'isi_ulang',
      iconBg: '#F0FDFA',
      borderColor: '#CCFBF1',
      iconColor: '#0D9488',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      ),
    },
    {
      id: 'token-listrik',
      label: 'Token PLN',
      category: 'isi_ulang',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      iconColor: '#D97706',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      id: 'ewallet',
      label: 'e-Wallet',
      category: 'isi_ulang',
      iconBg: '#EEF2FF',
      borderColor: '#E0E7FF',
      iconColor: '#4F46E5',
      isEwallet: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          <path d="M16 13h4" />
        </svg>
      ),
    },
  ]

  // 2. TAGIHAN BULANAN (Clean 4-column squircles)
  const tagihanItems: ServiceItem[] = [
    {
      id: 'tagihan-listrik',
      label: 'Listrik PLN',
      category: 'tagihan',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      iconColor: '#D97706',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      id: 'internet',
      label: 'Internet & TV',
      category: 'tagihan',
      iconBg: '#F0F9FF',
      borderColor: '#E0F2FE',
      iconColor: '#0284C7',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      ),
    },
    {
      id: 'pdam',
      label: 'PDAM',
      category: 'tagihan',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      iconColor: '#2563EB',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      id: 'bpjs',
      label: 'BPJS',
      category: 'tagihan',
      iconBg: '#F0FDF4',
      borderColor: '#DCFCE7',
      iconColor: '#16A34A',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'pbb',
      label: 'Pajak PBB',
      category: 'tagihan',
      iconBg: '#FAF5FF',
      borderColor: '#F3E8FF',
      iconColor: '#9333EA',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'pasca-bayar',
      label: 'Pascabayar',
      category: 'tagihan',
      iconBg: '#FFF7ED',
      borderColor: '#FFEDD5',
      iconColor: '#EA580C',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
    },
    {
      id: 'asuransi',
      label: 'Asuransi',
      category: 'tagihan',
      iconBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      iconColor: '#059669',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'tagihan-lain',
      label: 'Lainnya',
      category: 'tagihan',
      iconBg: '#F8FAFC',
      borderColor: '#E2E8F0',
      iconColor: '#64748B',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      ),
    },
  ]

  const pulsaNominals = [
    { value: '15.000', price: '15.000' },
    { value: '25.000', price: '25.000' },
    { value: '50.000', price: '50.000' },
    { value: '100.000', price: '100.000' },
    { value: '200.000', price: '200.000' },
    { value: '500.000', price: '500.000' },
  ]

  // DEDICATED FULL-SCREEN TRANSACTION FLOW (No Cramped Popup!)
  if (selectedService) {
    return (
      <div
        className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <StatusBar time="22.25" batteryLevel={33} dark={false} />

        {/* Top Header */}
        <div
          className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
          style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          <button
            onClick={() => {
              setSelectedService(null)
              setIsSuccess(false)
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
            {selectedService.label}
          </h1>

          <div style={{ width: '36px' }} />
        </div>

        {/* Transaction Content */}
        {isSuccess ? (
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col justify-between">
            <div className="text-center pt-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-[20px] font-extrabold text-[#1A1D26]">Pembayaran Berhasil!</h2>
              <p className="text-[12px] text-[#64748B] mt-1">
                Transaksi {selectedService.label} telah sukses diproses tanpa biaya admin.
              </p>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid #ECEEF2',
                  marginTop: '24px',
                  textAlign: 'left',
                }}
              >
                <div className="flex justify-between text-[12px] py-1">
                  <span className="text-[#64748B]">No. Referensi:</span>
                  <span className="font-mono font-bold text-[#1A1D26]">ALD-PAY-884920</span>
                </div>
                <div className="flex justify-between text-[12px] py-1">
                  <span className="text-[#64748B]">Tujuan:</span>
                  <span className="font-bold text-[#1A1D26]">{targetNumber}</span>
                </div>
                <div className="flex justify-between text-[12px] py-1">
                  <span className="text-[#64748B]">Nominal:</span>
                  <span className="font-bold text-[#1A1D26]">Rp{selectedNominal}</span>
                </div>
                <div className="flex justify-between text-[12px] py-1 border-t border-[#F1F5F9] mt-2 pt-2">
                  <span className="font-bold text-[#1A1D26]">Total Debet:</span>
                  <span className="font-extrabold text-[15px] text-[#1C20C4]">Rp{selectedNominal}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedService(null)
                setIsSuccess(false)
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
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              Selesai &amp; Kembali
            </button>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between"
            style={{ padding: '16px 20px 40px 20px' }}
          >
            <div>
              {/* Nomor Tujuan Input Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  border: '1px solid #ECEEF2',
                  marginBottom: '16px',
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Nomor Tujuan / ID Pelanggan
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '999px' }}>
                    {getProviderName(targetNumber)}
                  </span>
                </div>
                <input
                  type="tel"
                  value={targetNumber}
                  onChange={(e) => setTargetNumber(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1A1D26',
                    border: 'none',
                    outline: 'none',
                    padding: '4px 0',
                    fontFamily: 'monospace',
                  }}
                  placeholder="Contoh: 081234567890"
                />
              </div>

              {/* Nominal Options */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '10px', paddingLeft: '4px' }}>
                  Pilih Nominal {selectedService.label}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {pulsaNominals.map((nom) => (
                    <div
                      key={nom.value}
                      onClick={() => setSelectedNominal(nom.value)}
                      style={{
                        backgroundColor: selectedNominal === nom.value ? '#EEF2FF' : '#FFFFFF',
                        border: selectedNominal === nom.value ? '2px solid #1C20C4' : '1px solid #ECEEF2',
                        borderRadius: '16px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Nominal</span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', display: 'block', marginTop: '2px' }}>
                        Rp{nom.value}
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#16A34A', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                        Bebas Biaya Admin
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Pembayaran */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '16px 20px',
                  border: '1px solid #ECEEF2',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Ringkasan Pembayaran
                </span>
                <div className="flex justify-between text-[12px] py-1">
                  <span className="text-[#64748B]">Metode Pembayaran:</span>
                  <span className="font-bold text-[#1A1D26]">Ala Dompet (Rp{alaDompet.toLocaleString('id-ID')})</span>
                </div>
                <div className="flex justify-between text-[12px] py-1">
                  <span className="text-[#64748B]">Biaya Admin:</span>
                  <span className="font-bold text-[#16A34A]">Gratis (Rp0)</span>
                </div>
                <div className="flex justify-between text-[13px] pt-2 border-t border-[#F1F5F9] mt-2">
                  <span className="font-extrabold text-[#1A1D26]">Total Pembayaran:</span>
                  <span className="font-extrabold text-[16px] text-[#1C20C4]">Rp{selectedNominal}</span>
                </div>
              </div>
            </div>

            {/* Bottom Proceed Button */}
            <div style={{ paddingTop: '16px' }}>
              <button
                onClick={() => setShowPin(true)}
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
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
                }}
                className="active:scale-98 transition-all"
              >
                Lanjutkan Pembayaran →
              </button>
            </div>
          </div>
        )}

        {/* PIN Bottom Sheet Modal */}
        {showPin && (
          <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
            <div
              className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
              style={{ padding: '24px', paddingBottom: '36px' }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Masukkan PIN Aladin
                </h3>
                <button
                  onClick={() => setShowPin(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[12px] text-[#64748B] mb-4">
                Konfirmasi transaksi pembelian {selectedService.label} sebesar <strong>Rp{selectedNominal}</strong>.
              </p>

              {/* 6 Dots PIN with ample 32px spacing so nothing overlaps or touches */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '16px',
                  marginBottom: '32px',
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((dot) => (
                  <div key={dot} className="w-4 h-4 rounded-full bg-[#1C20C4]" />
                ))}
              </div>

              <button
                onClick={() => {
                  const amountNum = parseInt(selectedNominal.replace(/\D/g, '') || '0', 10)
                  const res = executeBillPayment({
                    serviceName: selectedService.label,
                    itemTitle: `Nominal Rp${selectedNominal}`,
                    customerId: targetNumber,
                    amount: amountNum,
                    adminFee: 0,
                  })
                  if (!res.success) {
                    alert(res.error || 'Saldo tidak mencukupi.')
                    return
                  }
                  setShowPin(false)
                  setIsSuccess(true)
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
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
                }}
              >
                Konfirmasi &amp; Bayar
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // MAIN BAYAR & BELI HUB VIEW (Livin' Sukha / Ala Hijrah Standard)
  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <StatusBar time="22.25" batteryLevel={33} dark={false} />

      {/* Top Header */}
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
            width={16}
            height={16}
            style={{ width: '15.5px', height: '15.5px' }}
            priority
          />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Bayar &amp; Beli
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

      {/* Scrollable Body */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '40px',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '10px 16px',
            border: '1px solid #ECEEF2',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            marginBottom: '16px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jenis tagihan, PLN, Pulsa..."
            style={{
              width: '100%',
              fontSize: '13px',
              border: 'none',
              outline: 'none',
              color: '#1A1D26',
            }}
          />
        </div>

        {/* Card 1: Isi Ulang & Pulsa (Clean 4-column squircle grid) */}
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
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '14px', paddingLeft: '4px' }}>
            Isi Ulang
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px' }}>
            {isiUlangItems.map((item) => {
              if (item.isEwallet) {
                return (
                  <Link
                    key={item.id}
                    href="/ewallet"
                    className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '18px',
                        backgroundColor: item.iconBg,
                        border: `1.5px solid ${item.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', textAlign: 'center' }}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                )
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedService(item)}
                  className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '18px',
                      backgroundColor: item.iconBg,
                      border: `1.5px solid ${item.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', textAlign: 'center' }}>
                      {item.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card 2: Tagihan Bulanan (Clean 4-column squircle grid) */}
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
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '14px', paddingLeft: '4px' }}>
            Bayar Tagihan Bulanan
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px' }}>
            {tagihanItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedService(item)}
                className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '18px',
                    backgroundColor: item.iconBg,
                    border: `1.5px solid ${item.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', textAlign: 'center' }}>
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Aladin Hemat */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091E42 0%, #1C20C4 100%)',
            borderRadius: '20px',
            padding: '16px 20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#00F3AD', letterSpacing: '1px', textTransform: 'uppercase' }}>
              PROMO ALADIN SYARIAH
            </span>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginTop: '2px' }}>
              Semua Tagihan Bebas Biaya Admin
            </h4>
            <p style={{ fontSize: '11px', color: '#93C5FD', marginTop: '2px' }}>
              Berlaku untuk seluruh nasabah Bank Aladin Syariah.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
