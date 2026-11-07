'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, convertIdrToSar, paySaudiMerchant, depositAlaDompet } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'

export default function AlaHaramainHubPage() {
  const { alaDompet, dompetSar } = useBankState()
  const { triggerReaction, showLoader, hideLoader } = useMascot()

  // First-time Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1)
  const [passportNum, setPassportNum] = useState('C9821402')
  const [visaNum, setVisaNum] = useState('2026-SA-88192')
  const [userName, setUserName] = useState('Ahmad Syahid Al-Fatih')

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

  // Modals
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onboarded = localStorage.getItem('aladin_haramain_onboarded')
      if (!onboarded) {
        setShowOnboarding(true)
      }

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
        sarRate: sarExchangeRate,
        method: 'NFC Tap Contactless',
      })
      setNfcTapping(false)
      if (res.success) {
        setNfcSuccess(true)
        setTimeout(() => {
          setNfcSuccess(false)
          setShowNfcModal(false)
          setSuccessToast('Pembayaran NFC SAR 35.00 di Al Baik berhasil!')
          setTimeout(() => setSuccessToast(null), 3500)
        }, 1500)
      } else {
        alert(res.error || 'Saldo SAR tidak mencukupi')
        setShowNfcModal(false)
      }
    }, 1200)
  }

  const handlePayMerchant = () => {
    if (!selectedMerchant) return
    const res = paySaudiMerchant({
      merchantName: selectedMerchant.name,
      terminalId: 'D360-QR #GD-2041',
      amountSar: selectedMerchant.sar,
      sarRate: sarExchangeRate,
      method: 'Scan QR Kasir',
    })

    if (!res.success) {
      alert(res.error || 'Saldo SAR tidak mencukupi')
      return
    }

    setShowPinModal(false)
    setSuccessToast(`Pembayaran SAR ${selectedMerchant.sar.toFixed(2)} ke ${selectedMerchant.name} berhasil!`)
    setSelectedMerchant(null)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <StatusBar />

      {/* Header Bar */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/beranda"
          className="w-8 h-8 rounded-full flex items-center justify-center p-1 -ml-1 active:opacity-60 transition-opacity"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={16}
            height={16}
            style={{ width: '15.5px', height: '15.5px' }}
            priority
          />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Ala Haramain
        </h1>

        <Link
          href="/pilgrim-bundle"
          className="text-[11.5px] font-extrabold text-[#1C20C4] bg-[#EEF2FF] px-2.5 py-1 rounded-full hover:bg-[#E0E7FF] transition-colors"
        >
          eSIM Saudi →
        </Link>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {/* Toast Notification */}
        {successToast && (
          <div className="p-3.5 bg-emerald-700 text-white rounded-2xl text-[12px] font-bold shadow-lg animate-in fade-in duration-200">
            {successToast}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1 PHYSICAL DUAL-SIDED HYBRID CARD (FRONT = IDR, BACK = SAR)              */}
        {/* ========================================================================= */}
        <div>
          {/* Card Side Indicator & Flip Button */}
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5 p-1 bg-gray-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className={`py-1 px-3 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  !isFlipped
                    ? 'bg-[#1C20C4] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kartu Indo (IDR)
              </button>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className={`py-1 px-3 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  isFlipped
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kartu Saudi (SAR)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="flex items-center gap-1.5 py-1 px-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-[11px] font-extrabold text-[#1A1D26] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>{isFlipped ? 'Balik ke Kartu Indo (IDR)' : 'Balik ke Kartu Saudi (SAR)'}</span>
            </button>
          </div>

          {/* 3D Card Viewport with Touch/Mouse Swipe Listeners */}
          <div
            onTouchStart={(e) => {
              setTouchStartX(e.targetTouches[0].clientX)
              setTouchEndX(null)
            }}
            onTouchMove={(e) => {
              setTouchEndX(e.targetTouches[0].clientX)
            }}
            onTouchEnd={() => {
              if (touchStartX !== null && touchEndX !== null) {
                const diff = touchStartX - touchEndX
                if (Math.abs(diff) > 35) {
                  setIsFlipped((prev) => !prev)
                }
              }
              setTouchStartX(null)
              setTouchEndX(null)
            }}
            onMouseDown={(e) => {
              setIsDragging(true)
              setDragStartX(e.clientX)
            }}
            onMouseMove={(e) => {
              if (!isDragging || dragStartX === null) return
              const diff = dragStartX - e.clientX
              if (Math.abs(diff) > 40) {
                setIsFlipped((prev) => !prev)
                setIsDragging(false)
                setDragStartX(null)
              }
            }}
            onMouseUp={() => {
              setIsDragging(false)
              setDragStartX(null)
            }}
            onMouseLeave={() => {
              setIsDragging(false)
              setDragStartX(null)
            }}
            style={{
              perspective: '1200px',
              width: '100%',
              height: '215px',
              cursor: 'grab',
              userSelect: 'none',
              touchAction: 'pan-y',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* ============================================================= */}
              {/* SISI DEPAN: KARTU WALLET INDO (BANK ALADIN SYARIAH - IDR)     */}
              {/* ============================================================= */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg) translateZ(1px)',
                  opacity: isFlipped ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #081D48 0%, #162477 50%, #1C20C4 100%)',
                  boxShadow: '0 12px 28px rgba(28, 32, 196, 0.35)',
                  padding: '20px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  pointerEvents: isFlipped ? 'none' : 'auto',
                }}
              >
                {/* Background decorative pattern */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Row: Brand & Product */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[15px] tracking-tight text-white">
                      BANK ALADIN
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-[#00F3AD] uppercase tracking-wider">
                      Platinum GPN
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-white/80 tracking-wider">
                    DEBIT SYARIAH
                  </span>
                </div>

                {/* EMV Chip & Contactless Wave */}
                <div className="flex items-center gap-3 relative z-10 mt-1">
                  {/* EMV Gold Chip SVG */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] p-0.5 shadow-sm border border-amber-300/60 relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full border border-amber-800/30 rounded-xs flex flex-col justify-between p-0.5">
                      <div className="h-[1px] bg-amber-900/40 w-full" />
                      <div className="flex justify-between w-full">
                        <div className="w-[1px] h-3 bg-amber-900/40" />
                        <div className="w-2 h-2 rounded-full border border-amber-900/40" />
                        <div className="w-[1px] h-3 bg-amber-900/40" />
                      </div>
                      <div className="h-[1px] bg-amber-900/40 w-full" />
                    </div>
                  </div>

                  {/* Contactless Wave Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" className="opacity-80">
                    <path d="M8.5 16.5a5 5 0 0 1 0-7" />
                    <path d="M12 19a9 9 0 0 0 0-14" />
                    <path d="M15.5 21.5a13 13 0 0 0 0-19" />
                  </svg>
                </div>

                {/* Embossed Card Number */}
                <div className="relative z-10 my-1">
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      fontWeight: 800,
                      letterSpacing: '2.5px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      color: '#FFFFFF',
                    }}
                  >
                    5241 •••• •••• 9842
                  </span>
                </div>

                {/* Bottom Row: Holder Name & Valid Thru */}
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <span className="text-[8.5px] uppercase tracking-wider text-white/60 block">
                      Card Holder (Sisi Depan)
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {userName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[8.5px] uppercase tracking-wider text-white/60 block">
                      Valid Thru
                    </span>
                    <span className="font-mono text-[12px] font-bold text-white">
                      11/30
                    </span>
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* SISI KEDUA: KARTU WALLET SAUDI (TAMPAK DEPAN D360 SAUDI SAR)  */}
              {/* ============================================================= */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(1px)',
                  opacity: isFlipped ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #022C22 0%, #064E3B 45%, #047857 80%, #09382E 100%)',
                  boxShadow: '0 12px 28px rgba(6, 78, 59, 0.45)',
                  padding: '20px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  pointerEvents: isFlipped ? 'auto' : 'none',
                }}
              >
                {/* Background decorative gold ring */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-35px',
                    right: '-35px',
                    width: '190px',
                    height: '190px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(253, 224, 71, 0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Row: Saudi Brand & Mada Network */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[15px] tracking-tight text-white">
                      D360 SAUDI
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-400/40 text-[#00F3AD] uppercase tracking-wider">
                      MADA SYARIAH
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-200/90 tracking-wider">
                    DEBIT SYARIAH (SAR)
                  </span>
                </div>

                {/* EMV Chip & Contactless Wave & Saldo SAR */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    {/* Realistic Gold EMV Chip */}
                    <div
                      style={{
                        width: '38px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #FFF3C4 0%, #F59E0B 50%, #D97706 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.25)',
                        border: '1px solid rgba(180, 83, 9, 0.6)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '18px',
                          border: '1px solid rgba(180, 83, 9, 0.45)',
                          borderRadius: '3px',
                        }}
                      />
                    </div>

                    {/* Contactless Wave */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-white/80">
                      <path d="M8.5 16.5a5 5 0 0 1 0-7" />
                      <path d="M12 19a8.5 8.5 0 0 0 0-12" />
                      <path d="M15.5 21.5a12 12 0 0 0 0-17" />
                    </svg>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-emerald-200/80 font-medium block">
                      Saldo Riyal di Saudi
                    </span>
                    <span className="text-[15px] font-black text-[#00F3AD] tracking-tight">
                      SAR {(dompetSar || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Saudi Card Number */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '15.5px',
                      fontWeight: 800,
                      letterSpacing: '2.5px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {showCardNumber ? '9660 5481 9284 2841' : '9660 •••• •••• 2841'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowCardNumber((prev) => !prev)}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white/80 text-[11px] font-bold"
                  >
                    {showCardNumber ? 'Sembunyi' : 'Lihat'}
                  </button>
                </div>

                {/* Bottom Row: Cardholder & Exp */}
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <span className="text-[8.5px] uppercase tracking-wider text-emerald-200/70 block">
                      Card Holder (Saudi Mada)
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {userName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[8.5px] uppercase tracking-wider text-emerald-200/70 block">
                      Valid Thru
                    </span>
                    <span className="font-mono text-[12px] font-bold text-white">
                      11/30
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Swipe Hint */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-[10.5px] text-gray-500 font-medium">
              💡 Usap (swipe) kartu atau klik tombol di atas untuk membalikkan sisi kartu
            </span>
          </div>

          {/* Quick Balance Details of the Currently Visible Face */}
          <div
            className="mt-3 bg-white rounded-2xl p-4 border border-[#ECEEF2] shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                {isFlipped ? 'Saldo Sisi Belakang: Dompet Saudi (SAR)' : 'Saldo Sisi Depan: Dompet Aladin (IDR)'}
              </span>
              <span className="text-[22px] font-black text-[#1A1D26] tracking-tight block">
                {isFlipped ? `SAR ${dompetSar.toFixed(2)}` : `Rp${alaDompet.toLocaleString('id-ID')}`}
              </span>
              <span className="text-[10.5px] text-gray-500 font-medium">
                {isFlipped
                  ? `≈ Rp${Math.round(dompetSar * sarExchangeRate).toLocaleString('id-ID')} (Kurs 0% Markup)`
                  : 'Sumber Rekening Utama Aladin'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {isFlipped ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowConvertModal(true)}
                    className="py-2 px-3.5 bg-[#064E3B] hover:bg-[#047857] text-white text-[12px] font-extrabold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    ⇄ Convert ke SAR
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNfcModal(true)}
                    className="py-1.5 px-3.5 bg-emerald-50 text-[#064E3B] border border-emerald-200 text-[11px] font-bold rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    Tap NFC Kasir
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(true)}
                    className="py-2 px-3.5 bg-[#1C20C4] hover:bg-[#151AA8] text-white text-[12px] font-extrabold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    + Isi Saldo IDR
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="py-1.5 px-3.5 bg-[#EEF2FF] text-[#1C20C4] border border-[#C7D2FE] text-[11px] font-bold rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    Buka Sisi Saudi →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* METODE PEMBAYARAN DI SAUDI */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
          <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
            PILIHAN METODE BAYAR DI TANAH SUCI
          </span>

          <div className="grid grid-cols-2 gap-3">
            {/* 1. Default: NFC Tap */}
            <div
              onClick={() => setShowNfcModal(true)}
              className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-all active:scale-98"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18h12M6 14h12M6 10h12M6 6h12" />
                </svg>
              </div>
              <span className="text-[13px] font-extrabold text-[#1A1D26] block">
                Tap NFC Kasir
              </span>
              <span className="text-[10.5px] text-[#059669] font-bold block mt-0.5">
                Default • Instan di EDC
              </span>
            </div>

            {/* 2. Fallback: Kartu Fisik */}
            <Link
              href="/ala-haramain/kartu-fisik"
              className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all active:scale-98 block"
            >
              <div className="w-10 h-10 rounded-xl bg-[#081D48] text-white flex items-center justify-center mb-2 shadow-xs">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <span className="text-[13px] font-extrabold text-[#1A1D26] block">
                Kartu Fisik
              </span>
              <span className="text-[10.5px] text-gray-500 font-bold block mt-0.5">
                {cardLinked ? '✓ Tertaut Aktif' : 'Ambil di Booth Bandara'}
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
              <h3 className="text-[14px] font-extrabold text-[#1A1D26]">Sekitar Masjidil Haram &amp; Nabawi</h3>
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

        {/* Security & Partner Endorsement Banner */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#ECEEF2] text-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Kemitraan Resmi Ekosistem Haji &amp; Umrah
          </span>
          <p className="text-[11.5px] font-bold text-gray-600 mt-0.5">
            D360 Bank Saudi • BPKH • HIMPUH • AMPHURI • Bank Aladin Syariah
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ONBOARDING MODAL: AKTIVASI NOMOR SAUDI & WALLET D360 (GATED)               */}
      {/* ========================================================================= */}
      {showOnboarding && (
        <div className="absolute inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            {/* Top Handle */}
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
                ✕
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
                    {onboardingStep > s.step ? '✓' : s.step}
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

                <p className="text-[10.5px] text-gray-400">
                  Data terhubung secara aman ke Sistem Informasi dan Komputerisasi Haji Terpadu (Siskohat) &amp; SAMA.
                </p>

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

            {/* Step 3: Success Completion */}
            {onboardingStep === 3 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center text-3xl font-black mx-auto">
                  ✓
                </div>
                <div>
                  <h4 className="text-[17px] font-extrabold text-[#1A1D26]">
                    Ala Haramain Wallet Aktif!
                  </h4>
                  <p className="text-[12px] text-gray-500 mt-1 max-w-[280px] mx-auto">
                    Kartu D360 Saudi virtual &amp; nomor +966 telah terbit. Anda kini dapat mengisi saldo IDR dan mengonversi ke SAR dengan kurs 0% markup.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full h-12 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  Mulai Gunakan Haramain Wallet →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TOP UP SALDO IDR (DENGAN EXPLICIT PADDING MELEGA)                   */}
      {/* ========================================================================= */}
      {showTopUpModal && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Top Up Saldo Ala Dompet</h3>
                <p className="text-[11.5px] text-gray-500">Isi saldo langsung untuk transaksi Tanah Suci</p>
              </div>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-bold text-gray-500 block mb-2">
                Pilih Nominal Top Up:
              </label>
              <div className="grid grid-cols-3 gap-2.5 mb-2">
                {['250.000', '500.000', '1.000.000'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setTopUpNominal(nom)}
                    className={`py-3 rounded-xl border text-[12.5px] font-bold cursor-pointer transition-all ${
                      topUpNominal === nom ? 'bg-[#1C20C4] text-white border-[#1C20C4]' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    Rp{nom}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const raw = parseInt(topUpNominal.replace(/\D/g, '') || '0', 10)
                depositAlaDompet(raw)
                setShowTopUpModal(false)
                setSuccessToast(`Top up Rp${topUpNominal} berhasil disetorkan ke Ala Dompet!`)
                setTimeout(() => setSuccessToast(null), 3500)
              }}
              className="w-full h-12 bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Simulasikan Top Up Masuk
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
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Konversi IDR ke SAR</h3>
                <p className="text-[11.5px] text-[#059669] font-bold">Kurs Real-Time Bank Indonesia • 0% Markup</p>
              </div>
              <button
                onClick={() => setShowConvertModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 block mb-1">
                  Nominal Tukar (IDR):
                </span>
                <div className="flex items-center text-[22px] font-black text-[#1A1D26]">
                  <span className="text-[#1C20C4] mr-2">Rp</span>
                  <input
                    type="text"
                    value={convertAmountIdr}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '')
                      setConvertAmountIdr(raw ? Number(raw).toLocaleString('id-ID') : '0')
                    }}
                    className="w-full bg-transparent font-black outline-none text-[#1A1D26]"
                  />
                </div>
                <span className="text-[10.5px] text-gray-400 block mt-1">
                  Saldo Tersedia: Rp{alaDompet.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Saldo Riyal yang Diterima:
                  </span>
                  <span className="text-[20px] font-black text-emerald-900">
                    SAR {sarEstimate}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-200/60 px-2.5 py-1 rounded-full">
                  1 SAR = Rp{sarExchangeRate.toLocaleString('id-ID')}
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
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={nfcTapping ? 'animate-bounce' : ''}>
                <path d="M6 18h12M6 14h12M6 10h12M6 6h12" />
              </svg>
            </div>

            <h3 className="text-[18px] font-extrabold text-[#1A1D26]">
              {nfcSuccess ? 'Transaksi Sukses! ✓' : nfcTapping ? 'Mendekatkan ke Mesin EDC...' : 'Dekatkan ke Terminal Kasir'}
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
                ✕
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
    </div>
  )
}
