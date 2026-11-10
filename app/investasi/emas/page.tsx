'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  ShieldCheck,
  Info,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react'

export default function EmasDigitalPage() {
  const { emasGrams = 2.76, emasPricePerGram = 1345000 } = useBankState()
  const buyPricePerGram = 1425000
  const sellPricePerGram = 1365000

  const [activeTab, setActiveTab] = useState<'beli' | 'jual' | 'cetak'>('beli')
  const [nominalBuy, setNominalBuy] = useState('100.000')
  const [chartRange, setChartRange] = useState<'1W' | '1M' | '1Y' | '5Y'>('1M')
  const [selectedDenom, setSelectedDenom] = useState<number>(1)
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null)

  const gramEquivalent = (
    parseInt(nominalBuy.replace(/\D/g, '') || '0', 10) / buyPricePerGram
  ).toFixed(4)

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'beli') {
      setShowSuccessToast(`Berhasil membeli ${gramEquivalent} gram emas fisik 24K!`)
    } else if (activeTab === 'jual') {
      setShowSuccessToast('Berhasil menjual 1.00 gram emas! Saldo masuk ke Ala Dompet.')
    } else {
      setShowSuccessToast(`Pengajuan cetak emas fisik Antam ${selectedDenom} gram diproses!`)
    }
    setTimeout(() => setShowSuccessToast(null), 3000)
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
                Emas Digital Syariah
              </h1>
              <p className="text-[10.5px] text-[#64748B] -mt-0.5">
                Emas Fisik Murni 24K • PT Pegadaian &amp; Antam
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              alert(
                'Emas Digital Aladin menggunakan akad Murabahah & Wadiah Yad Dhamanah. Setiap gram emas digital Anda didukung oleh emas fisik batangan 24K murni di brankas terasuransi.'
              )
            }
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info Emas"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE BODY */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        <div className="p-4 space-y-3">
          {/* Active Gold Balance Card */}
          <div className="bg-gradient-to-br from-[#78350F] via-[#B45309] to-[#F59E0B] rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-medium text-amber-100 uppercase tracking-wider block">
                Total Simpanan Emas Anda
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] font-black tracking-tight">
                    {emasGrams}
                  </span>
                  <span className="text-[14px] font-extrabold text-amber-100">
                    Gram
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[16px] font-extrabold text-white block">
                    Rp{(Math.round(emasGrams * buyPricePerGram)).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10.5px] text-amber-200 font-semibold">
                    +Rp184.000 (+5.2%)
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-amber-400/30 flex items-center justify-between text-[11px] text-amber-100">
                <span>Emas Batangan 24 Karat (99.99%)</span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0A0]" /> CertiCard Antam
                </span>
              </div>
            </div>
          </div>

          {/* Live Price Board */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
              <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
                Harga Beli (per Gram)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[16px] font-black text-gray-900">
                  Rp{buyPricePerGram.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +Rp8.000 (+0.56%)
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
              <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">
                Harga Jual (per Gram)
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[16px] font-black text-gray-900">
                  Rp{sellPricePerGram.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-[10.5px] text-gray-400 mt-0.5 block">
                Buyback Terjamin Cair Instan
              </span>
            </div>
          </div>

          {/* Visual Hero Banner with Physical Gold Photo */}
          <div className="relative h-28 rounded-2xl overflow-hidden shadow-xs border border-gray-100">
            <Image
              src="/assets/investasi/emas_antam_card.jpg"
              alt="Emas Antam 24K"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 via-amber-900/75 to-transparent p-3.5 flex flex-col justify-center text-white">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 w-fit px-2 py-0.5 rounded-full mb-1">
                Fisik 100% Antam
              </span>
              <h3 className="text-[14px] font-extrabold leading-tight">
                Tabung Emas Mulai Rp10.000
              </h3>
              <p className="text-[11px] text-amber-100 mt-0.5">
                Bisa dicetak jadi emas fisik batangan CertiCard
              </p>
            </div>
          </div>

          {/* Action Tabs: Beli / Jual / Cetak Fisik */}
          <div className="bg-gray-200/80 p-1 rounded-2xl flex text-[12px] font-bold text-center">
            <button
              onClick={() => setActiveTab('beli')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'beli'
                  ? 'bg-white text-[#1037A6] shadow-xs font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Beli Emas
            </button>
            <button
              onClick={() => setActiveTab('jual')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'jual'
                  ? 'bg-white text-[#1037A6] shadow-xs font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jual Emas
            </button>
            <button
              onClick={() => setActiveTab('cetak')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'cetak'
                  ? 'bg-white text-[#1037A6] shadow-xs font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cetak Fisik
            </button>
          </div>

          {/* Success Toast */}
          {showSuccessToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-[12px] font-bold text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{showSuccessToast}</span>
            </div>
          )}

          {/* TAB 1: BELI EMAS */}
          {activeTab === 'beli' && (
            <form onSubmit={handleAction} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <div>
                <label className="text-[11.5px] font-bold text-gray-700 block mb-1">
                  Nominal Pembelian Emas (Rp)
                </label>
                <input
                  type="text"
                  value={nominalBuy}
                  onChange={(e) => setNominalBuy(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-300 font-extrabold text-[16px] text-[#1037A6] focus:outline-none focus:ring-2 focus:ring-[#1037A6]"
                />
                <div className="flex gap-2 mt-2">
                  {['50.000', '100.000', '500.000', '1.000.000'].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setNominalBuy(val)}
                      className="flex-1 py-1 bg-gray-100 hover:bg-amber-50 text-[11px] font-bold text-gray-700 rounded-lg"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between text-[12px]">
                <span className="text-gray-600">Estimasi Emas Diterima:</span>
                <span className="font-black text-amber-900 text-[14px]">
                  {gramEquivalent} Gram
                </span>
              </div>

              <div className="p-2.5 bg-blue-50/60 rounded-xl text-[11px] text-gray-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1037A6] shrink-0 mt-0.5" />
                <span>Akad Murabahah: Bebas riba, kepemilikan fisik emas langsung tercatat di kustodian PT Pegadaian.</span>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-[14px] rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Beli Emas Fisik Sekarang
              </button>
            </form>
          )}

          {/* TAB 2: JUAL EMAS */}
          {activeTab === 'jual' && (
            <form onSubmit={handleAction} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <div>
                <label className="text-[11.5px] font-bold text-gray-700 block mb-1">
                  Gram Emas yang Dijual
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={1.0}
                    max={emasGrams}
                    className="flex-1 h-11 px-3 rounded-xl border border-gray-300 font-extrabold text-[16px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1037A6]"
                  />
                  <span className="text-[13px] font-extrabold text-gray-600">Gram</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-[12px]">
                <span className="text-gray-500">Estimasi Pencairan:</span>
                <span className="font-black text-gray-900 text-[14px]">
                  Rp{(1.0 * sellPricePerGram).toLocaleString('id-ID')}
                </span>
              </div>

              <p className="text-[11px] text-gray-500">
                Uang hasil penjualan emas langsung masuk ke saldo <strong>Ala Dompet</strong> Anda tanpa potongan biaya admin.
              </p>

              <button
                type="submit"
                className="w-full h-12 bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[14px] rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Jual Emas ke Ala Dompet
              </button>
            </form>
          )}

          {/* TAB 3: CETAK FISIK */}
          {activeTab === 'cetak' && (
            <form onSubmit={handleAction} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
              <div>
                <label className="text-[11.5px] font-bold text-gray-700 block mb-2">
                  Pilih Denominasi Emas Batangan Antam CertiCard:
                </label>
                <div className="grid grid-cols-4 gap-2 text-center text-[12px]">
                  {[0.5, 1, 5, 10, 25, 50, 100].map((gram) => (
                    <button
                      type="button"
                      key={gram}
                      onClick={() => setSelectedDenom(gram)}
                      className={`py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                        selectedDenom === gram
                          ? 'border-[#B45309] bg-amber-50 text-[#B45309] ring-2 ring-amber-300'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {gram} Gr
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11.5px] text-amber-900 space-y-1">
                <div className="flex justify-between">
                  <span>Biaya Cetak &amp; Sertifikat:</span>
                  <span className="font-extrabold">Rp85.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Asuransi Pengiriman:</span>
                  <span className="font-extrabold text-emerald-700">GRATIS</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-[14px] rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Ajukan Cetak Emas Fisik {selectedDenom} Gram
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
