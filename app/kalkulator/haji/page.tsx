'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import {
  ArrowLeft,
  Landmark,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface ProvinceWaitTime {
  province: string
  waitTimeYears: number
  quotaAnnual: string
}

const PROVINCE_DATA: ProvinceWaitTime[] = [
  { province: 'DKI Jakarta', waitTimeYears: 28, quotaAnnual: '7.926 Jemaah' },
  { province: 'Jawa Barat', waitTimeYears: 24, quotaAnnual: '38.723 Jemaah' },
  { province: 'Jawa Tengah', waitTimeYears: 32, quotaAnnual: '30.377 Jemaah' },
  { province: 'Jawa Timur', waitTimeYears: 35, quotaAnnual: '35.152 Jemaah' },
  { province: 'DI Yogyakarta', waitTimeYears: 31, quotaAnnual: '3.147 Jemaah' },
  { province: 'Banten', waitTimeYears: 27, quotaAnnual: '9.420 Jemaah' },
  { province: 'Aceh', waitTimeYears: 33, quotaAnnual: '4.378 Jemaah' },
  { province: 'Sumatera Utara', waitTimeYears: 22, quotaAnnual: '8.328 Jemaah' },
  { province: 'Sumatera Barat', waitTimeYears: 25, quotaAnnual: '4.613 Jemaah' },
  { province: 'Sulawesi Selatan', waitTimeYears: 41, quotaAnnual: '7.272 Jemaah' },
  { province: 'Kalimantan Timur', waitTimeYears: 29, quotaAnnual: '2.586 Jemaah' },
  { province: 'Bali & NTB', waitTimeYears: 36, quotaAnnual: '4.499 Jemaah' },
]

export default function HajiCalculatorPage() {
  const router = useRouter()

  // State
  const [selectedProvince, setSelectedProvince] = useState<string>('Jawa Barat')
  const [targetYearToRegister, setTargetYearToRegister] = useState<number>(2027)
  const [monthlyDepositStr, setMonthlyDepositStr] = useState<string>('1.500.000')

  const targetBpihPortion = 25000000 // Setoran Awal BPIH Kemenag
  const monthlyDeposit = parseInt(monthlyDepositStr.replace(/\D/g, '') || '0', 10)

  // Selected province details
  const currentProvinceInfo = PROVINCE_DATA.find((p) => p.province === selectedProvince) || PROVINCE_DATA[1]

  // Calculations
  const monthsNeeded = monthlyDeposit > 0 ? Math.ceil(targetBpihPortion / monthlyDeposit) : 0
  const yearsNeeded = (monthsNeeded / 12).toFixed(1)
  const finishYear = 2026 + Math.ceil(monthsNeeded / 12)

  // Estimated profit sharing (Nisbah Aladin ~7.5% p.a.)
  const annualNisbah = 0.075
  // Simplified accumulated mudharabah returns over saving period
  const totalAccumulatedDeposit = monthsNeeded * monthlyDeposit
  const estimatedBagiHasil = Math.round((totalAccumulatedDeposit * annualNisbah * (monthsNeeded / 24)))

  // Departure estimated year based on SISKOHAT Kemenag queue
  const estimatedDepartureYear = finishYear + currentProvinceInfo.waitTimeYears

  const formatRupiah = (val: number) => `Rp${val.toLocaleString('id-ID')}`

  const handleApplyToImpianHaji = () => {
    // Redirect to Haji creation flow with query parameter
    router.push(`/impian/haji/buat?monthly=${monthlyDeposit}`)
  }

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
              Kalkulator Haji
            </h1>
            <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B] border border-emerald-400">
              ⭐ Fitur Utama
            </span>
          </div>

          <div style={{ width: '36px' }} />
        </div>
      </header>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 p-5 pb-28">
        {/* Hero Card Target BPIH */}
        <div className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#00F0A0]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00F0A0]">
              TARGET SETORAN AWAL PORSI RESMI
            </span>
            <span className="text-[10px] font-bold text-emerald-200">SISKOHAT Kemenag</span>
          </div>

          <div className="relative z-10 mb-2">
            <span className="text-[12px] text-white/80 font-medium block">Nominal porsi haji reguler:</span>
            <span className="text-[28px] font-black tracking-tight text-[#00F0A0] font-mono">
              Rp25.000.000
            </span>
            <span className="text-[11px] text-white/85 font-semibold block mt-0.5">
              Syarat sah mendapatkan Nomor Porsi Antrean Kemenag RI
            </span>
          </div>

          <p className="text-[11px] text-white/75 leading-relaxed relative z-10 pt-2 border-t border-white/15">
            Makin cepat porsi diamankan, makin cepat estimasi tahun keberangkatan ke Tanah Suci!
          </p>
        </div>

        {/* INPUTS SECTION */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-4">
          <h3 className="text-[14.5px] font-black text-[#1A1D26]">
            Parameter Tabungan &amp; Domisili
          </h3>

          {/* 1. Pilih Provinsi / Wilayah */}
          <div>
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
              PROVINSI KEBERANGKATAN
            </label>
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full h-12 px-4 bg-[#F8FAFC] border-2 border-gray-200 focus:border-[#1037A6] rounded-2xl text-[13.5px] font-bold text-[#1A1D26] outline-none cursor-pointer appearance-none"
              >
                {PROVINCE_DATA.map((p) => (
                  <option key={p.province} value={p.province}>
                    {p.province} (Masa tunggu: ±{p.waitTimeYears} tahun)
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
            <span className="text-[10.5px] text-gray-400 mt-1 block">
              Kuota tahunan: {currentProvinceInfo.quotaAnnual} • Estimasi antrean: {currentProvinceInfo.waitTimeYears} tahun
            </span>
          </div>

          {/* 2. Setoran Rutin Bulanan */}
          <div>
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
              SETORAN BULANAN KE ALA IMPIAN HAJI
            </label>
            <div className="relative mb-2.5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-black text-gray-400 font-mono">
                Rp
              </span>
              <input
                type="text"
                value={monthlyDepositStr}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '')
                  const num = parseInt(clean || '0', 10)
                  setMonthlyDepositStr(num > 0 ? num.toLocaleString('id-ID') : '')
                }}
                className="w-full h-13 pl-12 pr-4 bg-[#F8FAFC] border-2 border-gray-200 focus:border-[#1037A6] rounded-2xl text-[20px] font-black text-[#1A1D26] font-mono tracking-tight outline-none"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[500000, 1000000, 1500000, 2000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthlyDepositStr(amt.toLocaleString('id-ID'))}
                  className="py-1.5 bg-gray-100 hover:bg-emerald-50 text-[11px] font-bold text-gray-700 hover:text-[#064E3B] rounded-xl transition-colors cursor-pointer"
                >
                  Rp{(amt / 1000000).toFixed(amt % 1000000 === 0 ? 0 : 1)} Jt
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* OUTPUT CALCULATION RESULTS CARD */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[14.5px] font-black text-[#1A1D26]">
              Hasil Estimasi Tabungan Haji
            </h3>
            <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Nisbah Bagi Hasil ~7.5% p.a.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Box 1: Waktu Kumpul Porsi */}
            <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-emerald-100">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                WAKTU CAPAI PORSI
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[22px] font-black text-[#064E3B] font-mono tracking-tight">
                  {monthsNeeded}
                </span>
                <span className="text-[12px] font-bold text-[#064E3B]">Bulan</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                (±{yearsNeeded} tahun, estimasi selesai {finishYear})
              </span>
            </div>

            {/* Box 2: Estimasi Bagi Hasil */}
            <div className="p-3.5 rounded-2xl bg-[#EEF2FF] border border-blue-100">
              <span className="text-[10px] font-extrabold text-[#1037A6] uppercase tracking-wider block">
                ESTIMASI BAGI HASIL
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[18px] font-black text-[#1037A6] font-mono tracking-tight">
                  {formatRupiah(estimatedBagiHasil)}
                </span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">
                Akad Mudharabah tanpa riba
              </span>
            </div>
          </div>

          {/* TIMELINE INTERAKTIF (DAFTAR -> NOMOR PORSI -> ESTIMASI BERANGKAT) */}
          <div className="pt-2">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2.5">
              TIMELINE PERJALANAN HAJI KAMU
            </span>

            <div className="relative pl-6 space-y-4 border-l-2 border-emerald-300 ml-2">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200" />
                <div>
                  <span className="text-[10.5px] font-extrabold text-emerald-700">Tahun 2026</span>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">Mulai Nabung di Ala Impian Haji</h4>
                  <p className="text-[11px] text-gray-500">
                    Setoran terencana {formatRupiah(monthlyDeposit)}/bulan bebas biaya admin.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1037A6] border-2 border-white ring-2 ring-blue-200" />
                <div>
                  <span className="text-[10.5px] font-extrabold text-[#1037A6]">Tahun {finishYear}</span>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">Daftar BPIH &amp; Amankan Nomor Porsi</h4>
                  <p className="text-[11px] text-gray-500">
                    Saldo Rp25 Juta tercapai. Pendaftaran resmi terhubung SISKOHAT Kemenag RI.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#F59E0B] border-2 border-white ring-2 ring-amber-200" />
                <div>
                  <span className="text-[10.5px] font-extrabold text-[#D97706]">
                    Estimasi Keberangkatan: Tahun {estimatedDepartureYear}
                  </span>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">Berangkat ke Baitullah (Tanah Suci)</h4>
                  <p className="text-[11px] text-gray-500">
                    Sesuai antrean kuota {selectedProvince} (estimasi, mengikuti data resmi Kemenag RI).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <span className="text-[10px] text-gray-400 italic block pt-1 text-center">
            *Estimasi porsi &amp; masa tunggu mengikuti data resmi Sistem Informasi dan Komputerisasi Haji Terpadu (SISKOHAT) Kemenag RI.
          </span>
        </div>

        {/* CTA TO CREATE HAJI DREAM */}
        <button
          type="button"
          onClick={handleApplyToImpianHaji}
          className="w-full h-12 bg-[#064E3B] hover:bg-emerald-900 text-white font-extrabold text-[13.5px] rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
        >
          <Landmark className="w-4 h-4 text-[#00F0A0]" />
          <span>Buat Ala Impian Haji Sekarang</span>
        </button>
      </div>
    </div>
  )
}
