'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, convertIdrToSar, paySaudiMerchant, depositAlaDompet } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import DigitalVerticalCard from '@/components/card/DigitalVerticalCard'
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Wifi,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  X,
  Check,
  ArrowRightLeft,
  QrCode,
  MapPin,
  Utensils,
  BookOpen,
  Info,
  ChevronRight,
  PhoneCall,
  Clock,
  Compass,
  Radio,
  Lock,
  Unlock,
  Settings,
  Copy,
  MoreHorizontal,
  Wallet,
  Coins,
  Calendar,
} from 'lucide-react'

export default function AlaHaramainHubPage() {
  const { alaDompet, dompetSar } = useBankState()
  const { triggerReaction, showLoader, hideLoader } = useMascot()

  // Sub-Feature Hub State: 'wallet' (Haramain Wallet) vs 'pilgrims' (Ala Pilgrims Store & Services)
  const [activeSubFeature, setActiveSubFeature] = useState<'wallet' | 'pilgrims'>('wallet')

  // First-time Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1)
  const [passportNum, setPassportNum] = useState('C9821402')
  const [visaNum, setVisaNum] = useState('2026-SA-88192')
  const [userName, setUserName] = useState('Dewan Juri IMOTION 2026')

  // Gated Status from LocalStorage
  const [phoneActive, setPhoneActive] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('+966 54 819 2841')
  const [walletActive, setWalletActive] = useState(true)
  const [cardLinked, setCardLinked] = useState(false)

  // 1 Physical Dual-Sided Hybrid Card State (Front = IDR, Back = SAR)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  // Digital Card Security & Modals
  const [isCardLocked, setIsCardLocked] = useState(false)
  const [copiedCard, setCopiedCard] = useState(false)
  const [copiedIban, setCopiedIban] = useState(false)
  const [showSarHistoryModal, setShowSarHistoryModal] = useState(false)
  const [showSarSettingsModal, setShowSarSettingsModal] = useState(false)
  const [sarDailyLimit, setSarDailyLimit] = useState(3000)

  // Modals for Wallet
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [convertAmountIdr, setConvertAmountIdr] = useState('1.000.000')
  const [sarExchangeRate] = useState(4220)

  const [showNfcModal, setShowNfcModal] = useState(false)
  const [nfcTapping, setNfcTapping] = useState(false)
  const [nfcSuccess, setNfcSuccess] = useState(false)

  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpNominal, setTopUpNominal] = useState('500.000')

  const [selectedMerchant, setSelectedMerchant] = useState<{
    name: string
    category: string
    sar: number
    location: string
  } | null>(null)
  const [showPinModal, setShowPinModal] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Modals & States for Ala Pilgrims Store
  const [selectedEsim, setSelectedEsim] = useState<{
    provider: string
    name: string
    quota: string
    validity: string
    sar: number
  } | null>(null)
  const [showEsimModal, setShowEsimModal] = useState(false)
  const [esimPurchased, setEsimPurchased] = useState(false)

  const [selectedRental, setSelectedRental] = useState<{
    name: string
    type: string
    sar: number
    desc: string
  } | null>(null)
  const [showRentalModal, setShowRentalModal] = useState(false)

  const [selectedPrayer, setSelectedPrayer] = useState<{
    title: string
    sub: string
    arabic: string
    latin: string
    meaning: string
  } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPhone = localStorage.getItem('aladin_haramain_phone_active')
      const storedPhoneNum = localStorage.getItem('aladin_haramain_phone_number')
      const storedWallet = localStorage.getItem('aladin_haramain_wallet_active')
      const storedCard = localStorage.getItem('aladin_haramain_card_linked')

      if (storedPhone === 'true') setPhoneActive(true)
      if (storedPhoneNum) setPhoneNumber(storedPhoneNum)
      if (storedWallet === 'true') setWalletActive(true)
      if (storedCard === 'true') setCardLinked(true)
    }
  }, [])

  const handleFinishOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aladin_haramain_onboarded', 'true')
      localStorage.setItem('aladin_haramain_phone_active', 'true')
      localStorage.setItem('aladin_haramain_wallet_active', 'true')
    }
    setPhoneActive(true)
    setWalletActive(true)
    setShowOnboarding(false)
    setSuccessToast('Aktivasi Haramain Wallet Sukses! Kartu D360 Saudi siap digunakan.')
    setTimeout(() => setSuccessToast(null), 4000)
  }

  // SAR Conversion Calculation
  const idrNum = parseInt(convertAmountIdr.replace(/\D/g, '') || '0', 10)
  const sarEstimate = (idrNum / sarExchangeRate).toFixed(2)

  const handleExecuteConvert = () => {
    setShowConvertModal(false)
    showLoader('Mengonversi Saldo ke Riyal Saudi (SAR)...')
    setTimeout(() => {
      const res = convertIdrToSar({
        fundingSource: 'ala_dompet',
        idrAmount: idrNum,
        sarRate: sarExchangeRate,
      })
      hideLoader()

      if (!res.success) {
        triggerReaction('shake-warning', res.error || 'Saldo IDR tidak mencukupi')
        return
      }

      triggerReaction('success', `Konversi Rp${idrNum.toLocaleString('id-ID')} ke SAR ${sarEstimate} sukses!`)
      setSuccessToast(`Konversi Rp${idrNum.toLocaleString('id-ID')} berhasil. Saldo +SAR ${sarEstimate} siap digunakan di Saudi!`)
      setTimeout(() => setSuccessToast(null), 3500)
    }, 700)
  }

  const handleTapNfc = () => {
    setNfcTapping(true)
    setTimeout(() => {
      const res = paySaudiMerchant({
        merchantName: 'Al Baik Express Ajyad',
        terminalId: 'D360-NFC #AL-9842',
        amountSar: 35.0,
        method: 'nfc',
      })
      setNfcTapping(false)

      if (!res.success) {
        triggerReaction('shake-warning', res.error || 'Saldo SAR tidak mencukupi')
        return
      }

      setNfcSuccess(true)
      triggerReaction('success', 'NFC Payment Sukses di Mesin EDC Kasir Al Baik!')
      setTimeout(() => {
        setShowNfcModal(false)
        setNfcSuccess(false)
      }, 1600)
    }, 900)
  }

  const handleTopUpIdr = () => {
    const nominal = parseInt(topUpNominal.replace(/\D/g, '') || '0', 10)
    if (nominal <= 0) return
    depositAlaDompet(nominal)
    setShowTopUpModal(false)
    triggerReaction('success', `Top up Rp${nominal.toLocaleString('id-ID')} berhasil!`)
    setSuccessToast(`Saldo Ala Dompet bertambah Rp${nominal.toLocaleString('id-ID')}`)
    setTimeout(() => setSuccessToast(null), 3000)
  }

  const handlePayMerchant = () => {
    if (!selectedMerchant) return
    const res = paySaudiMerchant({
      merchantName: selectedMerchant.name,
      terminalId: 'POS-HARAMAIN',
      amountSar: selectedMerchant.sar,
      method: 'card',
    })

    if (!res.success) {
      alert(res.error || 'Saldo SAR tidak mencukupi')
      return
    }

    setShowPinModal(false)
    triggerReaction('success', `Pembayaran SAR ${selectedMerchant.sar.toFixed(2)} ke ${selectedMerchant.name} berhasil!`)
    setSuccessToast(`Pembayaran SAR ${selectedMerchant.sar.toFixed(2)} ke ${selectedMerchant.name} berhasil!`)
    setSelectedMerchant(null)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  const handleBuyEsim = () => {
    if (!selectedEsim) return
    showLoader('Mengaktifkan Profil eSIM Saudi 5G...')
    setTimeout(() => {
      hideLoader()
      setEsimPurchased(true)
      triggerReaction('success', `eSIM ${selectedEsim.provider} 5G aktif dengan kuota ${selectedEsim.quota}!`)
      setSuccessToast(`eSIM ${selectedEsim.provider} berhasil diinstal dan terhubung ke jaringan 5G Saudi!`)
      setTimeout(() => setSuccessToast(null), 3500)
    }, 800)
  }

  const handleBookRental = () => {
    if (!selectedRental) return
    setShowRentalModal(false)
    triggerReaction('success', `Reservasi ${selectedRental.name} berhasil! Ambil di Counter Ajyad.`)
    setSuccessToast(`Reservasi ${selectedRental.name} terkonfirmasi. Tunjukkan QR Aladin di counter pintu King Abdulaziz.`)
    setSelectedRental(null)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-clip relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Unified Seamless White Header (No Notch Gap) */}
      <header className="shrink-0 w-full bg-white border-b border-gray-100 z-30">
        <StatusBar />
        <div className="h-14 px-4 flex items-center justify-between">
          <Link
            href="/beranda"
            data-back="true"
            className="w-9 h-9 -ml-1 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>

          <div className="text-center">
            <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
              Ala Haramain
            </h1>
            <span className="text-[10px] font-extrabold text-[#059669] block leading-none mt-0.5">
              Saudi Financial &amp; Pilgrim Hub
            </span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
            <span className="text-[10px] font-black uppercase text-[#064E3B]">
              D360 / SAMA
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {/* Toast Notification */}
        {successToast && (
          <div className="p-3.5 bg-[#064E3B] text-white rounded-2xl text-[12px] font-bold shadow-lg animate-in fade-in duration-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00F0A0] shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2 SUB-FEATURE INTERACTIVE PORTAL CARDS (NOT GENERIC TABS)                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-3">
          {/* Sub-Feature Card 1: Haramain Wallet */}
          <button
            type="button"
            onClick={() => setActiveSubFeature('wallet')}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeSubFeature === 'wallet'
                ? 'bg-gradient-to-br from-[#081D48] via-[#1037A6] to-[#1E40AF] text-white border-[#1037A6] shadow-lg ring-2 ring-[#00F0A0]'
                : 'bg-white text-[#1A1D26] border-[#ECEEF2] hover:border-gray-300 shadow-xs'
            }`}
            style={{ minHeight: '115px' }}
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeSubFeature === 'wallet' ? 'bg-white/20 text-[#00F0A0]' : 'bg-[#EEF2FF] text-[#1037A6]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeSubFeature === 'wallet' ? 'bg-[#00F0A0] text-[#064E3B]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Multi-Currency
              </span>
            </div>

            <div>
              <h3 className="text-[14px] font-black leading-tight">Haramain Wallet</h3>
              <p
                className={`text-[10.5px] mt-1 leading-tight line-clamp-2 ${
                  activeSubFeature === 'wallet' ? 'text-white/85' : 'text-gray-500'
                }`}
              >
                Kartu Hybrid IDR &amp; SAR, Konversi Kurs &amp; Tap NFC Kasir
              </p>
            </div>
          </button>

          {/* Sub-Feature Card 2: Ala Pilgrims Store */}
          <button
            type="button"
            onClick={() => setActiveSubFeature('pilgrims')}
            className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeSubFeature === 'pilgrims'
                ? 'bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#059669] text-white border-[#064E3B] shadow-lg ring-2 ring-[#00F0A0]'
                : 'bg-white text-[#1A1D26] border-[#ECEEF2] hover:border-gray-300 shadow-xs'
            }`}
            style={{ minHeight: '115px' }}
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  activeSubFeature === 'pilgrims' ? 'bg-white/20 text-[#00F0A0]' : 'bg-emerald-50 text-[#064E3B]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeSubFeature === 'pilgrims' ? 'bg-[#00F0A0] text-[#064E3B]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Store &amp; Layanan
              </span>
            </div>

            <div>
              <h3 className="text-[14px] font-black leading-tight">Ala Pilgrims</h3>
              <p
                className={`text-[10.5px] mt-1 leading-tight line-clamp-2 ${
                  activeSubFeature === 'pilgrims' ? 'text-white/85' : 'text-gray-500'
                }`}
              >
                eSIM Roaming 5G, Sewa Skuter Tawaf &amp; Panduan Doa
              </p>
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SUB-FEATURE VIEW 1: HARAMAIN WALLET (CARDS, SAR BALANCE & PAYMENTS)       */}
        {/* ========================================================================= */}
        {activeSubFeature === 'wallet' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* ========================================================================= */}
            {/* DIGITAL VERTICAL DUAL CARD SYSTEM (BANK JAGO 1:1 REDESIGN)               */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
              {/* Card Switcher Pills (Centered without Sisi Indo/Saudi flip button) */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl shadow-inner">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className={`py-1.5 px-4 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer ${
                      !isFlipped
                        ? 'bg-[#1037A6] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Kartu Indo (IDR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className={`py-1.5 px-4 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer ${
                      isFlipped
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Kartu Saudi (SAR)
                  </button>
                </div>
              </div>

              {/* Hero Vertical Card */}
              <div className="flex flex-col items-center justify-center py-2">
                <DigitalVerticalCard
                  cardType={isFlipped ? 'd360-sar' : 'aladin-idr'}
                  cardNickname={isFlipped ? 'D360 Saudi Riyal Card (Mada)' : 'Ala Dompet Indo'}
                  isLocked={isCardLocked}
                  cardNumberMasked={
                    showCardNumber
                      ? isFlipped
                        ? '9660 5481 9284 2841'
                        : '4000 1234 5678 9010'
                      : isFlipped
                      ? '•••• 2841'
                      : '•••• 9010'
                  }
                  cardHolderName={userName}
                  expiryDate={isFlipped ? '11/30' : '11/29'}
                  notchBg="#FFFFFF"
                  onClick={() => setIsFlipped((prev) => !prev)}
                />
              </div>

              {/* 3 Circular Action Buttons (Bank Jago File 1 & 2 Exact Match) */}
              <div className="grid grid-cols-3 gap-3 my-5 max-w-[300px] mx-auto">
                {/* 1. Kunci Kartu */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !isCardLocked
                    setIsCardLocked(next)
                    if (next) {
                      triggerReaction('lock-action', 'Kartu berhasil dikunci demi keamanan.')
                    } else {
                      triggerReaction('success', 'Kunci kartu berhasil dibuka!')
                    }
                  }}
                  className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                >
                  <div
                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all shadow-xs ${
                      isCardLocked
                        ? 'bg-red-500 text-white'
                        : isFlipped
                        ? 'bg-emerald-100 text-[#064E3B] group-hover:bg-emerald-200'
                        : 'bg-blue-50 text-[#1037A6] group-hover:bg-blue-100'
                    }`}
                  >
                    {isCardLocked ? (
                      <Unlock className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <Lock className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>
                  <span className="text-[12px] font-bold text-[#1A1D26] mt-2 text-center leading-tight">
                    {isCardLocked ? 'Buka Kunci' : 'Kunci Kartu'}
                  </span>
                </button>

                {/* 2. Riwayat */}
                <button
                  type="button"
                  onClick={() => setShowSarHistoryModal(true)}
                  className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                >
                  <div
                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all shadow-xs ${
                      isFlipped
                        ? 'bg-emerald-100 text-[#064E3B] group-hover:bg-emerald-200'
                        : 'bg-blue-50 text-[#1037A6] group-hover:bg-blue-100'
                    }`}
                  >
                    <Clock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1A1D26] mt-2 text-center leading-tight">
                    Riwayat
                  </span>
                </button>

                {/* 3. Pengaturan */}
                <button
                  type="button"
                  onClick={() => setShowSarSettingsModal(true)}
                  className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                >
                  <div
                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all shadow-xs ${
                      isFlipped
                        ? 'bg-emerald-100 text-[#064E3B] group-hover:bg-emerald-200'
                        : 'bg-blue-50 text-[#1037A6] group-hover:bg-blue-100'
                    }`}
                  >
                    <Settings className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1A1D26] mt-2 text-center leading-tight">
                    Pengaturan
                  </span>
                </button>
              </div>

              {/* SECTION: INFORMASI KARTU (CARD INFORMATION) */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-[14.5px] font-bold text-[#1A1D26]">
                    Informasi Kartu {isFlipped ? '(Saudi SAR)' : '(Aladin IDR)'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !showCardNumber
                      setShowCardNumber(next)
                      if (next) triggerReaction('success', 'Nomor kartu & CVV berhasil ditampilkan!')
                    }}
                    className="text-[12.5px] font-bold text-[#1037A6] hover:underline cursor-pointer"
                  >
                    {showCardNumber ? 'Tutup Info' : 'Lihat Info'}
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Card No */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-700">
                        Card No
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-bold text-gray-900">
                        {showCardNumber
                          ? isFlipped
                            ? '9660 5481 9284 2841'
                            : '4000 1234 5678 9010'
                          : isFlipped
                          ? '•••• •••• •••• 2841'
                          : '•••• •••• •••• 9010'}
                      </span>
                      {showCardNumber && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText?.(
                              isFlipped ? '9660548192842841' : '4000123456789010'
                            )
                            setCopiedCard(true)
                            triggerReaction('copy-success', 'Nomor kartu disalin!')
                            setTimeout(() => setCopiedCard(false), 2000)
                          }}
                          className="p-1 rounded text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-700">
                        Expiry date
                      </span>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-gray-900">
                      {isFlipped ? '11/30' : '11/29'}
                    </span>
                  </div>

                  {/* CVV */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-700">
                        CVV (3-digit security code)
                      </span>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-gray-900">
                      {showCardNumber ? '832' : '•••'}
                    </span>
                  </div>

                  {/* Saudi Virtual IBAN (when Saudi card is viewed) */}
                  {isFlipped && (
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[13px] font-medium text-gray-700 block">
                            Virtual IBAN Saudi (D360)
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            Untuk transfer lokal di Arab Saudi
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[12px] font-bold text-gray-800">
                          SA03 •••• 1234
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText?.('SA0380000000608010101234')
                            setCopiedIban(true)
                            triggerReaction('copy-success', 'Virtual IBAN disalin!')
                            setTimeout(() => setCopiedIban(false), 2000)
                          }}
                          className="p-1 rounded text-gray-500 hover:text-emerald-700 cursor-pointer"
                        >
                          {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: LINKED POCKETS (KANTONG TERHUBUNG) */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h3 className="text-[14.5px] font-bold text-[#1A1D26] mb-3">
                  Linked Pockets
                </h3>

                <div className="space-y-3">
                  {/* Rupiah Pocket Box */}
                  <div className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1C20C4] flex items-center justify-center">
                        <Wallet className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                          Rupiah Pocket
                        </span>
                        <h4 className="text-[13.5px] font-bold text-[#1A1D26]">
                          Ala Dompet Utama
                        </h4>
                        <p className="text-[12px] font-semibold text-gray-600">
                          Rp{alaDompet.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowConvertModal(true)}
                      className="py-1.5 px-3 bg-[#1C20C4] hover:bg-[#151AA8] text-white text-[11.5px] font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs"
                    >
                      Convert ke SAR
                    </button>
                  </div>

                  {/* Redesigned Multi-Currency Card: Foreign Currencies (Saudi Riyal) */}
                  <div className="p-4 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 shadow-xs relative overflow-hidden">
                    {/* Header Row: Flags, Tag & 0% Fee Badge */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-extrabold text-[12px] shadow-xs">
                          SAR
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-black text-[#064E3B]">
                              Saudi Riyal (SAR)
                            </span>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-100 text-[#064E3B] rounded-full border border-emerald-200">
                              0% Markup
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">
                            Kurs Real-Time: 1 SAR ≈ Rp{sarExchangeRate.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          Status Dompet
                        </span>
                        <span className="text-[11px] font-extrabold text-[#059669]">
                          Aktif (Mada POS)
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Big SAR Balance & IDR Equivalent */}
                    <div className="flex items-end justify-between py-1">
                      <div>
                        <span className="text-[10.5px] font-bold text-gray-500 block uppercase tracking-wider">
                          Saldo Tersedia
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-[14px] font-black text-[#064E3B]">SAR</span>
                          <span className="text-[24px] font-black text-[#1A1D26] font-mono tracking-tight">
                            {dompetSar.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[11.5px] font-bold text-gray-400">
                          ≈ Rp{Math.round(dompetSar * sarExchangeRate).toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowConvertModal(true)}
                          className="py-2 px-3 bg-white border border-emerald-300 hover:bg-emerald-50 text-[#064E3B] text-[11px] font-extrabold rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Tukar IDR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTopUpModal(true)}
                          className="py-2 px-3.5 bg-[#064E3B] hover:bg-[#047857] text-white text-[11px] font-extrabold rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs"
                        >
                          + Top Up SAR
                        </button>
                      </div>
                    </div>

                    {/* Bottom Micro Footer: Tap NFC Support */}
                    <div className="mt-2.5 pt-2 border-t border-emerald-100/70 flex items-center justify-between text-[10.5px] text-gray-500 font-semibold">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <Radio className="w-3 h-3 text-[#059669]" />
                        Mendukung Pembayaran Tap NFC Mada &amp; Al Baik
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowNfcModal(true)}
                        className="text-[#064E3B] font-extrabold hover:underline cursor-pointer"
                      >
                        Buka NFC →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* METODE PEMBAYARAN DI SAUDI */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
                PILIHAN METODE BAYAR DI TANAH SUCI
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setShowNfcModal(true)}
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-all active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
                    <Radio className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#1A1D26] block">
                    Tap NFC Kasir
                  </span>
                  <span className="text-[10.5px] text-[#059669] font-bold block mt-0.5">
                    Default • Instan di EDC
                  </span>
                </div>

                <Link
                  href="/ala-haramain/kartu-fisik"
                  className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all active:scale-98 block"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#081D48] text-white flex items-center justify-center mb-2 shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-extrabold text-[#1A1D26] block">
                    Kartu Fisik
                  </span>
                  <span className="text-[10.5px] text-gray-500 font-bold block mt-0.5">
                    {cardLinked ? 'Tertaut Aktif' : 'Ambil di Booth Bandara'}
                  </span>
                </Link>
              </div>
            </div>

            {/* MERCHANT REKOMENDASI MAKKAH & MADINAH */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    MERCHANT RESMI SAUDI
                  </span>
                  <h3 className="text-[14px] font-extrabold text-[#1A1D26]">
                    Sekitar Masjidil Haram &amp; Nabawi
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#059669]">Langsung SAR</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Al Baik Restaurant Ajyad', category: 'Kuliner Halal', sar: 32.0, location: '150m dari Haram' },
                  { name: 'Nahdi Pharmacy Clock Tower', category: 'Farmasi & Medis', sar: 45.5, location: 'Abraj Al Bait Lt. 2' },
                  { name: 'Bin Dawood Supermarket Misfalah', category: 'Oleh-Oleh & Kurma', sar: 68.0, location: 'Depan Hotel Jemaah' },
                  { name: 'Jarir Bookstore Madinah', category: 'Kitab & Mushaf', sar: 50.0, location: '300m dari Nabawi' },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#ECEEF2] hover:border-gray-300 transition-colors"
                  >
                    <div className="pr-3 flex-1">
                      <h4 className="text-[13.5px] font-extrabold text-[#1A1D26]">{m.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{m.location} • {m.category}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMerchant(m)
                        setShowPinModal(true)
                      }}
                      className="px-4 py-2 rounded-full bg-[#064E3B] text-white text-[12px] font-extrabold hover:bg-emerald-800 cursor-pointer active:scale-95 transition-all shrink-0 shadow-xs"
                    >
                      Bayar SAR {m.sar.toFixed(2)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-FEATURE VIEW 2: ALA PILGRIMS (STORE, ESIM, RENTAL & PRAYER GUIDE)     */}
        {/* ========================================================================= */}
        {activeSubFeature === 'pilgrims' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Promo Header Banner */}
            <div className="bg-gradient-to-br from-[#064E3B] to-[#0D6852] rounded-2xl p-4 text-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-[#00F0A0] border border-white/20">
                  Layanan Khusus Jamaah
                </span>
                <span className="text-[11px] text-emerald-200 font-bold">100% Resmi</span>
              </div>
              <h3 className="text-[16px] font-black">Kebutuhan Ibadah di Tanah Suci</h3>
              <p className="text-[11.5px] text-white/85 mt-1 leading-relaxed">
                Pesan paket data roaming eSIM Saudi 5G tanpa ganti kartu fisik, sewa skuter tawaf lantai 3, dan akses panduan manasik audio offline.
              </p>
            </div>

            {/* Section 1: eSIM Saudi 5G (Roaming Langsung Aktif) */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    PAKET DATA SAUDI 5G (ROAMING)
                  </span>
                  <h3 className="text-[14.5px] font-black text-[#1A1D26]">eSIM Jamaah Haji &amp; Umrah</h3>
                </div>
                <div className="flex items-center gap-1 text-[#059669] font-bold text-[11px]">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Langsung Aktif</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    provider: 'STC Sawa Ziyarah 5G',
                    name: 'Paket Hemat Ziyarah',
                    quota: '10 GB Data 5G + 100 Menit Nelpon',
                    validity: 'Masa Aktif 15 Hari',
                    sar: 55,
                    popular: false,
                  },
                  {
                    provider: 'Mobily Umrah & Hajj Pass',
                    name: 'Paket Populer Jamaah',
                    quota: '20 GB Data + Bebas Kuota WhatsApp & Maps',
                    validity: 'Masa Aktif 30 Hari',
                    sar: 85,
                    popular: true,
                  },
                  {
                    provider: 'Zain Saudi Pilgrim Ultimate',
                    name: 'Paket Unlimited Sebulan',
                    quota: 'Unlimited Data 5G + 150 Menit Domestik',
                    validity: 'Masa Aktif 30 Hari',
                    sar: 120,
                    popular: false,
                  },
                ].map((pkg) => (
                  <div
                    key={pkg.provider}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      pkg.popular
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : 'border-[#ECEEF2] bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-black text-[#1A1D26]">
                            {pkg.provider}
                          </span>
                          {pkg.popular && (
                            <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                              Pilihan Utama
                            </span>
                          )}
                        </div>
                        <p className="text-[11.5px] font-bold text-gray-700 mt-0.5">
                          {pkg.quota}
                        </p>
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          {pkg.validity}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[15px] font-black text-[#064E3B] block">
                          SAR {pkg.sar}
                        </span>
                        <span className="text-[9.5px] text-gray-500 font-medium block">
                          ≈ Rp{Math.round(pkg.sar * sarExchangeRate).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[10.5px] text-gray-500 flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-gray-500" />
                        Instal via Scan QR
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEsim(pkg)
                          setShowEsimModal(true)
                          setEsimPurchased(false)
                        }}
                        className="py-1.5 px-3.5 rounded-full bg-[#064E3B] text-white text-[11.5px] font-black hover:bg-emerald-800 active:scale-95 transition-all shadow-xs"
                      >
                        Beli &amp; Pasang eSIM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Sewa Skuter Listrik & Kursi Roda Tawaf */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    FASILITAS MASJIDIL HARAM
                  </span>
                  <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                    Sewa Skuter Tawaf &amp; Kursi Roda
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#1037A6]">Lantai 3 Mezzanine</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Skuter Listrik Tunggal (1 Orang)',
                    type: 'Self-Drive',
                    sar: 57.5,
                    desc: 'Jalur khusus skuter ber-AC lantai 3 untuk Tawaf & Sa’i mandiri dengan kontrol pedal mudah.',
                  },
                  {
                    name: 'Skuter Listrik Ganda (2 Orang)',
                    type: 'Keluarga / Berdua',
                    sar: 115.0,
                    desc: 'Kapasitas 2 orang dewasa untuk melaksanakan Tawaf & Sa’i bersama pasangan atau orang tua.',
                  },
                  {
                    name: 'Jasa Pendorong Kursi Roda Resmi',
                    type: 'Petugas Berizin Resmi',
                    sar: 150.0,
                    desc: 'Dipandu petugas resmi berrompi khusus Masjidil Haram untuk seluruh putaran Tawaf & Sa’i.',
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#ECEEF2] flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-3">
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[#1037A6] uppercase tracking-wider inline-block mb-1">
                          {item.type}
                        </span>
                        <h4 className="text-[13.5px] font-black text-[#1A1D26]">{item.name}</h4>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[15px] font-black text-[#064E3B] block">
                          SAR {item.sar.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-gray-500 block">
                          ≈ Rp{Math.round(item.sar * sarExchangeRate).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        Ambil di Gate King Abdulaziz
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRental(item)
                          setShowRentalModal(true)
                        }}
                        className="py-1.5 px-3 rounded-full bg-[#1037A6] text-white text-[11.5px] font-extrabold hover:bg-blue-800 active:scale-95 transition-all shadow-xs"
                      >
                        Pesan Layanan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Direktori Resto Cita Rasa Nusantara di Makkah & Madinah */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    KULINER NUSANTARA &amp; HALAL
                  </span>
                  <h3 className="text-[14.5px] font-black text-[#1A1D26]">Resto Favorit Jamaah</h3>
                </div>
                <div className="flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Halal 100%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    name: 'Rumah Makan Garuda Makkah',
                    menu: 'Nasi Padang Rendang, Gulai Tunjang, Sambal Hijau',
                    dist: '150m dari Masjidil Haram (Ajyad)',
                    tag: 'Cita Rasa Minang',
                  },
                  {
                    name: "D'Penyetz Clock Tower Makkah",
                    menu: 'Ayam Penyet Sambal Korek & Bakso Sapi Hangat',
                    dist: 'Abraj Al Bait Food Court Lantai 3',
                    tag: 'Menu Nusantara',
                  },
                  {
                    name: 'Al Baik Express Ajyad',
                    menu: 'Ayam Goreng Crispy Khas Saudi & Garlic Sauce Legendaris',
                    dist: 'Depan Tower Zamzam Makkah',
                    tag: 'Favorit Jamaah',
                  },
                  {
                    name: 'Resto Wong Solo Madinah',
                    menu: 'Ayam Bakar Madu, Nasi Ulam, Rawon & Es Teh Manis',
                    dist: '200m dari Pintu Utama Masjid Nabawi (Gate 333)',
                    tag: 'Cita Rasa Jawa',
                  },
                ].map((resto) => (
                  <div
                    key={resto.name}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#ECEEF2] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13px] font-black text-[#1A1D26]">{resto.name}</h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800">
                          {resto.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{resto.menu}</p>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {resto.dist}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Panduan Doa Digital & Manasik Offline */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    BIMBINGAN IBADAH
                  </span>
                  <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                    Panduan Doa Thawaf &amp; Sa&apos;i
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[#064E3B] font-bold text-[11px]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Akses Offline</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    title: 'Doa Thawaf Putaran 1-7',
                    sub: 'Teks Arab, Latin & Arti',
                    arabic: 'سُبْحَانَ اللهِ وَالحَمْدُ لِلهِ وَلَا إِلَهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ',
                    latin: 'Subhanallah walhamdulillah wala ilaha illallah wallahu akbar',
                    meaning: 'Maha Suci Allah, segala puji bagi Allah, tiada tuhan selain Allah, dan Allah Maha Besar.',
                  },
                  {
                    title: "Doa Sa'i Shafa-Marwah",
                    sub: '7 Putaran Lengkap',
                    arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ',
                    latin: "Innas-shafa wal-marwata min sya'a-irillah",
                    meaning: 'Sesungguhnya Shafa dan Marwah merupakan sebahagian daripada syiar-syiar Allah.',
                  },
                  {
                    title: 'Bacaan Talbiyah Haji & Umrah',
                    sub: 'Lafadz & Audio Manasik',
                    arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ',
                    latin: 'Labbaikallahumma labbaik, labbaika la syarika laka labbaik',
                    meaning: 'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu, tiada sekutu bagi-Mu.',
                  },
                  {
                    title: 'Doa Minum Air Zamzam',
                    sub: 'Khasiat & Adab Minum',
                    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
                    latin: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan wasi'an wa syifa'an min kulli da'in",
                    meaning: 'Ya Allah, sesungguhnya aku memohon ilmu yang bermanfaat, rezeki yang lapang, dan kesembuhan dari segala penyakit.',
                  },
                ].map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setSelectedPrayer(p)}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#ECEEF2] text-left hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-[12px] font-black text-[#1A1D26] leading-tight">{p.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{p.sub}</p>
                    </div>
                    <span className="text-[10.5px] font-black text-[#064E3B] mt-2 block">
                      Buka Teks Doa →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Official Partnership Endorsement */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#ECEEF2] text-center">
          <span className="text-[9.5px] font-black text-gray-400 uppercase tracking-wider block">
            Kemitraan Resmi Ekosistem Haji &amp; Umrah
          </span>
          <p className="text-[11px] font-bold text-gray-600 mt-0.5">
            D360 Bank Saudi • STC Saudi Telecom • SAMA • AMPHURI • Bank Aladin Syariah
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ONBOARDING AKTIVASI NOMOR SAUDI & WALLET                           */}
      {/* ========================================================================= */}
      {showOnboarding && (
        <div className="absolute inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#059669] uppercase tracking-wider block">
                  Aktivasi Perdana Jamaah
                </span>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Aktivasi Wallet Saudi Haramain
                </h3>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between mb-5">
              {[
                { step: 1, label: 'eSIM Saudi (+966)' },
                { step: 2, label: 'Data Paspor & Visa' },
                { step: 3, label: 'Wallet Siap' },
              ].map((s) => (
                <div key={s.step} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold mb-1 ${
                      onboardingStep >= s.step
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {onboardingStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
                  </div>
                  <span className="text-[9.5px] font-bold text-gray-500 text-center">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: eSIM Saudi */}
            {onboardingStep === 1 && (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-[10.5px] font-extrabold text-emerald-800 uppercase block mb-1">
                    Nomor Saudi Resmi Telah Disediakan
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[16px] font-black text-emerald-950">
                      +966 54 819 2841
                    </span>
                    <span className="text-[10px] font-black text-white bg-emerald-700 px-2 py-0.5 rounded-full">
                      STC 5G
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Paket Internet Jamaah 14 Hari (Unlimited Chatting WhatsApp &amp; Kuota Data 10GB).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="w-full h-12 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  Verifikasi Nomor &amp; Lanjut Langkah 2 →
                </button>
              </div>
            )}

            {/* Step 2: Data Paspor & Visa */}
            {onboardingStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    Nama Lengkap Sesuai Paspor:
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 font-bold text-[13px] bg-gray-50 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Nomor Paspor:
                    </label>
                    <input
                      type="text"
                      value={passportNum}
                      onChange={(e) => setPassportNum(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 font-mono font-bold text-[13px] bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Nomor Visa Umrah/Haji:
                    </label>
                    <input
                      type="text"
                      value={visaNum}
                      onChange={(e) => setVisaNum(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-300 font-mono font-bold text-[13px] bg-gray-50 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className="w-1/3 h-11 bg-gray-100 text-gray-700 rounded-full font-bold text-[13px]"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className="flex-1 h-11 bg-[#064E3B] text-white rounded-full font-extrabold text-[13px] shadow-md"
                  >
                    Terbitkan Wallet D360 →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Siap Digunakan */}
            {onboardingStep === 3 && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-[#064E3B]">
                  <CheckCircle2 className="w-8 h-8 text-[#064E3B]" />
                </div>
                <h4 className="text-[16px] font-black text-[#1A1D26]">
                  Wallet Saudi Siap Digunakan!
                </h4>
                <p className="text-[11.5px] text-gray-600 px-4">
                  Nomor STC 5G Anda dan rekening SAR D360 Bank telah terintegrasi dengan Bank Aladin Syariah.
                </p>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full h-12 bg-[#064E3B] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  Mulai Gunakan Ala Haramain
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TOP UP SALDO IDR                                                   */}
      {/* ========================================================================= */}
      {showTopUpModal && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Isi Saldo Ala Dompet (IDR)</h3>
                <p className="text-[11.5px] text-gray-500">Sumber dana utama untuk transaksi &amp; konversi ke SAR</p>
              </div>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-4">
              <span className="text-[11px] text-gray-500 block mb-1">Pilih Nominal Top Up:</span>
              <div className="grid grid-cols-3 gap-2">
                {['250.000', '500.000', '1.000.000', '2.000.000', '5.000.000'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setTopUpNominal(nom)}
                    className={`py-2 px-1 text-center rounded-xl font-bold text-[12px] border transition-all cursor-pointer ${
                      topUpNominal === nom
                        ? 'bg-[#1C20C4] text-white border-[#1C20C4]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Rp{nom}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTopUpIdr}
              className="w-full h-12 bg-[#1C20C4] hover:bg-[#151AA8] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Konfirmasi Top Up Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KONVERSI IDR KE SAR                                                */}
      {/* ========================================================================= */}
      {showConvertModal && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Tukar Saldo ke SAR</h3>
                <p className="text-[11.5px] text-gray-500">Kurs Transparan SAMA • 0% Markup Admin</p>
              </div>
              <button
                onClick={() => setShowConvertModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200">
                <span className="text-[10.5px] font-extrabold text-blue-900 block mb-1">
                  DARI: Rekening Ala Dompet (IDR)
                </span>
                <input
                  type="text"
                  value={convertAmountIdr}
                  onChange={(e) => setConvertAmountIdr(e.target.value)}
                  className="w-full font-black text-[22px] text-[#1A1D26] bg-transparent outline-none"
                  placeholder="Rp1.000.000"
                />
                <span className="text-[11px] text-gray-500">
                  Saldo tersedia: Rp{alaDompet.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500">
                  <ArrowRightLeft className="w-4 h-4 text-[#064E3B]" />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <span className="text-[10.5px] font-extrabold text-emerald-900 block mb-1">
                  MENJADI: Saldo Dompet Saudi (SAR)
                </span>
                <span className="font-black text-[22px] text-[#064E3B] block">
                  SAR {sarEstimate}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Kurs Real: 1 SAR = Rp{sarExchangeRate.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={handleExecuteConvert}
              className="w-full h-12 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Konfirmasi &amp; Tukar ke SAR Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NFC TAP SIMULATION                                                 */}
      {/* ========================================================================= */}
      {showNfcModal && (
        <div className="absolute inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div
            className="w-full max-w-sm bg-white rounded-3xl text-center shadow-2xl animate-in zoom-in-95 duration-200"
            style={{ boxSizing: 'border-box', padding: '24px 24px 32px 24px' }}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-[#064E3B]">
              <Radio className={`w-10 h-10 ${nfcTapping ? 'animate-bounce' : ''}`} />
            </div>

            <h3 className="text-[18px] font-extrabold text-[#1A1D26]">
              {nfcSuccess ? 'Transaksi Sukses!' : nfcTapping ? 'Mendekatkan ke Mesin EDC...' : 'Dekatkan ke Terminal Kasir'}
            </h3>
            <p className="text-[12px] text-gray-500 mt-1 mb-6">
              {nfcSuccess
                ? 'Pembayaran SAR 35.00 telah dipotong dari saldo dompet Saudi Anda.'
                : 'Posisikan bagian belakang smartphone ke logo Contactless EDC Al Baik.'}
            </p>

            {!nfcSuccess && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNfcModal(false)}
                  className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-full font-bold text-[13px]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleTapNfc}
                  disabled={nfcTapping}
                  className="flex-1 h-11 bg-[#064E3B] text-white rounded-full font-extrabold text-[13px] shadow-md"
                >
                  {nfcTapping ? 'Memproses...' : 'Simulasi Tap'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MERCHANT PAYMENT PIN / CONFIRMATION                                */}
      {/* ========================================================================= */}
      {showPinModal && selectedMerchant && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Konfirmasi Pembayaran</h3>
                <p className="text-[11.5px] text-gray-500">{selectedMerchant.name}</p>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-5 text-center">
              <span className="text-[11px] text-gray-500 block mb-1">Total Pembayaran Kasir:</span>
              <span className="text-[28px] font-black text-[#064E3B] block">
                SAR {selectedMerchant.sar.toFixed(2)}
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                ≈ Rp{Math.round(selectedMerchant.sar * sarExchangeRate).toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handlePayMerchant}
              className="w-full h-12 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Bayar Sekarang (Konfirmasi PIN Biometrik)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BELI & PASANG ESIM SAUDI 5G                                        */}
      {/* ========================================================================= */}
      {showEsimModal && selectedEsim && (
        <div className="absolute inset-0 z-[130] bg-black/70 backdrop-blur-md flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#059669] uppercase tracking-wider block">
                  Aktivasi Instan eSIM
                </span>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">{selectedEsim.provider}</h3>
              </div>
              <button
                onClick={() => setShowEsimModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!esimPurchased ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] font-black text-emerald-950">{selectedEsim.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                      {selectedEsim.validity}
                    </span>
                  </div>
                  <p className="text-[12.5px] font-bold text-gray-700">{selectedEsim.quota}</p>
                  <div className="mt-3 pt-2 border-t border-emerald-200 flex justify-between items-baseline">
                    <span className="text-[11px] text-gray-600">Total Harga:</span>
                    <div className="text-right">
                      <span className="text-[20px] font-black text-[#064E3B] block leading-none">
                        SAR {selectedEsim.sar}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        ≈ Rp{Math.round(selectedEsim.sar * sarExchangeRate).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-600 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Langsung terhubung ke jaringan 5G terkuat di Makkah, Madinah &amp; Jeddah.</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tidak perlu antre di counter bandara atau lepas SIM card fisik Indonesia.</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBuyEsim}
                  className="w-full h-12 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Beli &amp; Dapatkan QR Code eSIM</span>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl border-2 border-[#064E3B] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-gray-900 rounded-xl flex flex-col items-center justify-center text-white p-2">
                    <QrCode className="w-16 h-16 text-[#00F0A0]" />
                    <span className="text-[8px] font-mono mt-1 text-gray-300">LPA:1$sa.stc.com$K981</span>
                  </div>
                </div>

                <div className="px-4">
                  <h4 className="text-[15px] font-black text-[#1A1D26]">
                    Scan QR Code atau Buka Pengaturan Seluler
                  </h4>
                  <p className="text-[11.5px] text-gray-600 mt-1">
                    Buka <b>Pengaturan &gt; Seluler &gt; Tambah eSIM</b> di smartphone Anda, lalu scan QR di atas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEsimModal(false)}
                  className="w-full h-11 bg-[#064E3B] text-white rounded-full font-extrabold text-[13.5px] shadow-md cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SEWA SKUTER LISTRIK TAWAF / KURSI RODA                              */}
      {/* ========================================================================= */}
      {showRentalModal && selectedRental && (
        <div className="absolute inset-0 z-[130] bg-black/70 backdrop-blur-md flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#1037A6] uppercase tracking-wider block">
                  Reservasi Fasilitas Thawaf &amp; Sa&apos;i
                </span>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">{selectedRental.name}</h3>
              </div>
              <button
                onClick={() => setShowRentalModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 mb-4">
              <p className="text-[12px] text-gray-700 leading-relaxed mb-3">{selectedRental.desc}</p>
              <div className="flex justify-between items-baseline pt-2 border-t border-blue-200">
                <span className="text-[11px] font-bold text-gray-600">Tarif Resmi SAMA:</span>
                <div className="text-right">
                  <span className="text-[20px] font-black text-[#1037A6] block leading-none">
                    SAR {selectedRental.sar.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    ≈ Rp{Math.round(selectedRental.sar * sarExchangeRate).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-600 space-y-1 mb-5">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <b>Lokasi Pengambilan:</b> Mezzanine Lantai 3 Gate King Abdulaziz
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <b>Operasional:</b> Siap sedia 24 jam non-stop
              </p>
            </div>

            <button
              type="button"
              onClick={handleBookRental}
              className="w-full h-12 bg-[#1037A6] hover:bg-blue-900 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Konfirmasi Reservasi &amp; Ambil Nomor Antrean
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BACAAN PANDUAN DOA DIGITAL (OFFLINE)                                */}
      {/* ========================================================================= */}
      {selectedPrayer && (
        <div className="absolute inset-0 z-[130] bg-black/70 backdrop-blur-md flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#064E3B] uppercase tracking-wider block">
                  Panduan Ibadah Digital
                </span>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">{selectedPrayer.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPrayer(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Arabic Box */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-right">
                <span className="text-[22px] font-serif font-black text-[#064E3B] leading-loose block">
                  {selectedPrayer.arabic}
                </span>
              </div>

              {/* Latin Box */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Transliterasi Latin:
                </span>
                <p className="text-[13px] font-medium text-gray-800 italic leading-relaxed">
                  &ldquo;{selectedPrayer.latin}&rdquo;
                </p>
              </div>

              {/* Meaning Box */}
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Arti Terjemahan:
                </span>
                <p className="text-[12.5px] text-gray-700 leading-relaxed">
                  {selectedPrayer.meaning}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPrayer(null)}
                className="w-full h-11 bg-[#064E3B] text-white rounded-full font-extrabold text-[13px] shadow-md cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RIWAYAT TRANSAKSI KARTU HARAMAIN & IDR (JAGO STYLE)               */}
      {/* ========================================================================= */}
      {showSarHistoryModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                  Riwayat Transaksi Kartu
                </h3>
                <p className="text-[11px] text-gray-500">
                  Transaksi belanja Makkah, Madinah &amp; Online
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSarHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 py-2">
              {[
                { name: 'Al Baik Restaurant Makkah', date: '06 Nov 2026 • 21:14', sar: 'SAR 42.50', idr: 'Rp178.500', note: 'Geidea POS • 0% Markup' },
                { name: 'Nahdi Pharmacy Clock Tower', date: '05 Nov 2026 • 16:40', sar: 'SAR 45.50', idr: 'Rp191.100', note: 'Mada Contactless' },
                { name: 'Bin Dawood Supermarket Misfalah', date: '04 Nov 2026 • 11:20', sar: 'SAR 68.00', idr: 'Rp285.600', note: 'Oleh-Oleh Haji' },
                { name: 'Saudia Airlines Extra Baggage', date: '28 Okt 2026 • 14:05', sar: 'SAR 120.00', idr: 'Rp504.000', note: 'Online Saudi Rail' },
              ].map((tx) => (
                <div key={tx.name} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1A1D26]">{tx.name}</h4>
                    <p className="text-[11px] text-gray-500">{tx.date}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">{tx.note}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[13.5px] font-extrabold text-[#064E3B] block">{tx.sar}</span>
                    <span className="text-[11px] text-gray-500 block">{tx.idr}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowSarHistoryModal(false)}
              className="w-full mt-3 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-[12.5px] cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PENGATURAN KARTU HARAMAIN WALLET (JAGO STYLE)                      */}
      {/* ========================================================================= */}
      {showSarSettingsModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                  Pengaturan Kartu Haramain
                </h3>
                <p className="text-[11px] text-gray-500">
                  Kontrol limit belanja dan mata uang SAR
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSarSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Limit Slider in SAR */}
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-emerald-900 uppercase tracking-wider">
                  Batas Belanja Harian (SAR)
                </span>
                <span className="text-[15px] font-black text-[#064E3B]">
                  SAR {sarDailyLimit.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={250}
                value={sarDailyLimit}
                onChange={(e) => setSarDailyLimit(Number(e.target.value))}
                className="w-full accent-[#064E3B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-semibold text-emerald-800 mt-1">
                <span>Min SAR 500</span>
                <span>Maks SAR 10.000</span>
              </div>
            </div>

            {/* Currency Lock info */}
            <div className="mt-4 p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-[12px] text-gray-600 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-[#1A1D26]">
                <span>Kurs Terkunci:</span>
                <span className="text-[#064E3B]">1 SAR = Rp4.220</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Nilai tukar langsung tanpa konversi ganda USD. Berlaku di seluruh merchant Arab Saudi.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSarSettingsModal(false)
                triggerReaction('success', 'Pengaturan kartu Haramain berhasil disimpan!')
              }}
              className="w-full mt-5 py-3 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#064E3B]/20"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
