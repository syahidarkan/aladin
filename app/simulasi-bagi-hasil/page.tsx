'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function SimulasiBagiHasilPage() {
  const [nominalStr, setNominalStr] = useState('50.000.000')
  const [tenorMonths, setTenorMonths] = useState(12)
  const [isSuccess, setIsSuccess] = useState(false)

  const nominal = parseInt(nominalStr.replace(/\D/g, '') || '0', 10)

  // Tiered Aladin Bagi Hasil rate (5.5% - 8.5% p.a.)
  let aladinRate = 5.5
  if (nominal >= 100000000) aladinRate = 8.5
  else if (nominal >= 50000000) aladinRate = 8.0
  else if (nominal >= 10000000) aladinRate = 7.0
  else aladinRate = 6.0

  // Conventional bank comparison rate (3.0% p.a.)
  const konvenRate = 3.0

  // Mathematical calculations
  const aladinGross = Math.round(nominal * (aladinRate / 100) * (tenorMonths / 12))
  const aladinTax = Math.round(aladinGross * 0.2)
  const aladinNet = aladinGross - aladinTax
  const aladinMonthly = Math.round(aladinNet / tenorMonths)

  const konvenGross = Math.round(nominal * (konvenRate / 100) * (tenorMonths / 12))
  const konvenTax = Math.round(konvenGross * 0.2)
  const konvenNet = konvenGross - konvenTax

  const difference = Math.max(0, aladinNet - konvenNet)
  const percentageBetter = konvenNet > 0 ? Math.round(((aladinNet - konvenNet) / konvenNet) * 100) : 0

  const quickAmounts = [
    { label: 'Rp10 Jt', value: 10000000 },
    { label: 'Rp25 Jt', value: 25000000 },
    { label: 'Rp50 Jt', value: 50000000 },
    { label: 'Rp100 Jt', value: 100000000 },
  ]

  return (
    <div className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F7F8FC] select-none text-[#1A1D26] overflow-hidden relative">
      {/* 1. Top Header Bar */}
      <header className="shrink-0 w-full bg-white border-b border-[#F0F1F5] z-30">
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
            Simulasi Bagi Hasil
          </h1>

          <div style={{ width: '36px' }} />
        </div>
      </header>

      {/* 3. Scrollable Content with Strict Padding (paddingLeft & paddingRight = 23px) */}
      <div
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
        style={{
          paddingLeft: '23px',
          paddingRight: '23px',
          paddingTop: '16px',
          paddingBottom: '110px',
        }}
      >
        {/* CARD 1: Banner Ala Deposito Syariah */}
        <div
          className="text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #081D48 0%, #1C20C4 100%)',
            borderRadius: '20px',
            padding: '18px',
            marginBottom: '16px',
            boxShadow: '0 4px 16px rgba(28, 32, 196, 0.15)',
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
              <span
                className="font-extrabold uppercase tracking-wider text-white"
                style={{
                  fontSize: '9.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                #PAKAIALADIN SYARIAH
              </span>
              <span className="font-bold text-[#00F3AD]" style={{ fontSize: '10.5px' }}>
                Nisbah hingga 85:15
              </span>
            </div>

            <h2 className="text-[18px] font-extrabold tracking-tight">Ala Deposito</h2>

            <p className="text-white/80" style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.4' }}>
              Bagi hasil kompetitif hingga 8,5% p.a. Dikelola adil sesuai prinsip syariah tanpa riba.
            </p>
          </div>

          {/* Decorative subtle accent circle */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              right: '-24px',
              bottom: '-24px',
              width: '110px',
              height: '110px',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          />
        </div>

        {/* CARD 2: Input Nominal & Tenor */}
        <div
          className="bg-white border border-[#F0F1F5]"
          style={{
            borderRadius: '20px',
            padding: '18px',
            marginBottom: '16px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Label & Min badge */}
          <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
            <label className="font-bold text-[#6C737E]" style={{ fontSize: '12px' }}>
              Nominal Penempatan
            </label>
            <span className="font-bold text-[#1C20C4]" style={{ fontSize: '11px' }}>
              Min. Rp1.000.000
            </span>
          </div>

          {/* Amount input row */}
          <div
            className="flex items-center border-b-2 border-[#1C20C4]"
            style={{ paddingBottom: '6px', marginBottom: '14px' }}
          >
            <span className="font-extrabold text-[#1A1D26]" style={{ fontSize: '20px', marginRight: '6px' }}>
              Rp
            </span>
            <input
              type="text"
              value={nominalStr}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '')
                setNominalStr(raw ? Number(raw).toLocaleString('id-ID') : '')
              }}
              className="w-full font-extrabold text-[#1A1D26] focus:outline-none bg-transparent tracking-tight"
              style={{ fontSize: '22px' }}
              placeholder="0"
            />
          </div>

          {/* Range Slider */}
          <div style={{ marginBottom: '14px' }}>
            <input
              type="range"
              min={1000000}
              max={200000000}
              step={1000000}
              value={nominal || 1000000}
              onChange={(e) => setNominalStr(Number(e.target.value).toLocaleString('id-ID'))}
              className="w-full accent-[#1C20C4] cursor-pointer"
              style={{ height: '6px' }}
            />
            {/* Slider Min-Max Labels with proper margin */}
            <div
              className="flex justify-between font-medium text-[#9CA3AF]"
              style={{ fontSize: '10.5px', marginTop: '6px' }}
            >
              <span>Rp1 Jt</span>
              <span>Rp50 Jt</span>
              <span>Rp100 Jt</span>
              <span>Rp200 Jt</span>
            </div>
          </div>

          {/* Quick Amount Pill Chips */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '18px',
            }}
          >
            {quickAmounts.map((q) => {
              const isSelected = nominal === q.value
              return (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setNominalStr(q.value.toLocaleString('id-ID'))}
                  className="cursor-pointer transition-all border text-center font-bold"
                  style={{
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    backgroundColor: isSelected ? '#EFF0FC' : '#F9FAFB',
                    color: isSelected ? '#1C20C4' : '#6C737E',
                    borderColor: isSelected ? '#1C20C4' : '#E5E7EB',
                  }}
                >
                  {q.label}
                </button>
              )
            })}
          </div>

          {/* Tenor Selector */}
          <div style={{ paddingTop: '14px', borderTop: '1px solid #F0F1F5' }}>
            <label className="block font-bold text-[#6C737E]" style={{ fontSize: '12px', marginBottom: '10px' }}>
              Jangka Waktu Simpanan (Tenor)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[1, 3, 6, 12].map((m) => {
                const isSelected = tenorMonths === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenorMonths(m)}
                    className="cursor-pointer text-center font-bold transition-all"
                    style={{
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      borderRadius: '14px',
                      fontSize: '12.5px',
                      backgroundColor: isSelected ? '#1C20C4' : '#F4F5F9',
                      color: isSelected ? '#FFFFFF' : '#1A1D26',
                      boxShadow: isSelected ? '0 2px 6px rgba(28, 32, 196, 0.25)' : 'none',
                    }}
                  >
                    {m} Bulan
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* CARD 3: Visual Comparison & Breakdown Table */}
        <div
          className="bg-white border border-[#F0F1F5]"
          style={{
            borderRadius: '20px',
            padding: '18px',
            marginBottom: '16px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
            <h3 className="font-extrabold text-[#1A1D26]" style={{ fontSize: '14.5px' }}>
              Perbandingan Keuntungan Bersih
            </h3>
            <span
              className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100"
              style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '12px' }}
            >
              +{percentageBetter}% Lebih Tinggi
            </span>
          </div>

          {/* Comparison Bar Visuals */}
          <div style={{ marginBottom: '14px' }}>
            {/* Aladin Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div
                className="flex justify-between items-baseline font-bold"
                style={{ fontSize: '12px', marginBottom: '6px' }}
              >
                <span className="text-[#1C20C4] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1C20C4]" />
                  Ala Deposito Syariah ({aladinRate}% p.a.)
                </span>
                <span className="text-[#1C20C4] font-extrabold" style={{ fontSize: '13.5px' }}>
                  Rp{aladinNet.toLocaleString('id-ID')}
                </span>
              </div>
              <div
                className="bg-gray-100 rounded-full overflow-hidden"
                style={{ height: '14px', padding: '2px' }}
              >
                <div
                  className="rounded-full transition-all duration-500"
                  style={{
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(90deg, #1C20C4 0%, #00F3AD 100%)',
                  }}
                />
              </div>
            </div>

            {/* Konvensional Bar */}
            <div>
              <div
                className="flex justify-between items-baseline font-bold text-[#6C737E]"
                style={{ fontSize: '12px', marginBottom: '6px' }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  Bank Konvensional ({konvenRate}% p.a.)
                </span>
                <span className="text-[#1A1D26]" style={{ fontSize: '13px' }}>
                  Rp{konvenNet.toLocaleString('id-ID')}
                </span>
              </div>
              <div
                className="bg-gray-100 rounded-full overflow-hidden"
                style={{ height: '14px', padding: '2px' }}
              >
                <div
                  className="bg-gray-400 rounded-full transition-all duration-500"
                  style={{
                    height: '100%',
                    width: `${Math.max(15, Math.round((konvenNet / Math.max(1, aladinNet)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Selisih Box */}
          <div
            className="flex items-center justify-between"
            style={{
              backgroundColor: '#EFF0FC',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
            }}
          >
            <span className="font-bold text-[#1C20C4]" style={{ fontSize: '12px' }}>
              Selisih Lebih Untung di Aladin:
            </span>
            <span className="font-extrabold text-[#1C20C4]" style={{ fontSize: '13.5px' }}>
              +Rp{difference.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Breakdown Table */}
          <div
            style={{
              paddingTop: '10px',
              borderTop: '1px solid #F0F1F5',
              fontSize: '12px',
            }}
          >
            <div className="flex justify-between text-[#6C737E]" style={{ marginBottom: '6px' }}>
              <span>Nisbah Nasabah : Bank</span>
              <span className="font-bold text-[#1A1D26]">85% : 15%</span>
            </div>
            <div className="flex justify-between text-[#6C737E]" style={{ marginBottom: '6px' }}>
              <span>Estimasi Hasil Kotor:</span>
              <span className="font-bold text-[#1A1D26]">Rp{aladinGross.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[#6C737E]" style={{ marginBottom: '8px' }}>
              <span>Pajak PPh Final (20%):</span>
              <span className="font-bold text-[#B62821]">-Rp{aladinTax.toLocaleString('id-ID')}</span>
            </div>
            <div
              className="flex justify-between text-[#1A1D26]"
              style={{ paddingTop: '8px', borderTop: '1px solid #F0F1F5' }}
            >
              <span className="font-bold">Estimasi Bagi Hasil Tiap Bulan:</span>
              <span className="font-extrabold text-[#1C20C4]" style={{ fontSize: '13.5px' }}>
                Rp{aladinMonthly.toLocaleString('id-ID')} / bln
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: Sharia Compliance Card */}
        <div
          className="border border-emerald-200/80"
          style={{
            backgroundColor: '#E8F5E9',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
            <div
              className="rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0"
              style={{ width: '20px', height: '20px' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="font-extrabold text-[#064E3B]" style={{ fontSize: '13px' }}>
              Akad Mudharabah Muthlaqah
            </h4>
          </div>
          <p
            className="text-[#064E3B]/90"
            style={{ fontSize: '11.5px', lineHeight: '1.5', paddingLeft: '28px' }}
          >
            Dana simpanan Anda dikelola secara amanah pada sektor produktif riil yang halal, diawasi oleh Dewan Pengawas Syariah (DPS) MUI, serta terbebas dari riba, gharar, dan maysir.
          </p>
        </div>

        {/* OJK & LPS Regulatory Footer */}
        <div
          className="flex items-center justify-center gap-3 font-bold text-[#9CA3AF]"
          style={{ fontSize: '10.5px', paddingTop: '4px', paddingBottom: '8px' }}
        >
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1C20C4]" />
            Berizin & Diawasi OJK
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F3AD]" />
            Peserta Penjaminan LPS
          </span>
        </div>
      </div>

      {/* 4. Bottom Sticky CTA Button */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0F1F5] z-20"
        style={{ padding: '16px 23px 24px' }}
      >
        <button
          onClick={() => setIsSuccess(true)}
          className="w-full bg-[#1C20C4] text-white rounded-full font-bold flex items-center justify-center active:scale-98 transition-all cursor-pointer"
          style={{
            height: '47.5px',
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(28, 32, 196, 0.25)',
          }}
        >
          Buka Ala Deposito Sekarang
        </button>
      </div>

      {/* 5. Confirmation Success Modal */}
      {isSuccess && (
        <div
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center"
          style={{ padding: '24px' }}
        >
          <div
            className="w-full bg-white text-center shadow-2xl"
            style={{ maxWidth: '320px', borderRadius: '24px', padding: '24px' }}
          >
            <div
              className="rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto"
              style={{ width: '56px', height: '56px', marginBottom: '12px' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-[17px] font-extrabold text-[#1A1D26]" style={{ marginBottom: '6px' }}>
              Penempatan Berhasil!
            </h4>
            <p className="text-[12.5px] text-[#6C737E]" style={{ lineHeight: '1.5', marginBottom: '16px' }}>
              Ala Deposito sebesar <strong className="text-[#1A1D26]">Rp{nominal.toLocaleString('id-ID')}</strong> dengan tenor <strong className="text-[#1A1D26]">{tenorMonths} bulan</strong> telah berhasil diaktifkan.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href="/keuangan"
                className="w-full bg-[#1C20C4] text-white rounded-full font-bold text-[14px] text-center"
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                Lihat di Portofolio Keuangan
              </Link>
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full text-[#6C737E] font-bold text-[13px] text-center cursor-pointer"
                style={{ paddingTop: '10px', paddingBottom: '10px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
