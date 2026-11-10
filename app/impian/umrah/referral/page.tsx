'use client'
import { useState } from 'react'
import Link from 'next/link'
import StatusBar from '@/components/StatusBar'
import { ArrowLeft } from 'lucide-react'

export default function UmrahReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'ALADIN-UMRAH-JURI'

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referralList = [
    { name: 'Muhammad Rizky', date: '04 Nov 2026', status: 'Nabung Aktif', reward: 'Rp50.000' },
    { name: 'Fatimah Zahra', date: '28 Okt 2026', status: 'Nabung Aktif', reward: 'Rp50.000' },
    { name: 'Ahmad Fauzan', date: '21 Okt 2026', status: 'Nabung Aktif', reward: 'Rp50.000' },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F7F8FC] select-none text-[#1A1A2E] overflow-hidden">
      {/* Top Status Bar */}
      <StatusBar time="22.42" batteryLevel={29} />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-[23px] pt-1 pb-2">
        <Link
          href="/impian/umrah/buat"
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1A1A2E] hover:bg-gray-100 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1A2E]">
          Ajak Teman Nabung Umrah
        </h1>

        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[23px] pb-8 space-y-4">
        {/* Hero Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#081D48] to-[#1C20C4] text-white shadow-md text-center">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-[10.5px] font-bold uppercase tracking-wider mb-2">
            Program Syiar Berkah
          </span>
          <h2 className="text-[20px] font-extrabold leading-snug">
            Raih Rp50.000 untuk Tiap Teman yang Membuka Impian Umrah
          </h2>
          <p className="text-[12px] text-white/80 mt-1 max-w-[280px] mx-auto">
            Temanmu juga akan mendapatkan bonus saldo setoran awal Rp50.000 langsung ke pocket impian.
          </p>

          {/* Referral Code Box */}
          <div className="mt-4 p-3.5 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between">
            <span className="font-mono text-[15px] font-extrabold tracking-wider">
              {referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-[#00F3AD] text-[#081D48] rounded-full text-[12px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              {copied ? 'Disalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
            <span className="text-[11px] text-[#6B7280]">Teman Bergabung</span>
            <p className="text-[20px] font-extrabold text-[#1A1A2E] mt-0.5">3 Teman</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
            <span className="text-[11px] text-[#6B7280]">Total Bonus Didapat</span>
            <p className="text-[20px] font-extrabold text-emerald-600 mt-0.5">Rp150.000</p>
          </div>
        </div>

        {/* Steps */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-[14px] font-bold text-[#1A1A2E]">Cara Kerja Program:</h3>
          <div className="space-y-2 text-[12.5px] text-[#4B5563]">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1C20C4] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </span>
              <p>Bagikan kode referral pribadimu ke keluarga atau rekan.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1C20C4] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </span>
              <p>Temanmu membuka Ala Impian Umrah dan menabung minimal Rp50.000.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1C20C4] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </span>
              <p>Bonus saldo Rp50.000 langsung cair ke Ala Dompet Anda berdua.</p>
            </div>
          </div>
        </div>

        {/* List of Referred Friends */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1A1A2E] mb-2">Riwayat Referral Teman</h3>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-xs">
            {referralList.map((r, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1A1A2E]">{r.name}</h4>
                  <p className="text-[11px] text-[#6B7280]">{r.date} • {r.status}</p>
                </div>
                <span className="text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{r.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="p-5 border-t border-gray-200 bg-white">
        <button
          onClick={() => {
            alert('Tautan referral disiapkan untuk dibagikan ke kontak WhatsApp!')
          }}
          className="w-full py-4 bg-[#1C20C4] text-white rounded-full font-bold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
        >
          Bagikan Kode Referral
        </button>
      </div>
    </div>
  )
}
