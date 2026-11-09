'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  TrendingUp,
  ShieldCheck,
  Plus,
  Coins,
  Landmark,
  Sprout,
  CandlestickChart,
  PieChart,
  Calendar,
  Gift,
  LayoutGrid,
  Wallet,
  X,
  Check,
  ChevronRight,
  Info,
  Scale,
  ArrowUpRight,
} from 'lucide-react'

type ProductType = 'reksadana' | 'emas' | 'deposito' | 'saham'

export default function AlaInvestasiSyariahPage() {
  const router = useRouter()
  const { alaDompet, reksaDanaBalance = 5250000, emasGrams = 2.76, emasPricePerGram = 1345000 } = useBankState()
  const { triggerReaction, startTransition } = useMascot()

  // State
  const [isMasked, setIsMasked] = useState(false)
  const [activeTab, setActiveTab] = useState<ProductType>('reksadana')

  // RDN (Rekening Dana Nasabah) Saldo
  const [rdnBalance, setRdnBalance] = useState(750000)
  const [showRdnDepositModal, setShowRdnDepositModal] = useState(false)
  const [rdnNominal, setRdnNominal] = useState('250.000')

  // Interactive Product Action Modals
  const [selectedProductModal, setSelectedProductModal] = useState<ProductType | null>(null)
  const [transAmount, setTransAmount] = useState('100.000')
  const [depositoTenor, setDepositoTenor] = useState<'1' | '3' | '6' | '12'>('12')
  const [selectedStock, setSelectedStock] = useState('BRIS')

  // Portofolios Data
  const [portfolios, setPortfolios] = useState([
    {
      id: 'darurat',
      name: 'Dana Darurat Syariah',
      productsCount: 2,
      invested: 3500000,
      gain: 285000,
      gainPercent: 8.14,
      category: 'reksadana',
    },
    {
      id: 'haji-umrah',
      name: 'Tabungan Qurban & Haji',
      productsCount: 1,
      invested: 2800000,
      gain: 238000,
      gainPercent: 8.5,
      category: 'deposito',
    },
    {
      id: 'emas-antam',
      name: 'Simpanan Emas Fisik 24K',
      productsCount: 1,
      invested: Math.round(emasGrams * 1280000),
      gain: Math.round(emasGrams * (emasPricePerGram - 1280000)),
      gainPercent: 5.07,
      category: 'emas',
    },
  ])

  const totalInvested = portfolios.reduce((acc, p) => acc + p.invested, 0)
  const totalGain = portfolios.reduce((acc, p) => acc + p.gain, 0)
  const totalPortfolioValue = totalInvested + totalGain

  // Syariah Market Data
  const reksadanaList = [
    {
      name: 'Sucorinvest Sharia Money Market Fund',
      type: 'Pasar Uang Syariah',
      risk: 'Rendah',
      yield1Y: '+6.42% p.a.',
      nab: 'Rp1.428,50',
      minBuy: 'Rp10.000',
      akad: 'Akad Wakalah bil Ujrah',
    },
    {
      name: 'Majoris Sukuk Negara Indonesia',
      type: 'Pendapatan Tetap Syariah SBSN',
      risk: 'Moderat',
      yield1Y: '+7.85% p.a.',
      nab: 'Rp1.890,20',
      minBuy: 'Rp50.000',
      akad: 'Akad Ijarah Asset to be Leased',
    },
    {
      name: 'Mandiri Pasar Uang Syariah Ekstra',
      type: 'Pasar Uang Syariah',
      risk: 'Rendah',
      yield1Y: '+5.95% p.a.',
      nab: 'Rp1.215,80',
      minBuy: 'Rp10.000',
      akad: 'Akad Mudharabah Muthlaqah',
    },
  ]

  const emasPriceBuy = 1345000
  const emasPriceSell = 1298000

  const depositoOptions = [
    { tenor: '1', label: '1 Bulan', nisbah: '70:30', eqRate: '7.0% p.a.' },
    { tenor: '3', label: '3 Bulan', nisbah: '75:25', eqRate: '7.5% p.a.' },
    { tenor: '6', label: '6 Bulan', nisbah: '80:20', eqRate: '8.0% p.a.' },
    { tenor: '12', label: '12 Bulan', nisbah: '85:15', eqRate: '8.5% p.a.' },
  ]

  const sahamSyariahList = [
    { ticker: 'BRIS', name: 'PT Bank Syariah Indonesia Tbk', price: 'Rp2.840', change: '+3.27%', index: 'JII / ISSI' },
    { ticker: 'TLKM', name: 'PT Telkom Indonesia Tbk', price: 'Rp3.120', change: '+1.30%', index: 'ISSI' },
    { ticker: 'ICBP', name: 'PT Indofood CBP Sukses Makmur Tbk', price: 'Rp11.850', change: '+0.85%', index: 'JII / ISSI' },
    { ticker: 'PGAS', name: 'PT Perusahaan Gas Negara Tbk', price: 'Rp1.540', change: '+2.12%', index: 'ISSI' },
  ]

  // Handlers
  const handleRdnDeposit = () => {
    const raw = parseInt(rdnNominal.replace(/\D/g, '') || '0', 10)
    if (raw <= 0) return
    if (raw > alaDompet) {
      alert('Saldo Ala Dompet tidak mencukupi untuk top up RDN.')
      return
    }
    setRdnBalance((prev) => prev + raw)
    setShowRdnDepositModal(false)
    triggerReaction('success', `Berhasil top up Rp${raw.toLocaleString('id-ID')} ke Rekening Dana Nasabah (RDN)!`)
  }

  const handleProductTransaction = () => {
    const raw = parseInt(transAmount.replace(/\D/g, '') || '0', 10)
    if (raw <= 0) return

    if (raw > rdnBalance && raw > alaDompet) {
      alert('Saldo RDN / Ala Dompet tidak mencukupi untuk transaksi investasi.')
      return
    }

    setPortfolios((prev) =>
      prev.map((p, idx) => (idx === 0 ? { ...p, invested: p.invested + raw, gain: Math.round((p.invested + raw) * 0.08) } : p))
    )
    setSelectedProductModal(null)
    triggerReaction('success', `Investasi syariah sebesar Rp${raw.toLocaleString('id-ID')} berhasil dialokasikan!`)
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#F8FAFC] select-none text-[#1A1D26] overflow-x-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 0. Top Native Status Bar (Safe Area Offset) */}
      <StatusBar time="22.25" batteryLevel={33} dark={false} />

      {/* 1. TOP NATIVE HEADER BAR (Bank Aladin Syariah Identity) */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
          </Link>
          <div>
            <h1 className="text-[16px] font-black text-[#1037A6] tracking-tight leading-tight">
              Ala Investasi Syariah
            </h1>
            <span className="text-[10px] font-bold text-[#059669] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#059669]" />
              OJK &amp; Dewan Pengawas Syariah MUI
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => triggerReaction('success', 'Instrumen 100% Syariah: Akad Bebas Riba, Gharar & Maisir.')}
          className="text-[11px] font-extrabold text-[#1037A6] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-100 transition-all cursor-pointer"
        >
          Prinsip Syariah
        </button>
      </header>

      {/* 2. BODY CONTENT */}
      <main className="flex-1 px-4 pt-3.5 pb-32 space-y-4">
        {/* SECTION 1: NILAI PORTOFOLIO CARD */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wide">
              Nilai Portofolio Investasi
            </span>
            <button
              type="button"
              onClick={() => setIsMasked(!isMasked)}
              className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
            >
              {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <h2 className="text-[26px] font-black text-[#1037A6] tracking-tight font-mono">
              {isMasked ? '••••••••' : `Rp${totalPortfolioValue.toLocaleString('id-ID')}`}
            </h2>
            <div className="flex items-center gap-1 text-[11.5px] font-black text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{((totalGain / totalInvested) * 100).toFixed(2)}% YTD</span>
            </div>
          </div>

          {/* RDN WALLET BOX */}
          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1037A6] text-white flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Ala RDN Syariah
                </span>
                <span className="text-[13px] font-black text-gray-900 font-mono">
                  {isMasked ? '••••••••' : `Rp${rdnBalance.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRdnDepositModal(true)}
              className="py-1.5 px-3.5 bg-[#1037A6] hover:bg-[#0D2D88] text-white text-[11.5px] font-bold rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Top Up RDN
            </button>
          </div>

          {/* 4 Quick Actions */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => triggerReaction('success', 'Rincian alokasi aset syariah terverifikasi.')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center shadow-xs group-hover:bg-blue-100">
                <PieChart className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Portofolio</span>
            </button>

            <button
              type="button"
              onClick={() => triggerReaction('success', 'Nabung Rutin autodebit syariah aktif per bulan.')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center shadow-xs group-hover:bg-blue-100">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Nabung Rutin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                startTransition('/rewards/referral')
                router.push('/rewards/referral')
              }}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center shadow-xs group-hover:bg-blue-100">
                <Gift className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Referral</span>
            </button>

            <button
              type="button"
              onClick={() => triggerReaction('success', 'Seluruh produk diawasi DSN-MUI.')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center shadow-xs group-hover:bg-blue-100">
                <Scale className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Fatwa MUI</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: 4 PRODUK INVESTASI RESMI (Reksa Dana, Emas Digital, Deposito, Saham Syariah) */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#1037A6]/15 text-[#1037A6] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <h2 className="text-[14.5px] font-extrabold text-[#1A1D26]">
                4 Instrumen Syariah
              </h2>
            </div>
            <span className="text-[10.5px] font-extrabold text-[#059669]">
              100% Halal
            </span>
          </div>

          {/* 4 Product Selector Grid */}
          <div className="grid grid-cols-4 gap-2 pt-4 text-center">
            {/* 1. Reksa Dana Syariah */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('reksadana')
                setSelectedProductModal('reksadana')
              }}
              className={`flex flex-col items-center group cursor-pointer active:scale-95 transition-all ${
                activeTab === 'reksadana' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#059669] shadow-xs group-hover:bg-emerald-100">
                <Sprout className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Reksa Dana Syariah
              </span>
            </button>

            {/* 2. Emas Digital Syariah */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('emas')
                setSelectedProductModal('emas')
              }}
              className={`flex flex-col items-center group cursor-pointer active:scale-95 transition-all ${
                activeTab === 'emas' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs group-hover:bg-amber-100">
                <Coins className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Emas Digital Syariah
              </span>
            </button>

            {/* 3. Ala Deposito Syariah */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('deposito')
                setSelectedProductModal('deposito')
              }}
              className={`flex flex-col items-center group cursor-pointer active:scale-95 transition-all ${
                activeTab === 'deposito' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1037A6] shadow-xs group-hover:bg-blue-100">
                <Landmark className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Ala Deposito Syariah
              </span>
            </button>

            {/* 4. Saham Syariah */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('saham')
                setSelectedProductModal('saham')
              }}
              className={`flex flex-col items-center group cursor-pointer active:scale-95 transition-all ${
                activeTab === 'saham' ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#4338CA] shadow-xs group-hover:bg-indigo-100">
                <CandlestickChart className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Saham Syariah
              </span>
            </button>
          </div>
        </div>

        {/* SECTION 3: TAB DETAIL OVERVIEW (Realistic Market Quotes) */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          {activeTab === 'reksadana' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-black text-[#1A1D26]">
                  Daftar Reksa Dana Syariah Terbaik
                </h3>
                <span className="text-[11px] font-bold text-[#1037A6]">
                  Beli mulai Rp10.000
                </span>
              </div>
              <div className="space-y-2.5">
                {reksadanaList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedProductModal('reksadana')}
                    className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1A1D26]">{item.name}</h4>
                      <span className="text-[10.5px] text-gray-500 block">{item.type} • {item.akad}</span>
                      <span className="text-[11px] font-mono text-gray-400 mt-0.5 block">NAB {item.nab}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[13px] font-black text-[#059669] font-mono block">{item.yield1Y}</span>
                      <span className="text-[10px] text-gray-400">Return 1 Thn</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emas' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-black text-[#1A1D26]">
                  Emas Digital Fisik Antam 24K
                </h3>
                <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Fisik Terjamin
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <span className="text-[10.5px] font-bold text-gray-500 block uppercase">Harga Beli / Gram</span>
                  <span className="text-[16px] font-black text-amber-700 font-mono">Rp{emasPriceBuy.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10.5px] font-bold text-gray-500 block uppercase">Harga Jual / Gram</span>
                  <span className="text-[16px] font-black text-gray-800 font-mono">Rp{emasPriceSell.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <p className="text-[11.5px] text-gray-500 leading-snug">
                Akad Murabahah resmi. Simpanan emas tercatat fisik 1:1 dan dapat dicetak menjadi kepingan logam mulia Antam 24 Karat.
              </p>
              <button
                type="button"
                onClick={() => setSelectedProductModal('emas')}
                className="w-full mt-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[12px] rounded-xl active:scale-95 transition-all shadow-xs"
              >
                Beli Emas Mulai Rp10.000
              </button>
            </div>
          )}

          {activeTab === 'deposito' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-black text-[#1A1D26]">
                  Ala Deposito Syariah (Mudharabah)
                </h3>
                <span className="text-[11px] font-black text-[#1037A6] bg-blue-50 px-2 py-0.5 rounded-full">
                  Hingga 8.5% p.a.
                </span>
              </div>
              <div className="space-y-2">
                {depositoOptions.map((opt) => (
                  <div
                    key={opt.tenor}
                    onClick={() => {
                      setDepositoTenor(opt.tenor as any)
                      setSelectedProductModal('deposito')
                    }}
                    className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1A1D26]">Tenor {opt.label}</h4>
                      <span className="text-[10.5px] text-gray-500">Nisbah Nasabah : Bank ({opt.nisbah})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[13.5px] font-black text-[#1037A6] font-mono">{opt.eqRate}</span>
                      <span className="text-[10px] text-gray-400 block">Indikasi Bagi Hasil</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saham' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-black text-[#1A1D26]">
                  Saham Syariah Pilihan (ISSI / JII)
                </h3>
                <span className="text-[11px] font-bold text-[#059669]">
                  Lolos Screener OJK
                </span>
              </div>
              <div className="space-y-2.5">
                {sahamSyariahList.map((stk) => (
                  <div
                    key={stk.ticker}
                    onClick={() => {
                      setSelectedStock(stk.ticker)
                      setSelectedProductModal('saham')
                    }}
                    className="p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-black text-[#1A1D26]">{stk.ticker}</span>
                        <span className="text-[9.5px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                          {stk.index}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 block truncate max-w-[200px]">
                        {stk.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[13px] font-black text-gray-900 font-mono block">{stk.price}</span>
                      <span className="text-[11px] font-black text-[#059669] font-mono">{stk.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: PORTOFOLIO GOALS LIST */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-[14.5px] font-black text-[#1A1D26]">
              Portofolio Impian Saya
            </h3>
            <span className="text-[11.5px] font-bold text-[#1037A6]">
              {portfolios.length} Kantong Investasi
            </span>
          </div>

          <div className="space-y-2.5 pt-3">
            {portfolios.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#1A1D26]">{p.name}</h4>
                  <span className="text-[11px] text-gray-400">
                    Investasi: Rp{p.invested.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[13.5px] font-black text-gray-900 font-mono block">
                    Rp{(p.invested + p.gain).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] font-black text-[#059669] font-mono">
                    +{p.gainPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: TOP UP RDN WALLET                                               */}
      {/* ========================================================================= */}
      {showRdnDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-black text-[#1A1D26]">
                Top Up Ala RDN Syariah
              </h3>
              <button
                type="button"
                onClick={() => setShowRdnDepositModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl text-[12px] text-[#1037A6] flex justify-between items-center">
                <span>Sumber: Ala Dompet</span>
                <span className="font-bold">Rp{alaDompet.toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Top Up (Rp)
                </label>
                <input
                  type="text"
                  value={rdnNominal}
                  onChange={(e) => setRdnNominal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[15px] text-[#1A1D26] focus:border-[#1037A6] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['100.000', '250.000', '500.000'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setRdnNominal(nom)}
                    className="py-1.5 rounded-lg border border-gray-200 hover:border-[#1037A6] text-[11px] font-bold text-gray-700 active:scale-95 transition-all"
                  >
                    Rp{nom}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRdnDeposit}
              className="w-full py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Konfirmasi Top Up RDN
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUY PRODUCT INTERACTIVE TRANSACTION SHEET                        */}
      {/* ========================================================================= */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] bg-white rounded-t-[30px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-black text-[#1A1D26]">
                {selectedProductModal === 'reksadana' && 'Beli Reksa Dana Syariah'}
                {selectedProductModal === 'emas' && 'Beli Emas Digital Syariah'}
                {selectedProductModal === 'deposito' && 'Buka Ala Deposito Syariah'}
                {selectedProductModal === 'saham' && `Beli Saham Syariah (${selectedStock})`}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-blue-50/70 rounded-xl text-[12px] text-gray-700 flex justify-between items-center">
                <span>Saldo RDN Tersedia:</span>
                <span className="font-bold text-[#1037A6] font-mono">Rp{rdnBalance.toLocaleString('id-ID')}</span>
              </div>

              {selectedProductModal === 'deposito' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                    Pilih Tenor Simpanan
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {depositoOptions.map((opt) => (
                      <button
                        key={opt.tenor}
                        type="button"
                        onClick={() => setDepositoTenor(opt.tenor as any)}
                        className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          depositoTenor === opt.tenor
                            ? 'bg-[#1037A6] text-white border-[#1037A6]'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Alokasi (Rp)
                </label>
                <input
                  type="text"
                  value={transAmount}
                  onChange={(e) => setTransAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-black text-[15px] text-[#1A1D26] focus:border-[#1037A6] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {['100.000', '500.000', '1.000.000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTransAmount(amt)}
                    className="py-1.5 rounded-lg border border-gray-200 hover:border-[#1037A6] text-[11px] font-bold text-gray-700 active:scale-95 transition-all"
                  >
                    Rp{amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleProductTransaction}
              className="w-full py-3.5 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[13.5px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Konfirmasi Investasi Syariah
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
