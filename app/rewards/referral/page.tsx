'use client'

import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Award,
  Briefcase,
  Gift,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  Store,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function ReferralPage() {
  const [copiedGeneral, setCopiedGeneral] = useState(false)
  const [copiedCampus, setCopiedCampus] = useState(false)
  const freeTransaksi = 18
  const maxFree = 50
  const referralCode = 'ALADIN2026'
  const campusAmbassadorCode = 'ALADIN-KAMPUS-UI26'

  const referrals = [
    { name: 'Budi Santoso', date: '05 Nov 2026', status: 'Aktif', reward: '+Rp25.000' },
    { name: 'Rina Wati', date: '03 Nov 2026', status: 'Aktif', reward: '+Rp25.000' },
    { name: 'Dani Prasetyo', date: '28 Okt 2026', status: 'Daftar', reward: 'Menunggu' },
  ]

  const handleCopyGeneral = () => {
    navigator.clipboard?.writeText?.(referralCode)
    setCopiedGeneral(true)
    setTimeout(() => setCopiedGeneral(false), 2000)
  }

  const handleCopyCampus = () => {
    navigator.clipboard?.writeText?.(campusAmbassadorCode)
    setCopiedCampus(true)
    setTimeout(() => setCopiedCampus(false), 2000)
  }

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Top Header Bar */}
      <header className="shrink-0 w-full bg-[#081D48] text-white z-30 shadow-xs">
        <StatusBar dark={true} />
        <div
          className="w-full flex items-center justify-between px-4"
          style={{ height: '52px' }}
        >
          <Link
            href="/beranda"
            data-back="true"
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.6} />
          </Link>

          <div className="flex items-center gap-1.5">
            <h1 className="text-[16px] font-black text-white tracking-tight">
              Ajak Teman &amp; Komunitas
            </h1>
            <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B] border border-emerald-400">
              Pilar ACQUIRE
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
        {/* FREE TRANSACTION COUNTER HERO CARD */}
        <div className="bg-gradient-to-br from-[#081D48] via-[#0A2558] to-[#1037A6] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#00F0A0]/15 rounded-full blur-2xl pointer-events-none" />

          <span className="text-[11px] font-semibold text-white/75 block mb-1">
            Program 50 Transaksi Gratis Bulanan
          </span>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-black text-white tracking-tight font-mono">
                {freeTransaksi}
              </span>
              <span className="text-[15px] font-semibold text-white/60">
                /{maxFree} Kuota
              </span>
            </div>

            <span className="text-[11px] font-extrabold text-[#081D48] bg-[#00F0A0] px-2.5 py-1 rounded-full shadow-xs">
              {maxFree - freeTransaksi} Tersisa
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#00F0A0] rounded-full transition-all duration-500"
              style={{ width: `${(freeTransaksi / maxFree) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-white/80 mt-2.5 leading-snug">
            Bebas transfer BI-FAST, top-up e-wallet, dan tarik tunai gratis di 18.000+ gerai Alfamart.
          </p>
        </div>

        {/* REGULAR REFERRAL BOX */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs text-center">
          <span className="text-[10px] font-black text-[#1C20C4] tracking-widest uppercase block mb-2.5">
            KODE REFERRAL REGULER
          </span>

          <div className="bg-[#F8FAFC] rounded-2xl border-1.5 border-dashed border-[#C7D2FE] p-3 flex items-center justify-between gap-3 mb-3">
            <span className="font-mono text-[18px] font-black tracking-widest text-[#1C20C4]">
              {referralCode}
            </span>

            <button
              type="button"
              onClick={handleCopyGeneral}
              className="h-9 px-4 rounded-full bg-[#1C20C4] text-white text-[12px] font-bold border-none cursor-pointer shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
            >
              {copiedGeneral ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Salin
                </>
              )}
            </button>
          </div>

          <p className="text-[11.5px] text-gray-600 leading-relaxed">
            Dapatkan saldo Ala Dompet Rp25.000 untuk setiap teman yang mendaftar dan menyelesaikan verifikasi KYC menggunakan kodemu.
          </p>
        </div>

        {/* KARTU SPESIAL: KODE AMBASSADOR KAMPUS (PROGRAM ACQUIRE) */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#1C20C4]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                    Student Ambassador
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#1C20C4] border border-blue-200">
                    Program Kampus
                  </span>
                </div>
                <span className="text-[10.5px] text-gray-500 font-medium">
                  Benefit eksklusif mahasiswa penggerak literasi syariah
                </span>
              </div>
            </div>
          </div>

          {/* Ambassador Code Box */}
          <div className="bg-gradient-to-r from-indigo-50/70 to-blue-50/70 rounded-2xl border border-indigo-200 p-3 flex items-center justify-between gap-3 mb-3.5">
            <div>
              <span className="text-[9.5px] font-bold text-gray-500 block uppercase">
                Kode Ambassador Kampus Kamu
              </span>
              <span className="font-mono text-[15px] font-black tracking-wide text-[#1037A6]">
                {campusAmbassadorCode}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCampus}
              className="h-8 px-3.5 rounded-full bg-[#1037A6] hover:bg-[#0c2b82] text-white text-[11px] font-bold cursor-pointer shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1"
            >
              {copiedCampus ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Salin Kode
                </>
              )}
            </button>
          </div>

          {/* 4 Pilar Benefit Ambassador (Berbasis Benefit) */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-gray-700 block">
              Paket Benefit Aladin Student Ambassador:
            </span>

            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-indigo-700 mb-0.5">
                  <Gift className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black">Reward In-Kind</span>
                </div>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Merchandise eksklusif Aladin (hoodie, tumbler) &amp; voucher belanja.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-emerald-700 mb-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black">Talent Pool Magang</span>
                </div>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Akses prioritas magang &amp; rekrutmen di Bank Aladin Syariah.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-amber-700 mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black">Sertifikat Resmi</span>
                </div>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Pelatihan literasi finansial syariah dengan sertifikasi perbankan.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 text-blue-700 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black">Reward Berjenjang</span>
                </div>
                <p className="text-[10px] text-gray-600 leading-tight">
                  Bonus insentif bertingkat sesuai akumulasi performa referral.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KARTU CAMPUS ACTIVATION (BOOTH & ROADSHOW) */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-[14.5px] font-black text-[#1A1D26]">
                  Campus Activation Booth
                </h3>
                <span className="text-[10.5px] text-gray-500 font-medium">
                  Roadshow offline kampus &amp; onboarding on-the-spot
                </span>
              </div>
            </div>
            <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Booth
            </span>
          </div>

          <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/70 rounded-2xl p-3.5 border border-emerald-200 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-gray-800 leading-snug font-medium">
                <strong>Buka rekening di booth kampus:</strong> Dapatkan voucher Rp25.000 &amp; saldo bonus langsung setelah transaksi QRIS pertama!
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-gray-800 leading-snug font-medium">
                Verifikasi kilat 5 menit hanya dengan KTM (Kartu Tanda Mahasiswa) dan e-KTP.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-medium px-1">
            <span>📍 Booth Aktif: UI Depok, ITB Ganesha, UGM</span>
            <span className="text-emerald-700 font-bold">Jadwal Roadshow →</span>
          </div>
        </div>

        {/* RIWAYAT TEMAN YANG BERGABUNG */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs">
          <span className="text-[14px] font-black text-[#1A1D26] block mb-3">
            Teman yang Bergabung
          </span>

          <div className="divide-y divide-gray-100">
            {referrals.map((r, i) => (
              <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">
                    {r.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {r.date} • Status: {r.status}
                  </p>
                </div>
                <span
                  className={`text-[12.5px] font-black ${
                    r.status === 'Aktif' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {r.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
