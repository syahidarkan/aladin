'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  PieChart,
  Calendar,
  Gift,
  LayoutGrid,
  Sprout,
  Landmark,
  Coins,
  CandlestickChart,
  Wallet,
  X,
  Check,
  ArrowUpRight,
  Info,
} from 'lucide-react'

export default function AlaInvestasiPage() {
  const router = useRouter()
  const { alaDompet, reksaDanaBalance = 8167500, emasGrams = 2.76, emasPricePerGram = 1345000 } = useBankState()
  const { triggerReaction, startTransition } = useMascot()

  // Visibility toggle (eye lock like Bibit)
  const [isMasked, setIsMasked] = useState(false)

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositNominal, setDepositNominal] = useState('250.000')
  const [rdnBalance, setRdnBalance] = useState(500000)

  // Selected Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<'reksadana' | 'sbn' | 'obligasi' | 'saham' | 'emas' | null>(null)
  const [buyAmount, setBuyAmount] = useState('100.000')

  // Portfolio goals state
  const [portfolios, setPortfolios] = useState([
    {
      id: 'darurat',
      name: 'Dana Darurat',
      productsCount: 3,
      invested: 400000,
      gain: 40000,
      gainPercent: 10.0,
      category: 'reksadana',
    },
    {
      id: 'haji-umrah',
      name: 'Tabungan Umrah & Haji',
      productsCount: 2,
      invested: 350000,
      gain: 35000,
      gainPercent: 10.0,
      category: 'sukuk',
    },
    {
      id: 'emas-fisik',
      name: 'Emas Batangan Antam',
      productsCount: 1,
      invested: 250000,
      gain: 25000,
      gainPercent: 10.0,
      category: 'emas',
    },
  ])

  // Computed total portfolio value
  const totalInvested = portfolios.reduce((acc, p) => acc + p.invested, 0)
  const totalGain = portfolios.reduce((acc, p) => acc + p.gain, 0)
  const totalPortfolioValue = totalInvested + totalGain // Rp 1.000.000 (File 2 exact match)

  // Handlers
  const handleDepositSubmit = () => {
    const raw = parseInt(depositNominal.replace(/\D/g, '') || '0', 10)
    if (raw <= 0) return
    if (raw > alaDompet) {
      alert('Saldo Ala Dompet tidak mencukupi untuk deposit RDN.')
      return
    }
    setRdnBalance((prev) => prev + raw)
    setShowDepositModal(false)
    triggerReaction('success', `Berhasil deposit Rp${raw.toLocaleString('id-ID')} ke RDN Wallet!`)
  }

  const handleBuyProduct = () => {
    const raw = parseInt(buyAmount.replace(/\D/g, '') || '0', 10)
    if (raw <= 0) return
    if (raw > rdnBalance && raw > alaDompet) {
      alert('Saldo RDN / Ala Dompet tidak mencukupi.')
      return
    }

    // Add to first portfolio
    setPortfolios((prev) =>
      prev.map((p, idx) => (idx === 0 ? { ...p, invested: p.invested + raw, gain: Math.round((p.invested + raw) * 0.1) } : p))
    )
    setSelectedProduct(null)
    triggerReaction('success', `Investasi berhasil disalurkan ke produk syariah!`)
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#F8FAFC] select-none text-[#1A1D26] overflow-x-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. TOP NATIVE HEADER BAR (Bibit File 1 & 2 Style) */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        {/* Left: Back & Bibit Brand Logo */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
          </Link>

          {/* Bibit x Aladin Brand Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-[#00A86B] flex items-center justify-center text-white font-black text-[12px] shadow-xs">
              <Sprout className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[17px] font-black tracking-tight text-[#00A86B]">bibit</span>
              <span className="text-[11px] font-extrabold text-[#1C20C4] bg-blue-50 px-1.5 py-0.2 rounded-md">
                SYARIAH
              </span>
            </div>
          </div>
        </div>

        {/* Right: Notification Bell */}
        <Link
          href="/notifikasi"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </Link>
      </header>

      {/* 2. SCROLLABLE MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-32 space-y-4">
        {/* SECTION 1: NILAI PORTOFOLIO CARD (Bibit File 1 & 2 1:1 Match) */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          {/* Header Row: Label & Eye Lock */}
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[12.5px] font-medium">Nilai Portofolio</span>
            <button
              type="button"
              onClick={() => setIsMasked(!isMasked)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title={isMasked ? 'Tampilkan Nilai' : 'Sembunyikan Nilai'}
            >
              {isMasked ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Large Portfolio Amount: Rp 1,000,000 (File 2) */}
          <div className="mt-1">
            <span className="text-[26px] font-extrabold text-[#1A1D26] tracking-tight">
              {isMasked ? '••••••••' : `Rp ${totalPortfolioValue.toLocaleString('id-ID')}`}
            </span>
          </div>

          {/* Sub-Metrics: Keuntungan & Imbal Hasil */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[12px]">
            <div>
              <span className="text-gray-500 block">Keuntungan</span>
              <span className="font-bold text-[#00A86B] mt-0.5 block">
                {isMasked ? '••••••••' : `Rp ${totalGain.toLocaleString('id-ID')}`}
              </span>
            </div>

            <div className="text-right">
              <span className="text-gray-500 block">Imbal Hasil</span>
              <span className="font-extrabold text-[#00A86B] flex items-center gap-0.5 justify-end mt-0.5">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                {isMasked ? '••••' : '+10%'}
              </span>
            </div>
          </div>

          {/* RDN WALLET BOX (Bibit File 1) */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11.5px] font-bold text-gray-700">
                <span>RDN Wallet</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </div>
              <span className="text-[13px] font-bold text-[#1A1D26] mt-0.5 block font-mono">
                {isMasked ? '••••••••' : `Rp ${rdnBalance.toLocaleString('id-ID')}`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowDepositModal(true)}
              className="py-1.5 px-3.5 rounded-full border border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B]/10 text-[11.5px] font-extrabold transition-all cursor-pointer active:scale-95"
            >
              Deposit
            </button>
          </div>

          {/* 4 QUICK ACTION SQUIRCLES (Bibit File 1 & 2) */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-2 border-t border-gray-100 text-center">
            {/* 1. Portofolio */}
            <button
              type="button"
              onClick={() => triggerReaction('success', 'Membuka rincian aset portofolio...')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center group-hover:bg-emerald-100 transition-colors shadow-xs">
                <PieChart className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Portofolio</span>
            </button>

            {/* 2. Nabung Rutin */}
            <button
              type="button"
              onClick={() => triggerReaction('success', 'Fitur Nabung Rutin otomatis autodebit aktif.')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center group-hover:bg-emerald-100 transition-colors shadow-xs">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Nabung Rutin</span>
            </button>

            {/* 3. Referral */}
            <button
              type="button"
              onClick={() => {
                startTransition('/rewards/referral')
                router.push('/rewards/referral')
              }}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center group-hover:bg-emerald-100 transition-colors shadow-xs">
                <Gift className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Referral</span>
            </button>

            {/* 4. Lainnya */}
            <button
              type="button"
              onClick={() => triggerReaction('success', 'Katalog instrumen investasi syariah lengkap.')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A86B] flex items-center justify-center group-hover:bg-emerald-100 transition-colors shadow-xs">
                <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 mt-1.5">Lainnya</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: PRODUK INVESTASI (Bibit File 1 & 2 + EMAS) */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#00A86B]/15 text-[#00A86B] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <h2 className="text-[14.5px] font-extrabold text-[#1A1D26]">Produk Investasi</h2>
            </div>

            <button
              type="button"
              onClick={() => triggerReaction('success', 'Membuka seluruh instrumen syariah OJK...')}
              className="text-[12px] font-bold text-[#00A86B] hover:underline cursor-pointer"
            >
              Explore
            </button>
          </div>

          {/* 5 Product Icons Row: Reksa Dana, SBN Retail, Obligasi FR, Saham, and EMAS! */}
          <div className="grid grid-cols-5 gap-1.5 pt-4 text-center">
            {/* 1. Reksa Dana */}
            <button
              type="button"
              onClick={() => setSelectedProduct('reksadana')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#E6F7F0] border border-[#00A86B]/30 flex items-center justify-center text-[#00A86B] group-hover:bg-[#D1F2E4] transition-colors shadow-xs">
                <Sprout className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Reksa Dana
              </span>
            </button>

            {/* 2. SBN Retail / Sukuk */}
            <button
              type="button"
              onClick={() => setSelectedProduct('sbn')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors shadow-xs">
                <Landmark className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                SBN Retail
              </span>
            </button>

            {/* 3. Obligasi FR */}
            <button
              type="button"
              onClick={() => setSelectedProduct('obligasi')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1C20C4] group-hover:bg-blue-100 transition-colors shadow-xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Obligasi FR
              </span>
            </button>

            {/* 4. Saham Syariah */}
            <button
              type="button"
              onClick={() => setSelectedProduct('saham')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[#7C3AED] group-hover:bg-purple-100 transition-colors shadow-xs">
                <CandlestickChart className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Saham
              </span>
            </button>

            {/* 5. Emas Syariah (Antam 24K - User Explicit Request!) */}
            <button
              type="button"
              onClick={() => setSelectedProduct('emas')}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors shadow-xs">
                <Coins className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-[#1A1D26] mt-2 leading-tight">
                Emas Fisik
              </span>
            </button>
          </div>
        </div>

        {/* SECTION 3: PROMO / UPGRADE BANNER (Bibit File 2 Style) */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 border border-purple-100 flex items-center justify-between shadow-xs">
          <div className="pr-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 tracking-wider">
                BIBIT PLUS
              </span>
              <h3 className="text-[13px] font-extrabold text-purple-950">Upgrade ke Bibit Plus</h3>
            </div>
            <p className="text-[11px] text-purple-800/80 leading-snug">
              Nikmati RDN sebagai metode pembayaran, Investasi Saham dan Obligasi FR Syariah.
            </p>
            <button
              type="button"
              onClick={() => triggerReaction('success', 'Akun telah terhubung dengan Bibit Plus Syariah.')}
              className="text-[11.5px] font-extrabold text-[#6D28D9] mt-2 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Upgrade Sekarang</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* SECTION 4: PORTOFOLIO GOALS LIST (Bibit File 1 & 2 Style) */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-50 text-[#1C20C4] flex items-center justify-center">
                <PieChart className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <h2 className="text-[14.5px] font-extrabold text-[#1A1D26]">Portofolio</h2>
            </div>

            <button
              type="button"
              onClick={() => {
                const name = prompt('Masukkan nama tujuan portofolio baru (misal: Biaya Sekolah Anak):')
                if (name && name.trim()) {
                  setPortfolios((prev) => [
                    ...prev,
                    {
                      id: `port-${Date.now()}`,
                      name: name.trim(),
                      productsCount: 1,
                      invested: 100000,
                      gain: 10000,
                      gainPercent: 10.0,
                      category: 'reksadana',
                    },
                  ])
                  triggerReaction('success', `Portofolio "${name}" berhasil dibuat!`)
                }
              }}
              className="text-[12px] font-bold text-[#00A86B] hover:underline cursor-pointer"
            >
              Buat Baru
            </button>
          </div>

          {/* Portfolio Cards */}
          <div className="divide-y divide-gray-100 mt-1">
            {portfolios.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.category === 'emas'
                        ? 'bg-amber-50 text-amber-600'
                        : item.category === 'sukuk'
                        ? 'bg-blue-50 text-[#1C20C4]'
                        : 'bg-emerald-50 text-[#00A86B]'
                    }`}
                  >
                    {item.category === 'emas' ? (
                      <Coins className="w-5 h-5" />
                    ) : item.category === 'sukuk' ? (
                      <Landmark className="w-5 h-5" />
                    ) : (
                      <Sprout className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold text-[#1A1D26] leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {item.productsCount} Produk Syariah
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[13px] font-bold text-[#1A1D26] block">
                    {isMasked ? '••••••••' : `Rp ${item.invested.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-[11px] font-bold text-[#00A86B] block">
                    {isMasked ? '••••' : `+Rp ${item.gain.toLocaleString('id-ID')} (+${item.gainPercent}%)`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: DEPOSIT RDN WALLET                                              */}
      {/* ========================================================================= */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-extrabold text-[#1A1D26]">Deposit RDN Wallet</h3>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl text-[12px] text-blue-900 flex justify-between items-center">
                <span>Sumber: Ala Dompet</span>
                <span className="font-bold">Rp{alaDompet.toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Deposit (Rp)
                </label>
                <input
                  type="text"
                  value={depositNominal}
                  onChange={(e) => setDepositNominal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[15px] text-[#1A1D26] focus:border-[#00A86B] outline-none"
                />
              </div>

              {/* Quick Nominal Pills */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['100.000', '250.000', '500.000'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setDepositNominal(nom)}
                    className="py-1.5 rounded-lg border border-gray-200 hover:border-[#00A86B] text-[11px] font-bold text-gray-700 active:scale-95 transition-all cursor-pointer"
                  >
                    Rp{nom}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDepositSubmit}
              className="w-full py-3 rounded-xl bg-[#00A86B] hover:bg-[#008f5a] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#00A86B]/20"
            >
              Konfirmasi Deposit RDN
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DETAIL PRODUK (REKSA DANA / EMAS / SUKUK / SAHAM)               */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[350px] bg-white rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-extrabold text-[#1A1D26]">
                  {selectedProduct === 'reksadana' && 'Reksa Dana Syariah'}
                  {selectedProduct === 'sbn' && 'SBN Retail (Sukuk Negara)'}
                  {selectedProduct === 'obligasi' && 'Obligasi FR Syariah'}
                  {selectedProduct === 'saham' && 'Saham Syariah Indonesia'}
                  {selectedProduct === 'emas' && 'Emas Batangan Antam 24K'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-[12px] text-gray-600">
              {/* Product specific content */}
              {selectedProduct === 'emas' ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                      Harga Emas Hari Ini
                    </span>
                    <span className="text-[20px] font-black text-amber-950 block mt-0.5">
                      Rp{emasPricePerGram.toLocaleString('id-ID')}/gram
                    </span>
                    <span className="text-[10.5px] text-emerald-600 font-bold">
                      ▲ +Rp12.000 hari ini (Sertifikat LBMA & Antam)
                    </span>
                  </div>

                  <p className="text-[11.5px] leading-relaxed">
                    Emas fisik 24 karat disimpan secara aman di brankas bersertifikat OJK. Bisa dicetak fisik atau dijual instan kapan saja.
                  </p>
                </div>
              ) : selectedProduct === 'reksadana' ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                      Sucorinvest Sharia Money Market
                    </span>
                    <span className="text-[18px] font-black text-emerald-950 block mt-0.5">
                      Imbal Hasil: 5.85% p.a.
                    </span>
                    <span className="text-[10.5px] text-gray-500">
                      Tingkat risiko rendah • Bebas biaya admin pembelian
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed">
                    Dikelola manajer investasi profesional dengan prinsip syariah tanpa bunga dan bebas riba.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold uppercase text-blue-900 tracking-wider block">
                      Sukuk Tabungan Seri ST012
                    </span>
                    <span className="text-[18px] font-black text-blue-950 block mt-0.5">
                      Kupon: 6.40% p.a. Floating
                    </span>
                    <span className="text-[10.5px] text-blue-700">
                      100% Dijamin Pemerintah RI • Tenor 2 Tahun
                    </span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed">
                    Investasi syariah yang aman dan menguntungkan langsung dari Kementerian Keuangan RI.
                  </p>
                </div>
              )}

              {/* Purchase input */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                  Nominal Pembelian (Rp)
                </label>
                <input
                  type="text"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[14px] text-[#1A1D26] focus:border-[#00A86B] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyProduct}
              className="w-full py-3 rounded-xl bg-[#00A86B] hover:bg-[#008f5a] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#00A86B]/20"
            >
              Beli Sekarang via RDN / Dompet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
