'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { Canvas } from '@react-three/fiber'
import CarpetModel, { CarpetPose } from '@/components/mascot/CarpetModel'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  HeartHandshake,
  Users,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  PhoneCall,
  MessageCircle,
} from 'lucide-react'

export default function AlaLindungPage() {
  const { alaDompet } = useBankState()
  const { triggerReaction } = useMascot()

  const [activeTab, setActiveTab] = useState<'polis' | 'klaim'>('polis')
  const [claimSubmitted, setClaimSubmitted] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState('Fatimah Az-Zahra')
  const [beneficiaryRelation, setBeneficiaryRelation] = useState('Istri')
  const [claimAmount, setClaimAmount] = useState('25.000.000')

  const alanPose: CarpetPose = activeTab === 'polis' ? 'shielding' : 'stand'

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setClaimSubmitted(true)
    triggerReaction('success', 'Pengajuan bantuan klaim proteksi syariah telah diterima!')
  }

  return (
    <div
      className="flex flex-col h-full bg-[#F8FAFC] select-none text-[#1A1D26] overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-[#F0F1F5] shrink-0">
        <StatusBar className="bg-white" />
        <div
          className="w-full h-[52px] flex items-center justify-between"
          style={{ paddingLeft: '20px', paddingRight: '20px' }}
        >
          <Link
            href="/beranda"
            className="flex items-center justify-center p-1 -ml-1 text-gray-700 active:opacity-60 transition-opacity cursor-pointer"
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

          <div className="text-center">
            <h1 className="text-[16.5px] font-extrabold text-[#1A1D26] tracking-tight">
              Ala Lindung
            </h1>
            <span className="text-[10px] font-bold text-[#059669] tracking-wider uppercase block">
              Proteksi Finansial Syariah
            </span>
          </div>

          <Link
            href="/bantu"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            aria-label="Bantuan"
          >
            <HelpCircle className="w-4 h-4 text-[#1037A6]" />
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-t border-gray-100 px-5 pt-1.5 pb-2 bg-gray-50/60">
          <button
            type="button"
            onClick={() => setActiveTab('polis')}
            className={`flex-1 py-1.5 text-center text-[12.5px] font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'polis'
                ? 'bg-[#1037A6] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Ringkasan Polis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('klaim')}
            className={`flex-1 py-1.5 text-center text-[12.5px] font-bold rounded-full transition-all cursor-pointer ${
              activeTab === 'klaim'
                ? 'bg-[#1037A6] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Bantuan &amp; Klaim
          </button>
        </div>
      </header>

      {/* 2. Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {/* ================= TAB 1: RINGKASAN POLIS (SHIELDING POSE) ================= */}
        {activeTab === 'polis' && (
          <>
            {/* 3D Alan Shielding Guardian Crown */}
            <div className="bg-gradient-to-br from-[#081D48] via-[#1037A6] to-[#0A2E5C] text-white rounded-[26px] p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 pr-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#00F0A0] text-[10px] font-black border border-emerald-400/30 uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Perlindungan Aktif 100%</span>
                  </div>
                  <h2 className="text-[18px] font-extrabold leading-snug tracking-tight">
                    Takaful Berkah Keluarga
                  </h2>
                  <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                    Alan membentuk perisai syariah untuk menjaga kestabilan finansial ahli waris tanpa unsur gharar dan riba.
                  </p>
                </div>

                {/* 3D Alan Live Mascot in Shielding Pose */}
                <div className="w-[100px] h-[90px] shrink-0 relative -mr-2">
                  <Canvas
                    camera={{ position: [0, 0.05, 5.2], fov: 32 }}
                    gl={{ antialias: true, alpha: true }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ambientLight intensity={2.2} />
                    <directionalLight position={[2, 4, 3]} intensity={2.6} />
                    <pointLight position={[0, 0.3, 2.8]} intensity={3.0} color="#FFFFFF" />
                    <pointLight position={[-1.2, -0.2, 2.2]} intensity={2.0} color="#00F0A0" />
                    <CarpetModel pose="shielding" interactive={false} scale={0.72} />
                  </Canvas>
                </div>
              </div>

              {/* Policy Numbers Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/15 text-[11.5px]">
                <div>
                  <span className="text-white/60 block text-[10px] uppercase font-bold">
                    Nomor Polis
                  </span>
                  <span className="font-mono font-bold text-white tracking-wider">
                    POL-ALD-2026-8819
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase font-bold">
                    Uang Pertanggungan
                  </span>
                  <span className="font-extrabold text-[#00F0A0] text-[13.5px]">
                    Rp100.000.000
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase font-bold">
                    Akad Asuransi
                  </span>
                  <span className="font-bold text-white">
                    Tabarru’ &amp; Wakalah
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase font-bold">
                    Periode Polis
                  </span>
                  <span className="font-bold text-white">
                    Hingga 31 Des 2027
                  </span>
                </div>
              </div>
            </div>

            {/* Manfaat Proteksi List */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3">
              <h3 className="text-[14px] font-extrabold text-[#1A1D26]">
                Cakupan Perlindungan Syariah
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Santunan Jiwa & Tutup Usia',
                    desc: 'Santunan tunai 100% langsung disalurkan ke rekening ahli waris tanpa potongan biaya.',
                    amount: 'Rp100.000.000',
                  },
                  {
                    title: 'Perlindungan Rawat Inap & Operasi',
                    desc: 'Kompensasi harian saat nasabah menjalani perawatan medis di rumah sakit syariah rekanan.',
                    amount: 'Rp500.000 / hari',
                  },
                  {
                    title: 'Bebas Kontribusi Premi Saat Musibah',
                    desc: 'Iuran polis dibebaskan sepenuhnya jika terjadi cacat tetap total, polis tetap aktif.',
                    amount: 'Gratis 100%',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 flex items-start justify-between">
                    <div className="pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <h4 className="text-[12.5px] font-bold text-[#1A1D26]">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed pl-5">{item.desc}</p>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1037A6] bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button to Klaim */}
            <button
              type="button"
              onClick={() => setActiveTab('klaim')}
              className="w-full h-12 bg-white border border-[#1037A6] text-[#1037A6] rounded-full font-extrabold text-[13px] flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              <span>Ajukan Bantuan atau Klaim</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* ================= TAB 2: BANTUAN & KLAIM (STAND EMPATHY POSE) ================= */}
        {activeTab === 'klaim' && (
          <>
            {/* Alan Empathy Guide Companion Header */}
            <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between shadow-2xs">
              <div className="flex-1 pr-2">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                  Pendamping Klaim
                </span>
                <h3 className="text-[14.5px] font-extrabold text-[#1A1D26] leading-snug">
                  Alan Siap Membimbing Proses Klaim
                </h3>
                <p className="text-[11.5px] text-gray-600 mt-1 leading-relaxed">
                  Kami mengutamakan empati, transparansi, dan kecepatan pencairan dana santunan untuk meringankan beban nasabah.
                </p>
              </div>

              {/* 3D Alan in Polite / Empathetic Pose */}
              <div className="w-[84px] h-[78px] shrink-0 relative">
                <Canvas
                  camera={{ position: [0, 0.05, 5.2], fov: 32 }}
                  gl={{ antialias: true, alpha: true }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ambientLight intensity={2.2} />
                  <directionalLight position={[2, 4, 3]} intensity={2.6} />
                  <pointLight position={[0, 0.3, 2.8]} intensity={3.0} color="#FFFFFF" />
                  <pointLight position={[-1.2, -0.2, 2.2]} intensity={2.0} color="#00F0A0" />
                  <CarpetModel pose="polite-bow" face="chill" interactive={false} scale={0.7} />
                </Canvas>
              </div>
            </div>

            {claimSubmitted ? (
              <div className="bg-white rounded-2xl p-6 border border-emerald-200 text-center shadow-sm space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Pengajuan Klaim Diterima!
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Tim Aladin Bantu &amp; Layanan Takaful sedang memverifikasi berkas Anda. Status akan diupdate dalam 1x24 jam kerja.
                </p>
                <div className="p-3 bg-gray-50 rounded-xl text-left text-[11.5px] space-y-1 text-gray-700">
                  <div className="flex justify-between">
                    <span>No. Registrasi Klaim:</span>
                    <span className="font-mono font-bold text-[#1037A6]">CLM-2026-9041</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ahli Waris Penerima:</span>
                    <span className="font-bold">{beneficiaryName} ({beneficiaryRelation})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Santunan:</span>
                    <span className="font-extrabold text-emerald-600">Rp{claimAmount}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setClaimSubmitted(false)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-[12px] text-gray-700 cursor-pointer"
                >
                  Ajukan Dokumen Tambahan
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3.5">
                <h4 className="text-[13.5px] font-extrabold text-[#1A1D26]">
                  Formulir Cepat Ahli Waris &amp; Klaim
                </h4>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                    Nama Ahli Waris Terdaftar
                  </label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    required
                    className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1037A6]/30 text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                      Hubungan
                    </label>
                    <select
                      value={beneficiaryRelation}
                      onChange={(e) => setBeneficiaryRelation(e.target.value)}
                      className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none text-gray-800"
                    >
                      <option value="Istri">Istri</option>
                      <option value="Suami">Suami</option>
                      <option value="Anak Kandung">Anak Kandung</option>
                      <option value="Orang Tua">Orang Tua</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                      Nominal Klaim (Rp)
                    </label>
                    <input
                      type="text"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      required
                      className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none text-gray-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase block mb-1">
                    Penyebab Klaim
                  </label>
                  <select className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none text-gray-800">
                    <option>Santunan Perawatan Medis Rumah Sakit</option>
                    <option>Santunan Cacat Tetap Musibah</option>
                    <option>Klaim Santunan Duka Ahli Waris</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#1037A6] text-white rounded-full font-extrabold text-[13px] flex items-center justify-center gap-2 hover:bg-[#0c2e91] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/20 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pengajuan Klaim</span>
                </button>
              </form>
            )}

            {/* Direct WhatsApp Call Center Card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[12px] font-extrabold text-emerald-900 block">
                  Butuh Pendampingan Darurat?
                </span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Layanan Klaim Siaga 24 Jam via WhatsApp Resmi
                </p>
              </div>
              <a
                href="https://wa.me/628118888888"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-bold text-[11.5px] hover:bg-emerald-700 flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WA</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
