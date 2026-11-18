'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { useBankState, createPocket, executeDonation } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  PieChart,
  Wallet,
  HeartHandshake,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FolderPlus,
  Heart,
} from 'lucide-react'

export default function BudgetCalculatorPage() {
  const router = useRouter()
  const { alaDompet } = useBankState()
  const { triggerReaction } = useMascot()

  // Mode: Bulanan vs Harian
  const [periodMode, setPeriodMode] = useState<'monthly' | 'daily'>('monthly')
  const [incomeInput, setIncomeInput] = useState<string>('6.000.000')

  // Sliders for allocations (Default 50 / 20 / 10 / 20)
  const [needPct, setNeedPct] = useState<number>(50)
  const [savingPct, setSavingPct] = useState<number>(20)
  const [charityPct, setCharityPct] = useState<number>(10)
  const [wantPct, setWantPct] = useState<number>(20)

  // Feedback States
  const [pocketCreatedToast, setPocketCreatedToast] = useState<string | null>(null)
  const [isSubmittingPockets, setIsSubmittingPockets] = useState<boolean>(false)
  const [showSedekahSuccess, setShowSedekahSuccess] = useState<boolean>(false)

  // Calculations
  const rawIncome = parseInt(incomeInput.replace(/\D/g, '') || '0', 10)
  const monthlyIncome = periodMode === 'monthly' ? rawIncome : rawIncome * 30

  // Nominal allocations
  const needNominal = Math.round((monthlyIncome * needPct) / 100)
  const savingNominal = Math.round((monthlyIncome * savingPct) / 100)
  const charityNominal = Math.round((monthlyIncome * charityPct) / 100)
  const wantNominal = Math.round((monthlyIncome * wantPct) / 100)

  // Daily Allowance (Batas Jajan Harian)
  const dailyAllowance = Math.round(wantNominal / 30)

  const totalPct = needPct + savingPct + charityPct + wantPct

  // Format currency
  const formatRupiah = (val: number) => {
    return `Rp${val.toLocaleString('id-ID')}`
  }

  // Handle Quick Income Presets
  const handleQuickPreset = (val: number) => {
    setIncomeInput(val.toLocaleString('id-ID'))
  }

  // Handle Auto-creating 4 Pockets
  const handleCreateAutoPockets = () => {
    setIsSubmittingPockets(true)

    // Create 4 structured Ala Pockets
    const p1 = createPocket({
      name: 'Pos Kebutuhan Pokok',
      category: 'belanja',
      initialDeposit: 0,
      target: needNominal,
      color: '#1037A6',
      icon: 'Home',
    })

    const p2 = createPocket({
      name: 'Tabungan Ala Impian',
      category: 'darurat',
      initialDeposit: 0,
      target: savingNominal,
      color: '#059669',
      icon: 'Target',
    })

    const p3 = createPocket({
      name: 'ZISWAF & Sedekah Berkah',
      category: 'sedekah',
      initialDeposit: 0,
      target: charityNominal,
      color: '#00F0A0',
      icon: 'Heart',
    })

    const p4 = createPocket({
      name: 'Pos Jajan & Lifestyle',
      category: 'makan',
      initialDeposit: 0,
      target: wantNominal,
      color: '#F59E0B',
      icon: 'UtensilsCrossed',
    })

    setTimeout(() => {
      setIsSubmittingPockets(false)
      triggerReaction('success', '4 Kantong Aladin Otomatis berhasil dibuat!')
      setPocketCreatedToast('4 Pos Kantong berhasil dibuat di Ala Pocket sesuai alokasi!')
      setTimeout(() => {
        setPocketCreatedToast(null)
      }, 4000)
    }, 600)
  }

  // Handle Sedekah quick deposit
  const handleQuickSedekah = () => {
    const res = executeDonation({
      title: 'Sedekah Terencana Syariah',
      category: 'sedekah',
      amount: Math.min(charityNominal, 50000), // Default demo portion
      institution: 'BAZNAS RI & Lazismu',
      isAnonymous: false,
    })

    if (res.success) {
      triggerReaction('success', 'Sedekah berhasil disalurkan lewat Ala Berbagi!')
      setShowSedekahSuccess(true)
      setTimeout(() => setShowSedekahSuccess(false), 3500)
    } else {
      router.push('/donasi')
    }
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
              Kalkulator Budget
            </h1>
            <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B] border border-emerald-400">
              ⭐ Fitur Utama
            </span>
          </div>

          <div style={{ width: '36px' }} />
        </div>
      </header>

      {/* 2. Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 p-5 pb-28">
        {/* Toast Notifikasi Sukses Buat Kantong */}
        {pocketCreatedToast && (
          <div className="p-3.5 bg-[#064E3B] text-white rounded-2xl text-[12px] font-bold shadow-lg animate-in fade-in duration-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00F0A0] shrink-0" />
              <span>{pocketCreatedToast}</span>
            </div>
            <Link href="/pocket" className="underline text-[#00F0A0] shrink-0 font-extrabold text-[11px]">
              Lihat Kantong →
            </Link>
          </div>
        )}

        {showSedekahSuccess && (
          <div className="p-3.5 bg-[#1037A6] text-white rounded-2xl text-[12px] font-bold shadow-lg animate-in fade-in duration-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00F0A0] shrink-0" />
            <span>Alhamdulillah! Sedekah berhasil disisihkan ke BAZNAS RI &amp; Lazismu.</span>
          </div>
        )}

        {/* Hero Card Input Pemasukan */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
              ESTIMASI PEMASUKAN
            </span>

            {/* Toggle Harian / Bulanan */}
            <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setPeriodMode('monthly')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  periodMode === 'monthly'
                    ? 'bg-[#1037A6] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setPeriodMode('daily')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  periodMode === 'daily'
                    ? 'bg-[#1037A6] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Harian
              </button>
            </div>
          </div>

          {/* Nominal Input Field */}
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-black text-gray-400 font-mono">
              Rp
            </span>
            <input
              type="text"
              value={incomeInput}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '')
                const num = parseInt(clean || '0', 10)
                setIncomeInput(num > 0 ? num.toLocaleString('id-ID') : '')
              }}
              className="w-full h-14 pl-12 pr-4 bg-[#F8FAFC] border-2 border-gray-200 focus:border-[#1037A6] rounded-2xl text-[22px] font-black text-[#1A1D26] font-mono tracking-tight outline-none transition-all"
              placeholder="0"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[3000000, 5000000, 7500000, 10000000, 15000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-blue-50 text-[11px] font-bold text-gray-700 hover:text-[#1037A6] transition-colors cursor-pointer shrink-0"
              >
                Rp{(preset / 1000000).toFixed(preset % 1000000 === 0 ? 0 : 1)} Jt
              </button>
            ))}
          </div>
        </div>

        {/* CARD: BATAS JAJAN HARIAN KAMU */}
        <div className="bg-gradient-to-br from-[#001F5D] to-[#1037A6] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0A0]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
              LIFESTYLE &amp; SELF REWARD
            </span>
            <span className="text-[10px] font-bold text-white/70">Perhitungan 30 Hari</span>
          </div>

          <div className="relative z-10 mb-2">
            <span className="text-[12px] text-white/80 font-medium block">Batas jajan harian kamu:</span>
            <span className="text-[28px] font-black tracking-tight text-[#00F0A0] font-mono">
              {formatRupiah(dailyAllowance)}
            </span>
            <span className="text-[11px] text-white/80 font-semibold block mt-0.5">
              per hari dari porsi keinginan ({wantPct}% = {formatRupiah(wantNominal)})
            </span>
          </div>

          <p className="text-[11px] text-white/75 leading-relaxed relative z-10 pt-2 border-t border-white/15">
            💡 Jajan harian aman terkendali tanpa mengorbankan pos tabungan dan sedekah syariah.
          </p>
        </div>

        {/* SLIDERS ALOKASI SYARIAH (BISA DISESUAIKAN) */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-black text-[#1A1D26]">
                Alokasi Syariah 50/20/10/20
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">
                Geser slider untuk menyesuaikan proporsi
              </span>
            </div>
            <span
              className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full border ${
                totalPct === 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Total: {totalPct}% {totalPct !== 100 && '(bisa disesuaikan)'}
            </span>
          </div>

          {/* Visual Proportion Bar */}
          <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
            <div style={{ width: `${needPct}%` }} className="bg-[#1037A6] h-full" title="Kebutuhan" />
            <div style={{ width: `${savingPct}%` }} className="bg-[#059669] h-full" title="Tabungan" />
            <div style={{ width: `${charityPct}%` }} className="bg-[#00F0A0] h-full" title="Sedekah & Zakat" />
            <div style={{ width: `${wantPct}%` }} className="bg-[#F59E0B] h-full" title="Keinginan" />
          </div>

          {/* 1. Pos Kebutuhan (50%) */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1037A6]" />
                <span className="text-[13px] font-bold text-[#1A1D26]">Kebutuhan Pokok</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-black text-[#1037A6] font-mono">
                  {formatRupiah(needNominal)}
                </span>
                <span className="text-[10.5px] font-bold text-gray-500 ml-1.5">({needPct}%)</span>
              </div>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              value={needPct}
              onChange={(e) => setNeedPct(Number(e.target.value))}
              className="w-full accent-[#1037A6] cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block leading-tight">
              Biaya sewa, belanja dapur, tagihan listrik, cicilan halal, &amp; transportasi.
            </span>
          </div>

          {/* 2. Pos Tabungan & Ala Impian (20%) */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#059669]" />
                <span className="text-[13px] font-bold text-[#1A1D26]">Tabungan &amp; Ala Impian</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-black text-[#059669] font-mono">
                  {formatRupiah(savingNominal)}
                </span>
                <span className="text-[10.5px] font-bold text-gray-500 ml-1.5">({savingPct}%)</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={savingPct}
              onChange={(e) => setSavingPct(Number(e.target.value))}
              className="w-full accent-[#059669] cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block leading-tight">
              Dana darurat, tabungan porsi haji/umrah, &amp; investasi syariah masa depan.
            </span>
          </div>

          {/* 3. Pos Sedekah & Zakat (10%) */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00F0A0]" />
                <span className="text-[13px] font-bold text-[#1A1D26]">Sedekah &amp; Zakat Maal</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-black text-[#064E3B] font-mono">
                  {formatRupiah(charityNominal)}
                </span>
                <span className="text-[10.5px] font-bold text-gray-500 ml-1.5">({charityPct}%)</span>
              </div>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              value={charityPct}
              onChange={(e) => setCharityPct(Number(e.target.value))}
              className="w-full accent-[#00F0A0] cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block leading-tight">
              Penyucian harta 2.5% zakat maal, infaq subuh, dan sedekah jumat berkah.
            </span>
          </div>

          {/* 4. Pos Keinginan & Jajan (20%) */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-[13px] font-bold text-[#1A1D26]">Keinginan &amp; Lifestyle</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-black text-[#D97706] font-mono">
                  {formatRupiah(wantNominal)}
                </span>
                <span className="text-[10.5px] font-bold text-gray-500 ml-1.5">({wantPct}%)</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={wantPct}
              onChange={(e) => setWantPct(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block leading-tight">
              Kopi, hiburan halal, nongkrong bersama teman, dan belanja hobi.
            </span>
          </div>
        </div>

        {/* 2 ACTION BUTTONS (CTAs) */}
        <div className="space-y-2.5 pt-1">
          {/* CTA 1: Buat Kantong Otomatis */}
          <button
            type="button"
            onClick={handleCreateAutoPockets}
            disabled={isSubmittingPockets}
            className="w-full h-12 bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[13.5px] rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <FolderPlus className="w-4 h-4 text-[#00F0A0]" />
            <span>{isSubmittingPockets ? 'Membuat Kantong...' : 'Buat Kantong Otomatis di Ala Pocket'}</span>
          </button>

          {/* CTA 2: Sisihkan ke Ala Berbagi */}
          <button
            type="button"
            onClick={handleQuickSedekah}
            className="w-full h-12 bg-white hover:bg-emerald-50 text-[#064E3B] font-extrabold text-[13px] rounded-2xl border-2 border-emerald-300 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Heart className="w-4 h-4 text-[#059669]" />
            <span>Sisihkan {formatRupiah(charityNominal)} ke Ala Berbagi</span>
          </button>
        </div>
      </div>
    </div>
  )
}
