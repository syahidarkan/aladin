'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DigitalVerticalCard from '@/components/card/DigitalVerticalCard'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  HelpCircle,
  Lock,
  Unlock,
  Clock,
  Settings,
  CreditCard,
  Calendar,
  ShieldCheck,
  Copy,
  Check,
  Plus,
  MoreHorizontal,
  Fingerprint,
  X,
  ChevronRight,
  Sliders,
  Globe,
  Coins,
  ShieldAlert,
  Wallet,
} from 'lucide-react'

export default function VirtualCardPage() {
  const router = useRouter()
  const { alaDompet, dompetSar } = useBankState()
  const { triggerReaction, startTransition } = useMascot()

  // Card Appearance & State
  const [selectedTheme, setSelectedTheme] = useState<'aladin-idr' | 'aladin-gold' | 'aladin-purple'>('aladin-idr')
  const [isFrozen, setIsFrozen] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [showBiometricModal, setShowBiometricModal] = useState(false)
  const [cvvTimer, setCvvTimer] = useState(30)
  const [copied, setCopied] = useState(false)

  // Modals & Bottom Sheets
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showPocketMenu, setShowPocketMenu] = useState(false)

  // Settings Controls
  const [dailyLimit, setDailyLimit] = useState(5000000)
  const [onlineEnabled, setOnlineEnabled] = useState(true)
  const [overseasEnabled, setOverseasEnabled] = useState(true)
  const [contactlessEnabled, setContactlessEnabled] = useState(true)

  // Filter for Transaction History
  const [activeFilter, setActiveFilter] = useState<'semua' | 'online' | 'saudi'>('semua')

  // CVV Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRevealed && cvvTimer > 0) {
      interval = setInterval(() => {
        setCvvTimer((t) => t - 1)
      }, 1000)
    } else if (cvvTimer === 0) {
      setIsRevealed(false)
      setCvvTimer(30)
    }
    return () => clearInterval(interval)
  }, [isRevealed, cvvTimer])

  // Copy card number to clipboard
  const handleCopyCard = () => {
    navigator.clipboard?.writeText?.('4111223344557890')
    setCopied(true)
    triggerReaction('copy-success', 'Nomor kartu Visa Aladin berhasil disalin!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Toggle reveal info via Biometric check
  const handleRevealClick = () => {
    if (isRevealed) {
      setIsRevealed(false)
      setCvvTimer(30)
    } else {
      setShowBiometricModal(true)
    }
  }

  const handleBiometricConfirm = () => {
    setShowBiometricModal(false)
    setIsRevealed(true)
    setCvvTimer(30)
    triggerReaction('success', 'Informasi kartu berhasil dibuka!')
  }

  // Toggle Card Freeze / Lock
  const handleToggleFreeze = () => {
    const nextState = !isFrozen
    setIsFrozen(nextState)
    if (nextState) {
      triggerReaction('lock-action', 'Kartu Visa Aladin berhasil dikunci demi keamanan.')
    } else {
      triggerReaction('success', 'Kunci kartu Visa Aladin berhasil dibuka!')
    }
  }

  // Sample transactions
  const transactions = [
    {
      id: 1,
      merchant: 'Al Baik Express Makkah',
      category: 'saudi',
      date: '06 Nov 2026 • 21:14',
      amount: 'SAR 42.50',
      idr: 'Rp178.500',
      status: 'Berhasil',
      note: 'Geidea POS • Bebas Markup SAR',
    },
    {
      id: 2,
      merchant: 'Spotify Subscription',
      category: 'online',
      date: '03 Nov 2026 • 09:30',
      amount: 'Rp54.990',
      idr: 'Rp54.990',
      status: 'Berhasil',
      note: 'Langganan Otomatis',
    },
    {
      id: 3,
      merchant: 'Saudia Airlines Baggage',
      category: 'saudi',
      date: '28 Okt 2026 • 14:05',
      amount: 'SAR 120.00',
      idr: 'Rp504.000',
      status: 'Berhasil',
      note: 'Tiket & Bagasi Tambahan',
    },
    {
      id: 4,
      merchant: 'Amazon Web Services',
      category: 'online',
      date: '25 Okt 2026 • 01:12',
      amount: 'USD 14.20',
      idr: 'Rp227.200',
      status: 'Berhasil',
      note: 'Cloud Hosting Syariah',
    },
  ]

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === 'semua') return true
    return tx.category === activeFilter
  })

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-white select-none text-[#1A1D26] overflow-clip relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Unified Seamless White Header (No Notch Gap) */}
      <header className="shrink-0 w-full bg-white border-b border-gray-100 z-30">
        <StatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Back Button */}
          <Link
            href="/beranda"
            data-back="true"
            className="w-9 h-9 -ml-1 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>

          {/* Title */}
          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight text-center">
            Rincian Kartu
          </h1>

          {/* Help Circle Button */}
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="w-9 h-9 -mr-1 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Pusat Bantuan Kartu"
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE BODY CONTENT */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-4 pb-32">
        {/* HERO SECTION: DIGITAL VERTICAL CARD */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
          <DigitalVerticalCard
            cardType={selectedTheme}
            cardNickname="Ala Dompet Utama"
            isLocked={isFrozen}
            cardNumberMasked={isRevealed ? '4111 2233 4455 7890' : '•••• 7890'}
            cardHolderName="DEWAN JURI IMOTION"
            expiryDate="11/29"
            notchBg="#FFFFFF"
            onClick={handleToggleFreeze}
          />

          {/* Theme Color Switcher Pills (Sleek Micro-Picker) */}
          <div className="flex items-center gap-2 mt-2">
            {[
              { id: 'aladin-idr', label: 'Aladin Blue', color: 'bg-[#1C20C4]' },
              { id: 'aladin-gold', label: 'Aladin Gold', color: 'bg-[#F59E0B]' },
              { id: 'aladin-purple', label: 'Aladin Emerald', color: 'bg-[#059669]' },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setSelectedTheme(th.id as any)}
                className={`w-4 h-4 rounded-full ${th.color} transition-transform ${
                  selectedTheme === th.id
                    ? 'ring-2 ring-offset-2 ring-gray-400 scale-125'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title={th.label}
              />
            ))}
          </div>
        </div>

        {/* 3 CIRCULAR ACTION BUTTONS (Bank Jago File 1 & 2 Exact Layout) */}
        <div className="grid grid-cols-3 gap-3 my-5 max-w-[320px] mx-auto">
          {/* Button 1: Kunci Kartu / Buka Kunci */}
          <button
            type="button"
            onClick={handleToggleFreeze}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all shadow-xs ${
                isFrozen
                  ? 'bg-red-500 text-white shadow-red-200'
                  : 'bg-blue-50 text-[#1037A6] group-hover:bg-blue-100'
              }`}
            >
              {isFrozen ? (
                <Unlock className="w-5 h-5 text-white stroke-[2.2]" />
              ) : (
                <Lock className="w-5 h-5 text-[#1037A6] stroke-[2.2]" />
              )}
            </div>
            <span className="text-[12px] font-bold text-[#1A1D26] mt-2 text-center leading-tight">
              {isFrozen ? 'Buka Kunci' : 'Kunci Kartu'}
            </span>
          </button>

          {/* Button 2: Riwayat */}
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-blue-50 text-[#1037A6] group-hover:bg-blue-100 flex items-center justify-center transition-all shadow-xs">
              <Clock className="w-5 h-5 text-[#1037A6] stroke-[2.2]" />
            </div>
            <span className="text-[12px] font-bold text-[#1A1D26] mt-2 text-center leading-tight">
              Riwayat
            </span>
          </button>

          {/* Button 3: Pengaturan */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-[52px] h-[52px] rounded-full bg-blue-50 text-[#1037A6] group-hover:bg-blue-100 flex items-center justify-center transition-all shadow-xs">
              <Settings className="w-5 h-5 text-[#1037A6] stroke-[2.2]" />
            </div>
            <span className="text-[12px] font-bold text-[#1A1D26] mt-2 text-center leading-tight">
              Pengaturan
            </span>
          </button>
        </div>

        {/* SECTION: INFORMASI KARTU (CARD INFORMATION) */}
        <section className="mt-7">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-[15.5px] font-bold text-[#1A1D26] tracking-tight">
              Informasi Kartu
            </h2>
            <button
              type="button"
              onClick={handleRevealClick}
              className="text-[13px] font-bold text-[#1C20C4] hover:underline underline-offset-2 cursor-pointer flex items-center gap-1 active:opacity-70"
            >
              {isRevealed ? 'Tutup Info' : 'Lihat Info'}
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Row 1: Card No */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                  <CreditCard className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-[13.5px] font-medium text-[#1A1D26]">
                  Card No
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[13.5px] font-semibold text-gray-800 tracking-wider">
                  {isRevealed ? '4111 2233 4455 7890' : '•••• •••• •••• 7890'}
                </span>
                {isRevealed && (
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1C20C4] transition-all cursor-pointer active:scale-90"
                    title="Salin Nomor Kartu"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Expiry date */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                  <Calendar className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-[13.5px] font-medium text-[#1A1D26]">
                  Expiry date
                </span>
              </div>
              <span className="font-mono text-[13.5px] font-semibold text-gray-800">
                11/29
              </span>
            </div>

            {/* Row 3: CVV (3-digit security code) */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[13.5px] font-medium text-[#1A1D26] block">
                    CVV (3-digit security code)
                  </span>
                  {isRevealed && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Kode dinamis berganti dalam {cvvTimer}s
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-[13.5px] font-bold ${
                    isRevealed ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md' : 'text-gray-800'
                  }`}
                >
                  {isRevealed ? '832' : '•••'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: LINKED POCKETS (KANTONG TERHUBUNG) - Bank Jago File 2 Style */}
        <section className="mt-8">
          <h2 className="text-[15.5px] font-bold text-[#1A1D26] tracking-tight mb-3">
            Linked Pockets
          </h2>

          <div className="space-y-3">
            {/* 1. Rupiah Pocket Box */}
            <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                  Rupiah Pocket
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                    <Wallet className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-bold text-[#1A1D26] leading-snug">
                      Ala Dompet Utama
                    </h3>
                    <p className="text-[12.5px] font-medium text-gray-500">
                      Rp{alaDompet.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPocketMenu((prev) => !prev)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
                  aria-label="Opsi Kantong"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Pocket Quick Menu Popup */}
              {showPocketMenu && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-bold text-[#1C20C4]">
                  <Link href="/pocket" className="hover:underline">
                    Ganti Kantong Terhubung →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowPocketMenu(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>

            {/* 2. Foreign Currencies Box */}
            <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                  Foreign Currencies
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  0% FX Markup
                </span>
              </div>

              {/* Active SAR Pocket Item */}
              <div className="flex items-center justify-between py-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#064E3B]">
                    <Coins className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[13.5px] font-bold text-[#1A1D26] leading-snug">
                        Haramain Wallet (SAR)
                      </h3>
                      <span className="text-[9px] font-black px-1.5 py-0.2 bg-[#064E3B] text-white rounded">
                        MADA
                      </span>
                    </div>
                    <p className="text-[12.5px] font-medium text-gray-500">
                      SAR {dompetSar.toFixed(2)}
                      <span className="text-gray-400 text-[11px] ml-1">
                        (≈ Rp{Math.round(dompetSar * 4200).toLocaleString('id-ID')})
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startTransition('/ala-haramain')
                  }}
                  className="text-[11.5px] font-bold text-[#064E3B] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95"
                >
                  Kelola
                </button>
              </div>

              {/* Bank Jago Style: Add Another Currency Pockets Button */}
              <button
                type="button"
                onClick={() => {
                  startTransition('/ala-haramain')
                }}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/60 hover:bg-purple-50 text-[#6D28D9] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Kantong Mata Uang Asing (SAR)</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: BIOMETRIC CONFIRMATION MODAL                                    */}
      {/* ========================================================================= */}
      {showBiometricModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[320px] bg-white rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#1C20C4]/10 text-[#1C20C4] flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h3 className="text-[17px] font-extrabold text-[#1A1D26] tracking-tight">
              Autentikasi Biometrik
            </h3>
            <p className="text-[12.5px] text-gray-500 mt-1 mb-6 leading-relaxed">
              Gunakan Face ID atau Sidik Jari untuk membuka nomor kartu lengkap dan kode CVV rahasia.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowBiometricModal(false)}
                className="flex-1 h-11 rounded-xl border border-gray-200 font-bold text-[13px] text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBiometricConfirm}
                className="flex-1 h-11 rounded-xl bg-[#1C20C4] hover:bg-[#151AA8] text-white font-extrabold text-[13px] shadow-md shadow-[#1C20C4]/30 active:scale-95 transition-all cursor-pointer"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RIWAYAT TRANSAKSI BOTTOM SHEET                                  */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                  Riwayat Transaksi Kartu
                </h3>
                <p className="text-[11px] text-gray-500">
                  Transaksi belanja kartu Visa Aladin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl my-3">
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'online', label: 'Online' },
                { id: 'saudi', label: 'Saudi SAR' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-white text-[#1C20C4] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Transaction List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pr-1">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1A1D26]">
                      {tx.merchant}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{tx.date}</p>
                    <span className="text-[10px] text-gray-400">{tx.note}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[13.5px] font-extrabold text-[#1A1D26] block">
                      {tx.idr}
                    </span>
                    {tx.category === 'saudi' && (
                      <span className="text-[10.5px] font-bold text-emerald-600 block">
                        {tx.amount}
                      </span>
                    )}
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PENGATURAN KARTU BOTTOM SHEET                                   */}
      {/* ========================================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                  Pengaturan Kartu
                </h3>
                <p className="text-[11px] text-gray-500">
                  Kontrol keamanan dan batas transaksi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Limit Slider */}
            <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">
                  Batas Harian Transaksi
                </span>
                <span className="text-[14px] font-black text-[#1C20C4]">
                  Rp{dailyLimit.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={25000000}
                step={1000000}
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-[#1C20C4] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-1">
                <span>Min Rp1.000.000</span>
                <span>Maks Rp25.000.000</span>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="mt-4 divide-y divide-gray-100">
              {/* Toggle 1: Online */}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">
                    Transaksi Online & E-Commerce
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Belanja merchant digital (Spotify, Netflix, Marketplace)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOnlineEnabled(!onlineEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    onlineEnabled ? 'bg-[#1C20C4]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                      onlineEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Overseas */}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">
                    Transaksi Luar Negeri (SAR & Global)
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Bebas markup di mesin POS Makkah, Madinah & Internasional
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOverseasEnabled(!overseasEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    overseasEnabled ? 'bg-[#1C20C4]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                      overseasEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Contactless */}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">
                    Pembayaran Tap Contactless
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    NFC tap tanpa memasukkan kartu ke mesin EDC
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setContactlessEnabled(!contactlessEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    contactlessEnabled ? 'bg-[#1C20C4]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                      contactlessEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => {
                setShowSettingsModal(false)
                triggerReaction('success', 'Pengaturan kartu berhasil disimpan!')
              }}
              className="w-full mt-5 py-3 rounded-xl bg-[#1C20C4] hover:bg-[#151AA8] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1C20C4]/20"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HELP / FAQ MODAL                                                */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                Bantuan Kartu Visa Aladin
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 my-4 text-[12px] text-gray-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#1A1D26] mb-0.5">
                  Apa itu CVV Dinamis?
                </h4>
                <p>
                  Untuk keamanan transaksi online, kode CVV 3-digit diperbarui berkala sehingga aman dari pencurian data online.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#1A1D26] mb-0.5">
                  Bebas Markup Luar Negeri
                </h4>
                <p>
                  Belanja di Arab Saudi menggunakan kurs resmi BI tanpa biaya tersembunyi (0% foreign exchange markup).
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#1A1D26] mb-0.5">
                  Bagaimana jika kartu hilang?
                </h4>
                <p>
                  Segera tekan tombol &ldquo;Kunci Kartu&rdquo; di halaman ini untuk membekukan kartu seketika.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12.5px] cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
