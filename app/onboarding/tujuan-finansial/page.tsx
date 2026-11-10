'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { Canvas } from '@react-three/fiber'
import CarpetModel, { CarpetPose } from '@/components/mascot/CarpetModel'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  Compass,
  Video,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Lock,
  Wallet,
  TrendingUp,
  Award,
  Check,
  ChevronRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'

export default function TujuanFinansialPage() {
  const router = useRouter()
  const { alaDompet } = useBankState()
  const { triggerReaction } = useMascot()

  // Multi-step State (1: Pilih Fokus, 2: Target & Personalisasi, 3: Konfirmasi Akad, 4: Sukses 30-Day Active)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedGoal, setSelectedGoal] = useState<string>('ibadah')
  const [abVariant, setAbVariant] = useState<'goal-based' | 'standard'>('goal-based')
  const [alanPose, setAlanPose] = useState<CarpetPose>('curious-think')

  // Step 2 Customization States
  const [targetAmount, setTargetAmount] = useState('35.000.000')
  const [targetTenor, setTargetTenor] = useState<'6' | '12' | '18' | '24'>('18')
  const [monthlyAutoDebit, setMonthlyAutoDebit] = useState('1.950.000')
  const [autoLockEnabled, setAutoLockEnabled] = useState(true)

  // Step 3 Confirmation State
  const [syariahAgreed, setSyariahAgreed] = useState(true)

  const goals = [
    {
      id: 'ibadah',
      title: 'Nabung buat Ibadah',
      desc: 'Persiapan ibadah Umrah, Haji reguler/khusus, atau Qurban ke Baitullah.',
      badge: 'Prioritas Utama',
      defaultTarget: '35.000.000',
      defaultMonthly: '1.950.000',
      recommendation: {
        title: 'Ala Impian Umrah & Haji Terpadu',
        desc: 'Setoran ringan mulai Rp10.000 dengan nisbah bagi hasil kompetitif setara 8% p.a., terhubung langsung dengan asosiasi resmi dan SISKOHAT Kemenag.',
        cta: 'Lanjut Personalisasi Ibadah',
        href: '/impian/umrah/intro/1',
      },
    },
    {
      id: 'harian',
      title: 'Kelola Uang Harian',
      desc: 'Atur pos belanja bulanan, jajan, bayar tagihan, dan belanja hemat di Alfamart.',
      badge: 'Bebas Admin',
      defaultTarget: '5.000.000',
      defaultMonthly: '1.250.000',
      recommendation: {
        title: 'Ala Dompet & Alfa Daily Loop',
        desc: 'Bebas biaya setor dan tarik tunai di seluruh gerai Alfamart, transfer BI-FAST gratis 50x/bulan, dan integrasi barcode member otomatis.',
        cta: 'Lanjut Personalisasi Pos Harian',
        href: '/pocket',
      },
    },
    {
      id: 'investasi',
      title: 'Mulai Investasi & Kekayaan Halal',
      desc: 'Kembangkan dana secara syariah lewat Ala Deposito 8,5% & Reksa Dana halal.',
      badge: 'Imbal Hasil Optimal',
      defaultTarget: '20.000.000',
      defaultMonthly: '2.500.000',
      recommendation: {
        title: 'Ala Deposito & Wealth Hub',
        desc: 'Nisbah bagi hasil 85%:15% bebas riba dengan talangan likuiditas Qardh T+0 instan yang aman diawasi DSN-MUI.',
        cta: 'Lanjut Personalisasi Investasi',
        href: '/investasi',
      },
    },
    {
      id: 'anak',
      title: 'Nabung buat Masa Depan Anak',
      desc: 'Tabungan berjangka syariah terproteksi untuk dana pendidikan dan masa depan buah hati.',
      badge: 'Proteksi Berjangka',
      defaultTarget: '50.000.000',
      defaultMonthly: '2.800.000',
      recommendation: {
        title: 'Ala Impian Pendidikan Terkunci',
        desc: 'Kunci otomatis tabungan bulanan agar rencana sekolah buah hati terwujud tanpa terganggu pengeluaran impulsif.',
        cta: 'Lanjut Personalisasi Pendidikan',
        href: '/impian',
      },
    },
  ]

  const currentGoal = goals.find((g) => g.id === selectedGoal) || goals[0]

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId)
    const selected = goals.find((g) => g.id === goalId)
    if (selected) {
      setTargetAmount(selected.defaultTarget)
      setMonthlyAutoDebit(selected.defaultMonthly)
    }
    // Alan points to recommendation then claps happily per animation brief
    setAlanPose('pointing')
    setTimeout(() => {
      setAlanPose('clapping')
    }, 1100)
    triggerReaction('success', `Fokus ${selected?.title} dipilih.`)
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (abVariant === 'standard') {
        router.push('/beranda')
        return
      }
      setCurrentStep(2)
      triggerReaction('success', 'Mari tentukan target nominal tabunganmu.')
    } else if (currentStep === 2) {
      setCurrentStep(3)
      triggerReaction('success', 'Tinjau akad syariah dan rencana finansial.')
    } else if (currentStep === 3) {
      setCurrentStep(4)
      triggerReaction('success', 'Alhamdulillah! Fokus finansial kamu resmi aktif!')
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 4) {
      router.push('/beranda')
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any)
    } else {
      router.push('/beranda')
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-[#F7F8FC] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. TOP NATIVE HEADER BAR (Bank Aladin Syariah Identity - Seamless White) */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-[#F0F1F5] shrink-0">
        <StatusBar className="bg-white" />
        <div
          className="w-full h-[46px] flex items-center justify-between"
          style={{ paddingLeft: '20px', paddingRight: '20px' }}
        >
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex items-center justify-center p-1 -ml-1 text-gray-700 active:opacity-60 transition-opacity cursor-pointer"
            aria-label="Kembali"
          >
            <Image
              src="/assets/icons/header_back_clean.png"
              alt="Kembali"
              width={16}
              height={16}
              style={{ width: '15.5px', height: '15.5px' }}
              priority
            />
          </button>

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#00F0A0]" />
            <span className="text-[12px] font-black text-[#1037A6] tracking-wider uppercase">
              SOBAT ALADIN
            </span>
          </div>

          {currentStep < 4 ? (
            <Link
              href="/beranda"
              className="text-[12.5px] font-bold text-gray-400 hover:text-gray-700 transition-colors"
            >
              Lewati
            </Link>
          ) : (
            <div className="w-8" />
          )}
        </div>
      </header>

      {/* 2. 30-DAY ACTIVE ACTIVATION TRACKER BAR */}
      <div className="bg-[#EFF2FE] px-5 py-2.5 border-b border-[#DDE4FD] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1037A6]" />
          <span className="text-[11px] font-extrabold text-[#1037A6]">
            {currentStep === 4 ? 'Aktivasi Berhasil: 30-Day Active Tercapai!' : `Langkah ${currentStep} dari 4: Aktivasi Pasca-KYC`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10.5px] font-black text-[#059669] bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-[#059669]" />
          <span>{currentStep === 4 ? 'Target 65% Aktif' : 'KYC Terverifikasi'}</span>
        </div>
      </div>

      {/* 3. SCROLLABLE MAIN CONTENT */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar space-y-4"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '110px',
        }}
      >
        {/* ================= STEP 1: PILIH FOKUS FINANSIAL ================= */}
        {currentStep === 1 && (
          <>
            {/* 3D Companion Alan listening curiously & cheering per animation brief */}
            <div className="bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/50 rounded-2xl p-3 border border-[#E0E7FF] flex items-center justify-between mb-2 shadow-2xs">
              <div className="flex-1 pr-2">
                <span className="text-[10px] font-black text-[#1037A6] bg-blue-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                  Pendamping Finansial
                </span>
                <p className="text-[12px] font-bold text-[#1A1D26] leading-snug">
                  {alanPose === 'curious-think' && 'Alan menyimak... pilih fokus keuangan utamamu!'}
                  {alanPose === 'pointing' && 'Pilihan tepat! Simak rekomendasi aksi berikut.'}
                  {alanPose === 'clapping' && 'Mabruk! Selamat atas langkah awal berkahmu!'}
                </p>
              </div>
              <div className="w-[88px] h-[74px] shrink-0 relative">
                <Canvas
                  camera={{ position: [0, 0.05, 5.2], fov: 32 }}
                  gl={{ antialias: true, alpha: true }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ambientLight intensity={2.2} />
                  <directionalLight position={[2, 4, 3]} intensity={2.6} />
                  <pointLight position={[0, 0.3, 2.8]} intensity={3.0} color="#FFFFFF" />
                  <pointLight position={[-1.2, -0.2, 2.2]} intensity={2.0} color="#00F0A0" />
                  <CarpetModel pose={alanPose} interactive={false} followCursor={true} scale={0.7} />
                </Canvas>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1037A6] text-white px-2.5 py-0.5 rounded-full">
                  Langkah 1: Pilih Fokus
                </span>

                {/* A/B Testing Simulator Toggle */}
                <button
                  type="button"
                  onClick={() => setAbVariant(abVariant === 'goal-based' ? 'standard' : 'goal-based')}
                  className="text-[10px] font-bold text-[#1037A6] bg-white border border-[#C7D2FE] px-2 py-0.5 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="A/B Testing: Onboarding Goal-Based vs Standar"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>A/B: {abVariant === 'goal-based' ? 'Goal-Based' : 'Standar'}</span>
                </button>
              </div>

              <h1 className="text-[20px] font-extrabold text-[#1A1D26] tracking-tight leading-snug">
                Apa fokus keuangan utamamu sekarang?
              </h1>
              <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                Sobat Aladin akan menyesuaikan dashboard, rekomendasi produk, dan aksi berikutnya agar targetmu cepat terwujud tanpa riba.
              </p>
            </div>

            {/* 4 Core Goal Options */}
            <div className="space-y-2.5">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id

                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGoalSelect(g.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                      isSelected
                        ? 'bg-[#EFF2FE] border-[#1037A6] shadow-sm ring-1 ring-[#1037A6]/20'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="pr-3 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[14.5px] font-extrabold text-[#1A1D26] leading-tight">
                          {g.title}
                        </h3>
                        {g.badge && (
                          <span className="text-[9.5px] font-black bg-emerald-50 text-[#059669] border border-emerald-200 px-2 py-0.5 rounded-full">
                            {g.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-gray-500 leading-relaxed">
                        {g.desc}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-[#1037A6] bg-[#1037A6]' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Dynamic Personalized Recommendation Box */}
            <div className="bg-white rounded-2xl p-4 border border-[#C7D2FE] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EFF2FE] text-[#1037A6] flex items-center justify-center">
                    <Compass className="w-3.5 h-3.5 text-[#1037A6]" />
                  </div>
                  <span className="text-[11.5px] font-black text-[#1037A6] uppercase tracking-wide">
                    Rekomendasi Aksi Sobat Aladin
                  </span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669]">
                  {abVariant === 'goal-based' ? 'Mode Goal-Based' : 'Mode Standar'}
                </span>
              </div>

              <div>
                <h4 className="text-[15px] font-black text-[#1A1D26]">
                  {abVariant === 'goal-based'
                    ? currentGoal.recommendation.title
                    : 'Eksplorasi Beranda Standar Aladin'}
                </h4>
                <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
                  {abVariant === 'goal-based'
                    ? currentGoal.recommendation.desc
                    : 'Mulai dengan setoran perdana ke Ala Dompet untuk menikmati bebas transfer BI-FAST dan promo gratis tarik tunai di Alfamart.'}
                </p>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#059669]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Follow-up berbasis perilaku &amp; pengingat mingguan disesuaikan otomatis</span>
              </div>
            </div>
          </>
        )}

        {/* ================= STEP 2: PERSONALISASI TARGET & AUTODEBIT ================= */}
        {currentStep === 2 && (
          <>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1037A6] text-white px-2.5 py-0.5 rounded-full">
                Langkah 2: Personalisasi Rencana
              </span>
              <h1 className="text-[20px] font-extrabold text-[#1A1D26] tracking-tight leading-snug mt-2">
                Atur Target &amp; Autodebit: {currentGoal.title}
              </h1>
              <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                Tentukan target nominal tabungan dan autodebit bulanan dari saldo Ala Dompet kamu.
              </p>
            </div>

            {/* Target Amount Input */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
              <div>
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wide block mb-1">
                  Target Nominal Tabungan (Rp)
                </label>
                <input
                  type="text"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-200 font-black text-[18px] text-[#1037A6] focus:border-[#1037A6] outline-none font-mono"
                />
              </div>

              {/* Quick Nominal Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  selectedGoal === 'ibadah' ? '35.000.000' : '10.000.000',
                  selectedGoal === 'ibadah' ? '45.000.000' : '25.000.000',
                  selectedGoal === 'ibadah' ? '70.000.000' : '50.000.000',
                ].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetAmount(val)}
                    className="py-1.5 rounded-lg border border-gray-200 hover:border-[#1037A6] text-[11px] font-bold text-gray-700 active:scale-95 transition-all"
                  >
                    Rp{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenor & Autodebit Config */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
              <div>
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Pilihan Jangka Waktu (Tenor)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['6', '12', '18', '24'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTargetTenor(t)}
                      className={`py-2 rounded-xl text-[12px] font-black border transition-all cursor-pointer ${
                        targetTenor === t
                          ? 'bg-[#1037A6] text-white border-[#1037A6]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t} Bulan
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-gray-500 uppercase block">
                    Estimasi Autodebit Bulanan
                  </span>
                  <span className="text-[16px] font-black text-[#059669] font-mono">
                    Rp{monthlyAutoDebit}/bulan
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Sumber Dana:</span>
                  <span className="text-[11.5px] font-bold text-gray-800">
                    Ala Dompet (Rp{alaDompet.toLocaleString('id-ID')})
                  </span>
                </div>
              </div>
            </div>

            {/* Fitur Kunci Tabungan Otomatis */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center shrink-0">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[13px] font-black text-gray-900 block leading-tight">
                    Kunci Saldo Rencana
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Mencegah penarikan impulsif sampai target tercapai
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoLockEnabled}
                onChange={(e) => setAutoLockEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#1037A6] cursor-pointer"
              />
            </div>
          </>
        )}

        {/* ================= STEP 3: KONFIRMASI AKAD SYARIAH ================= */}
        {currentStep === 3 && (
          <>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1037A6] text-white px-2.5 py-0.5 rounded-full">
                Langkah 3: Konfirmasi Akad Syariah
              </span>
              <h1 className="text-[20px] font-extrabold text-[#1A1D26] tracking-tight leading-snug mt-2">
                Tinjau Akad &amp; Komitmen Rencana
              </h1>
              <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">
                Seluruh simpanan dan investasi dikelola secara amanah di bawah pengawasan Dewan Pengawas Syariah DSN-MUI.
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-4.5 border border-gray-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-[12px] font-bold text-gray-500">Fokus Finansial</span>
                <span className="text-[13px] font-black text-[#1037A6]">{currentGoal.title}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-[12px] font-bold text-gray-500">Target Nominal</span>
                <span className="text-[13px] font-black text-gray-900 font-mono">Rp{targetAmount}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-[12px] font-bold text-gray-500">Tenor Rencana</span>
                <span className="text-[13px] font-black text-gray-900">{targetTenor} Bulan</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <span className="text-[12px] font-bold text-gray-500">Autodebit Bulanan</span>
                <span className="text-[13px] font-black text-[#059669] font-mono">Rp{monthlyAutoDebit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-gray-500">Jenis Akad Syariah</span>
                <span className="text-[12px] font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                  Mudharabah &amp; Wadiah
                </span>
              </div>
            </div>

            {/* Sharia Principles Box */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-[#059669]">
                <ShieldCheck className="w-4.5 h-4.5" />
                <span className="text-[12px] font-black">Jaminan 100% Halal Tanpa Bunga</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Bebas Riba, Bebas Gharar, Bebas Maisir. Dilindungi Lembaga Penjamin Simpanan (LPS) hingga Rp2 Miliar per nasabah.
              </p>
            </div>

            {/* Syariah Agreement Checkbox */}
            <label className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={syariahAgreed}
                onChange={(e) => setSyariahAgreed(e.target.checked)}
                className="w-5 h-5 accent-[#1037A6] rounded mt-0.5 cursor-pointer"
              />
              <span className="text-[11.5px] text-gray-700 leading-snug">
                Saya menyetujui ketentuan akad syariah, otorisasi autodebit dari Ala Dompet, dan aktivasi status 30-Day Active Sobat Aladin.
              </span>
            </label>
          </>
        )}

        {/* ================= STEP 4: PERAYAAN MILESTONE SUKSES (30-DAY ACTIVE REACHED) ================= */}
        {currentStep === 4 && (
          <>
            {/* Celebration Header Card */}
            <div className="bg-gradient-to-br from-[#1037A6] via-[#0D2D88] to-[#0A236E] rounded-3xl p-5 text-white text-center space-y-3 shadow-lg">
              <div className="w-14 h-14 bg-[#00F0A0] text-[#0A236E] rounded-full flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider bg-white/20 text-[#00F0A0] px-3 py-0.5 rounded-full inline-block mb-1">
                  Milestone Berhasil Tercapai
                </span>
                <h1 className="text-[20px] font-black leading-tight">
                  Alhamdulillah! Fokus Finansial Kamu Resmi Aktif
                </h1>
                <p className="text-[12px] text-blue-100 mt-1 leading-relaxed">
                  Selamat! Akun kamu kini resmi berstatus <strong className="text-white">30-Day Active</strong> dengan target keberhasilan onboarding syariah 65% tercapai.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-left">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span className="text-blue-100">Status Aktivasi Nasabah Baru</span>
                  <span className="text-[#00F0A0] font-mono">65% Target Tercapai</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00F0A0] rounded-full w-[65%]" />
                </div>
              </div>
            </div>

            {/* Roadmap 3 Aksi Berikutnya */}
            <div className="bg-white rounded-2xl p-4.5 border border-gray-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1037A6] flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-[13.5px] font-black text-gray-900">
                  Roadmap 3 Aksi Berikutnya Kamu
                </h3>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    no: '1',
                    title: 'Autodebit Perdana Siap Berjalan',
                    desc: `Setoran rutin Rp${monthlyAutoDebit}/bulan akan didebit pasca gajian.`,
                    active: true,
                  },
                  {
                    no: '2',
                    title: 'Pengingat Mingguan di WhatsApp & Notifikasi',
                    desc: 'Pantau perkembangan tabungan secara otomatis tanpa perlu repot cek berkala.',
                    active: true,
                  },
                  {
                    no: '3',
                    title: 'Ambil Hadiah Aktivasi di Alfamart',
                    desc: 'Tunjukkan barcode member Aladin di kasir Alfamart untuk bonus belanja.',
                    active: false,
                  },
                ].map((item) => (
                  <div key={item.no} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1037A6] text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {item.no}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[12.5px] font-black text-gray-900">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Rescue Mechanism: Aladin Bantu Concierge & Video Call */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-[#F8FAFC] border border-gray-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1037A6] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Video className="w-4.5 h-4.5 text-[#00F0A0]" />
            </div>
            <div>
              <span className="text-[12.5px] font-extrabold text-[#1A1D26] block leading-tight">
                {currentStep === 4 ? 'Ingin pendampingan syariah?' : 'Bingung menentukan prioritas?'}
              </span>
              <span className="text-[10.5px] text-gray-500 block mt-0.5">
                Konsultasikan gratis via Video Call Aladin Bantu
              </span>
            </div>
          </div>
          <Link
            href="/bantu"
            className="text-[12px] font-extrabold text-[#1037A6] hover:underline shrink-0 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs cursor-pointer"
          >
            Bantuan →
          </Link>
        </div>
      </div>

      {/* 4. BOTTOM STICKY ACTION BUTTON */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F0F1F5] z-20 flex gap-2">
        {currentStep > 1 && currentStep < 4 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Kembali ke langkah sebelumnya"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStep === 3 && !syariahAgreed}
            className={`flex-1 h-12 bg-[#1037A6] hover:bg-[#0D2D8A] text-white rounded-full font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer ${
              currentStep === 3 && !syariahAgreed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>
              {currentStep === 1 && (abVariant === 'goal-based' ? currentGoal.recommendation.cta : 'Masuk ke Beranda Standar')}
              {currentStep === 2 && 'Lanjut ke Akad Syariah'}
              {currentStep === 3 && 'Aktifkan Rencana Finansial'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/beranda"
            className="w-full h-12 bg-[#1037A6] hover:bg-[#0D2D8A] text-white rounded-full font-extrabold text-[14.5px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <span>Masuk ke Beranda Aladin</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
