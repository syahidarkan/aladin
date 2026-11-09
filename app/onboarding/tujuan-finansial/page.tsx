'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { Compass, Video, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, SlidersHorizontal } from 'lucide-react'

export default function TujuanFinansialPage() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState<string>('ibadah')
  const [abVariant, setAbVariant] = useState<'goal-based' | 'standard'>('goal-based')

  const goals = [
    {
      id: 'ibadah',
      title: 'Nabung buat Ibadah',
      desc: 'Persiapan ibadah Umrah, Haji reguler/khusus, atau Qurban ke Baitullah.',
      badge: 'Prioritas Utama',
      recommendation: {
        title: 'Ala Impian Umrah & Haji Terpadu',
        desc: 'Setoran ringan mulai Rp10.000 dengan nisbah bagi hasil kompetitif setara 8% p.a., terhubung langsung dengan asosiasi resmi dan SISKOHAT Kemenag.',
        cta: 'Buka Rekening Impian Ibadah',
        href: '/impian/umrah/intro/1',
      },
    },
    {
      id: 'harian',
      title: 'Kelola Uang Harian',
      desc: 'Atur pos belanja bulanan, jajan, bayar tagihan, dan belanja hemat di Alfamart.',
      badge: 'Bebas Admin',
      recommendation: {
        title: 'Ala Dompet & Alfa Daily Loop',
        desc: 'Bebas biaya setor dan tarik tunai di seluruh gerai Alfamart, transfer BI-FAST gratis 50x/bulan, dan integrasi barcode member otomatis.',
        cta: 'Aktifkan Pos Anggaran Harian',
        href: '/pocket',
      },
    },
    {
      id: 'investasi',
      title: 'Mulai Investasi & Kekayaan Halal',
      desc: 'Kembangkan dana secara syariah lewat Ala Deposito 8,5% & Reksa Dana halal.',
      badge: 'Imbal Hasil Optimal',
      recommendation: {
        title: 'Ala Deposito & Wealth Hub',
        desc: 'Nisbah bagi hasil 85%:15% bebas riba dengan talangan likuiditas Qardh T+0 instan yang aman diawasi DSN-MUI.',
        cta: 'Simulasi Bagi Hasil Deposito',
        href: '/simulasi-bagi-hasil',
      },
    },
    {
      id: 'anak',
      title: 'Nabung buat Masa Depan Anak',
      desc: 'Tabungan berjangka syariah terproteksi untuk dana pendidikan dan masa depan anak.',
      badge: 'Proteksi Berjangka',
      recommendation: {
        title: 'Ala Impian Pendidikan Terkunci',
        desc: 'Kunci otomatis tabungan bulanan agar rencana sekolah buah hati terwujud tanpa terganggu pengeluaran impulsif.',
        cta: 'Atur Target Dana Pendidikan',
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

      {/* 2. Top Header Bar */}
      <div
        className="w-full h-[46px] flex items-center justify-between bg-white border-b border-[#F0F1F5] shrink-0"
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/beranda"
          className="flex items-center justify-center p-1 -ml-1 text-gray-700 active:opacity-60 transition-opacity"
          aria-label="Kembali ke Beranda"
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

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00F0A0]" />
          <span className="text-[12px] font-black text-[#1037A6] tracking-wider uppercase">
            SOBAT ALADIN
          </span>
        </div>

        <Link
          href="/beranda"
          className="text-[12.5px] font-bold text-gray-400 hover:text-gray-700 transition-colors"
        >
          Lewati
        </Link>
      </div>

      {/* 3. 30-Day Active Activation Tracker Bar */}
      <div className="bg-[#EFF2FE] px-5 py-2.5 border-b border-[#DDE4FD] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1037A6]" />
          <span className="text-[11px] font-extrabold text-[#1037A6]">
            Aktivasi Pasca-KYC: 30-Day Active Target
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10.5px] font-black text-[#059669] bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-[#059669]" />
          <span>KYC Terverifikasi</span>
        </div>
      </div>

      {/* 4. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar space-y-4"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '110px',
        }}
      >
        {/* Title & Guidance */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1037A6] text-white px-2.5 py-0.5 rounded-full">
              Langkah 1 dari 2: Pilih Fokus
            </span>

            {/* A/B Testing Badge Toggle */}
            <button
              type="button"
              onClick={() => setAbVariant(abVariant === 'goal-based' ? 'standard' : 'goal-based')}
              className="text-[10px] font-bold text-[#1037A6] bg-white border border-[#C7D2FE] px-2 py-0.5 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition-colors cursor-pointer"
              title="A/B Testing Simulator: Onboarding Goal-Based vs Standar"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>A/B: {abVariant === 'goal-based' ? 'Goal-Based' : 'Standar'}</span>
            </button>
          </div>

          <h1 className="text-[20px] font-extrabold text-[#1A1D26] tracking-tight leading-snug">
            Apa fokus keuangan utamamu sekarang?
          </h1>
          <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
            Sobat Aladin akan menyesuaikan dashboard, rekomendasi produk, dan aksi berikutnya agar tabunganmu cepat terwujud.
          </p>
        </div>

        {/* 4 Core Goal Options */}
        <div className="space-y-2.5">
          {goals.map((g) => {
            const isSelected = selectedGoal === g.id

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGoal(g.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                  isSelected
                    ? 'bg-[#EFF2FE] border-[#1037A6] shadow-sm ring-1 ring-[#1037A6]/20'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="pr-3 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[14.5px] font-extrabold text-[#1A1D26] leading-tight">
                      {g.title}
                    </h3>
                    {g.badge && (
                      <span className="text-[9.5px] font-black bg-emerald-50 text-[#059669] border border-emerald-200 px-2 py-0.5 rounded-full">
                        {g.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-gray-500 leading-relaxed">
                    {g.desc}
                  </p>
                </div>

                {/* Selection Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-[#1037A6] bg-[#1037A6]' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Dynamic Personalized "Aksi Berikutnya" Recommendation Box */}
        <div className="bg-white rounded-2xl p-4 border border-[#C7D2FE] shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#EFF2FE] text-[#1037A6] flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-[#1037A6]" />
              </div>
              <span className="text-[11.5px] font-black text-[#1037A6] uppercase tracking-wide">
                Rekomendasi Aksi Berikutnya
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669]">
              {abVariant === 'goal-based' ? 'Mode Goal-Based' : 'Mode Standar'}
            </span>
          </div>

          <div>
            <h4 className="text-[15px] font-black text-[#1A1D26]">
              {abVariant === 'goal-based'
                ? currentGoal.recommendation.title
                : 'Eksplorasi Beranda & Fitur Lengkap Aladin'}
            </h4>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              {abVariant === 'goal-based'
                ? currentGoal.recommendation.desc
                : 'Mulai dengan setoran perdana ke Ala Dompet untuk menikmati bebas transfer BI-FAST dan promo gratis tarik tunai di Alfamart.'}
            </p>
          </div>

          <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#059669]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Follow-up pintar &amp; pengingat mingguan disesuaikan otomatis</span>
          </div>
        </div>

        {/* Rescue Mechanism: Aladin Bantu Concierge & Video Call */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-[#F8FAFC] border border-gray-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1037A6] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Video className="w-4.5 h-4.5 text-[#00F0A0]" />
            </div>
            <div>
              <span className="text-[12.5px] font-extrabold text-[#1A1D26] block leading-tight">
                Bingung menentukan prioritas?
              </span>
              <span className="text-[10.5px] text-gray-500 block mt-0.5">
                Konsultasikan gratis via Video Call Aladin Bantu
              </span>
            </div>
          </div>
          <Link
            href="/bantu"
            className="text-[12px] font-extrabold text-[#1037A6] hover:underline shrink-0 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs"
          >
            Bantuan →
          </Link>
        </div>
      </div>

      {/* 5. Bottom Sticky CTA Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F0F1F5] z-20">
        <Link
          href={
            abVariant === 'goal-based'
              ? currentGoal.recommendation.href
              : '/beranda'
          }
          className="w-full h-12 bg-[#1037A6] hover:bg-[#0D2D8A] text-white rounded-full font-extrabold text-[14.5px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
        >
          <span>
            {abVariant === 'goal-based'
              ? currentGoal.recommendation.cta
              : 'Masuk ke Beranda Aladin'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
