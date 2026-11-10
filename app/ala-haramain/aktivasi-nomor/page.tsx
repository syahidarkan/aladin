'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'

export default function AktivasiNomorSaudiPage() {
  const router = useRouter()
  const [simType, setSimType] = useState<'esim' | 'fisik'>('esim')
  const [provider, setProvider] = useState<'STC' | 'Mobily' | 'Zain'>('STC')
  const [visaNumber, setVisaNumber] = useState('VSA-9821401928')
  const [passportNumber, setPassportNumber] = useState('X8192041')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activatedNumber, setActivatedNumber] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const generatedNum = `+966 54 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`
      if (typeof window !== 'undefined') {
        localStorage.setItem('aladin_haramain_phone_active', 'true')
        localStorage.setItem('aladin_haramain_phone_number', generatedNum)
        localStorage.setItem('aladin_haramain_sim_type', simType)
        localStorage.setItem('aladin_haramain_provider', provider)
      }
      setActivatedNumber(generatedNum)
      setIsSubmitting(false)
    }, 1200)
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

      {/* Header */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '48px', paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/ala-haramain"
          data-back="true"
          className="w-9 h-9 -ml-1 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
          aria-label="Kembali ke Ala Haramain"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
        </Link>

        <div className="text-center">
          <h1 className="text-[16px] font-extrabold text-[#1A1D26]">Aktivasi Nomor Saudi</h1>
          <p className="text-[9.5px] font-bold text-[#059669]">Langkah 1 dari 2 • Prasyarat Wallet</p>
        </div>

        <div style={{ width: '28px' }} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-10">
        {!activatedNumber ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Explanatory Hero Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
                borderRadius: '20px',
                padding: '18px',
                color: 'white',
              }}
            >
              <span className="text-[10px] font-extrabold text-[#00F3AD] uppercase tracking-wider block mb-1">
                KEMITRAAN TELEKOMUNIKASI SAUDI
              </span>
              <h2 className="text-[17px] font-extrabold mb-1">Dapatkan Nomor Lokal Arab Saudi</h2>
              <p className="text-[11.5px] text-emerald-100 leading-relaxed">
                Nomor lokal Saudi diperlukan untuk menerbitkan wallet resmi berlisensi lokal di Tanah Suci.
              </p>
            </div>

            {/* Pilihan SIM Type */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Pilih Jenis SIM Card:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'esim', title: 'eSIM Instan', sub: 'Aktif langsung di HP' },
                  { id: 'fisik', title: 'SIM Fisik', sub: 'Ambil di Bandara Jeddah/Madinah' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSimType(s.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      simType === s.id
                        ? 'border-[#047857] bg-emerald-50/60 shadow-xs'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <span className="text-[13px] font-extrabold text-[#1A1D26] block">{s.title}</span>
                    <span className="text-[10px] text-gray-500">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan Provider */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Pilih Operator Telekomunikasi Saudi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['STC', 'Mobily', 'Zain'] as const).map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setProvider(prov)}
                    className={`py-2.5 rounded-xl border font-extrabold text-[13px] transition-all cursor-pointer ${
                      provider === prov
                        ? 'bg-[#047857] text-white border-[#047857]'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {prov} 5G
                  </button>
                ))}
              </div>
            </div>

            {/* Verifikasi Visa & Paspor */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">
                  Nomor Visa Saudi (KSA Visa):
                </label>
                <input
                  type="text"
                  value={visaNumber}
                  onChange={(e) => setVisaNumber(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[13px] text-[#1A1D26] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">
                  Nomor Paspor Republik Indonesia:
                </label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[13px] text-[#1A1D26] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#047857] text-white font-extrabold text-[14px] rounded-full shadow-lg active:scale-98 transition-all flex items-center justify-center cursor-pointer"
            >
              {isSubmitting ? 'Memverifikasi Data Visa...' : 'Aktivasi Nomor Saudi Sekarang →'}
            </button>
          </form>
        ) : (
          /* Success Card */
          <div className="bg-white rounded-3xl p-6 border border-[#ECEEF2] shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#047857] flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <span className="text-[11px] font-extrabold text-[#047857] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              Nomor Saudi Berhasil Aktif
            </span>

            <h3 className="text-[20px] font-extrabold text-[#1A1D26]">{activatedNumber}</h3>
            <p className="text-[12px] text-gray-500 mt-1 mb-6">
              Operator {provider} ({simType.toUpperCase()}) • Terhubung ke Visa KSA Anda
            </p>

            <button
              onClick={() => router.push('/ala-haramain/aktivasi-wallet')}
              className="w-full h-12 bg-[#1C20C4] text-white font-extrabold text-[14px] rounded-full shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              Lanjut ke Langkah 2: Aktivasi Wallet D360 →
            </button>
          </div>
        )}

        {/* Co-branding Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Powered by D360 × BPKH • Bank Aladin Syariah
          </p>
        </div>
      </div>
    </div>
  )
}

