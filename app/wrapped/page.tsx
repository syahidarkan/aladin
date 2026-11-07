'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatusBar from '@/components/StatusBar'

export default function AladinWrappedPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const slides = [
    {
      id: 1,
      tag: 'KILAS BALIK 2026',
      title: 'Tahun Penuh Berkah Bersama Bank Aladin',
      subtitle: 'Mari kita rayakan jejak perjalanan finansial dan ibadah syariahmu selama 365 hari terakhir.',
      bg: 'linear-gradient(135deg, #081D48 0%, #1C20C4 100%)',
      accent: '#00F3AD',
    },
    {
      id: 2,
      tag: 'AKTIVITAS FINANSIAL',
      title: '148 Transaksi Tanpa Riba Berhasil',
      subtitle: 'Total mutasi dana Rp18.450.000 dengan hemat biaya admin hingga Rp450.000 berkat kuota gratis Aladin.',
      bg: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
      accent: '#FDE047',
    },
    {
      id: 3,
      tag: 'OUTLET FAVORIT',
      title: 'Alfamart & SPBU Lenteng Agung',
      subtitle: 'Kamu paling sering transaksi QRIS dan setor tunai gratis di jaringan gerai Alfa Group terdekat.',
      bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
      accent: '#38BDF8',
    },
    {
      id: 4,
      tag: 'ALA IMPIAN BAITULLAH',
      title: 'Rp8.440.366 Ditabung untuk Umrah',
      subtitle: 'Komitmen luar biasa menyisihkan dana setiap bulan dengan indikasi bagi hasil syariah 8,0% p.a.',
      bg: 'linear-gradient(135deg, #701A75 0%, #86198F 100%)',
      accent: '#F472B6',
    },
    {
      id: 5,
      tag: 'GELAR FINANSIALMU',
      title: 'Pejuang Berkah Syariah',
      subtitle: 'Kamu telah membuktikan bahwa mengelola finansial bisa cerdas, hemat, dan tetap taat syariat.',
      bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      accent: '#00F3AD',
      isFinal: true,
    },
  ]

  // Auto advance slides every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length, currentSlide])

  const slide = slides[currentSlide]

  const handleShare = () => {
    setToastMessage('Kartu Kilas Balik siap dibagikan ke Story!')
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleDownload = () => {
    setToastMessage('Mengunduh Laporan Kilas Balik Berkah 2026 (PDF)... File tersimpan!')
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div
      className="relative w-full h-full select-none text-white overflow-hidden flex flex-col justify-between transition-all duration-700"
      style={{
        background: slide.bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. iOS Status Bar (Dark mode for full screen story) */}
      <StatusBar time="22.25" batteryLevel={33} dark={true} />

      {/* 2. Story Progress Bars */}
      <div className="flex gap-1.5 px-5 pt-2 z-20">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-300 ${
                i < currentSlide
                  ? 'w-full'
                  : i === currentSlide
                  ? 'w-full animate-[progress_6s_linear]'
                  : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* 3. Top Header Bar */}
      <div className="flex items-center justify-between px-5 pt-3 z-20">
        <span className="font-extrabold text-[15px] tracking-tight">#PakaiAladin Wrapped</span>

        <Link
          href="/beranda"
          className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-bold text-white hover:bg-white/25 transition-colors"
        >
          ✕
        </Link>
      </div>

      {/* 4. Tap Areas for Story Navigation */}
      <div className="absolute inset-y-24 left-0 w-1/3 z-10" onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} />
      <div className="absolute inset-y-24 right-0 w-1/3 z-10" onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} />

      {/* 5. Center Story Content */}
      <div className="px-6 py-8 z-20 space-y-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase border border-white/20 backdrop-blur-xs"
          style={{ color: slide.accent }}
        >
          {slide.tag}
        </span>

        <h2 className="text-[28px] font-extrabold leading-tight tracking-tight">
          {slide.title}
        </h2>

        <p className="text-[14px] text-white/85 leading-relaxed">
          {slide.subtitle}
        </p>
      </div>

      {/* 6. Bottom Action Controls */}
      <div className="p-6 pb-20 z-20 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleShare}
            className="h-[44px] rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shadow-lg"
            style={{ background: slide.accent, color: '#081D48' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Bagikan
          </button>

          <button
            onClick={handleDownload}
            className="h-[44px] rounded-full font-bold text-[13px] bg-white/20 hover:bg-white/30 text-white flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh PDF
          </button>
        </div>

        <p className="text-center text-[10.5px] text-white/60">
          Geser atau ketuk layar untuk melihat slide berikutnya
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-[12px] font-bold text-white border border-white/20 shadow-xl">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
