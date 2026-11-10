'use client'

import { ArrowLeft } from 'lucide-react'
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
  imageSrc?: string
  icon?: React.ReactNode
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

  // 1. ISI ULANG (Authentic APK Icons 1:1 to 07-bayar-dan-beli.png)
  const isiUlangItems: ServiceItem[] = [
    {
      id: 'pulsa',
      label: 'Pulsa',
      category: 'isi_ulang',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      iconColor: '#2563EB',
      imageSrc: '/assets/icons/bill_pulsa_clean.png',
    },
    {
      id: 'paket-data',
      label: 'Paket Data',
      category: 'isi_ulang',
      iconBg: '#F0FDFA',
      borderColor: '#CCFBF1',
      iconColor: '#0D9488',
      imageSrc: '/assets/icons/bill_paket_data_clean.png',
    },
    {
      id: 'token-listrik',
      label: 'Token PLN',
      category: 'isi_ulang',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      iconColor: '#D97706',
      imageSrc: '/assets/icons/bill_token_listrik_clean.png',
    },
    {
      id: 'ewallet',
      label: 'e-Wallet',
      category: 'isi_ulang',
      iconBg: '#EEF2FF',
      borderColor: '#E0E7FF',
      iconColor: '#4F46E5',
      imageSrc: '/assets/icons/bill_ewallet_clean.png',
      isEwallet: true,
    },
  ]

  // 2. TAGIHAN (Authentic APK Icons 1:1 to 07-bayar-dan-beli.png)
  const tagihanItems: ServiceItem[] = [
    {
      id: 'tagihan-listrik',
      label: 'Listrik PLN',
      category: 'tagihan',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      iconColor: '#D97706',
      imageSrc: '/assets/icons/bill_tagihan_listrik_clean.png',
    },
    {
      id: 'internet',
      label: 'Internet & TV',
      category: 'tagihan',
      iconBg: '#F0F9FF',
      borderColor: '#E0F2FE',
      iconColor: '#0284C7',
      imageSrc: '/assets/icons/bill_internet_clean.png',
    },
    {
      id: 'pdam',
      label: 'PDAM',
      category: 'tagihan',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      iconColor: '#2563EB',
      imageSrc: '/assets/icons/bill_pdam_clean.png',
    },
    {
      id: 'bpjs',
      label: 'BPJS',
      category: 'tagihan',
      iconBg: '#F0FDF4',
      borderColor: '#DCFCE7',
      iconColor: '#16A34A',
      imageSrc: '/assets/icons/bill_bpjs_clean.png',
    },
    {
      id: 'pbb',
      label: 'Pajak PBB',
      category: 'tagihan',
      iconBg: '#FAF5FF',
      borderColor: '#F3E8FF',
      iconColor: '#9333EA',
      imageSrc: '/assets/icons/bill_pbb_clean.png',
    },
    {
      id: 'pasca-bayar',
      label: 'Pascabayar',
      category: 'tagihan',
      iconBg: '#FFF7ED',
      borderColor: '#FFEDD5',
      iconColor: '#EA580C',
      imageSrc: '/assets/icons/bill_pasca_bayar_clean.png',
    },
    {
      id: 'voucher-tv',
      label: 'Voucher TV',
      category: 'tagihan',
      iconBg: '#EFF6FF',
      borderColor: '#DBEAFE',
      iconColor: '#2563EB',
      imageSrc: '/assets/icons/bill_voucher_tv_clean.png',
    },
    {
      id: 'tagihan-tv',
      label: 'TV Kabel',
      category: 'tagihan',
      iconBg: '#FEF2F2',
      borderColor: '#FEE2E2',
      iconColor: '#DC2626',
      imageSrc: '/assets/icons/bill_tagihan_tv_clean.png',
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
            className="w-full bg-white flex items-center justify-between px-4"
            style={{ height: '52px' }}
          >
            <button
              onClick={() => {
                setSelectedService(null)
                setIsSuccess(false)
              }}
              data-back="true"
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
            </button>

          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            {selectedService.label}
          </h1>

          <div style={{ width: '36px' }} />
        </div>
        </header>

        {/* Transaction Content */}
        {isSuccess ? (
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 flex flex-col justify-between">
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
                  ×
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
          className="w-full bg-white flex items-center justify-between px-4"
          style={{ height: '52px' }}
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
          Bayar &amp; Beli
        </h1>

        <button
          type="button"
          onClick={() => alert('Riwayat transaksi Bayar & Beli')}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          aria-label="Riwayat Transaksi"
        >
          <Image
            src="/assets/icons/header_history_clean.png"
            alt="Riwayat"
            width={20}
            height={20}
            style={{ width: '19px', height: '19px' }}
            priority
          />
        </button>
      </div>
      </header>

      {/* Scrollable Body */}
      <div
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
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
                      {item.imageSrc ? (
                        <div className="relative w-7 h-7">
                          <Image src={item.imageSrc} alt={item.label} fill className="object-contain" priority />
                        </div>
                      ) : (
                        item.icon
                      )}
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
                    {item.imageSrc ? (
                      <div className="relative w-7 h-7">
                        <Image src={item.imageSrc} alt={item.label} fill className="object-contain" priority />
                      </div>
                    ) : (
                      item.icon
                    )}
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
                  {item.imageSrc ? (
                    <div className="relative w-7 h-7">
                      <Image src={item.imageSrc} alt={item.label} fill className="object-contain" priority />
                    </div>
                  ) : (
                    item.icon
                  )}
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
