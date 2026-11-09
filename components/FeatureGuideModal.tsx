'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Wallet, Landmark, Wifi, Gem, Headphones, X, ChevronRight, Target } from 'lucide-react'

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

      if (shouldOpenFromQuery) {
        const timer = setTimeout(() => {
          setIsOpen(true)
          setStep(0)
        }, 300)
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
      title: 'Selamat Datang di Bank Aladin Syariah',
      desc: 'Kenali ekosistem perbankan digital syariah masa depan. Kamu bisa memilih fokus finansial pribadimu melalui Sobat Aladin atau menjelajahi tur inovasi fitur kami.',
      primaryBtn: 'Ikuti Tur Fitur',
      secondaryBtn: 'Nanti Saja',
      featureHref: '/onboarding/tujuan-finansial',
      featureBtnText: 'Atur Fokus Finansial (Sobat Aladin) →',
      badge: 'Inovasi Digital',
      icon: <Sparkles className="w-6 h-6 text-[#1037A6]" />,
      iconBg: 'bg-[#EFF2FE] border-[#C7D2FE]',
    },
    {
      stepLabel: 'LANGKAH 2 DARI 6',
      title: 'Ala Pocket — Pos Anggaran Harian',
      desc: 'Pisahkan anggaran belanja, sedekah, dan kebutuhan dapur dari rekening utama tanpa komitmen target yang kaku. Transfer dana langsung dari pocket pilihanmu.',
      primaryBtn: 'Lanjut →',
      secondaryBtn: 'Lewati',
      featureHref: '/pocket',
      featureBtnText: 'Buka Ala Pocket ↗',
      badge: 'Bebas Target',
      icon: <Wallet className="w-6 h-6 text-[#059669]" />,
      iconBg: 'bg-emerald-50 border-emerald-200',
    },
    {
      stepLabel: 'LANGKAH 3 DARI 6',
      title: 'Ala Haramain — Transaksi Bebas Markup di Saudi',
      desc: 'Dompet dual saldo IDR & SAR dengan kurs resmi 0% markup. Dilengkapi 1 kartu debit hybrid bolak-balik: Sisi Depan IDR dan Sisi Belakang Mada SAR.',
      primaryBtn: 'Lanjut →',
      secondaryBtn: 'Lewati',
      featureHref: '/ala-haramain',
      featureBtnText: 'Buka Ala Haramain ↗',
      badge: '0% Kurs Markup',
      icon: <Landmark className="w-6 h-6 text-[#D97706]" />,
      iconBg: 'bg-amber-50 border-amber-200',
    },
    {
      stepLabel: 'LANGKAH 4 DARI 6',
      title: 'Pilgrim Bundle — Konektivitas Tanah Suci',
      desc: 'Paket kuota internet dan aktivasi nomor e-SIM Arab Saudi resmi langsung aktif saat mendarat di Jeddah atau Madinah, tanpa antre beli kartu fisik di bandara.',
      primaryBtn: 'Lanjut →',
      secondaryBtn: 'Lewati',
      featureHref: '/ala-haramain',
      featureBtnText: 'Lihat Paket Pilgrim ↗',
      badge: 'eSIM Instan',
      icon: <Wifi className="w-6 h-6 text-[#2563EB]" />,
      iconBg: 'bg-blue-50 border-blue-200',
    },
    {
      stepLabel: 'LANGKAH 5 DARI 6',
      title: 'Wealth Hub & Impian 3D Baitullah',
      desc: 'Investasi reksa dana syariah & sukuk dengan talangan Qardh T+0 instan, serta pantau target tabungan dengan visualisasi perjalanan 3D ke Baitullah.',
      primaryBtn: 'Lanjut →',
      secondaryBtn: 'Lewati',
      featureHref: '/wealth',
      featureBtnText: 'Buka Wealth Hub ↗',
      badge: 'Investasi Halal',
      icon: <Gem className="w-6 h-6 text-[#7C3AED]" />,
      iconBg: 'bg-purple-50 border-purple-200',
    },
    {
      stepLabel: 'LANGKAH 6 DARI 6',
      title: 'Concierge Desk & Video Call 24/7',
      desc: 'Butuh panduan transaksi atau konsultasi syariah? Maskot Floating Concierge di pojok layar siap menghubungkanmu langsung ke Relationship Desk 24/7.',
      primaryBtn: 'Selesai & Jelajah',
      secondaryBtn: 'Tutup',
      featureHref: '/bantu',
      featureBtnText: 'Pusat Bantuan Aladin ↗',
      badge: 'Siaga 24 Jam',
      icon: <Headphones className="w-6 h-6 text-[#1037A6]" />,
      iconBg: 'bg-blue-50 border-blue-200',
    },
  ]

  if (!isOpen) return null

  const current = steps[step]

  return (
    <div className="absolute inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 select-none animate-in fade-in duration-200">
      {/* Modern Bank Aladin Floating Card */}
      <div className="w-full max-w-[340px] bg-white rounded-[28px] p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Subtle Top Accent Ambient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1037A6] via-[#00F0A0] to-[#1C20C4]" />

        {/* Close (X) button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup panduan"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header: Brand Avatar + Step Counter + Title */}
        <div className="flex items-start gap-3.5 mb-3.5 mt-1">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${current.iconBg}`}
          >
            {current.icon}
          </div>

          <div className="flex-1 min-w-0 pr-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                {current.stepLabel}
              </span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#EFF2FE] text-[#1037A6]">
                {current.badge}
              </span>
            </div>
            <h3 className="text-[15px] font-black text-[#1A1D26] leading-snug">
              {current.title}
            </h3>
          </div>
        </div>

        {/* Body Description */}
        <p className="text-[12.5px] text-gray-600 leading-relaxed mb-4">
          {current.desc}
        </p>

        {/* Step 1 Highlight: Direct Sobat Aladin Pathway */}
        {step === 0 ? (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-br from-[#EFF2FE] to-[#F5F7FF] border border-[#C7D2FE]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1037A6] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Target className="w-4 h-4 text-[#00F0A0]" />
              </div>
              <div>
                <span className="text-[12px] font-extrabold text-[#1037A6] block leading-tight">
                  Sobat Aladin
                </span>
                <span className="text-[10.5px] text-gray-500 block">
                  Aktivasi fokus keuangan personalmu
                </span>
              </div>
            </div>
            <Link
              href="/onboarding/tujuan-finansial"
              onClick={handleClose}
              className="text-[11.5px] font-extrabold text-[#1037A6] hover:text-[#0D2D8A] bg-white px-2.5 py-1.5 rounded-xl border border-[#C7D2FE] flex items-center gap-1 shadow-2xs hover:shadow-xs transition-all shrink-0"
            >
              <span>Atur</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Steps 2-6 Shortcut Link */
          current.featureHref && (
            <div className="mb-4">
              <Link
                href={current.featureHref}
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#1037A6] hover:underline bg-[#EFF2FE] px-3 py-1.5 rounded-full border border-[#C7D2FE]/60 transition-colors"
              >
                <span>{current.featureBtnText}</span>
              </Link>
            </div>
          )
        )}

        {/* Modern Pill Step Progress Indicators */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx)}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: step === idx ? '22px' : '6px',
                backgroundColor: step === idx ? '#1037A6' : '#E2E8F0',
              }}
              aria-label={`Ke Langkah ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Buttons Row */}
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
            className="flex-1 py-3 px-5 rounded-full bg-[#1037A6] hover:bg-[#0D2D8A] text-white font-extrabold text-[13px] shadow-sm active:scale-95 transition-all text-center cursor-pointer"
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
