'use client'

import { useState } from 'react'
import Link from 'next/link'
import StatusBar from '@/components/StatusBar'
import {
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Info,
  Calendar,
  Building2,
  Sparkles,
  ChevronRight,
  Calculator,
  ArrowUpRight,
} from 'lucide-react'

export default function AlaInvestasiPage() {
  const [selectedCategory, setSelectedCategory] = useState<'sukuk' | 'reksadana'>('sukuk')
  const [simulasiModal, setSimulasiModal] = useState(5000000)
  const [simulasiTenor, setSimulasiTenor] = useState(3) // tahun

  const returnRate = 0.068 // 6.8% p.a.
  const estimasiKeuntungan = Math.round(simulasiModal * returnRate * simulasiTenor)
  const estimasiTotal = simulasiModal + estimasiKeuntungan

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] select-none text-[#1A1D26] overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="bg-[#0A256B] text-white pt-2 pb-5 px-5 shrink-0 relative overflow-hidden">
        <StatusBar dark />

        <div className="flex items-center justify-between mt-2">
          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>

          <h1 className="text-[17px] font-extrabold text-white">Ala Investasi</h1>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00F0A0]" />
            <span className="text-[10px] font-black uppercase text-[#00F0A0]">
              DSN-MUI
            </span>
          </div>
        </div>

        {/* Portfolio Summary Card */}
        <div className="mt-5 bg-gradient-to-br from-[#1037A6] to-[#1E40AF] rounded-2xl p-4.5 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between text-white/80">
            <span className="text-[12px] font-medium">Total Portofolio Investasi</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00F0A0]/20 text-[#00F0A0] border border-[#00F0A0]/40">
              100% Syariah
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[26px] font-black text-white tracking-tight">
              Rp15.420.000
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-white/90">
            <div>
              <span className="text-[10.5px] text-white/70 block">Keuntungan Berjalan</span>
              <span className="text-[13px] font-extrabold text-[#00F0A0] flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +Rp840.500 (+5,78%)
              </span>
            </div>
            <div>
              <span className="text-[10.5px] text-white/70 block">Bagi Hasil Bulan Ini</span>
              <span className="text-[13px] font-extrabold text-white mt-0.5 block">
                Rp88.200
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 py-5 space-y-6 pb-28">
        {/* Category Tabs: Sukuk Negara vs Reksadana */}
        <div>
          <div className="flex bg-[#E2E8F0] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedCategory('sukuk')}
              className={`flex-1 py-2 rounded-lg text-[12.5px] font-extrabold transition-all cursor-pointer ${
                selectedCategory === 'sukuk'
                  ? 'bg-white text-[#1037A6] shadow-sm'
                  : 'text-[#64748B] hover:text-[#1A1D26]'
              }`}
            >
              Sukuk Ritel Negara
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('reksadana')}
              className={`flex-1 py-2 rounded-lg text-[12.5px] font-extrabold transition-all cursor-pointer ${
                selectedCategory === 'reksadana'
                  ? 'bg-white text-[#1037A6] shadow-sm'
                  : 'text-[#64748B] hover:text-[#1A1D26]'
              }`}
            >
              Reksadana Syariah
            </button>
          </div>
        </div>

        {/* Product List */}
        {selectedCategory === 'sukuk' ? (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[#1A1D26]">
                Surat Berharga Syariah Negara (SBSN)
              </h2>
              <span className="text-[11px] font-bold text-[#1037A6]">
                Dijamin UU 100%
              </span>
            </div>

            {/* Sukuk Card 1 */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs hover:border-[#1037A6]/50 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Masa Penawaran
                  </span>
                  <h3 className="text-[15px] font-extrabold text-[#1A1D26] mt-1.5">
                    Sukuk Ritel Seri SR020-T3
                  </h3>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">
                    Penerbit: Kementerian Keuangan Republik Indonesia
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block">Kupon Fixed</span>
                  <span className="text-[16px] font-black text-[#059669]">
                    6,40% p.a.
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-[#94A3B8] block">Tenor</span>
                  <span className="font-bold text-[#1E293B]">3 Tahun</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block">Minimal Order</span>
                  <span className="font-bold text-[#1E293B]">Rp1.000.000</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block">Pencairan</span>
                  <span className="font-bold text-[#1E293B]">Tiap Bulan</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-3 py-2.5 rounded-xl bg-[#1037A6] hover:bg-[#0D2D8A] text-white font-extrabold text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                <span>Pesan Sukuk Sekarang</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sukuk Card 2 */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Project Based
                  </span>
                  <h3 className="text-[15px] font-extrabold text-[#1A1D26] mt-1.5">
                    PBS036 — Green Sukuk Mandiri
                  </h3>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">
                    Pembiayaan Proyek Ramah Lingkungan Nasional
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block">Imbal Hasil</span>
                  <span className="text-[16px] font-black text-[#059669]">
                    6,85% p.a.
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-[#94A3B8] block">Tenor</span>
                  <span className="font-bold text-[#1E293B]">5 Tahun</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block">Minimal Order</span>
                  <span className="font-bold text-[#1E293B]">Rp5.000.000</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block">Akad</span>
                  <span className="font-bold text-[#1E293B]">Ijarah</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            <h2 className="text-[15px] font-extrabold text-[#1A1D26]">
              Pilihan Reksadana Syariah Pilihan
            </h2>

            {/* Reksadana 1 */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Pasar Uang Syariah
                  </span>
                  <h3 className="text-[15px] font-extrabold text-[#1A1D26] mt-1.5">
                    Bahana Likuid Syariah
                  </h3>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">
                    Risiko Rendah • Likuiditas Harian Bebas Biaya
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block">Return 1 Thn</span>
                  <span className="text-[16px] font-black text-[#059669]">
                    +5,25%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[#94A3B8] block">Minimal Investasi</span>
                  <span className="font-bold text-[#1E293B]">Rp10.000</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#1037A6] text-white font-extrabold text-[11.5px] hover:bg-[#0D2D8A] transition-colors"
                >
                  Beli Unit
                </button>
              </div>
            </div>

            {/* Reksadana 2 */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Saham Syariah
                  </span>
                  <h3 className="text-[15px] font-extrabold text-[#1A1D26] mt-1.5">
                    Sucorinvest Sharia Equity Fund
                  </h3>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">
                    Pertumbuhan Jangka Panjang Portofolio Saham Halal
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block">Return 1 Thn</span>
                  <span className="text-[16px] font-black text-[#059669]">
                    +11,40%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[#94A3B8] block">Minimal Investasi</span>
                  <span className="font-bold text-[#1E293B]">Rp100.000</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#1037A6] text-white font-extrabold text-[11.5px] hover:bg-[#0D2D8A] transition-colors"
                >
                  Beli Unit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Investment Growth Calculator Simulation */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#1037A6]" />
            <h3 className="text-[14.5px] font-extrabold text-[#1A1D26]">
              Simulasi Pertumbuhan Dana Syariah
            </h3>
          </div>

          <div>
            <div className="flex justify-between text-[12px] mb-1">
              <span className="text-[#64748B]">Modal Awal:</span>
              <span className="font-extrabold text-[#1037A6]">
                Rp{simulasiModal.toLocaleString('id-ID')}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={50000000}
              step={1000000}
              value={simulasiModal}
              onChange={(e) => setSimulasiModal(Number(e.target.value))}
              className="w-full accent-[#1037A6] cursor-pointer"
            />
          </div>

          <div>
            <span className="text-[12px] text-[#64748B] block mb-1.5">Jangka Waktu Tenor:</span>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSimulasiTenor(t)}
                  className={`py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
                    simulasiTenor === t
                      ? 'border-[#1037A6] bg-blue-50 text-[#1037A6]'
                      : 'border-gray-200 bg-white text-[#64748B]'
                  }`}
                >
                  {t} Tahun
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="rounded-xl p-3 bg-gradient-to-br from-[#064E3B] to-[#047857] text-white">
            <div className="flex justify-between items-center text-[11px] text-white/80">
              <span>Estimasi Imbal Hasil ({returnRate * 100}% p.a.):</span>
              <span className="font-extrabold text-[#00F0A0]">
                +Rp{estimasiKeuntungan.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/20">
              <span className="text-[12px] font-bold text-white">Total Dana Akhir:</span>
              <span className="text-[15px] font-black text-white">
                Rp{estimasiTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Sharia Principles Banner */}
        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1037A6] shrink-0 mt-0.5" />
          <div className="text-[11.5px] text-[#1E3A8A] leading-relaxed">
            <span className="font-extrabold block mb-0.5">
              100% Sesuai Fatwa DSN-MUI &amp; OJK
            </span>
            Seluruh instrumen investasi bebas dari unsur riba (bunga), gharar (ketidakpastian), dan maysir (spekulasi/judi).
          </div>
        </div>
      </div>
    </div>
  )
}

