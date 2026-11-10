'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, depositAlaImpian } from '@/lib/bankState'
import { ArrowLeft, Info } from 'lucide-react'

export default function AlaImpianLandingPage() {
  const { alaDompet, alaImpianUmroh } = useBankState()

  // Track if user has opened Umrah or Haji before to skip onboarding
  const [hasOpenedUmrah, setHasOpenedUmrah] = useState(false)
  const [hasOpenedHaji, setHasOpenedHaji] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasOpenedUmrah(localStorage.getItem('aladin_has_opened_umrah') === 'true')
      setHasOpenedHaji(localStorage.getItem('aladin_has_opened_haji') === 'true')
    }
  }, [])

  // Modal states for sub-features
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetCategory, setTargetCategory] = useState<'Liburan' | 'Mobil' | 'Gadget' | 'Rumah' | 'Pendidikan'>('Liburan')
  const [targetName, setTargetName] = useState('Liburan ke Turki & Umroh Plus')
  const [targetAmount, setTargetAmount] = useState('35.000.000')
  const [targetMonths, setTargetMonths] = useState(12)

  const [showTanpaTargetModal, setShowTanpaTargetModal] = useState(false)
  const [tanpaTargetName, setTanpaTargetName] = useState('Dana Darurat & Kebutuhan Mendadak')
  const [initialDeposit, setInitialDeposit] = useState('500.000')

  const [showQurbanModal, setShowQurbanModal] = useState(false)
  const [selectedQurban, setSelectedQurban] = useState({
    type: '1 Ekor Kambing Standar',
    weight: '23-28 kg',
    price: 2800000,
    institution: 'BAZNAS RI',
  })

  const [successToast, setSuccessToast] = useState<string | null>(null)

  const handleTargetSubmit = () => {
    const recMonthly = monthlyRecommendation
    const res = depositAlaImpian({
      targetPocket: 'bebas',
      amount: recMonthly,
    })
    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi untuk setoran awal')
      return
    }
    setShowTargetModal(false)
    setSuccessToast(`Kantong "${targetName}" berhasil dibuat dengan setoran awal Rp${recMonthly.toLocaleString('id-ID')}!`)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  const handleTanpaTargetSubmit = () => {
    const rawDep = parseInt(initialDeposit.replace(/\D/g, '') || '0', 10)
    const res = depositAlaImpian({
      targetPocket: 'bebas',
      amount: rawDep,
    })
    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi untuk setoran awal')
      return
    }
    setShowTanpaTargetModal(false)
    setSuccessToast(`Kantong fleksibel "${tanpaTargetName}" aktif dengan setoran awal Rp${rawDep.toLocaleString('id-ID')}!`)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  const handleQurbanSubmit = () => {
    const initialQurban = Math.round(selectedQurban.price / 8)
    const res = depositAlaImpian({
      targetPocket: 'qurban',
      amount: initialQurban,
    })
    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi untuk setoran awal qurban')
      return
    }
    setShowQurbanModal(false)
    setSuccessToast(`Tabungan Qurban "${selectedQurban.type}" aktif dengan setoran awal Rp${initialQurban.toLocaleString('id-ID')}!`)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  const targetAmountNum = parseInt(targetAmount.replace(/\D/g, '') || '0', 10)
  const monthlyRecommendation = Math.round(targetAmountNum / (targetMonths || 1))

  return (
    <div
      className="flex flex-col h-full min-h-0 bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Top Header Bar with Seamless White Background */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-[#ECEEF2] shrink-0">
        <StatusBar className="bg-white" />
        <div
          className="w-full bg-white flex items-center justify-between"
          style={{ height: '48px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
          </Link>

          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            Ala Impian
          </h1>

          <button
            onClick={() =>
              alert(
                'Ala Impian adalah tabungan berjangka syariah dengan akad Mudharabah Muthlaqah, bagi hasil optimal, dan perlindungan LPS.'
              )
            }
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 3. Main Scrollable Container (Generous 20px Margins, Block Flow) */}
      <div
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {/* Hero Title Section */}
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#1A1D26',
              letterSpacing: '-0.4px',
              lineHeight: 1.25,
            }}
          >
            Yuk, mulai wujudkan
            <br />
            impian berkahmu!
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Nabung berjangka otomatis dengan nisbah bagi hasil syariah.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SUB-FITUR 1: NABUNG DENGAN TARGET                                         */}
        {/* ========================================================================= */}
        <div
          onClick={() => setShowTargetModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="active:scale-[0.99] transition-transform"
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#1C20C4', backgroundColor: '#EEF2FF', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
              TARGET WAKTU & DANA
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '4px 0 2px 0' }}>
              Nabung dengan target
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.35 }}>
              Wujudkan impian seperti liburan, kendaraan, hingga rumah dengan jadwal terencana.
            </p>
          </div>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative' }}>
            <Image
              src="/assets/illustrations/impian_target_clean.png"
              alt="Target"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-FITUR 2: NABUNG TANPA TARGET                                          */}
        {/* ========================================================================= */}
        <div
          onClick={() => setShowTanpaTargetModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="active:scale-[0.99] transition-transform"
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
              FLEKSIBEL BEBAS TARIK
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '4px 0 2px 0' }}>
              Nabung tanpa target
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.35 }}>
              Nabung fleksibel tanpa batasan waktu dan nominal untuk berbagai kebutuhan darurat.
            </p>
          </div>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative' }}>
            <Image
              src="/assets/illustrations/impian_tanpa_target_clean.png"
              alt="Tanpa Target"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Section Header: Impian dengan Partner Aladin */}
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26' }}>
            Impian dengan Partner Resmi
          </h3>
          <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
            Program terintegrasi bersama travel mitra & lembaga resmi nasional.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SUB-FITUR 3: IMPIAN UMRAH                                                 */}
        {/* ========================================================================= */}
        <Link
          href="/impian/umrah/intro/1"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
          }}
          className="active:scale-[0.99] transition-transform block"
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#047857', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
              MITRA HIMPUH & AMPHURI
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '4px 0 2px 0' }}>
              Impian Umrah
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.35 }}>
              Persiapkan ibadah ke Tanah Suci dengan paket travel terpercaya &amp; bebas riba.
            </p>
          </div>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative' }}>
            <Image
              src="/assets/illustrations/impian_umrah_clean.png"
              alt="Impian Umrah"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* SUB-FITUR 4: IMPIAN HAJI                                                  */}
        {/* ========================================================================= */}
        <Link
          href="/impian/haji/intro/1"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
          }}
          className="active:scale-[0.99] transition-transform block"
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
              SETORAN PORSI BPKH
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '4px 0 2px 0' }}>
              Impian Haji
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.35 }}>
              Nabung setoran awal porsi haji Rp25.000.000 untuk dapatkan nomor porsi resmi Kemenag.
            </p>
          </div>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative' }}>
            <Image
              src="/assets/illustrations/impian_haji_clean.png"
              alt="Impian Haji"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* SUB-FITUR 5: IMPIAN QURBAN                                                */}
        {/* ========================================================================= */}
        <div
          onClick={() => setShowQurbanModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="active:scale-[0.99] transition-transform"
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
              IDUL ADHA TERENCANA
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '4px 0 2px 0' }}>
              Impian Qurban
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.35 }}>
              Nabung qurban terjadwal bersama BAZNAS &amp; Rumah Zakat tanpa beban di hari H.
            </p>
          </div>
          <div style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative' }}>
            <Image
              src="/assets/illustrations/impian_qurban_clean.png"
              alt="Impian Qurban"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* TOAST SUCCESS NOTIFICATION */}
      {successToast && (
        <div className="absolute top-[60px] left-1/2 -translate-x-1/2 z-[110] bg-[#064E3B] text-white px-5 py-2.5 rounded-full text-[12.5px] font-bold shadow-2xl border border-emerald-400">
           {successToast}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: BUAT KANTONG DENGAN TARGET                                       */}
      {/* ========================================================================= */}
      {showTargetModal && (
        <div
          className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowTargetModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '20px 24px 54px 24px', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Buat Tabungan dengan Target</h3>
              <button
                onClick={() => setShowTargetModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
              {(['Liburan', 'Mobil', 'Gadget', 'Rumah', 'Pendidikan'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTargetCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition-all cursor-pointer ${
                    targetCategory === cat
                      ? 'bg-[#1C20C4] text-white border-[#1C20C4]'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dream Name */}
            <div className="mb-3">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Nama Impian:</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-bold text-[#1A1D26] outline-none"
              />
            </div>

            {/* Target Amount */}
            <div className="mb-3">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Target Dana (Rp):</label>
              <input
                type="text"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[14px] font-extrabold text-[#1C20C4] outline-none"
              />
            </div>

            {/* Duration (Months) */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Jangka Waktu: {targetMonths} Bulan</label>
              <input
                type="range"
                min="3"
                max="36"
                step="1"
                value={targetMonths}
                onChange={(e) => setTargetMonths(parseInt(e.target.value, 10))}
                className="w-full accent-[#1C20C4]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>3 Bulan</span>
                <span>12 Bulan</span>
                <span>36 Bulan</span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl mb-5 flex justify-between items-center text-[12px]">
              <span className="text-gray-600">Rekomendasi Nabung/Bulan:</span>
              <span className="font-extrabold text-[#1C20C4] text-[14px]">
                Rp{monthlyRecommendation.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleTargetSubmit}
              className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Simpan &amp; Aktifkan Target
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUAT KANTONG TANPA TARGET                                        */}
      {/* ========================================================================= */}
      {showTanpaTargetModal && (
        <div
          className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowTanpaTargetModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '20px 24px 54px 24px', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Buat Tabungan Fleksibel</h3>
              <button
                onClick={() => setShowTanpaTargetModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="mb-3">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Nama Kantong:</label>
              <input
                type="text"
                value={tanpaTargetName}
                onChange={(e) => setTanpaTargetName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[13px] font-bold text-[#1A1D26] outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">Setoran Awal dari Ala Dompet (Rp):</label>
              <input
                type="text"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-[14px] font-extrabold text-[#059669] outline-none"
              />
              <span className="text-[10.5px] text-gray-400 mt-1 block">Saldo Ala Dompet saat ini: Rp{alaDompet.toLocaleString('id-ID')}</span>
            </div>

            <button
              onClick={handleTanpaTargetSubmit}
              className="w-full h-[48px] bg-[#059669] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Aktifkan Kantong Fleksibel
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: IMPIAN QURBAN                                                    */}
      {/* ========================================================================= */}
      {showQurbanModal && (
        <div
          className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowQurbanModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '20px 24px 54px 24px', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                  MITRA BAZNAS &amp; RUMAH ZAKAT
                </span>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Pilih Paket Hewan Qurban</h3>
              </div>
              <button
                onClick={() => setShowQurbanModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer shrink-0 mt-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              {[
                { type: '1 Ekor Kambing Standar (23-28 kg)', price: 2800000, monthly: 350000 },
                { type: '1 Ekor Kambing Premium (29-35 kg)', price: 3400000, monthly: 425000 },
                { type: '1/7 Sapi Berjamaah (220-250 kg)', price: 3100000, monthly: 387500 },
              ].map((q) => (
                <div
                  key={q.type}
                  onClick={() => setSelectedQurban({ type: q.type, weight: 'Resmi Syariah', price: q.price, institution: 'BAZNAS RI' })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedQurban.type === q.type
                      ? 'bg-amber-50/70 border-amber-500 shadow-xs'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-[#1A1D26]">{q.type}</span>
                    <span className="text-[13.5px] font-extrabold text-amber-700">Rp{q.price.toLocaleString('id-ID')}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">
                    Nabung estimasi Rp{q.monthly.toLocaleString('id-ID')}/bln (Target Idul Adha 1448H)
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleQurbanSubmit}
              className="w-full h-[48px] bg-amber-700 text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Nabung Qurban Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
