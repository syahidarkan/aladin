'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import StatusBar from '@/components/StatusBar'
import {
  ArrowLeft,
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building2,
  Flame,
  Award,
} from 'lucide-react'

type InvestmentTab = 'deposito' | 'reksadana' | 'emas'

export default function InvestmentCalculatorPage() {
  const [activeTab, setActiveTab] = useState<InvestmentTab>('deposito')

  // Deposito States
  const [depositoNominalStr, setDepositoNominalStr] = useState<string>('50.000.000')
  const [depositoTenor, setDepositoTenor] = useState<number>(12) // months

  // Reksa Dana States
  const [rdNominalStr, setRdNominalStr] = useState<string>('10.000.000')
  const [rdTenorYears, setRdTenorYears] = useState<number>(3) // years
  const [rdExpectedRate, setRdExpectedRate] = useState<number>(8.5) // percent p.a.

  // Emas States
  const [goldGrams, setGoldGrams] = useState<number>(10)
  const [goldYears, setGoldYears] = useState<number>(3)
  const currentGoldPricePerGram = 1485000 // Rp1.485.000/gr

  const formatRupiah = (val: number) => `Rp${Math.round(val).toLocaleString('id-ID')}`

  // 1. DEPOSITO CALCULATIONS
  const rawDeposito = parseInt(depositoNominalStr.replace(/\D/g, '') || '0', 10)
  let aladinNisbahRate = 5.5
  if (rawDeposito >= 100000000) aladinNisbahRate = 8.5
  else if (rawDeposito >= 50000000) aladinNisbahRate = 8.0
  else if (rawDeposito >= 10000000) aladinNisbahRate = 7.0
  else aladinNisbahRate = 6.0

  const konvenInterestRate = 3.0 // conventional bank comparison

  const aladinGross = Math.round(rawDeposito * (aladinNisbahRate / 100) * (depositoTenor / 12))
  const aladinTax = Math.round(aladinGross * 0.2) // 20% PPh
  const aladinNet = aladinGross - aladinTax
  const aladinMonthly = Math.round(aladinNet / depositoTenor)

  const konvenGross = Math.round(rawDeposito * (konvenInterestRate / 100) * (depositoTenor / 12))
  const konvenTax = Math.round(konvenGross * 0.2)
  const konvenNet = konvenGross - konvenTax
  const aladinAdvantage = Math.max(0, aladinNet - konvenNet)

  // 2. REKSA DANA CALCULATIONS (Compounding, Non-taxable)
  const rawRd = parseInt(rdNominalStr.replace(/\D/g, '') || '0', 10)
  const rdFutureValue = rawRd * Math.pow(1 + rdExpectedRate / 100, rdTenorYears)
  const rdProfit = rdFutureValue - rawRd

  // 3. EMAS CALCULATIONS (Average historical growth 10% p.a.)
  const goldInitialValue = goldGrams * currentGoldPricePerGram
  const goldGrowthRate = 0.10 // 10% p.a.
  const goldFutureValue = goldInitialValue * Math.pow(1 + goldGrowthRate, goldYears)
  const goldProfit = goldFutureValue - goldInitialValue

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F7F8FC] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Top Header Bar */}
      <header className="shrink-0 w-full bg-white border-b border-[#ECEEF2] z-30">
        <StatusBar />
        <div className="w-full bg-white flex items-center justify-between px-4" style={{ height: '52px' }}>
          <Link
            href="/kalkulator"
            data-back="true"
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Kalkulator Hub"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>

          <div className="flex items-center gap-1.5">
            <h1 className="text-[16px] font-black text-[#1A1D26] tracking-tight">
              Kalkulator Investasi
            </h1>
            <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B] border border-emerald-400">
              ⭐ Fitur Utama
            </span>
          </div>

          <div style={{ width: '36px' }} />
        </div>
      </header>

      {/* 2. Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 p-5 pb-28">
        {/* Product Tab Selector */}
        <div className="flex bg-gray-200/80 rounded-2xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('deposito')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
              activeTab === 'deposito'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ala Deposito
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reksadana')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
              activeTab === 'reksadana'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Reksa Dana
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emas')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
              activeTab === 'emas'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Emas Fisik 24K
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ALA DEPOSITO SYARIAH                                               */}
        {/* ========================================================================= */}
        {activeTab === 'deposito' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Input Nominal Deposito */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  NOMINAL PENEMPATAN DEPOSITO
                </span>
                <span className="text-[10px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Nisbah hingga 85:15
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-black text-gray-400 font-mono">
                  Rp
                </span>
                <input
                  type="text"
                  value={depositoNominalStr}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '')
                    const num = parseInt(clean || '0', 10)
                    setDepositoNominalStr(num > 0 ? num.toLocaleString('id-ID') : '')
                  }}
                  className="w-full h-14 pl-12 pr-4 bg-[#F8FAFC] border-2 border-gray-200 focus:border-[#1037A6] rounded-2xl text-[22px] font-black text-[#1A1D26] font-mono tracking-tight outline-none"
                />
              </div>

              {/* Tenor Selector */}
              <div>
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                  PILIHAN JANGKA WAKTU (TENOR)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDepositoTenor(m)}
                      className={`py-2 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
                        depositoTenor === m
                          ? 'bg-[#1037A6] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {m} Bulan
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results: Aladin Mudharabah vs Bank Konvensional */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                  Simulasi Bagi Hasil Bersih
                </h3>
                <span className="text-[9.5px] font-extrabold text-gray-400">
                  Pajak 20% Dihitung
                </span>
              </div>

              {/* Aladin Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#081D48] to-[#1037A6] text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00F0A0]">
                    ALA DEPOSITO SYARIAH
                  </span>
                  <span className="text-[10px] font-bold text-emerald-200 bg-white/10 px-2 py-0.5 rounded-full">
                    Nisbah {aladinNisbahRate}% p.a.
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-white/70 block">Estimasi bagi hasil bersih:</span>
                  <span className="text-[24px] font-black text-[#00F0A0] font-mono tracking-tight">
                    {formatRupiah(aladinNet)}
                  </span>
                  <span className="text-[11px] text-white/80 block mt-0.5">
                    (±{formatRupiah(aladinMonthly)}/bulan)
                  </span>
                </div>
              </div>

              {/* Conventional Comparison Card */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-gray-600">
                <div>
                  <span className="text-[10.5px] font-bold text-gray-500 block">
                    Bunga Bank Konvensional (3.0% p.a.)
                  </span>
                  <span className="text-[14px] font-bold text-gray-700 font-mono">
                    {formatRupiah(konvenNet)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block">
                    Aladin Lebih Tinggi +{formatRupiah(aladinAdvantage)}
                  </span>
                </div>
              </div>

              <p className="text-[10.5px] text-gray-400 italic text-center">
                *Simulasi menggunakan nisbah bagi hasil riil perbankan syariah (bukan bunga bank konvensional), diawasi DSN-MUI dan dijamin LPS hingga Rp2 Miliar.
              </p>

              <Link
                href="/investasi/deposito"
                className="w-full h-12 bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[13.5px] rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <span>Buka Ala Deposito Sekarang</span>
                <ArrowRight className="w-4 h-4 text-[#00F0A0]" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REKSA DANA SYARIAH                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'reksadana' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  MODAL AWAL INVESTASI
                </span>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Bebas Pajak (Bukan Objek PPh)
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-black text-gray-400 font-mono">
                  Rp
                </span>
                <input
                  type="text"
                  value={rdNominalStr}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '')
                    const num = parseInt(clean || '0', 10)
                    setRdNominalStr(num > 0 ? num.toLocaleString('id-ID') : '')
                  }}
                  className="w-full h-14 pl-12 pr-4 bg-[#F8FAFC] border-2 border-gray-200 focus:border-[#1037A6] rounded-2xl text-[22px] font-black text-[#1A1D26] font-mono tracking-tight outline-none"
                />
              </div>

              {/* Jangka Waktu */}
              <div>
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                  RENCANA HORIZON WAKTU
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setRdTenorYears(yr)}
                      className={`py-2 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
                        rdTenorYears === yr
                          ? 'bg-[#1037A6] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {yr} Tahun
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Proyeksi Reksa Dana */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                  Proyeksi Pertumbuhan Portofolio
                </h3>
                <span className="text-[10px] font-bold text-gray-400">
                  Return Historis ~{rdExpectedRate}% p.a.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#047857] text-white space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00F0A0]">
                  ESTIMASI NILAI AKHIR ({rdTenorYears} TAHUN)
                </span>
                <span className="text-[26px] font-black text-[#00F0A0] font-mono tracking-tight block">
                  {formatRupiah(rdFutureValue)}
                </span>
                <span className="text-[11.5px] text-white/90 block">
                  Potensi keuntungan: <strong className="text-white">+{formatRupiah(rdProfit)}</strong>
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ⚠️ <strong>Catatan:</strong> Proyeksi di atas merupakan ilustrasi simulasi matematis berdasarkan imbal hasil historis pasar modal syariah, bukan jaminan hasil masa depan.
              </div>

              <Link
                href="/investasi/reksadana"
                className="w-full h-12 bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[13.5px] rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <span>Eksplor Reksa Dana Syariah</span>
                <ArrowRight className="w-4 h-4 text-[#00F0A0]" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EMAS FISIK 24K ANTAM                                               */}
        {/* ========================================================================= */}
        {activeTab === 'emas' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  TARGET GRAMASI EMAS ANTAM 24K
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {formatRupiah(currentGoldPricePerGram)} / gram
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[5, 10, 25, 50, 100].map((gr) => (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => setGoldGrams(gr)}
                    className={`flex-1 py-2.5 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
                      goldGrams === gr
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {gr} Gram
                  </button>
                ))}
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-600">Nilai Pembelian Hari Ini:</span>
                <span className="text-[14px] font-black text-[#1A1D26] font-mono">
                  {formatRupiah(goldInitialValue)}
                </span>
              </div>

              {/* Jangka Waktu Simpan */}
              <div>
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                  PERIODE SIMPAN INVESTASI
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setGoldYears(yr)}
                      className={`py-2 rounded-xl text-[12px] font-black transition-all cursor-pointer ${
                        goldYears === yr
                          ? 'bg-[#1037A6] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {yr} Tahun
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Proyeksi Emas */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                  Proyeksi Lindung Nilai (Hedging)
                </h3>
                <span className="text-[10px] font-bold text-gray-400">
                  Rata-rata kenaikan emas ~10% p.a.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#78350F] to-[#B45309] text-white space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                  ESTIMASI NILAI EMAS ({goldYears} TAHUN LAGI)
                </span>
                <span className="text-[26px] font-black text-amber-300 font-mono tracking-tight block">
                  {formatRupiah(goldFutureValue)}
                </span>
                <span className="text-[11.5px] text-white/90 block">
                  Kenaikan nilai aset: <strong className="text-white">+{formatRupiah(goldProfit)}</strong>
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ⚠️ <strong>Catatan:</strong> Proyeksi di atas merupakan ilustrasi sederhana berdasarkan kenaikan harga emas historis, bukan jaminan harga di masa depan.
              </div>

              <Link
                href="/investasi/emas"
                className="w-full h-12 bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[13.5px] rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <span>Nabung Emas Fisik 24K Sekarang</span>
                <ArrowRight className="w-4 h-4 text-[#00F0A0]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
