'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import MilestoneOverlay, { MilestoneData, MILESTONES } from '@/components/MilestoneOverlay'

export default function BuatImpianUmrahPage() {
  const [monthlyAmount, setMonthlyAmount] = useState<string>('2.500.000')
  const [isLocked, setIsLocked] = useState<boolean>(true)
  const [selectedTravel, setSelectedTravel] = useState<string>('Maktour Travel (AMPHURI)')
  const [activeMilestone, setActiveMilestone] = useState<MilestoneData | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  // Mark as opened so subsequent visits skip intro
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aladin_has_opened_umrah', 'true')
    }
  }, [])

  const numAmount = parseInt(monthlyAmount.replace(/\D/g, '') || '0', 10)
  const targetSaldo = 30000000
  const dpTravel = 7500000
  const sisaPocket = targetSaldo - dpTravel
  const estimatedMonths = numAmount > 0 ? Math.ceil(targetSaldo / numAmount) : 0

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
          href="/impian/umrah/intro/2"
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

        <h1 className="text-[17px] font-extrabold text-[#1A1D26]">Buat Impian Umrah</h1>

        <Link
          href="/impian/umrah/referral"
          className="text-[11.5px] font-extrabold text-[#1C20C4] hover:underline"
        >
          Referral →
        </Link>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {/* Target Header Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #047857 55%, #1C20C4 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.2)',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black text-[#00F3AD] uppercase tracking-wider">
              TARGET TERKUMPUL • IMPIAN UMRAH
            </span>
            <span className="text-[10px] font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">
              HIMPUH / AMPHURI
            </span>
          </div>

          <span className="text-[28px] font-black tracking-tight block">
            Rp30.000.000
          </span>

          {/* Breakdown DP vs Sisa Pocket */}
          <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-emerald-200 block text-[9.5px]">DP ke Travel Mitra:</span>
              <span className="font-extrabold text-white text-[12px]">Rp{dpTravel.toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-emerald-200 block text-[9.5px]">Sisa di Pocket Aladin:</span>
              <span className="font-extrabold text-[#00F3AD] text-[12px]">Rp{sisaPocket.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Travel Partner Selector */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
            Pilih Biro Travel Mitra Resmi:
          </label>
          <select
            value={selectedTravel}
            onChange={(e) => setSelectedTravel(e.target.value)}
            className="w-full h-11 px-3 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[13px] text-[#1A1D26] outline-none"
          >
            <option value="Maktour Travel (AMPHURI)">Maktour Travel • Akreditasi A (AMPHURI)</option>
            <option value="Tazkia Travel Syariah (HIMPUH)">Tazkia Travel • Bimbingan Ibadah (HIMPUH)</option>
            <option value="Al-Bayan Umrah Mandiri (AMPHURI)">Al-Bayan Umrah • Penerbangan Langsung</option>
          </select>
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
            <span className="text-gray-500">Estimasi waktu:</span>
            <span className="font-extrabold text-[#1C20C4]">
              {numAmount > 0 ? `${estimatedMonths} Bulan (${(estimatedMonths / 12).toFixed(1)} Tahun)` : '—'}
            </span>
          </div>
        </div>

        {/* Roadmap Menuju Baitullah (Interactive 3D Gamifikasi 5 Milestone) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #081D48 0%, #0D2B6B 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(8, 29, 72, 0.25)',
          }}
        >
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F3AD] animate-pulse" />
              <span className="text-[12px] font-extrabold text-white tracking-tight">
                Tahapan Menuju Baitullah
              </span>
            </div>
            <span className="text-[9.5px] font-black text-[#081D48] bg-[#00F3AD] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              5 Milestone Berkah
            </span>
          </div>
          <p className="text-[11.5px] text-white/80 mb-3 leading-relaxed">
            Pencapaian target menghadirkan visualisasi 3D perjalanan ibadah &amp; audio takbir:
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
              className="p-2 bg-gradient-to-br from-[#00F3AD] to-[#059669] text-[#081D48] rounded-xl text-center shadow-lg active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[78px]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#081D48]/15 flex items-center justify-center text-[#081D48] mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="text-[8.5px] font-extrabold text-[#081D48]/70 block">30 Jt</span>
              <span className="text-[9.5px] font-black text-[#081D48] block leading-tight">Ka&apos;bah! ✦</span>
            </button>
          </div>
        </div>

        {/* Lock Ala Impian Toggle */}
        <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] flex items-center justify-between">
          <div className="flex items-start gap-3 max-w-[270px]">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#1C20C4] flex items-center justify-center shrink-0 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-[14px] text-[#1A1D26]">Kunci Ala Impianmu</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isLocked
                  ? 'Uang terkunci aman sampai target tercapai (bebas biaya penalti)'
                  : 'Fleksibel: Saldo bisa ditarik kapan saja ke Ala Dompet'}
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
          Simpan &amp; Wujudkan Impian Umrah
        </button>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#047857] text-2xl font-black">
              ✓
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1A1D26]">
              Ala Impian Umrah Aktif!
            </h3>
            <p className="text-[12px] text-gray-500 mt-1 mb-5">
              Mitra Travel: <strong>{selectedTravel}</strong><br />
              Nabung Rp{monthlyAmount}/bulan • Target Rp30 Juta
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
