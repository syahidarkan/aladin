'use client'

import {
  ArrowLeft,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  Gift,
  Trophy,
  QrCode,
  Tag,
  ArrowUpRight,
  RotateCcw,
  Check,
  Lock,
  ShoppingBag,
  ExternalLink,
  Store,
  Sparkle,
  Clock,
  Info,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function RewardsAlfaPage() {
  const [timer, setTimer] = useState(60)
  const [activeBarcode, setActiveBarcode] = useState<'barcode' | 'qr'>('barcode')
  const [claimedTier3, setClaimedTier3] = useState(false)
  const [totalPoints, setTotalPoints] = useState(1450)

  // 60-second refresh countdown for the security barcode/QR
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 1 ? t - 1 : 60))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleClaimTier3 = () => {
    if (!claimedTier3) {
      setClaimedTier3(true)
      setTotalPoints((prev) => prev + 500)
    }
  }

  // Periodic Promos with clear expiration dates (contrasting with always-on Daily Loop)
  const periodicPromos = [
    {
      id: 1,
      title: 'Promo JSM (Jumat-Sabtu-Minggu)',
      desc: 'Diskon 20% Minyak Goreng 2L & Beras Premium dengan QRIS Aladin',
      validUntil: 'Berakhir 30 Nov 2026',
      tag: 'Spesial Akhir Pekan',
      tagColor: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      id: 2,
      title: 'Berkah Lawson Oden & Arabica Coffee',
      desc: 'Cashback 30% s.d. Rp10.000 setiap jam sarapan (06.00 - 10.00 WIB)',
      validUntil: 'Berakhir 15 Des 2026',
      tag: 'Lawson Station',
      tagColor: 'bg-blue-50 text-[#1037A6] border-blue-200',
    },
    {
      id: 3,
      title: 'Tebus Murah Gula Pasir 1kg Rp5.000',
      desc: 'Minimal transaksi belanja bulanan Rp100.000 di Alfamidi',
      validUntil: 'Berakhir 05 Des 2026',
      tag: 'Alfamidi Super',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ]

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F7F8FC] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Top Header Bar with Native Back Button */}
      <header className="shrink-0 w-full bg-white border-b border-[#ECEEF2] z-30">
        <StatusBar />
        <div
          className="w-full bg-white flex items-center justify-between px-4"
          style={{ height: '52px' }}
        >
          <Link
            href="/beranda"
            data-back="true"
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>

          <div className="flex items-center gap-1.5 min-w-0">
            <h1 className="text-[15px] font-black text-[#1A1D26] tracking-tight">
              Alfa Daily Loop
            </h1>
            <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B] border border-emerald-400 shrink-0">
              ⭐ Fitur Utama
            </span>
          </div>

          <div style={{ width: '36px' }} />
        </div>
      </header>

      {/* 2. Scrollable Main Content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4"
        style={{
          padding: '16px 20px 48px 20px',
        }}
      >
        {/* BAGIAN 1: KARTU STATUS "DAILY LOOP KAMU" */}
        <div className="bg-gradient-to-br from-[#001F5D] via-[#1037A6] to-[#1C20C4] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#00F0A0]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <RotateCcw className="w-3.5 h-3.5 text-[#00F0A0]" />
              <span className="text-[11px] font-black tracking-wide">Daily Loop Aktif • Siklus #2</span>
            </div>
            <span className="text-[10px] font-bold text-white/80">
              Pilar RETAIN (Slide 17)
            </span>
          </div>

          {/* Status Header */}
          <div className="mb-4">
            <span className="text-[11px] text-white/80 font-medium block">Progres Siklus Berjalan</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-black tracking-tight font-mono text-[#00F0A0]">
                  3
                </span>
                <span className="text-[18px] font-bold text-white/90">
                  dari 5 transaksi
                </span>
              </div>
              <span className="text-[11px] font-black bg-[#00F0A0]/20 text-[#00F0A0] border border-[#00F0A0]/30 px-2.5 py-1 rounded-xl">
                60% Tercapai
              </span>
            </div>
          </div>

          {/* Segmented Progress Bar (3 of 5 filled) */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            <div className="h-2.5 rounded-full bg-[#00F0A0] shadow-xs" />
            <div className="h-2.5 rounded-full bg-[#00F0A0] shadow-xs" />
            <div className="h-2.5 rounded-full bg-[#00F0A0] shadow-xs" />
            <div className="h-2.5 rounded-full bg-white/25" />
            <div className="h-2.5 rounded-full bg-white/25" />
          </div>

          {/* Subtext description */}
          <div className="bg-black/20 rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold text-white/90 leading-tight">
                Selesaikan <span className="text-[#00F0A0] font-black">2 transaksi lagi</span> untuk membuka Bonus Besar Voucher Rp25.000!
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-white/70 block">Poin Tersimpan</span>
              <span className="text-[13px] font-black font-mono text-[#00F0A0]">{totalPoints} Poin</span>
            </div>
          </div>
        </div>

        {/* BAGIAN 2: TANGGA REWARD BERJENJANG (WAJIB) */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-[15px] font-black text-[#1A1D26]">
                  Tangga Reward Berjenjang
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Reward bertingkat untuk setiap transaksi QRIS di ekosistem Alfa
              </p>
            </div>
            <span className="text-[10px] font-black text-[#1037A6] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Always-On Loop
            </span>
          </div>

          {/* Transaction Steps Stack */}
          <div className="space-y-3 mt-3.5">
            {/* TAHAP 1: TRANSAKSI 1 */}
            <div className="p-3.5 rounded-2xl border bg-emerald-50/40 border-emerald-200 flex items-center justify-between gap-3 transition-all">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[12px] shrink-0 shadow-xs">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-300">
                      Transaksi 1
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">Selesai ✓</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26] leading-snug mt-0.5">
                    Cashback Sambutan Rp5.000
                  </h4>
                  <p className="text-[10.5px] text-gray-500">Otomatis masuk ke saldo Ala Dompet</p>
                </div>
              </div>
              <span className="text-[10.5px] font-black text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                Terklaim
              </span>
            </div>

            {/* TAHAP 2: TRANSAKSI 3 */}
            <div className="p-3.5 rounded-2xl border bg-[#EEF2FF] border-[#C7D2FE] flex items-center justify-between gap-3 transition-all">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#1037A6] text-white flex items-center justify-center font-black text-[12px] shrink-0 shadow-xs">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-[#1037A6] border border-blue-200">
                      Transaksi 3
                    </span>
                    <span className="text-[10px] font-bold text-[#1037A6]">Sedang Berjalan • Terbuka!</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26] leading-snug mt-0.5">
                    Voucher Minyak Goreng 1L / Voucher Rp15.000
                  </h4>
                  <p className="text-[10.5px] text-gray-600">Bisa ditukarkan langsung di kasir Alfamart</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClaimTier3}
                disabled={claimedTier3}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black shadow-xs transition-all cursor-pointer shrink-0 active:scale-95 ${
                  claimedTier3
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default'
                    : 'bg-[#1037A6] hover:bg-[#0c2b82] text-white'
                }`}
              >
                {claimedTier3 ? 'Terklaim! ✓' : 'Klaim'}
              </button>
            </div>

            {/* TAHAP 3: TRANSAKSI 5 */}
            <div className="p-3.5 rounded-2xl border bg-gray-50/70 border-gray-200 flex items-center justify-between gap-3 transition-all opacity-85">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-black text-[12px] shrink-0">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200">
                      Transaksi 5
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">Terkunci (Butuh 2 Tx Lagi)</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26] leading-snug mt-0.5">
                    Bonus Besar: Voucher Rp25.000 / A-Poin
                  </h4>
                  <p className="text-[10.5px] text-gray-500">
                    Reward puncak siklus <span className="text-gray-400 italic">(subject to partnership)</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-white px-2.5 py-1 rounded-full border border-gray-200 shrink-0">
                🔒 Terkunci
              </span>
            </div>

            {/* SIKLUS BARU DIMULAI (LOOP INDIKATOR) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-emerald-700 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[12px] font-black text-emerald-900 block leading-tight">
                  Setelah 5 transaksi → Siklus baru dimulai!
                </span>
                <p className="text-[10.5px] text-emerald-700 font-medium mt-0.5 leading-tight">
                  Loyalitas tanpa batas — ulangi loop untuk terus kumpulkan cashback &amp; voucher setiap bulan.
                </p>
              </div>
            </div>
          </div>

          {/* Small Mandatory Note */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-1.5 text-gray-500">
            <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed">
              <strong>Transaksi dihitung:</strong> QRIS Aladin di kasir Alfamart, Alfamidi, Lawson, dan Dan+Dan, dengan min. belanja Rp50.000 per transaksi.
            </p>
          </div>
        </div>

        {/* BAGIAN 3: KARTU "TERHUBUNG KE ALFAGIFT" (LABEL KONSEP) */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-black text-[14px]">
                A
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14px] font-black text-[#1A1D26]">
                    Terhubung ke Alfagift
                  </h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300">
                    Konsep
                  </span>
                </div>
                <span className="text-[10.5px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Akun Tertaut: 0812-****-8819
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Aktif ⚡
            </span>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-gray-100 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-gray-700 leading-snug">
                <strong>Persetujuan sekali di awal:</strong> Transaksi QRIS di kasir otomatis tercatat ke progres Daily Loop — tanpa perlu input kode promo atau tunjukkan nomor HP lagi.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-gray-700 leading-snug">
                Poin A-Poin Alfagift dan Poin Berkah Aladin tersinkronisasi langsung dalam satu saldo terpadu.
              </p>
            </div>
          </div>
        </div>

        {/* BAGIAN 4: KARTU "KODE KAMPANYE KASIR" */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#1037A6]" />
              <div>
                <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                  Kode Kampanye Kasir
                </h3>
                <span className="text-[11px] text-gray-500 font-medium">
                  Scan QR kampanye di counter kasir toko
                </span>
              </div>
            </div>
            <span className="text-[10.5px] font-mono font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
              ALFA-JKT-0213
            </span>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase text-[#1037A6] tracking-wider block mb-1">
                SOLUSI ANTI-ANTREAN (SLIDE 12 &amp; 15)
              </span>
              <p className="text-[11.5px] text-gray-700 leading-relaxed font-medium">
                Daftar &amp; e-KYC bisa dilanjutkan setelah keluar antrean kasir. Promo tetap terkunci ke akun kamu!
              </p>
            </div>
            {/* Visual QR Code representation */}
            <div className="w-16 h-16 bg-white p-1 rounded-xl border border-blue-200 shrink-0 shadow-xs flex items-center justify-center">
              <QrCode className="w-12 h-12 text-[#1037A6]" />
            </div>
          </div>
        </div>

        {/* BARCODE "SCAN MEMBER & TRANSAKSI" (DIPERTAHANKAN) */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs text-center">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <span className="text-[10px] font-black text-[#B62821] bg-red-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                KASIR ALFA GROUP
              </span>
              <h2 className="text-[15px] font-extrabold text-[#1A1D26] mt-1">
                Scan Member &amp; Transaksi
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6C737E] bg-[#F7F8FC] px-2.5 py-1 rounded-full border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{timer}s</span>
            </div>
          </div>

          {/* Toggle Barcode vs QR code */}
          <div className="flex bg-[#F4F5F9] rounded-full p-1 mb-4 max-w-[200px] mx-auto">
            <button
              type="button"
              onClick={() => setActiveBarcode('barcode')}
              className={`flex-1 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeBarcode === 'barcode' ? 'bg-white text-[#1C20C4] shadow-xs' : 'text-[#6C737E]'
              }`}
            >
              Barcode
            </button>
            <button
              type="button"
              onClick={() => setActiveBarcode('qr')}
              className={`flex-1 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeBarcode === 'qr' ? 'bg-white text-[#1C20C4] shadow-xs' : 'text-[#6C737E]'
              }`}
            >
              QR Code
            </button>
          </div>

          {/* Barcode / QR Visual */}
          {activeBarcode === 'barcode' ? (
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-3 flex flex-col items-center shadow-xs">
              <svg width="240" height="58" viewBox="0 0 240 58" className="w-full max-w-[260px] h-[52px]">
                <rect x="0" y="0" width="8" height="58" fill="white" />
                <rect x="10" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="15" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="19" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="26" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="30" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="36" y="0" width="6" height="58" fill="#1A1D26" />
                <rect x="45" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="49" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="55" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="62" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="66" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="72" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="79" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="83" y="0" width="6" height="58" fill="#1A1D26" />
                <rect x="92" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="96" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="102" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="109" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="115" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="119" y="0" width="6" height="58" fill="#1A1D26" />
                <rect x="128" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="132" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="139" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="145" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="149" y="0" width="6" height="58" fill="#1A1D26" />
                <rect x="158" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="164" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="168" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="175" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="181" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="185" y="0" width="6" height="58" fill="#1A1D26" />
                <rect x="194" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="198" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="204" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="211" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="217" y="0" width="1.5" height="58" fill="#1A1D26" />
                <rect x="221" y="0" width="4.5" height="58" fill="#1A1D26" />
                <rect x="228" y="0" width="3" height="58" fill="#1A1D26" />
                <rect x="232" y="0" width="8" height="58" fill="white" />
              </svg>
              <p className="font-mono text-[13px] font-extrabold tracking-[3px] text-[#1A1D26] mt-2.5">
                9928 4102 7719 3320
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-3 flex flex-col items-center shadow-xs">
              <div className="w-28 h-28 bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-center">
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
                  <rect x="5" y="5" width="30" height="30" rx="4" stroke="#1A1D26" strokeWidth="6" />
                  <rect x="13" y="13" width="14" height="14" rx="2" fill="#1C20C4" />
                  <rect x="65" y="5" width="30" height="30" rx="4" stroke="#1A1D26" strokeWidth="6" />
                  <rect x="73" y="13" width="14" height="14" rx="2" fill="#1C20C4" />
                  <rect x="5" y="65" width="30" height="30" rx="4" stroke="#1A1D26" strokeWidth="6" />
                  <rect x="13" y="73" width="14" height="14" rx="2" fill="#1C20C4" />
                  <rect x="42" y="10" width="6" height="12" fill="#1A1D26" />
                  <rect x="52" y="16" width="6" height="6" fill="#1A1D26" />
                  <rect x="42" y="32" width="16" height="6" fill="#1A1D26" />
                  <rect x="10" y="42" width="14" height="6" fill="#1A1D26" />
                  <rect x="30" y="42" width="12" height="12" fill="#1C20C4" />
                  <rect x="48" y="48" width="14" height="8" fill="#1A1D26" />
                  <rect x="70" y="42" width="20" height="6" fill="#1A1D26" />
                  <rect x="42" y="68" width="8" height="16" fill="#1A1D26" />
                  <rect x="60" y="60" width="14" height="10" fill="#1A1D26" />
                  <rect x="78" y="72" width="12" height="14" fill="#1A1D26" />
                </svg>
              </div>
              <p className="font-mono text-[12px] font-bold tracking-wider text-[#1A1D26] mt-2">
                ALFA-ALADIN-992841
              </p>
            </div>
          )}

          <p className="text-[11px] text-[#6C737E] leading-relaxed">
            Tunjukkan barcode ke kasir Alfamart, Alfamidi, Lawson, &amp; Dan+Dan untuk gratis tarik tunai, setor tunai, atau transaksi QRIS.
          </p>
        </div>

        {/* PISAHKAN: BAGIAN "PROMO PERIODIK" DENGAN TANGGAL BERAKHIR */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-red-500" />
                <h3 className="text-[15px] font-black text-[#1A1D26]">
                  Promo Periodik Terbatas
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Promo musiman spesial di luar siklus rutin Daily Loop
              </p>
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Musiman
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {periodicPromos.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border border-gray-100 bg-[#FAFAFC] hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border ${p.tagColor}`}>
                    {p.tag}
                  </span>
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-red-100">
                    <Clock className="w-3 h-3 text-red-500" />
                    {p.validUntil}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-[#1A1D26] leading-snug">
                  {p.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
