'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import {
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Info,
  CheckCircle2,
  X,
  CandlestickChart,
  BarChart3,
  Layers,
} from 'lucide-react'

type SectorFilter = 'all' | 'banking' | 'consumer' | 'telco' | 'infra' | 'green'

interface StockItem {
  ticker: string
  name: string
  sector: SectorFilter
  sectorLabel: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  peRatio: number
  dividendYield: number
  logo: string
  isBlueChip?: boolean
  shariaScreening: string
}

const STOCKS_DATA: StockItem[] = [
  {
    ticker: 'BRIS',
    name: 'PT Bank Syariah Indonesia Tbk',
    sector: 'banking',
    sectorLabel: 'Perbankan Syariah',
    price: 3120,
    change: 140,
    changePercent: 4.7,
    volume: '124,5 Juta',
    marketCap: 'Rp143,8 Triliun',
    peRatio: 16.4,
    dividendYield: 2.1,
    logo: '/assets/investasi/stocks/bris.png',
    isBlueChip: true,
    shariaScreening: 'Rasio Bunga 0% (Pure Islamic Bank)',
  },
  {
    ticker: 'TLKM',
    name: 'PT Telkom Indonesia (Persero) Tbk',
    sector: 'telco',
    sectorLabel: 'Telekomunikasi & Digital',
    price: 3680,
    change: 45,
    changePercent: 1.2,
    volume: '82,1 Juta',
    marketCap: 'Rp364,5 Triliun',
    peRatio: 14.8,
    dividendYield: 4.8,
    logo: '/assets/investasi/stocks/tlkm.png',
    isBlueChip: true,
    shariaScreening: 'Utang Berbasis Bunga 24.2% (<45%)',
  },
  {
    ticker: 'ICBP',
    name: 'PT Indofood CBP Sukses Makmur Tbk',
    sector: 'consumer',
    sectorLabel: 'Consumer Goods Halal',
    price: 11850,
    change: 250,
    changePercent: 2.15,
    volume: '14,8 Juta',
    marketCap: 'Rp138,2 Triliun',
    peRatio: 15.2,
    dividendYield: 3.4,
    logo: '/assets/investasi/stocks/icbp.png',
    isBlueChip: true,
    shariaScreening: 'Produk Halal BPJPH 100%',
  },
  {
    ticker: 'ASII',
    name: 'PT Astra International Tbk',
    sector: 'infra',
    sectorLabel: 'Konglomerasi Otomotif',
    price: 5150,
    change: 40,
    changePercent: 0.78,
    volume: '45,2 Juta',
    marketCap: 'Rp208,4 Triliun',
    peRatio: 7.1,
    dividendYield: 7.2,
    logo: '/assets/investasi/stocks/asii.png',
    isBlueChip: true,
    shariaScreening: 'Pendapatan Non-Halal 2.1% (<10%)',
  },
  {
    ticker: 'PGAS',
    name: 'PT Perusahaan Gas Negara Tbk',
    sector: 'infra',
    sectorLabel: 'Infrastruktur Gas Bumi',
    price: 1540,
    change: 48,
    changePercent: 3.22,
    volume: '98,7 Juta',
    marketCap: 'Rp37,3 Triliun',
    peRatio: 8.4,
    dividendYield: 8.5,
    logo: '/assets/investasi/stocks/pgas.png',
    shariaScreening: 'Penyalur Energi Ramah Lingkungan',
  },
  {
    ticker: 'UNTR',
    name: 'PT United Tractors Tbk',
    sector: 'green',
    sectorLabel: 'Alat Berat & Hilirisasi',
    price: 27400,
    change: 500,
    changePercent: 1.86,
    volume: '8,2 Juta',
    marketCap: 'Rp102,1 Triliun',
    peRatio: 5.6,
    dividendYield: 9.1,
    logo: '/assets/investasi/stocks/untr.png',
    isBlueChip: true,
    shariaScreening: 'Transisi Energi Terbarukan & Solar',
  },
  {
    ticker: 'KLBF',
    name: 'PT Kalbe Farma Tbk',
    sector: 'consumer',
    sectorLabel: 'Farmasi & Kesehatan',
    price: 1620,
    change: 25,
    changePercent: 1.57,
    volume: '32,4 Juta',
    marketCap: 'Rp75,9 Triliun',
    peRatio: 22.3,
    dividendYield: 2.8,
    logo: '/assets/investasi/stocks/klbf.png',
    shariaScreening: 'Sertifikasi Obat Halal MUI',
  },
  {
    ticker: 'ADRO',
    name: 'PT Adaro Minerals Indonesia Tbk',
    sector: 'green',
    sectorLabel: 'Mineral Hijau Aluminium',
    price: 1410,
    change: 38,
    changePercent: 2.77,
    volume: '64,3 Juta',
    marketCap: 'Rp57,8 Triliun',
    peRatio: 7.8,
    dividendYield: 5.4,
    logo: '/assets/investasi/stocks/adro.png',
    shariaScreening: 'Peleburan Aluminium Rendah Emisi',
  },
  {
    ticker: 'SIDO',
    name: 'PT Industri Jamu Sido Muncul Tbk',
    sector: 'consumer',
    sectorLabel: 'Herbal & Jamu Halal',
    price: 645,
    change: 10,
    changePercent: 1.57,
    volume: '28,1 Juta',
    marketCap: 'Rp19,3 Triliun',
    peRatio: 18.2,
    dividendYield: 6.8,
    logo: '/assets/investasi/stocks/sido.png',
    shariaScreening: 'Bahan Baku Herbal Alami & Halal',
  },
  {
    ticker: 'MAPI',
    name: 'PT Mitra Adiperkasa Tbk',
    sector: 'consumer',
    sectorLabel: 'Gaya Hidup & Retail',
    price: 1780,
    change: 40,
    changePercent: 2.3,
    volume: '19,5 Juta',
    marketCap: 'Rp29,5 Triliun',
    peRatio: 14.1,
    dividendYield: 1.9,
    logo: '/assets/investasi/stocks/mapi.png',
    shariaScreening: 'Retail Syariah Tanpa Produk Terlarang',
  },
]

export default function SahamSyariahPage() {
  const [selectedSector, setSelectedSector] = useState<SectorFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null)
  const [lots, setLots] = useState(5)
  const [showBuySuccess, setShowBuySuccess] = useState(false)

  const filteredStocks = STOCKS_DATA.filter((stk) => {
    const matchesSector = selectedSector === 'all' || stk.sector === selectedSector
    const matchesSearch =
      stk.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.sectorLabel.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSector && matchesSearch
  })

  const totalValue = selectedStock ? selectedStock.price * lots * 100 : 0

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowBuySuccess(true)
    setTimeout(() => {
      setShowBuySuccess(false)
      setSelectedStock(null)
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
                Saham Syariah
              </h1>
              <p className="text-[10.5px] text-[#64748B] -mt-0.5">
                Konstituen Indeks Saham Syariah Indonesia (ISSI)
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              alert(
                'Saham Syariah adalah emiten yang memenuhi kriteria Fatwa DSN-MUI No. 80/2011: rasio total utang berbasis bunga terhadap total aset < 45% dan pendapatan non-halal < 10%.'
              )
            }
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info Saham Syariah"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE BODY */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        <div className="p-4 space-y-3">
          {/* Market Indices Tracker */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                ISSI (Syariah)
              </span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-[17px] font-black text-gray-900">218,42</span>
                <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +1,42%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                528 Saham Lolos Seleksi
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                JII (Islamic 30)
              </span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-[17px] font-black text-gray-900">542,80</span>
                <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +0,88%
                </span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                30 Saham Paling Likuid
              </span>
            </div>
          </div>

          {/* Visual Hero Banner */}
          <div className="relative h-28 rounded-2xl overflow-hidden shadow-xs border border-gray-100">
            <Image
              src="/assets/investasi/saham_hero.jpg"
              alt="Saham Syariah"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent p-3.5 flex flex-col justify-center text-white">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#00F0A0] bg-emerald-950/60 w-fit px-2 py-0.5 rounded-full mb-1">
                Akad Musyarakah
              </span>
              <h3 className="text-[14px] font-extrabold leading-tight">
                Trading Saham Halal &amp; Transparan
              </h3>
              <p className="text-[11px] text-gray-200 mt-0.5">
                Beli saham mulai 1 Lot (100 lembar) via RDN Syariah
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode saham (e.g. BRIS, TLKM, ICBP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-[12.5px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1037A6]"
            />
          </div>

          {/* Sector Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'Semua Sektor' },
              { id: 'banking', label: 'Perbankan' },
              { id: 'consumer', label: 'Consumer Goods' },
              { id: 'telco', label: 'Telekomunikasi' },
              { id: 'infra', label: 'Infrastruktur' },
              { id: 'green', label: 'Tambang Hijau' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSector(tab.id as SectorFilter)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedSector === tab.id
                    ? 'bg-[#1037A6] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* STOCKS LIST */}
          <div className="space-y-2 pt-1">
            {filteredStocks.map((stk) => (
              <div
                key={stk.ticker}
                onClick={() => setSelectedStock(stk)}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs hover:border-blue-200 transition-all cursor-pointer active:scale-99 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-2xs border border-gray-100">
                    <Image
                      src={stk.logo}
                      alt={stk.ticker}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-black text-gray-900 tracking-tight">
                        {stk.ticker}
                      </span>
                      {stk.isBlueChip && (
                        <span className="text-[9.5px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-sm">
                          BlueChip
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate max-w-[160px]">
                      {stk.name}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Vol: {stk.volume} • MC: {stk.marketCap}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[14px] font-black text-gray-900 block">
                    Rp{stk.price.toLocaleString('id-ID')}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                      stk.change >= 0
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-red-700 bg-red-50'
                    }`}
                  >
                    {stk.change >= 0 ? '+' : ''}
                    {stk.changePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3. STOCK ORDER DRAWER */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl w-full max-w-[430px] p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={selectedStock.logo}
                    alt={selectedStock.ticker}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">
                    {selectedStock.ticker} - {selectedStock.name}
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    {selectedStock.sectorLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
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
                  Order Beli Berhasil Dikirim!
                </h4>
                <p className="text-[12.5px] text-gray-600 max-w-xs mx-auto">
                  Order {lots} Lot ({lots * 100} lembar) saham {selectedStock.ticker} pada harga Rp{selectedStock.price.toLocaleString('id-ID')} telah match via Bursa Efek Indonesia.
                </p>
                <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-medium">
                  Total Transaksi: Rp{totalValue.toLocaleString('id-ID')} didanai dari RDN Syariah Bank Aladin.
                </div>
              </div>
            ) : (
              <form onSubmit={handleBuySubmit} className="space-y-4 pt-4">
                {/* Stock Key Metrics */}
                <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-3 gap-2 text-[11.5px] text-center">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Harga Terakhir</span>
                    <p className="font-extrabold text-gray-900 text-[13px]">
                      Rp{selectedStock.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">P/E Ratio</span>
                    <p className="font-extrabold text-gray-900 text-[13px]">
                      {selectedStock.peRatio}x
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Div. Yield</span>
                    <p className="font-extrabold text-emerald-600 text-[13px]">
                      {selectedStock.dividendYield}%
                    </p>
                  </div>
                </div>

                {/* Sharia Screening Tag */}
                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                  <span><strong>Lolos Seleksi DSN-MUI:</strong> {selectedStock.shariaScreening}</span>
                </div>

                {/* Lot Calculator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-bold text-gray-700">
                      Jumlah Pesanan (Lot)
                    </label>
                    <span className="text-[11px] text-gray-500">
                      1 Lot = 100 Lembar
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLots(Math.max(1, lots - 1))}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={lots}
                      onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 h-10 text-center font-black text-[16px] text-[#1037A6] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1037A6]"
                    />
                    <button
                      type="button"
                      onClick={() => setLots(lots + 1)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Cost Calculation */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-[12px]">
                  <div className="flex justify-between text-gray-500">
                    <span>Estimasi Nilai Saham ({lots * 100} lbr):</span>
                    <span className="font-bold text-gray-900">
                      Rp{totalValue.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Biaya Broker &amp; Levy Syariah (0.15%):</span>
                    <span className="font-bold text-gray-900">
                      Rp{Math.round(totalValue * 0.0015).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-gray-200 flex justify-between text-[13px] font-extrabold text-[#1037A6]">
                    <span>Total Pembayaran:</span>
                    <span>
                      Rp{(totalValue + Math.round(totalValue * 0.0015)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#1037A6] text-white font-extrabold text-[14px] rounded-xl hover:bg-[#0c2b82] transition-colors shadow-sm cursor-pointer"
                >
                  Beli Saham {selectedStock.ticker} Sekarang
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
