'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function RewardsAlfaPage() {
  const [timer, setTimer] = useState(60)
  const [claimedReward, setClaimedReward] = useState<number | null>(null)
  const [activeBarcode, setActiveBarcode] = useState<'barcode' | 'qr'>('barcode')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 1 ? t - 1 : 60))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const milestones = [
    { id: 1, step: '1', title: 'Buka Rekening Aladin', status: 'done', reward: 'Gratis Tarik/Setor 5x' },
    { id: 2, step: '2', title: 'Verifikasi KYC Selesai', status: 'done', reward: 'Voucher Alfa Rp15.000' },
    { id: 3, step: '3', title: 'Transaksi Perdana', status: 'done', reward: 'Minyak Goreng 1L Gratis' },
    { id: 4, step: '4', title: 'Aktif 30 Hari', status: 'current', reward: 'Voucher Belanja Rp25.000' },
    { id: 5, step: '5', title: 'Aktif 90 Hari Setia', status: 'locked', reward: 'Saldo Ala Dompet Rp50.000' },
  ]

  const outletHistory = [
    {
      outlet: 'Alfamidi Lenteng Agung',
      date: '06 Nov 2026',
      type: 'Tarik Tunai Gratis',
      detail: 'Rp200.000 (Biaya Rp0)',
      badge: 'Selesai',
    },
    {
      outlet: 'Alfamart Margonda Raya',
      date: '02 Nov 2026',
      type: 'Voucher Belanja JSM',
      detail: 'Hemat Rp15.000',
      badge: 'Terklaim',
    },
    {
      outlet: 'Lawson St. Tebet',
      date: '29 Okt 2026',
      type: 'Cashback 20% QRIS',
      detail: 'Oden & Coffee',
      badge: 'Selesai',
    },
  ]

  return (
    <div
      className="flex flex-col h-full bg-[#F7F8FC] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Safe Area Spacer */}
      <StatusBar />

      {/* 2. Top Header Bar (Clean Native Header) */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
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

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Aladin × Alfa Daily Loop
        </h1>

        <div style={{ width: '36px' }} />
      </div>

      {/* 3. Scrollable Main Content (Generous 20px Margins, Space Between Cards) */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar space-y-4"
        style={{
          padding: '16px 20px 48px 20px',
        }}
      >
        {/* Cashier Barcode & QR Card */}
        <div className="bg-white rounded-[24px] p-5 border border-[#ECEEF2] shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <span className="text-[10px] font-extrabold text-[#B62821] bg-red-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                KASIR ALFA GROUP
              </span>
              <h2 className="text-[15px] font-extrabold text-[#1A1D26] mt-1">
                Scan Member &amp; Transaksi
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6C737E] bg-[#F7F8FC] px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{timer}s</span>
            </div>
          </div>

          {/* Toggle Barcode vs QR code */}
          <div className="flex bg-[#F4F5F9] rounded-full p-1 mb-4 max-w-[200px] mx-auto">
            <button
              onClick={() => setActiveBarcode('barcode')}
              className={`flex-1 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeBarcode === 'barcode' ? 'bg-white text-[#1C20C4] shadow-xs' : 'text-[#6C737E]'
              }`}
            >
              Barcode
            </button>
            <button
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
            <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] mb-3 flex flex-col items-center shadow-xs">
              {/* Authentic High-Fidelity SVG Barcode */}
              <svg width="240" height="58" viewBox="0 0 240 58" className="w-full max-w-[260px] h-[52px]">
                {/* Quiet zone left */}
                <rect x="0" y="0" width="8" height="58" fill="white" />
                {/* Code-128 Bars Pattern */}
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
                {/* Quiet zone right */}
                <rect x="232" y="0" width="8" height="58" fill="white" />
              </svg>
              <p className="font-mono text-[13px] font-extrabold tracking-[3px] text-[#1A1D26] mt-2.5">
                9928 4102 7719 3320
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] mb-3 flex flex-col items-center shadow-xs">
              <div className="w-28 h-28 bg-white p-2 rounded-[12px] border border-gray-100 flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="30" height="30" rx="4" stroke="#1A1D26" strokeWidth="6" />
                  <rect x="13" y="13" width="14" height="14" rx="2" fill="#1C20C4" />
                  {/* Top-right position marker */}
                  <rect x="65" y="5" width="30" height="30" rx="4" stroke="#1A1D26" strokeWidth="6" />
                  <rect x="73" y="13" width="14" height="14" rx="2" fill="#1C20C4" />
                  {/* Bottom-left position marker */}
                  <rect x="5" y="65" width="30" height="30" rx="4" stroke="#1A1D26" strokeWidth="6" />
                  <rect x="13" y="73" width="14" height="14" rx="2" fill="#1C20C4" />
                  {/* QR Matrix dots */}
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

          <p className="text-[11.5px] text-[#6C737E] leading-relaxed">
            Tunjukkan kode ini ke kasir <strong>Alfamart, Alfamidi, Lawson, &amp; Dan+Dan</strong> untuk gratis tarik tunai, setor tunai, atau klaim promo belanja.
          </p>
        </div>

        {/* Milestone Tracker Section */}
        <div className="bg-white rounded-[24px] p-5 border border-[#ECEEF2] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="flex justify-between items-baseline">
            <h3 className="text-[15px] font-extrabold text-[#1A1D26]">
              Milestone Reward Perjalanan
            </h3>
            <span className="text-[12px] font-bold text-[#1C20C4]">
              Level 4 dari 5
            </span>
          </div>

          {/* Progress bar line */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-gradient-to-r from-[#1C20C4] to-[#00F3AD] rounded-full w-[78%]" />
          </div>

          {/* Milestone List */}
          <div className="space-y-2.5 pt-1">
            {milestones.map((m) => {
              const isDone = m.status === 'done'
              const isCurrent = m.status === 'current'

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-[18px] border flex items-center justify-between transition-all gap-3 ${
                    isCurrent
                      ? 'bg-[#EEF2FF] border-[#C7D2FE]'
                      : isDone
                      ? 'bg-white border-[#ECEEF2]'
                      : 'bg-[#F9FAFB] border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#1C20C4] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isDone ? '' : m.step}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-bold text-[#1A1D26] leading-snug truncate">
                        {m.title}
                      </h4>
                      <p className="text-[11px] font-medium text-[#6C737E] mt-0.5">
                        Reward: <span className="text-[#1C20C4] font-bold">{m.reward}</span>
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <button
                      onClick={() => setClaimedReward(m.id)}
                      className="h-7 px-3.5 rounded-full bg-[#1C20C4] text-white text-[11px] font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      {claimedReward === m.id ? 'Terklaim! ' : 'Klaim'}
                    </button>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0">
                      Terklaim
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Outlet Transaction History */}
        <div className="bg-white rounded-[24px] p-5 border border-[#ECEEF2] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
          <h3 className="text-[15px] font-extrabold text-[#1A1D26]">
            Riwayat Outlet Alfa Terakhir
          </h3>

          <div className="divide-y divide-[#F0F1F5]">
            {outletHistory.map((item, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1D26]">{item.outlet}</h4>
                  <p className="text-[11px] text-[#6C737E] mt-0.5">
                    {item.date} • {item.type}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-bold text-[#1C20C4] block">{item.detail}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
