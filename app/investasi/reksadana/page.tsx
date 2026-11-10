'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  ShieldCheck,
  Info,
  CheckCircle2,
  ChevronRight,
  Sprout,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react'

type CategoryFilter = 'all' | 'pasar_uang' | 'sukuk' | 'saham' | 'campuran'

interface ReksadanaProduct {
  id: string
  name: string
  fundManager: string
  category: 'pasar_uang' | 'sukuk' | 'saham' | 'campuran'
  categoryLabel: string
  return1Y: number
  return3Y: number
  nav: number
  aum: string
  minBuy: number
  riskLevel: 'Rendah' | 'Moderat' | 'Tinggi'
  logo: string
  isPopular?: boolean
  fatwaNo: string
}

const REKSADANA_PRODUCTS: ReksadanaProduct[] = [
  {
    id: 'sucor-pasar-uang',
    name: 'Sucorinvest Sharia Money Market Fund',
    fundManager: 'PT Sucorinvest Asset Management',
    category: 'pasar_uang',
    categoryLabel: 'Pasar Uang Syariah',
    return1Y: 6.35,
    return3Y: 19.8,
    nav: 1420.5,
    aum: 'Rp3,25 Triliun',
    minBuy: 10000,
    riskLevel: 'Rendah',
    logo: '/assets/investasi/funds/sucor.png',
    isPopular: true,
    fatwaNo: 'DSN-MUI No. 20/DSN-MUI/IX/2000',
  },
  {
    id: 'bni-dompet-syariah',
    name: 'BNI-AM Dana Dompet Syariah',
    fundManager: 'PT BNI Asset Management',
    category: 'pasar_uang',
    categoryLabel: 'Pasar Uang Syariah',
    return1Y: 5.95,
    return3Y: 17.6,
    nav: 1285.2,
    aum: 'Rp1,84 Triliun',
    minBuy: 10000,
    riskLevel: 'Rendah',
    logo: '/assets/investasi/funds/bni.png',
    fatwaNo: 'DSN-MUI No. 20/DSN-MUI/IX/2000',
  },
  {
    id: 'mandiri-investa-syariah',
    name: 'Mandiri Investa Dana Syariah (MIDS)',
    fundManager: 'PT Mandiri Manajemen Investasi',
    category: 'sukuk',
    categoryLabel: 'Pendapatan Tetap / Sukuk',
    return1Y: 8.42,
    return3Y: 26.4,
    nav: 2150.8,
    aum: 'Rp2,48 Triliun',
    minBuy: 50000,
    riskLevel: 'Moderat',
    logo: '/assets/investasi/funds/mandiri.png',
    isPopular: true,
    fatwaNo: 'DSN-MUI No. 32/DSN-MUI/IX/2002',
  },
  {
    id: 'eastspring-syariah-sukuk',
    name: 'Eastspring Syariah Fixed Income Amanah',
    fundManager: 'PT Eastspring Investments Indonesia',
    category: 'sukuk',
    categoryLabel: 'Pendapatan Tetap / Sukuk',
    return1Y: 8.15,
    return3Y: 25.1,
    nav: 1890.4,
    aum: 'Rp1,42 Triliun',
    minBuy: 50000,
    riskLevel: 'Moderat',
    logo: '/assets/investasi/funds/eastspring.png',
    fatwaNo: 'DSN-MUI No. 32/DSN-MUI/IX/2002',
  },
  {
    id: 'schroder-syariah-equity',
    name: 'Schroder Syariah Islamic Equity Fund',
    fundManager: 'PT Schroder Investment Management',
    category: 'saham',
    categoryLabel: 'Saham Syariah',
    return1Y: 14.85,
    return3Y: 42.6,
    nav: 3410.2,
    aum: 'Rp4,60 Triliun',
    minBuy: 100000,
    riskLevel: 'Tinggi',
    logo: '/assets/investasi/funds/schroder.png',
    isPopular: true,
    fatwaNo: 'DSN-MUI No. 80/DSN-MUI/III/2011',
  },
  {
    id: 'bahana-mes-syariah',
    name: 'Bahana MES Syariah Fund',
    fundManager: 'PT Bahana TCW Investment Management',
    category: 'campuran',
    categoryLabel: 'Campuran Syariah',
    return1Y: 11.2,
    return3Y: 33.8,
    nav: 2470.6,
    aum: 'Rp1,15 Triliun',
    minBuy: 50000,
    riskLevel: 'Moderat',
    logo: '/assets/investasi/funds/bahana.png',
    fatwaNo: 'DSN-MUI No. 40/DSN-MUI/X/2003',
  },
  {
    id: 'batavia-kas-syariah',
    name: 'Batavia Dana Kas Syariah',
    fundManager: 'PT Batavia Prosperindo Aset Manajemen',
    category: 'pasar_uang',
    categoryLabel: 'Pasar Uang Syariah',
    return1Y: 5.8,
    return3Y: 16.9,
    nav: 1190.1,
    aum: 'Rp950 Miliar',
    minBuy: 10000,
    riskLevel: 'Rendah',
    logo: '/assets/investasi/funds/batavia.png',
    fatwaNo: 'DSN-MUI No. 20/DSN-MUI/IX/2000',
  },
  {
    id: 'majoris-sukuk-negara',
    name: 'Majoris Sukuk Negara Indonesia',
    fundManager: 'PT Majoris Asset Management',
    category: 'sukuk',
    categoryLabel: 'Pendapatan Tetap / Sukuk',
    return1Y: 7.9,
    return3Y: 24.3,
    nav: 1720.5,
    aum: 'Rp820 Miliar',
    minBuy: 50000,
    riskLevel: 'Rendah',
    logo: '/assets/investasi/funds/majoris.png',
    fatwaNo: 'DSN-MUI No. 32/DSN-MUI/IX/2002',
  },
]

export default function ReksadanaCatalogPage() {
  const { reksaDanaBalance = 5250000 } = useBankState()
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ReksadanaProduct | null>(null)
  const [buyAmount, setBuyAmount] = useState('100.000')
  const [showBuySuccess, setShowBuySuccess] = useState(false)

  const filteredProducts = REKSADANA_PRODUCTS.filter((prod) => {
    const matchesFilter = selectedFilter === 'all' || prod.category === selectedFilter
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.fundManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowBuySuccess(true)
    setTimeout(() => {
      setShowBuySuccess(false)
      setSelectedProduct(null)
    }, 2400)
  }

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. TOP HEADER (FIXED, NO SCROLL OFF) */}
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
                Reksa Dana Syariah
              </h1>
              <p className="text-[10.5px] text-[#64748B] -mt-0.5">
                Katalog Produk &amp; Manajer Investasi OJK
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              alert(
                'Reksa Dana Syariah dikelola oleh Manajer Investasi terdaftar OJK dan diawasi DSN-MUI dengan akad Wakalah bil Ujrah.'
              )
            }
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info Reksa Dana"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE BODY */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        {/* HERO PORTFOLIO & PROMO BANNER */}
        <div className="p-4 space-y-3">
          {/* User Active Balance Card */}
          <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#10B981] rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider block">
                Total Nilai Investasi Reksa Dana
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[22px] font-black tracking-tight">
                  Rp{reksaDanaBalance.toLocaleString('id-ID')}
                </span>
                <span className="text-[12px] font-extrabold text-[#00F0A0] bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  +7.9% (+Rp385.000)
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-100">
                <span>3 Portofolio Aktif</span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0A0]" /> 100% Halal
                </span>
              </div>
            </div>
          </div>

          {/* Visual Educational Banner */}
          <div className="relative h-28 rounded-2xl overflow-hidden shadow-xs border border-gray-100">
            <Image
              src="/assets/investasi/reksadana_hero.jpg"
              alt="Reksa Dana Syariah"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-transparent p-3.5 flex flex-col justify-center text-white">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#00F0A0] bg-emerald-950/60 w-fit px-2 py-0.5 rounded-full mb-1">
                Bebas Biaya Admin
              </span>
              <h3 className="text-[14px] font-extrabold leading-tight">
                Mulai Investasi dari Rp10.000
              </h3>
              <p className="text-[11px] text-gray-200 mt-0.5">
                Diversifikasi portofolio pasar uang &amp; sukuk negara
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari produk reksa dana atau manajer investasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-[12.5px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1037A6]"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'Semua Produk' },
              { id: 'pasar_uang', label: 'Pasar Uang' },
              { id: 'sukuk', label: 'Pendapatan Tetap / Sukuk' },
              { id: 'saham', label: 'Saham Syariah' },
              { id: 'campuran', label: 'Campuran' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as CategoryFilter)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedFilter === tab.id
                    ? 'bg-[#1037A6] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PRODUCTS LIST */}
          <div className="space-y-2.5 pt-1">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-blue-200 transition-all cursor-pointer active:scale-99"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                    <Image
                      src={prod.logo}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#1037A6] bg-blue-50 px-2 py-0.5 rounded-md">
                        {prod.categoryLabel}
                      </span>
                      {prod.isPopular && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          ⭐ Populer
                        </span>
                      )}
                    </div>
                    <h4 className="text-[13.5px] font-extrabold text-[#1A1D26] mt-1 leading-snug line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {prod.fundManager}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-gray-100 text-[11px]">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Return 1 Thn</span>
                        <span className="font-extrabold text-emerald-600">
                          +{prod.return1Y}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">AUM</span>
                        <span className="font-bold text-gray-700 truncate block">
                          {prod.aum}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block text-[10px]">Min. Beli</span>
                        <span className="font-bold text-gray-800">
                          Rp{prod.minBuy.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. PRODUCT DETAIL & BUY DRAWER */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl w-full max-w-[430px] p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={selectedProduct.logo}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-extrabold text-gray-900 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    {selectedProduct.categoryLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showBuySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-[16px] font-extrabold text-gray-900">
                  Pembelian Reksa Dana Berhasil!
                </h4>
                <p className="text-[12.5px] text-gray-600 max-w-xs mx-auto">
                  Investasi senilai Rp{buyAmount} berhasil ditempatkan pada {selectedProduct.name}.
                </p>
                <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-medium">
                  Akad Wakalah bil Ujrah telah sah terverifikasi DSN-MUI.
                </div>
              </div>
            ) : (
              <form onSubmit={handleBuySubmit} className="space-y-4 pt-4">
                {/* Product Detail Matrix */}
                <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11.5px]">
                  <div>
                    <span className="text-gray-400">NAB per Unit:</span>
                    <p className="font-extrabold text-gray-900">
                      Rp{selectedProduct.nav.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tingkat Risiko:</span>
                    <p className="font-extrabold text-emerald-700">
                      {selectedProduct.riskLevel}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Kelolaan (AUM):</span>
                    <p className="font-extrabold text-gray-900">
                      {selectedProduct.aum}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Kepatuhan Syariah:</span>
                    <p className="font-extrabold text-[#1037A6]">
                      Lolos DSN-MUI
                    </p>
                  </div>
                </div>

                {/* Nominal Input */}
                <div>
                  <label className="text-[12px] font-bold text-gray-700 block mb-1">
                    Nominal Investasi (Rp)
                  </label>
                  <input
                    type="text"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-300 font-extrabold text-[16px] text-[#1037A6] focus:outline-none focus:ring-2 focus:ring-[#1037A6]"
                  />
                  <div className="flex gap-2 mt-2">
                    {['50.000', '100.000', '500.000', '1.000.000'].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setBuyAmount(preset)}
                        className="flex-1 py-1 bg-gray-100 hover:bg-blue-50 text-[11px] font-bold text-gray-700 rounded-lg transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sharia Statement */}
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start gap-2 text-[11px] text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-[#1037A6] shrink-0 mt-0.5" />
                  <p>
                    Transaksi ini menggunakan akad <strong>Wakalah bil Ujrah</strong>. Manajer Investasi bertindak sebagai wakil pengelola dana sesuai fatwa {selectedProduct.fatwaNo}.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#1037A6] text-white font-extrabold text-[14px] rounded-xl hover:bg-[#0c2b82] transition-colors shadow-sm cursor-pointer"
                >
                  Beli Reksa Dana Sekarang
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
