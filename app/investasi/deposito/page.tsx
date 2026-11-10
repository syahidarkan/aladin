'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import {
  ArrowLeft,
  Landmark,
  ShieldCheck,
  Info,
  CheckCircle2,
  Calculator,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

type TenorMonths = '1' | '3' | '6' | '12'

export default function DepositoCatalogPage() {
  const { alaDeposito = 10000000 } = useBankState()
  const [selectedTenor, setSelectedTenor] = useState<TenorMonths>('12')
  const [nominal, setNominal] = useState(10000000)
  const [aroType, setAroType] = useState<'pokok' | 'pokok_bagi_hasil' | 'none'>('pokok_bagi_hasil')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Nisbah & Equivalent Returns
  const tenorData = {
    '1': { nisbah: '60:40', eqRate: 5.75, label: '1 Bulan' },
    '3': { nisbah: '68:32', eqRate: 6.25, label: '3 Bulan' },
    '6': { nisbah: '75:25', eqRate: 6.85, label: '6 Bulan' },
    '12': { nisbah: '85:15', eqRate: 7.35, label: '12 Bulan (Paling Populer)' },
  }

  const current = tenorData[selectedTenor]
  const monthsInt = parseInt(selectedTenor, 10)
  const estimatedReturnTotal = Math.round((nominal * (current.eqRate / 100) * monthsInt) / 12)
  const estimatedReturnMonthly = Math.round((nominal * (current.eqRate / 100)) / 12)

  const handleOpenDeposito = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3500)
  }

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. TOP HEADER (FIXED) */}
      <header className="shrink-0 w-full bg-white border-b border-gray-100 z-30">
        <StatusBar className="bg-white" />
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/investasi"
              data-back="true"
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="Kembali ke Ala Investasi"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
            </Link>
            <div>
              <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
                Ala Deposito Syariah
              </h1>
              <p className="text-[10.5px] text-[#64748B] -mt-0.5">
                Akad Mudharabah Muthlaqah • Dijamin LPS
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              alert(
                'Ala Deposito menggunakan akad Mudharabah Muthlaqah. Bank mengelola dana simpanan secara produktif dan membagi keuntungan sesuai nisbah yang disepakati tanpa riba.'
              )
            }
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info Deposito"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE BODY */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        <div className="p-4 space-y-3">
          {/* Active Deposito Card */}
          <div className="bg-gradient-to-r from-[#0C2340] via-[#1037A6] to-[#1D4ED8] rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-medium text-blue-200 uppercase tracking-wider block">
                Total Deposito Aktif Anda
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[24px] font-black tracking-tight">
                  Rp{alaDeposito.toLocaleString('id-ID')}
                </span>
                <span className="text-[12px] font-extrabold text-[#00F0A0] bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-400/30">
                  Nisbah 85:15
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-blue-400/30 flex items-center justify-between text-[11px] text-blue-100">
                <span>Estimasi Bagi Hasil Bulanan: Rp61.250</span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0A0]" /> LPS s.d Rp2M
                </span>
              </div>
            </div>
          </div>

          {/* Visual Hero Banner */}
          <div className="relative h-28 rounded-2xl overflow-hidden shadow-xs border border-gray-100">
            <Image
              src="/assets/investasi/deposito_hero.jpg"
              alt="Ala Deposito Syariah"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-transparent p-3.5 flex flex-col justify-center text-white">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#00F0A0] bg-blue-950/80 w-fit px-2 py-0.5 rounded-full mb-1">
                Bebas Pinalti Pencairan
              </span>
              <h3 className="text-[14px] font-extrabold leading-tight">
                Simpanan Berjangka Berkah
              </h3>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Bagi hasil optimal hingga setara 7.35% p.a. tanpa riba
              </p>
            </div>
          </div>

          {/* Success Toast */}
          {showSuccessToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-[12px] font-bold text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Alhamdulillah! Pembukaan Ala Deposito Rp{nominal.toLocaleString('id-ID')} tenor {selectedTenor} bulan berhasil!
              </span>
            </div>
          )}

          {/* 4 Tenor Selector Cards */}
          <div>
            <h3 className="text-[13px] font-extrabold text-gray-900 mb-2">
              Pilih Tenor &amp; Nisbah Bagi Hasil:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['1', '3', '6', '12'] as TenorMonths[]).map((t) => {
                const info = tenorData[t]
                const isSelected = selectedTenor === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTenor(t)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1037A6] bg-blue-50/60 ring-2 ring-blue-300'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-black text-gray-900">
                        {t} Bulan
                      </span>
                      {t === '12' && (
                        <span className="text-[9px] font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-sm">
                          Favorit
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1037A6] block mt-1">
                      Nisbah {info.nisbah}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      Indikasi ~{info.eqRate}% p.a.
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Interactive Calculation Simulator */}
          <form onSubmit={handleOpenDeposito} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Calculator className="w-4 h-4 text-[#1037A6]" />
              <h4 className="text-[13px] font-extrabold text-gray-900">
                Simulasi Bagi Hasil Deposito
              </h4>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-[11.5px] font-bold text-gray-700">
                  Nominal Penempatan (Rp)
                </label>
                <span className="text-[14px] font-black text-[#1037A6]">
                  Rp{nominal.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={100000000}
                step={1000000}
                value={nominal}
                onChange={(e) => setNominal(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1037A6]"
              />
              <div className="flex gap-1.5 mt-2">
                {[1000000, 5000000, 10000000, 50000000].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setNominal(preset)}
                    className="flex-1 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 text-[10.5px] font-bold text-gray-700"
                  >
                    Rp{(preset / 1000000)}Jt
                  </button>
                ))}
              </div>
            </div>

            {/* Live Projected Yield Display */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1.5 text-[12px]">
              <div className="flex justify-between text-gray-600">
                <span>Bagi Hasil Bulanan:</span>
                <span className="font-extrabold text-emerald-800">
                  Rp{estimatedReturnMonthly.toLocaleString('id-ID')} / bln
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Estimasi Bagi Hasil ({selectedTenor} bln):</span>
                <span className="font-black text-emerald-700 text-[13.5px]">
                  Rp{estimatedReturnTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="pt-1.5 border-t border-emerald-200/60 flex justify-between text-[11px] text-gray-500">
                <span>Pajak PPh Final Deposito (20%):</span>
                <span>Rp{Math.round(estimatedReturnTotal * 0.2).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* ARO Option Selection */}
            <div>
              <label className="text-[11.5px] font-bold text-gray-700 block mb-1.5">
                Pilihan Perpanjangan Otomatis (ARO):
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-bold">
                {[
                  { id: 'pokok_bagi_hasil', label: 'Pokok + Bagi Hasil' },
                  { id: 'pokok', label: 'Pokok Saja' },
                  { id: 'none', label: 'Tidak ARO' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAroType(opt.id as any)}
                    className={`py-2 px-1 rounded-xl border transition-all ${
                      aroType === opt.id
                        ? 'border-[#1037A6] bg-blue-50 text-[#1037A6]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[14px] rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Buka Deposito Rp{nominal.toLocaleString('id-ID')} Sekarang
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
