'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'

export default function TujuanFinansialPage() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState<string>('ibadah')

  const goals = [
    {
      id: 'ibadah',
      title: 'Nabung untuk Ibadah',
      desc: 'Persiapan Umrah, Haji reguler/khusus, atau Qurban ke tanah suci.',
      badge: 'Favorit',
      recommendation: {
        title: 'Ala Impian Haji & Umrah',
        desc: 'Setoran ringan mulai Rp10.000, bagi hasil kompetitif setara 8% p.a., langsung terhubung porsi BPKH/Kemenag.',
        cta: 'Buka Impian Ibadah',
        href: '/impian/umrah/intro/1',
      },
    },
    {
      id: 'investasi',
      title: 'Kembangkan Kekayaan Halal',
      desc: 'Maksimalkan imbal hasil lewat Ala Deposito 8,5% & Reksa Dana Syariah.',
      badge: 'Tinggi Return',
      recommendation: {
        title: 'Ala Deposito & Wealth Hub',
        desc: 'Nisbah bagi hasil 85%:15% bebas riba dengan talangan likuiditas Qardh T+0 instan.',
        cta: 'Simulasi Bagi Hasil',
        href: '/simulasi-bagi-hasil',
      },
    },
    {
      id: 'harian',
      title: 'Kelola Belanja & Harian',
      desc: 'Atur budget bulanan, bayar tagihan, dan belanja hemat di Alfamart.',
      recommendation: {
        title: 'Ala Dompet & Alfa Daily Loop',
        desc: 'Kuota 5x gratis setor/tarik tunai tiap bulan dan barcode member otomatis.',
        cta: 'Lihat Rewards Alfa',
        href: '/rewards/alfa',
      },
    },
    {
      id: 'darurat',
      title: 'Siapkan Dana Darurat',
      desc: 'Simpanan likuid yang aman dan siap dicairkan kapan saja tanpa denda.',
      recommendation: {
        title: 'Ala Impian Tanpa Target',
        desc: 'Pisahkan saldo darurat dari rekening utama, fleksibel tarik sewaktu-waktu.',
        cta: 'Mulai Nabung Darurat',
        href: '/impian',
      },
    },
    {
      id: 'anak',
      title: 'Pendidikan & Masa Depan Anak',
      desc: 'Tabungan berjangka syariah terproteksi untuk jenjang sekolah masa depan.',
      recommendation: {
        title: 'Ala Impian Terkunci',
        desc: 'Kunci tabungan secara otomatis agar rencana pendidikan tidak terganggu pengeluaran impulsif.',
        cta: 'Atur Target Pendidikan',
        href: '/impian',
      },
    },
  ]

  const currentGoal = goals.find((g) => g.id === selectedGoal) || goals[0]

  return (
    <div
      className="flex flex-col h-full bg-[#F7F8FC] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. iOS Status Bar */}
      <StatusBar time="22.25" batteryLevel={33} dark={false} />

      {/* 2. Top Header Bar (Authentic Aladin Back Button + Title) */}
      <div
        className="w-full h-[44px] flex items-center justify-between bg-white border-b border-[#F0F1F5] shrink-0"
        style={{ paddingLeft: '23px', paddingRight: '23px' }}
      >
        <Link
          href="/beranda"
          className="flex items-center justify-center p-1 -ml-1 active:opacity-60 transition-opacity"
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

        <span className="text-[12px] font-extrabold text-[#1C20C4] uppercase tracking-wider">
          SOBAT ALADIN
        </span>

        <Link
          href="/beranda"
          className="text-[13px] font-bold text-[#6C737E] hover:text-[#1A1D26] transition-colors"
        >
          Lewati
        </Link>
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingLeft: '23px',
          paddingRight: '23px',
          paddingTop: '16px',
          paddingBottom: '100px',
        }}
      >
        {/* Step indicator & title */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#EFF0FC] text-[#1C20C4] px-2.5 py-0.5 rounded-full">
              LANGKAH 1 DARI 2
            </span>
          </div>
          <h1 className="text-[20px] font-extrabold text-[#1A1D26] tracking-tight leading-snug">
            Apa tujuan finansial utamamu bersama Aladin?
          </h1>
          <p className="text-[12.5px] text-[#6C737E] mt-1 leading-relaxed">
            Kami akan menyesuaikan dashboard, rekomendasi produk, dan perhitungan bagi hasil sesuai prioritasmu.
          </p>
        </div>

        {/* Goals Selectable Cards */}
        <div className="space-y-2.5">
          {goals.map((g) => {
            const isSelected = selectedGoal === g.id

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGoal(g.id)}
                className={`w-full p-3.5 rounded-[18px] border text-left transition-all cursor-pointer flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                  isSelected
                    ? 'bg-[#EFF0FC] border-[#1C20C4] shadow-[0_4px_12px_rgba(28,32,196,0.08)]'
                    : 'bg-white border-[#F0F1F5] hover:border-gray-300'
                }`}
              >
                <div className="pr-3 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[14px] font-bold text-[#1A1D26] leading-tight">
                      {g.title}
                    </h3>
                    {g.badge && (
                      <span className="text-[9.5px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full">
                        {g.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-[#6C737E] leading-relaxed">
                    {g.desc}
                  </p>
                </div>

                {/* Selection Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-[#1C20C4] bg-[#1C20C4]' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Dynamic Personalized Recommendation Box */}
        <div className="bg-white rounded-[20px] p-[18px] border border-[#F0F1F5] shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#EFF0FC] text-[#1C20C4] flex items-center justify-center font-bold text-[12px]">
              ★
            </div>
            <span className="text-[11.5px] font-extrabold text-[#1C20C4] uppercase tracking-wide">
              Rekomendasi Sobat Aladin
            </span>
          </div>

          <div>
            <h4 className="text-[15px] font-extrabold text-[#1A1D26]">
              {currentGoal.recommendation.title}
            </h4>
            <p className="text-[12px] text-[#6C737E] mt-1 leading-relaxed">
              {currentGoal.recommendation.desc}
            </p>
          </div>
        </div>

        {/* Rescue Link to Aladin Bantu & Hub */}
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#1C20C4] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <span className="text-[12px] font-bold text-[#1A1D26] block leading-tight">
                Bingung memilih tujuan finansial?
              </span>
              <span className="text-[10.5px] text-gray-500">
                Konsultasikan via Video Call &amp; Concierge Aladin
              </span>
            </div>
          </div>
          <Link
            href="/bantu"
            className="text-[12px] font-extrabold text-[#1C20C4] hover:underline shrink-0"
          >
            Bantuan →
          </Link>
        </div>
      </div>

      {/* 4. Bottom Sticky CTA Button */}
      <div className="absolute bottom-0 left-0 right-0 p-[20px] bg-white border-t border-[#F0F1F5] z-20">
        <Link
          href={currentGoal.recommendation.href}
          className="w-full h-[47.5px] bg-[#1C20C4] text-white rounded-full font-bold text-[15px] flex items-center justify-center shadow-[0_4px_12px_rgba(28,32,196,0.25)] active:scale-98 transition-all"
        >
          {currentGoal.recommendation.cta}
        </Link>
      </div>
    </div>
  )
}
