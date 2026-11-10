'use client'

import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'

export default function AktivasiWalletD360Page() {
  const router = useRouter()
  const [saudiNumber, setSaudiNumber] = useState('+966 54 819 2841')
  const [passport, setPassport] = useState('X8192041')
  const [visa, setVisa] = useState('VSA-9821401928')
  const [agreed, setAgreed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPhone = localStorage.getItem('aladin_haramain_phone_number')
      if (storedPhone) setSaudiNumber(storedPhone)
    }
  }, [])

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aladin_haramain_wallet_active', 'true')
      }
      setIsSubmitting(false)
      router.push('/ala-haramain')
    }, 1400)
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
          className="w-8 h-8 -ml-1 rounded-full bg-gray-100/90 hover:bg-gray-200 border border-gray-200/80 flex items-center justify-center text-[#1A1D26] active:scale-95 transition-all cursor-pointer shadow-2xs"
          aria-label="Kembali ke Ala Haramain"
        >
          <ArrowLeft className="w-4 h-4 text-[#1A1D26] stroke-[2.4]" />
        </Link>

        <div className="text-center">
          <h1 className="text-[16px] font-extrabold text-[#1A1D26]">Aktivasi Wallet Saudi</h1>
          <p className="text-[9.5px] font-bold text-[#1C20C4]">Langkah 2 dari 2 • Penerbitan Rekening Lokal</p>
        </div>

        <div style={{ width: '28px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-10">
        <form onSubmit={handleActivate} className="space-y-4">
          {/* Card Hero */}
          <div
            style={{
              background: 'linear-gradient(135deg, #081D48 0%, #102A72 55%, #1C20C4 100%)',
              borderRadius: '20px',
              padding: '18px',
              color: 'white',
            }}
          >
            <span className="text-[10px] font-extrabold text-[#00F3AD] uppercase tracking-wider block mb-1">
              D360 BANK SAUDI × BPKH × ALADIN
            </span>
            <h2 className="text-[17px] font-extrabold mb-1">Penerbitan Wallet Riyal Saudi (SAR)</h2>
            <p className="text-[11.5px] text-blue-100 leading-relaxed">
              Akun pembayaran lokal berizin Saudi Central Bank (SAMA) yang langsung aktif di dalam aplikasi Aladin.
            </p>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2] space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Nomor Handphone Saudi Terverifikasi:
              </label>
              <input
                type="text"
                value={saudiNumber}
                disabled
                className="w-full h-11 px-3.5 rounded-xl bg-gray-100 border border-gray-200 font-mono font-bold text-[13px] text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Nomor Paspor RI:
              </label>
              <input
                type="text"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[13px] text-[#1A1D26] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Nomor Visa Umrah/Haji (KSA):
              </label>
              <input
                type="text"
                value={visa}
                onChange={(e) => setVisa(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[13px] text-[#1A1D26] outline-none"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#1C20C4]"
            />
            <span className="text-[11.5px] text-gray-600 leading-snug">
              Saya menyetujui penerbitan instrumen pembayaran elektronik Saudi berlisensi SAMA melalui kerja sama Bank Aladin &amp; D360 Bank Saudi.
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed || isSubmitting}
            className="w-full h-12 bg-[#1C20C4] text-white font-extrabold text-[14px] rounded-full shadow-lg active:scale-98 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Menerbitkan Wallet D360...' : 'Aktifkan Wallet Saudi Sekarang →'}
          </button>
        </form>

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

