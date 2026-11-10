'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'

export default function KartuFisikHaramainPage() {
  const router = useRouter()
  const [cardSerial, setCardSerial] = useState('HARAMAIN-7842-9912')
  const [isLinking, setIsLinking] = useState(false)
  const [isLinked, setIsLinked] = useState(false)

  const handleLinkCard = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLinking(true)

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aladin_haramain_card_linked', 'true')
        localStorage.setItem('aladin_haramain_card_serial', cardSerial)
      }
      setIsLinking(false)
      setIsLinked(true)
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
          <h1 className="text-[16px] font-extrabold text-[#1A1D26]">Kartu Fisik Ala Haramain</h1>
          <p className="text-[9.5px] font-bold text-[#059669]">Solusi Belanja Non-NFC di Saudi</p>
        </div>

        <div style={{ width: '28px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-32">
        {!isLinked ? (
          <div className="space-y-4">
            {/* Visual Physical Card Mockup with EMV Chip & Embossing */}
            <div
              style={{
                background: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #0B2545 100%)',
                borderRadius: '20px',
                padding: '20px',
                color: 'white',
                minHeight: '200px',
                boxShadow: '0 12px 28px rgba(6, 78, 59, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[17px] font-black tracking-tight block">Ala Haramain</span>
                  <span className="text-[9px] font-extrabold text-[#00F3AD] uppercase tracking-wider">
                    Physical Travel Card • D360 Saudi
                  </span>
                </div>
                <span className="text-[9.5px] font-black bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs uppercase">
                  Mada Debit
                </span>
              </div>

              {/* EMV Chip & Contactless */}
              <div className="flex items-center gap-2.5 relative z-10 my-1">
                <div className="w-10 h-7 rounded-sm bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] p-0.5 shadow-xs border border-amber-300/60 flex items-center justify-center">
                  <div className="w-full h-full border border-amber-900/30 rounded-xs flex flex-col justify-between p-0.5">
                    <div className="h-[1px] bg-amber-900/40 w-full" />
                    <div className="flex justify-between w-full">
                      <div className="w-[1px] h-2 bg-amber-900/40" />
                      <div className="w-1.5 h-1.5 rounded-full border border-amber-900/40" />
                      <div className="w-[1px] h-2 bg-amber-900/40" />
                    </div>
                    <div className="h-[1px] bg-amber-900/40 w-full" />
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" className="opacity-80">
                  <path d="M8.5 16.5a5 5 0 0 1 0-7" />
                  <path d="M12 19a9 9 0 0 0 0-14" />
                </svg>
              </div>

              <div className="relative z-10">
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '17px',
                    fontWeight: 800,
                    letterSpacing: '2.5px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                  className="block mb-1"
                >
                  9660 •••• •••• 9912
                </span>
                <div className="flex justify-between text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
                  <span>Khusus Jamaah Umrah &amp; Haji</span>
                  <span className="font-mono">10/30</span>
                </div>
              </div>
            </div>

            {/* Airport Counter Info */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF2]">
              <span className="text-[10.5px] font-extrabold text-[#059669] uppercase tracking-wider block mb-1">
                LOKASI BOOTH AMBIL KARTU FISIK
              </span>
              <h3 className="text-[15px] font-extrabold text-[#1A1D26] mb-2">
                Ambil Gratis di Bandara Keberangkatan
              </h3>
              <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
                Petugas Aladin siap membantu Anda di Counter Keberangkatan Haji &amp; Umrah:
              </p>
              <ul className="text-[11.5px] text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Bandara Soekarno-Hatta (Terminal 3 Internasional Gate 2)</li>
                <li>Bandara Juanda Surabaya (T2 Lounge Umrah)</li>
                <li>Bandara Kertajati Majalengka (Hall Keberangkatan)</li>
                <li>Bandara King Abdulaziz Jeddah (Arrival Hall Haji)</li>
              </ul>
            </div>

            {/* Form Input / Scan to Link */}
            <form onSubmit={handleLinkCard} className="bg-white rounded-2xl p-4 border border-[#ECEEF2] space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">
                  Nomor Seri Kartu (Scan Barcode di Belakang Kartu):
                </label>
                <input
                  type="text"
                  value={cardSerial}
                  onChange={(e) => setCardSerial(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-mono font-bold text-[13px] text-[#1A1D26] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLinking}
                className="w-full h-12 bg-[#047857] text-white font-extrabold text-[14px] rounded-full shadow-lg active:scale-98 transition-all flex items-center justify-center cursor-pointer"
              >
                {isLinking ? 'Menghubungkan Kartu ke Akun...' : 'Tautkan Kartu ke Wallet Saudi →'}
              </button>
            </form>
          </div>
        ) : (
          /* Linked Success Card */
          <div className="bg-white rounded-3xl p-6 border border-[#ECEEF2] shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#047857] flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <span className="text-[11px] font-extrabold text-[#047857] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              Kartu Fisik Berhasil Tertaut
            </span>

            <h3 className="text-[18px] font-extrabold text-[#1A1D26] mb-1">Kartu Ala Haramain Aktif</h3>
            <p className="text-[12px] text-gray-500 mb-6 leading-relaxed">
              Kartu fisik ini sekarang tersinkronisasi otomatis dengan saldo Riyal Saudi (SAR) di aplikasi Anda. Bisa langsung digesek di seluruh mesin EDC di Arab Saudi.
            </p>

            <button
              onClick={() => router.push('/ala-haramain')}
              className="w-full h-12 bg-[#1C20C4] text-white font-extrabold text-[14px] rounded-full shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              Kembali ke Hub Ala Haramain →
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

