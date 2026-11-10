'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import CarpetModel, { CarpetPose, MascotFace } from './CarpetModel'
import { Sparkles, ArrowRight, X, CheckCircle2 } from 'lucide-react'

interface FeatureWelcomeConfig {
  key: string
  badge: string
  title: string
  subtitle: string
  description: string
  pose: CarpetPose
  face: MascotFace
  accentColor: string
}

const FEATURE_CONFIGS: Record<string, FeatureWelcomeConfig> = {
  '/qris': {
    key: 'qris',
    badge: 'Pemindai QRIS Syariah',
    title: 'Bayar Cepat & Berkah',
    subtitle: 'Transaksi Contactless Tanpa Biaya Admin',
    description: 'Arahkan kamera ke QRIS merchant. Alan siap memproses pembayaran instan yang aman dan sesuai syariah!',
    pose: 'peeking',
    face: 'curious',
    accentColor: '#00F0A0',
  },
  '/kartu': {
    key: 'kartu',
    badge: 'Kartu Virtual Aladin Visa',
    title: 'Privasi & Proteksi Penuh',
    subtitle: 'Kerahasiaan CVV & Nomor Kartu Dijaga',
    description: 'Alan menjaga kerahasiaan nomor kartu dan kode CVV dinamis agar terbebas dari risiko kebocoran.',
    pose: 'peek-a-boo-hide',
    face: 'curious',
    accentColor: '#38BDF8',
  },
  '/simulasi-bagi-hasil': {
    key: 'simulasi-bagi-hasil',
    badge: 'Ala Deposito Berkah',
    title: 'Simulasi Bagi Hasil',
    subtitle: 'Nisbah Kompetitif hingga 85:15',
    description: 'Hitung potensi bagi hasil simpananmu yang dikelola adil murni syariah tanpa unsur riba!',
    pose: 'celebrate-max',
    face: 'cheerful',
    accentColor: '#00F0A0',
  },
  '/bayar-beli': {
    key: 'bayar-beli',
    badge: 'Bayar & Beli',
    title: 'Kebutuhan Harian Bebas Biaya',
    subtitle: 'Pulsa, Listrik PLN, & Tagihan',
    description: 'Nikmati kemudahan beli paket data, pulsa, token listrik, dan tagihan keluarga tanpa biaya admin.',
    pose: 'roll-cylinder',
    face: 'cheerful',
    accentColor: '#60A5FA',
  },
  '/impian': {
    key: 'impian',
    badge: 'Ala Impian Baitullah',
    title: 'Wujudkan Niat Suci',
    subtitle: 'Tabungan Haji & Umrah Terencana',
    description: 'Nabung disiplin untuk ibadah ke Baitullah, terintegrasi langsung dengan SISKOHAT Kemenag RI.',
    pose: 'ihrom-bow',
    face: 'chill',
    accentColor: '#10B981',
  },
  '/ala-haramain': {
    key: 'ala-haramain',
    badge: 'Ala Haramain Hub',
    title: 'Dompet Digital Saudi SAR',
    subtitle: 'Kurs Real-Time Tanpa Biaya Markup',
    description: 'Konversi rupiah ke Saudi Riyal instan, belanja contactless di Makkah & Madinah dengan tenang.',
    pose: 'barrel-roll',
    face: 'cheerful',
    accentColor: '#00F0A0',
  },
  '/ala-lindung': {
    key: 'ala-lindung',
    badge: 'Proteksi Syariah Ala Lindung',
    title: 'Perisai Finansial Keluarga',
    subtitle: 'Prinsip Tolong Menolong Tabarru’',
    description: 'Alan membentuk perisai proteksi untuk menjaga kestabilan finansial orang tersayang dari musibah tak terduga.',
    pose: 'shielding',
    face: 'proud',
    accentColor: '#00F0A0',
  },
  '/onboarding/tujuan-finansial': {
    key: 'onboarding-tujuan-finansial',
    badge: 'Sobat Aladin',
    title: 'Fokus Finansial Pilihanmu',
    subtitle: 'Rekomendasi Aksi & Pendampingan',
    description: 'Pilih tujuan utama keuanganmu, Alan siap menemani setiap langkah dan mengarahkan rencana berkahmu!',
    pose: 'curious-think',
    face: 'curious',
    accentColor: '#F59E0B',
  },
  '/wrapped': {
    key: 'wrapped',
    badge: 'Aladin Wrapped 2026',
    title: 'Kilas Balik 365 Hari',
    subtitle: 'Catatan Perjalanan Finansial Berkah',
    description: 'Mari kita saksikan pencapaian, sedekah, dan kebiasaan finansial berkahmu selama setahun penuh!',
    pose: 'host-proud',
    face: 'proud',
    accentColor: '#C084FC',
  },
  '/pocket': {
    key: 'pocket',
    badge: 'Ala Pocket',
    title: 'Kelola Pos Tabungan',
    subtitle: 'Kategori Belanja & Dana Darurat',
    description: 'Pisahkan uang belanja, pos liburan, dan dana cadangan agar keuangan tetap teratur rapi.',
    pose: 'stand',
    face: 'cheerful',
    accentColor: '#38BDF8',
  },
  '/investasi': {
    key: 'investasi',
    badge: 'Ala Investasi Syariah',
    title: 'Investasi Bersih & Halal',
    subtitle: 'Reksa Dana, Emas & Deposito',
    description: 'Pertumbuhan portofolio diawasi DSN-MUI & OJK. Investasi tenang dengan imbal hasil optimal.',
    pose: 'celebrate-max',
    face: 'cheerful',
    accentColor: '#00F0A0',
  },
  '/alfa-daily': {
    key: 'alfa-daily',
    badge: 'Aladin x Alfamart',
    title: 'Aladin x Alfa Daily Loop',
    subtitle: 'Setor, Tarik, & Tebus Murah',
    description: 'Tarik & setor tunai gratis serta promo tebus hemat di lebih dari 18.000 gerai Alfamart seluruh Indonesia.',
    pose: 'pointing',
    face: 'wink',
    accentColor: '#F87171',
  },
  '/setor': {
    key: 'setor',
    badge: 'Setor Tunai Alfamart',
    title: 'Isi Saldo Tanpa Antre',
    subtitle: 'Bebas Biaya Admin di Seluruh Kasir',
    description: 'Tunjukkan kode setor ke kasir Alfamart dan saldo Ala Dompet langsung bertambah seketika.',
    pose: 'pointing',
    face: 'cheerful',
    accentColor: '#00F0A0',
  },
  '/tarik': {
    key: 'tarik',
    badge: 'Tarik Tunai Alfamart',
    title: 'Tarik Tunai Praktis Tanpa Kartu',
    subtitle: 'Cepat & Bebas Biaya Penarikan',
    description: 'Dapatkan uang tunai langsung dari kasir Alfamart tanpa perlu bawa kartu debit fisik.',
    pose: 'pointing',
    face: 'cheerful',
    accentColor: '#38BDF8',
  },
}

/**
 * Welcoming Spotlight Animation Overlay
 * When user navigates into a feature, renders a full-screen dark blurred backdrop
 * with Alan the magic carpet in the spotlight performing that feature's specific pose and greeting.
 */
export default function FeatureWelcomeOverlay() {
  const pathname = usePathname()
  const [activeConfig, setActiveConfig] = useState<FeatureWelcomeConfig | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Determine matching feature config
    const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/'
    const config = FEATURE_CONFIGS[cleanPath]

    if (!config) {
      setIsVisible(false)
      setActiveConfig(null)
      return
    }

    // Check if user has already been welcomed for this feature in this session
    const storageKey = `aladin_welcomed_${config.key}`
    const alreadyWelcomed = typeof window !== 'undefined' ? sessionStorage.getItem(storageKey) : null

    if (!alreadyWelcomed) {
      setActiveConfig(config)
      setIsVisible(true)
      setIsFading(false)

      // Auto dismiss after 4 seconds if not tapped
      const autoTimer = setTimeout(() => {
        handleDismiss(config.key)
      }, 4200)

      return () => clearTimeout(autoTimer)
    }
  }, [pathname])

  const handleDismiss = (key?: string) => {
    setIsFading(true)
    const targetKey = key || activeConfig?.key
    if (targetKey && typeof window !== 'undefined') {
      sessionStorage.setItem(`aladin_welcomed_${targetKey}`, 'true')
    }

    setTimeout(() => {
      setIsVisible(false)
      setIsFading(false)
      setActiveConfig(null)
    }, 320)
  }

  if (!isVisible || !activeConfig) return null

  return (
    <div
      onClick={() => handleDismiss()}
      className={`absolute inset-0 z-[140] bg-black/80 backdrop-blur-md flex flex-col items-center justify-between p-6 select-none cursor-pointer transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Top Header Spacing with Dismiss Button */}
      <div className="w-full flex items-center justify-between pt-8 px-2 z-20">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: activeConfig.accentColor }}
          />
          <span
            className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
            style={{
              color: activeConfig.accentColor,
              borderColor: `${activeConfig.accentColor}55`,
              backgroundColor: `${activeConfig.accentColor}15`,
            }}
          >
            {activeConfig.badge}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup Sambutan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center 3D Mascot Spotlight */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center my-auto z-10">
        {/* Magic Aura Glow behind Alan */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle, ${activeConfig.accentColor}50 0%, rgba(16, 55, 166, 0.3) 60%, transparent 100%)`,
          }}
        />

        {/* 3D WebGL Canvas with Alan Performing Feature Pose */}
        <div className="w-full max-w-[280px] h-[220px] relative pointer-events-none">
          <Canvas
            camera={{ position: [0, 0.05, 5.0], fov: 34 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={2.2} />
            <directionalLight position={[2, 4, 3]} intensity={2.8} />
            <pointLight position={[0, 0.4, 3.0]} intensity={3.5} color="#FFFFFF" />
            <pointLight position={[-1.4, -0.2, 2.2]} intensity={2.2} color={activeConfig.accentColor} />
            <pointLight position={[1.4, -0.2, 2.2]} intensity={1.8} color="#60A5FA" />
            <CarpetModel
              pose={activeConfig.pose}
              face={activeConfig.face}
              interactive={false}
              followCursor={false}
              scale={0.85}
            />
          </Canvas>
        </div>

        {/* Subtle Floating Star Sparkles */}
        <div className="flex items-center gap-2 mt-1">
          <Sparkles className="w-4 h-4 text-[#00F0A0] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[11.5px] font-bold text-white/90 tracking-wide">
            Alan menyambutmu di {activeConfig.badge}
          </span>
          <Sparkles className="w-4 h-4 text-[#00F0A0] animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      {/* Bottom Dialog Card & Call-to-Action */}
      <div
        className="w-full max-w-[340px] bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-[28px] p-5 text-center shadow-2xl z-20 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-[19px] font-black text-white tracking-tight leading-tight">
            {activeConfig.title}
          </h2>
          <p
            className="text-[12px] font-bold mt-0.5 tracking-wide"
            style={{ color: activeConfig.accentColor }}
          >
            {activeConfig.subtitle}
          </p>
        </div>

        <p className="text-[12px] text-white/80 leading-relaxed px-1">
          {activeConfig.description}
        </p>

        <button
          type="button"
          onClick={() => handleDismiss()}
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-[13.5px] text-gray-950 flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
          style={{
            backgroundColor: activeConfig.accentColor,
            boxShadow: `0 8px 24px ${activeConfig.accentColor}44`,
          }}
        >
          <span>Mulai Jelajahi Fitur</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-white/50 tracking-wider">
          Ketuk layar atau tombol untuk langsung masuk
        </p>
      </div>
    </div>
  )
}
