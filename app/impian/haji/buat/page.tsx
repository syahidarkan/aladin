'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import MilestoneOverlay, { MilestoneData, MILESTONES } from '@/components/MilestoneOverlay'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function BuatImpianHajiPage() {
  const [monthlyAmount, setMonthlyAmount] = useState<string>('1.500.000')
  const [isLocked, setIsLocked] = useState<boolean>(true)
  const [nisbahRate, setNisbahRate] = useState<number>(7.5) // percent
  const [activeMilestone, setActiveMilestone] = useState<MilestoneData | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // Mark as opened so subsequent visits skip intro
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aladin_has_opened_haji', 'true')
    }
  }, [])

  const numAmount = parseInt(monthlyAmount.replace(/\D/g, '') || '0', 10)
  const onhReguler = 25000000
  const saldoMengendap = 10000
  const biayaMaterai = 2000
  const totalTarget = onhReguler + saldoMengendap + biayaMaterai // Rp25.012.000

  const estimatedMonths = numAmount > 0 ? Math.ceil(totalTarget / numAmount) : 0
  const targetYear = 2026 + Math.ceil(estimatedMonths / 12)

  const handleSimulateMilestone = (threshold: number) => {
    const found = MILESTONES.find((m) => m.threshold === threshold)
    if (found) {
      setActiveMilestone(found)
    }
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

      {/* Milestone Animation Overlay (TikTok Live Style) */}
      <MilestoneOverlay
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
      />

      {/* Header Bar */}
      <div
        className="w-full bg-[#E8F5E9] border-b border-[#D1E7DD] flex items-center justify-between shrink-0"
        style={{ height: '48px', paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/impian"
          data-back="true"
          className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
          aria-label="Kembali ke Ala Impian"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
        </Link>

        <h1 className="text-[17px] font-extrabold text-[#1A1D26]">Buat Impian Haji</h1>

        <div style={{ width: '28px' }} />
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {/* Target Header Card with Exact 3-Part Breakdown */}
        <div
          style={{
            background: 'linear-gradient(135deg, #022C22 0%, #064E3B 50%, #047857 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.3)',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black text-[#00F3AD] uppercase tracking-wider">
              SETORAN AWAL BPIH • SISKOHAT RESMI
            </span>
            <span className="text-[10px] font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              BPKH PARTNER
            </span>
          </div>

          <span className="text-[28px] font-black tracking-tight block text-white">
            Rp25.012.000
          </span>

          {/* 3-Part Breakdown */}
          <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-3 gap-1.5 text-[10.5px]">
            <div>
              <span className="text-emerald-200/80 block text-[9.5px] font-medium">Porsi ONH:</span>
              <span className="font-extrabold text-white text-[12px]">Rp25.000.000</span>
            </div>
            <div>
              <span className="text-emerald-200/80 block text-[9.5px] font-medium">Saldo Endap:</span>
              <span className="font-extrabold text-white text-[12px]">Rp10.000</span>
            </div>
            <div>
              <span className="text-emerald-200/80 block text-[9.5px] font-medium">Bea Materai:</span>
              <span className="font-extrabold text-[#00F3AD] text-[12px]">Rp2.000</span>
            </div>
          </div>
        </div>

        {/* Badge Siskohat Info */}
        <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            
          </div>
          <div className="text-[11.5px]">
            <span className="font-extrabold text-emerald-950 block">Terhubung Siskohat Kemenag RI</span>
            <span className="text-emerald-700">Nomor porsi haji diterbitkan langsung saat target tercapai.</span>
          </div>
        </div>

        {/* Input Nabung Per Bulan */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
            Simulasi Nabung Setiap Bulan
          </span>
          <div className="flex items-center text-[26px] font-black text-[#1A1D26] border-b border-gray-200 pb-2 mb-2">
            <span className="text-[#1C20C4] mr-2">Rp</span>
            <input
              type="text"
              value={monthlyAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '')
                setMonthlyAmount(raw ? Number(raw).toLocaleString('id-ID') : '0')
              }}
              className="w-full bg-transparent font-black outline-none text-[#1A1D26]"
            />
          </div>

          <div className="flex justify-between items-center text-[12px] pt-1">
            <span className="text-gray-500">Estimasi dapat nomor porsi:</span>
            <span className="font-extrabold text-[#1C20C4]">
              {numAmount > 0 ? `${estimatedMonths} Bulan (Tahun ${targetYear})` : '—'}
            </span>
          </div>
        </div>

        {/* Slider Bagi Hasil Cerdas */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
              Estimasi Bagi Hasil Syariah:
            </span>
            <span className="font-extrabold text-[#059669] text-[13px]">
              {nisbahRate.toFixed(1)}% p.a.
            </span>
          </div>
          <input
            type="range"
            min="5.5"
            max="8.5"
            step="0.5"
            value={nisbahRate}
            onChange={(e) => setNisbahRate(parseFloat(e.target.value))}
            className="w-full accent-[#059669] mt-2 mb-2"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>5,5% Standar</span>
            <span>7,0% Optimal</span>
            <span>8,5% Maksimal</span>
          </div>
        </div>

        {/* Roadmap Menuju Baitullah (Interactive 3D Gamifikasi 5 Milestone) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)',
          }}
        >
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F3AD] animate-pulse" />
              <span className="text-[12px] font-extrabold text-white tracking-tight">
                Tahapan Menuju Porsi Haji
              </span>
            </div>
            <span className="text-[9.5px] font-black text-[#064E3B] bg-[#00F3AD] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              5 Milestone Berkah
            </span>
          </div>
          <p className="text-[11.5px] text-white/80 mb-3 leading-relaxed">
            Pencapaian porsi BPKH menghadirkan visualisasi 3D perjalanan ibadah &amp; audio takbir:
          </p>

          {/* 5 Milestone Interactive Grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {/* 1. Niat & Kain Ihram */}
            <button
              type="button"
              onClick={() => handleSimulateMilestone(1000000)}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-center active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[78px]"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#00F3AD] mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-[8.5px] font-bold text-white/70 block">1 Jt</span>
              <span className="text-[9.5px] font-black text-[#00F3AD] block leading-tight">Ihram</span>
            </button>

            {/* 2. Bandara Soekarno-Hatta */}
            <button
              type="button"
              onClick={() => handleSimulateMilestone(5000000)}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-center active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[78px]"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#00F3AD] mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7" />
                </svg>
              </div>
              <span className="text-[8.5px] font-bold text-white/70 block">5 Jt</span>
              <span className="text-[9.5px] font-black text-[#00F3AD] block leading-tight">CGK</span>
            </button>

            {/* 3. Pesawat Mengudara */}
            <button
              type="button"
              onClick={() => handleSimulateMilestone(15000000)}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-center active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[78px]"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#00F3AD] mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </div>
              <span className="text-[8.5px] font-bold text-white/70 block">15 Jt</span>
              <span className="text-[9.5px] font-black text-[#00F3AD] block leading-tight">Pesawat</span>
            </button>

            {/* 4. Bandara King Abdulaziz Jeddah */}
            <button
              type="button"
              onClick={() => handleSimulateMilestone(25000000)}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-center active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[78px]"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#00F3AD] mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10l8-6 8 6v10H4zM9 20v-6h6v6" />
                </svg>
              </div>
              <span className="text-[8.5px] font-bold text-white/70 block">25 Jt</span>
              <span className="text-[9.5px] font-black text-[#00F3AD] block leading-tight">JED</span>
            </button>

            {/* 5. Kemegahan Baitullah */}
            <button
              type="button"
              onClick={() => handleSimulateMilestone(30000000)}
              className="p-2 bg-gradient-to-br from-[#00F3AD] to-[#10B981] text-[#064E3B] rounded-xl text-center shadow-lg active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[78px]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#064E3B]/15 flex items-center justify-center text-[#064E3B] mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="text-[8.5px] font-extrabold text-[#064E3B]/70 block">30 Jt</span>
              <span className="text-[9.5px] font-black text-[#064E3B] block leading-tight">Ka&apos;bah!</span>
            </button>
          </div>
        </div>

        {/* Lock Ala Impian Toggle */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] flex items-center justify-between">
          <div className="flex items-start gap-3 max-w-[270px]">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-[14px] text-[#1A1D26]">Kunci Ala Impianmu</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isLocked
                  ? 'Terkunci disiplin sampai nomor porsi haji resmi terbit'
                  : 'Fleksibel: Saldo bisa dipindah kapan saja'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`relative w-[48px] h-[28px] rounded-full transition-colors cursor-pointer shrink-0 ${
              isLocked ? 'bg-[#1C20C4]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-[24px] h-[24px] bg-white rounded-full shadow-sm transition-transform ${
                isLocked ? 'translate-x-[20px]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => {
            if (numAmount > 0) setIsSuccess(true)
          }}
          disabled={numAmount === 0}
          className="w-full h-12 bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          Daftar Antrian Porsi Haji BPKH
        </button>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#059669]">
              <CheckCircle2 className="w-9 h-9 text-[#059669]" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1A1D26]">
              Ala Impian Haji Terdaftar!
            </h3>
            <p className="text-[12px] text-gray-500 mt-1 mb-5">
              Target BPIH <strong>Rp25.012.000</strong> telah aktif.<br />
              Nabung Rp{monthlyAmount}/bulan untuk amankan nomor porsi di Siskohat Kemenag.
            </p>
            <Link
              href="/keuangan"
              className="block w-full py-3 bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-md"
            >
              Lihat di Tabungan &amp; Deposito
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
