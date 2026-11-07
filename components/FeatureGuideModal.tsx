'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FeatureGuideModalProps {
  forceOpen?: boolean
  onClose?: () => void
}

export default function FeatureGuideModal({ forceOpen = false, onClose }: FeatureGuideModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true)
      setStep(0)
      return
    }

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const shouldOpenFromQuery = urlParams.get('openGuide') === 'true'
      const completed = localStorage.getItem('aladin_feature_guide_seen')

      if (shouldOpenFromQuery || !completed) {
        // Automatically pop up on homepage
        const timer = setTimeout(() => {
          setIsOpen(true)
          setStep(0)
        }, 600)
        return () => clearTimeout(timer)
      }
    }
  }, [forceOpen])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aladin_feature_guide_seen', 'true')
    }
    setIsOpen(false)
    if (onClose) onClose()
  }

  const steps = [
    {
      stepLabel: 'LANGKAH 1 DARI 6',
      title: 'Inovasi Syariah #PakaiAladin',
      desc: 'Hai, aku Aladin Guide! Aku yang bakal nemenin kamu siap-siap kenalan sama deretan fitur inovasi syariah terbaru kita. Yuk keliling sebentar, selama tur kamu bisa langsung intip kemudahannya.',
      primaryBtn: 'Ayo mulai',
      secondaryBtn: 'Nanti aja',
      featureHref: null,
      badge: 'Selamat Datang',
      mascotEmoji: '🧞‍♂️',
      mascotBg: 'bg-amber-100 border-amber-300 text-amber-600',
    },
    {
      stepLabel: 'LANGKAH 2 DARI 6',
      title: 'Ala Pocket — Pos Anggaran Harian',
      desc: 'Pisah anggaran belanja, makan, dan sedekah langsung dari rekening utama tanpa target tabungan yang memberatkan. Kamu juga bisa langsung transfer dana dari pocket tertentu!',
      primaryBtn: 'Lanjut tur →',
      secondaryBtn: 'Lewati',
      featureHref: '/pocket',
      featureBtnText: 'Buka Ala Pocket ↗',
      badge: 'Bebas Target',
      mascotEmoji: '👛',
      mascotBg: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    },
    {
      stepLabel: 'LANGKAH 3 DARI 6',
      title: 'Ala Haramain — Transaksi Nyata di Saudi',
      desc: 'Dompet dual saldo IDR & SAR dengan kurs resmi 0% markup! Dilengkapi 1 kartu debit hybrid bolak-balik: Sisi Depan IDR dan Sisi Belakang Saudi Mada yang bisa di-swipe dengan jari.',
      primaryBtn: 'Lanjut tur →',
      secondaryBtn: 'Lewati',
      featureHref: '/ala-haramain',
      featureBtnText: 'Buka Ala Haramain ↗',
      badge: '0% Kurs Markup',
      mascotEmoji: '🕋',
      mascotBg: 'bg-emerald-100 border-emerald-300 text-emerald-700',
    },
    {
      stepLabel: 'LANGKAH 4 DARI 6',
      title: 'Pilgrim Bundle — Konektivitas Tanah Suci',
      desc: 'Paket kuota internet dan aktivasi nomor e-SIM Arab Saudi resmi langsung aktif saat mendarat di Jeddah atau Madinah, tanpa repot antre beli kartu fisik di bandara.',
      primaryBtn: 'Lanjut tur →',
      secondaryBtn: 'Lewati',
      featureHref: '/pilgrim-bundle',
      featureBtnText: 'Buka Pilgrim Bundle ↗',
      badge: 'eSIM Instant',
      mascotEmoji: '📶',
      mascotBg: 'bg-blue-100 border-blue-300 text-blue-700',
    },
    {
      stepLabel: 'LANGKAH 5 DARI 6',
      title: 'Wealth Hub & Impian 3D Baitullah',
      desc: 'Kelola investasi reksa dana syariah & sukuk dengan talangan Qardh T+0 instan, serta rasakan perayaan tabungan impian dengan visualisasi 3D perjalanan ibadah ke Baitullah.',
      primaryBtn: 'Lanjut tur →',
      secondaryBtn: 'Lewati',
      featureHref: '/wealth',
      featureBtnText: 'Buka Wealth Hub ↗',
      badge: 'Visualisasi 3D Interaktif',
      mascotEmoji: '💎',
      mascotBg: 'bg-indigo-100 border-indigo-300 text-indigo-700',
    },
    {
      stepLabel: 'LANGKAH 6 DARI 6',
      title: 'Concierge Desk & Video Call 24/7',
      desc: 'Butuh bantuan kapan pun? Floating Concierge mengambang di pojok layar siap melayani via WhatsApp dan Video Call tatap muka bersama Sharia Officer bersertifikat.',
      primaryBtn: 'Selesai & Jelajah! 🚀',
      secondaryBtn: 'Tutup',
      featureHref: '/bantu',
      featureBtnText: 'Buka Aladin Bantu ↗',
      badge: 'Layanan 24 Jam',
      mascotEmoji: '🎧',
      mascotBg: 'bg-purple-100 border-purple-300 text-purple-700',
    },
  ]

  if (!isOpen) return null

  const current = steps[step]

  return (
    <div className="absolute inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 select-none animate-in fade-in duration-300">
      {/* Otbee-Style Floating Card */}
      <div className="w-full max-w-[340px] bg-white rounded-[28px] p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative">
        {/* Top Header: Mascot Avatar + Step Counter + Title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-[22px] shrink-0 shadow-sm ${current.mascotBg}`}
          >
            {current.mascotEmoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                {current.stepLabel}
              </span>
              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1C20C4]">
                {current.badge}
              </span>
            </div>
            <h3 className="text-[14.5px] font-black text-[#1A1D26] leading-snug mt-0.5">
              {current.title}
            </h3>
          </div>
        </div>

        {/* Body Text */}
        <p className="text-[12.5px] text-gray-600 leading-relaxed mb-5">
          {current.desc}
        </p>

        {/* Feature Shortcut Link (Steps 2-6) */}
        {current.featureHref && (
          <div className="mb-4">
            <Link
              href={current.featureHref}
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#1C20C4] hover:underline bg-[#EEF2FF] px-3 py-1.5 rounded-full"
            >
              <span>{current.featureBtnText}</span>
            </Link>
          </div>
        )}

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx)}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: step === idx ? '20px' : '6px',
                backgroundColor: step === idx ? '#F59E0B' : '#E2E8F0',
              }}
              aria-label={`Ke Langkah ${idx + 1}`}
            />
          ))}
        </div>

        {/* Buttons Row (Matching Otbee Style: Big Yellow/Amber Primary + Ghost Secondary) */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1)
              } else {
                handleClose()
              }
            }}
            className="flex-1 py-3 px-5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1A1D26] font-black text-[13px] shadow-sm active:scale-95 transition-all text-center cursor-pointer"
          >
            {current.primaryBtn}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="py-3 px-3 text-gray-400 hover:text-gray-700 font-bold text-[12.5px] transition-colors cursor-pointer"
          >
            {current.secondaryBtn}
          </button>
        </div>
      </div>
    </div>
  )
}

