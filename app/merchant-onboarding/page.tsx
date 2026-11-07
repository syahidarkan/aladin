'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function MerchantOnboardingPage() {
  const [storeName, setStoreName] = useState('')
  const [city, setCity] = useState<'Makkah' | 'Madinah'>('Makkah')
  const [category, setCategory] = useState('Kuliner & Restoran')
  const [ownerName, setOwnerName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeName || !ownerName) {
      alert('Mohon lengkapi nama usaha dan nama penanggung jawab.')
      return
    }
    setIsSubmitted(true)
  }

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. iOS Status Bar */}
      <StatusBar time="22.25" batteryLevel={33} dark={false} />

      {/* 2. Top Header Bar (Authentic Aladin Back Button + Title) */}
      <div
        className="w-full h-[46px] flex items-center justify-between bg-white border-b border-[#ECEEF2] shrink-0"
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/bayar-saudi"
          className="flex items-center justify-center p-1 -ml-1 active:opacity-60 transition-opacity cursor-pointer"
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
          Merchant Hub Saudi
        </h1>

        <div className="w-[16px]" />
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ padding: '16px 20px 40px 20px' }}
      >
        {!isSubmitted ? (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Intro Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #064E3B 0%, #047857 60%, #059669 100%)',
                  borderRadius: '24px',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(6, 78, 59, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F3AD] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    JARINGAN GEIDEA × WADZPAY
                  </span>
                </div>
                <h2 className="text-[17px] font-extrabold text-white leading-snug">
                  Daftarkan Usaha di Makkah & Madinah
                </h2>
                <p className="text-[12px] text-white/90 leading-relaxed mt-1.5">
                  Terima pembayaran instan dari jamaah haji & umrah Indonesia langsung di terminal POS Geidea tanpa konversi rumit.
                </p>
              </div>

              {/* Form Fields Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '20px 18px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[12px] font-bold text-[#64748B] block mb-1.5">
                    Nama Toko / Usaha
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Al Baik Express Ajyad"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 rounded-[16px] border border-[#ECEEF2] text-[14px] font-semibold text-[#1A1D26] focus:outline-none focus:border-[#047857] bg-[#F8FAFC]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-[#64748B] block mb-1.5">
                    Kota Operasional di Saudi
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['Makkah', 'Madinah'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`py-2.5 rounded-[14px] text-[13px] font-bold cursor-pointer transition-all ${
                          city === c
                            ? 'bg-[#047857] text-white shadow-md'
                            : 'bg-[#F1F5F9] text-[#64748B] border border-transparent'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-[#64748B] block mb-1.5">
                    Kategori Usaha
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-[16px] border border-[#ECEEF2] text-[14px] font-semibold text-[#1A1D26] focus:outline-none focus:border-[#047857] bg-[#F8FAFC]"
                  >
                    <option value="Kuliner & Restoran">Kuliner & Restoran Halal</option>
                    <option value="Farmasi & Obat-obatan">Farmasi & Obat-obatan</option>
                    <option value="Supermarket & Retail">Supermarket & Retail</option>
                    <option value="Cinderamata & Kitab">Cinderamata & Kitab</option>
                    <option value="Transportasi & Travel">Transportasi & Tour</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-[#64748B] block mb-1.5">
                    Nama Penanggung Jawab / Pemilik
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap sesuai Paspor / Iqama"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-[16px] border border-[#ECEEF2] text-[14px] font-semibold text-[#1A1D26] focus:outline-none focus:border-[#047857] bg-[#F8FAFC]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-[50px] bg-[#047857] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer mt-2"
                >
                  Kirim Pengajuan Kemitraan
                </button>
              </div>
            </form>

            {/* Merchant Benefits & Regulatory Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '20px 18px',
                border: '1px solid #ECEEF2',
              }}
            >
              <h3 className="text-[14px] font-extrabold text-[#1A1D26] mb-3">
                Keuntungan Terhubung ke Rail Geidea
              </h3>
              <div className="space-y-2.5">
                {[
                  {
                    title: 'Settlement Instan SAMA Berlisensi',
                    desc: 'Dana riyal masuk langsung ke rekening bank lokal Saudi via Geidea acquiring.',
                  },
                  {
                    title: 'Dukungan Terminal POS Lengkap',
                    desc: 'Dapat menerima pembayaran Tap NFC mada, QRIS dinamis, dan kartu virtual.',
                  },
                  {
                    title: 'Promosi di Peta Jemaah Aladin',
                    desc: 'Toko otomatis terdaftar di direktori merchant resmi Aladin yang dibuka jutaan jemaah.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#047857] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[12.5px] font-bold text-[#1A1D26]">{item.title}</p>
                      <p className="text-[11px] text-[#64748B] leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Submission Confirmation */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 20px',
              border: '1px solid #ECEEF2',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[19px] font-extrabold text-[#1A1D26]">Pengajuan Berhasil Dikirim!</h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Toko <strong>{storeName}</strong> ({city}) sedang dalam proses verifikasi tim partnership Aladin × Geidea Saudi Arabia.
            </p>
            <div className="pt-2">
              <Link
                href="/bayar-saudi"
                className="inline-block px-8 py-3 bg-[#047857] text-white rounded-full font-bold text-[14px] shadow-md"
              >
                Kembali ke Bayar Saudi
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
