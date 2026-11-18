'use client'

import React from 'react'
import Link from 'next/link'
import StatusBar from '@/components/StatusBar'
import {
  ArrowLeft,
  PieChart,
  Landmark,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  ArrowRight,
  Wallet,
  Coins,
} from 'lucide-react'

export default function FinancialCalculatorHubPage() {
  const calculators = [
    {
      id: 'budget',
      title: 'Kalkulator Budget',
      subtitle: 'Harian & Bulanan',
      desc: 'Atur alokasi syariah 50/20/10/20, ketahui batas jajan harian, dan buat kantong otomatis.',
      href: '/kalkulator/budget',
      tag: 'Everyday Budgeting',
      icon: <PieChart className="w-6 h-6 text-[#1037A6]" />,
      iconBg: 'bg-blue-50 border-blue-200',
      badge: 'Baru',
      ctaText: 'Hitung Budget',
    },
    {
      id: 'haji',
      title: 'Kalkulator Haji',
      subtitle: 'Target Porsi SISKOHAT',
      desc: 'Hitung waktu kumpul setoran awal porsi Rp25 Juta & estimasi jadwal keberangkatan Kemenag.',
      href: '/kalkulator/haji',
      tag: 'Perencanaan Ibadah',
      icon: <Landmark className="w-6 h-6 text-[#064E3B]" />,
      iconBg: 'bg-emerald-50 border-emerald-200',
      badge: 'Populer',
      ctaText: 'Hitung Target Haji',
    },
    {
      id: 'investasi',
      title: 'Kalkulator Investasi',
      subtitle: 'Deposito, Reksadana & Emas',
      desc: 'Simulasi nisbah bagi hasil deposito hingga 85:15 serta proyeksi halal reksa dana & emas 24K.',
      href: '/kalkulator/investasi',
      tag: 'Wealth & Bagi Hasil',
      icon: <TrendingUp className="w-6 h-6 text-[#1C20C4]" />,
      iconBg: 'bg-indigo-50 border-indigo-200',
      badge: 'Komprehensif',
      ctaText: 'Hitung Bagi Hasil',
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
      {/* 1. Top Header Bar */}
      <header className="shrink-0 w-full bg-white border-b border-[#ECEEF2] z-30">
        <StatusBar />
        <div className="w-full bg-white flex items-center justify-between px-4" style={{ height: '52px' }}>
          <Link
            href="/beranda"
            data-back="true"
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </Link>

          <div className="flex items-center gap-1.5">
            <h1 className="text-[16px] font-black text-[#1A1D26] tracking-tight">
              Aladin Calculator
            </h1>
            <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-[#00F0A0] text-[#064E3B] border border-emerald-400">
              ⭐ Fitur Utama
            </span>
          </div>

          <div style={{ width: '36px' }} />
        </div>
      </header>

      {/* 2. Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 p-5 pb-24">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#001F5D] via-[#1037A6] to-[#1C20C4] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#00F0A0]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <Calculator className="w-3.5 h-3.5 text-[#00F0A0]" />
              <span className="text-[11px] font-black tracking-wide">Financial Planning Syariah</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-300">#FlywithAladin</span>
          </div>

          <h2 className="text-[20px] font-black tracking-tight leading-snug mb-1 relative z-10">
            Aladin Financial Calculator
          </h2>
          <p className="text-[12px] text-white/85 leading-relaxed relative z-10">
            Hitung dulu, baru melangkah — semua simulasi transparan, terukur, dan sesuai prinsip syariah tanpa riba.
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/90">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0A0]" />
              Diawasi DSN-MUI &amp; OJK
            </span>
            <span className="font-semibold text-emerald-200">100% Halal &amp; Transparan</span>
          </div>
        </div>

        {/* 3 Large Calculator Cards */}
        <div className="space-y-3.5">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className="bg-white rounded-3xl p-5 border border-[#ECEEF2] shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${calc.iconBg} shrink-0`}>
                      {calc.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-black text-[#1A1D26] leading-tight">
                          {calc.title}
                        </h3>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-[#1037A6] border border-blue-200">
                          {calc.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">{calc.subtitle}</span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                    {calc.tag}
                  </span>
                </div>

                <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
                  {calc.desc}
                </p>
              </div>

              <Link
                href={calc.href}
                className="w-full h-11 rounded-2xl bg-[#1037A6] hover:bg-[#0c2b82] text-white font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <span>{calc.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Informative Assurance Card */}
        <div className="bg-[#F0FDF4] rounded-2xl p-4 border border-emerald-200 text-[#064E3B]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[13px] font-black text-[#064E3B]">
                Perhitungan Bersih Sesuai Syariat
              </h4>
              <p className="text-[11.5px] text-[#064E3B]/85 mt-0.5 leading-relaxed">
                Seluruh proyeksi menggunakan akad Mudharabah Muthlaqah, nisbah bagi hasil riil, dan tidak mengandung unsur bunga (riba), spekulasi berlebih (gharar), maupun maisir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
