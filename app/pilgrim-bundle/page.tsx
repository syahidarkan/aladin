'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  Globe,
  Phone,
  Mail,
  QrCode,
  Share2,
  Users,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  Wifi,
  Award,
  Zap,
  HelpCircle,
  Plus,
  Coins,
  MapPin,
  AlertTriangle,
} from 'lucide-react'

interface TelecomPackage {
  id: string
  name: string
  localQuotaPill: string
  quotaTotal: string
  duration: string
  points: number
  price: number
  originalPrice: number
  promoTag?: string
  operator: string
  partnerNetwork: string
  description: string
  category: 'umrah' | 'haji' | 'esim' | 'keluarga'
}

export default function PilgrimBundleTelecomPage() {
  const { alaDompet, dompetSar } = useBankState()
  const { triggerReaction, startTransition } = useMascot()

  // Exchange rate simulation
  const [sarRate, setSarRate] = useState(4200)
  useEffect(() => {
    const interval = setInterval(() => {
      setSarRate((r) => r + (Math.random() > 0.5 ? 1 : -1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Active View / Tab
  const [activeTab, setActiveTab] = useState<'store' | 'merchants' | 'emergency'>('store')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'umrah' | 'haji' | 'esim' | 'keluarga'>('all')

  // Telecom Balance & Quota State
  const [userBalanceSar, setUserBalanceSar] = useState(120.0)
  const [activeInternetGb, setActiveInternetGb] = useState(18.5)
  const [activeVoiceMins, setActiveVoiceMins] = useState(80)
  const [activeDaysLeft, setActiveDaysLeft] = useState(25)

  // Modals state
  const [selectedPkg, setSelectedPkg] = useState<TelecomPackage | null>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmountSar, setTopUpAmountSar] = useState('50')
  const [showQrModal, setShowQrModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showDetailPackageModal, setShowDetailPackageModal] = useState(false)
  const [paymentSource, setPaymentSource] = useState<'dompet' | 'sar'>('sar')
  const [cityFilter, setCityFilter] = useState<'makkah' | 'madinah'>('makkah')

  // Telecom Packages (Styled 1:1 like myXL & myIM3 per user screenshot attempt 4)
  const telecomPackages: TelecomPackage[] = [
    {
      id: 'umrah-extra-15',
      name: 'Xtra Combo Roaming Umrah 15GB',
      localQuotaPill: 'Include Local Saudi Quota 5GB (STC/Mobily 5G)',
      quotaTotal: '15 GB',
      duration: '14 Hari',
      points: 74,
      price: 275000,
      originalPrice: 350000,
      promoTag: 'Paling Laku',
      operator: 'Telkomsel RoaMAX / XL Pass',
      partnerNetwork: 'STC / Mobily Saudi 5G',
      description: 'Tetap pakai no WA Indonesia • Nelpon 45 Menit • Bebas roaming aktif otomatis di Bandara Jeddah.',
      category: 'umrah',
    },
    {
      id: 'haji-akrab-40',
      name: 'Paket Haji Akbar 40GB Long Stay',
      localQuotaPill: 'Include Local Quota Saudi 15GB (Zain / STC)',
      quotaTotal: '40 GB',
      duration: '45 Hari',
      points: 120,
      price: 580000,
      originalPrice: 750000,
      promoTag: 'Hot Promo',
      operator: 'Indosat Ooredoo / Aladin Connect',
      partnerNetwork: 'STC, Mobily & Zain High Speed',
      description: 'Masa aktif penuh musim haji 45 hari • Nelpon 120 Menit ke Tanah Air • Akses gratis aplikasi Nusuk & Kemenag.',
      category: 'haji',
    },
    {
      id: 'esim-instant-10',
      name: 'eSIM Baitullah 5G Instant QR',
      localQuotaPill: 'Instant Scan QR Profile • Tanpa FUP',
      quotaTotal: '10 GB',
      duration: '15 Hari',
      points: 61,
      price: 195000,
      originalPrice: 245000,
      promoTag: 'Best Deal',
      operator: 'Baitullah eSIM Global',
      partnerNetwork: 'Saudi Telecom Co (STC 5G)',
      description: 'Scan QR langsung konek begitu mendarat di King Abdulaziz Airport Jeddah • No physical SIM swap.',
      category: 'esim',
    },
    {
      id: 'umrah-hemat-7',
      name: 'Paket Singkat Umrah 6.5GB',
      localQuotaPill: 'Include Local Saudi Quota 2GB',
      quotaTotal: '6.5 GB',
      duration: '7 Hari',
      points: 49,
      price: 145000,
      originalPrice: 185000,
      operator: 'XL Axiata Roam',
      partnerNetwork: 'Mobily 5G Network',
      description: 'Ideal untuk umrah transit atau rombongan singkat • Unlimited WhatsApp chat & call.',
      category: 'umrah',
    },
    {
      id: 'haji-keluarga-80',
      name: 'Paket Akrab Rombongan 4 Jamaah',
      localQuotaPill: 'Sharing Kuota 80GB untuk 4 Nomor',
      quotaTotal: '80 GB',
      duration: '35 Hari',
      points: 210,
      price: 890000,
      originalPrice: 1200000,
      promoTag: 'Super Promo',
      operator: 'Aladin Pilgrim Family Group',
      partnerNetwork: 'Dual STC + Mobily Multi-Carrier',
      description: 'Satu paket dibagi ke 4 anggota keluarga atau teman satu kloter haji • Kuota terkontrol dari aplikasi Aladin.',
      category: 'keluarga',
    },
    {
      id: 'esim-unlimited-30',
      name: 'eSIM Unlimited Data Saudi 5G',
      localQuotaPill: 'True Unlimited Kuota Tanpa Batas Harian',
      quotaTotal: 'UNLIMITED',
      duration: '30 Hari',
      points: 150,
      price: 490000,
      originalPrice: 620000,
      promoTag: 'Best Deal',
      operator: 'Holafly / Airalo Saudi Pro',
      partnerNetwork: 'Mobily & STC 5G Standalone',
      description: 'Internet sepuasnya untuk video call keluarga, streaming kajian Masjidil Haram & live ibadah.',
      category: 'esim',
    },
  ]

  const filteredPackages =
    categoryFilter === 'all'
      ? telecomPackages
      : telecomPackages.filter((p) => p.category === categoryFilter)

  // Merchants & Emergency Data
  const merchantsMakkah = [
    { id: 1, name: 'Al Baik Restaurant Ajyad', type: 'Kuliner Halal', location: '150m dari Masjidil Haram', terminal: 'Geidea POS #GD-9842' },
    { id: 2, name: 'Nahdi Pharmacy Clock Tower', type: 'Farmasi & Kesehatan', location: 'Abraj Al Bait Lt. 2 Zamzam', terminal: 'Geidea POS #GD-1024' },
    { id: 3, name: 'Bin Dawood Supermarket', type: 'Supermarket & Oleh-Oleh', location: 'Lantai Dasar Abraj Al Bait', terminal: 'Geidea POS #GD-5519' },
  ]

  const merchantsMadinah = [
    { id: 4, name: 'Nahdi Central Nabawi', type: 'Apotek & Kebutuhan Medis', location: 'Pusat Pertokoan Northern Central', terminal: 'Geidea POS #GD-2241' },
    { id: 5, name: 'Bin Dawood Madinah Station', type: 'Supermarket & Kurma', location: 'Dekat Stasiun Haramain Madinah', terminal: 'Geidea POS #GD-8812' },
    { id: 6, name: 'Al Tazaj Nabawi South', type: 'Kuliner Halal Cepat Saji', location: 'Southern Courtyard Gate 5', terminal: 'Geidea POS #GD-4120' },
  ]

  const emergencyContacts = [
    { name: 'Posko Haji & Umrah Kemenag RI', role: 'Pelayanan Jemaah Indonesia di Saudi', number: '+966 54 892 0111' },
    { name: 'Konsulat Jenderal RI (KJRI) Jeddah', role: 'Perlindungan WNI & Paspor Hilang', number: '+966 12 671 1271' },
    { name: 'Bantuan Medis Darurat Saudi (Red Crescent)', role: 'Ambulans Cepat Tanggap 24 Jam', number: '997' },
    { name: 'Polisi Wilayah Haramain', role: 'Keamanan Darurat Makkah & Madinah', number: '999' },
  ]

  // Handlers
  const handleOpenBuy = (pkg: TelecomPackage) => {
    setSelectedPkg(pkg)
    setShowBuyModal(true)
  }

  const handleConfirmPurchase = () => {
    if (!selectedPkg) return
    const priceIdr = selectedPkg.price
    const priceSar = Math.round(priceIdr / sarRate)

    if (paymentSource === 'sar' && userBalanceSar < priceSar) {
      alert(`Saldo SAR Anda (SAR ${userBalanceSar.toFixed(2)}) tidak mencukupi untuk SAR ${priceSar}. Silakan Top Up atau pilih bayar pakai Ala Dompet.`)
      return
    }

    if (paymentSource === 'sar') {
      setUserBalanceSar((prev) => Math.max(0, prev - priceSar))
    }

    // Add extra gigabytes
    const addedGb = selectedPkg.quotaTotal === 'UNLIMITED' ? 50 : parseFloat(selectedPkg.quotaTotal) || 10
    setActiveInternetGb((prev) => prev + addedGb)
    setShowBuyModal(false)
    triggerReaction('success', `Paket "${selectedPkg.name}" aktif! Kuota ${selectedPkg.quotaTotal} siap dipakai di Arab Saudi.`)
  }

  const handleTopUpSubmit = () => {
    const rawSar = parseFloat(topUpAmountSar) || 0
    if (rawSar <= 0) return
    setUserBalanceSar((prev) => prev + rawSar)
    setShowTopUpModal(false)
    triggerReaction('success', `Berhasil isi ulang saldo SAR ${rawSar.toFixed(2)} ke Kartu Roaming!`)
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#F4F6F9] select-none text-[#1A1D26] overflow-x-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 0. Top Native Status Bar (Dark mode on Royal Blue Header) */}
      <StatusBar time="22.25" batteryLevel={33} dark={true} className="bg-[#1037A6]" />

      {/* ========================================================================= */}
      {/* 1. TOP CARRIER HEADER & QUICK MENU (myXL & myIM3 Exact Match per image 4) */}
      {/* ========================================================================= */}
      <div className="bg-[#1037A6] text-white pt-2 pb-6 px-5 relative shadow-md">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link
              href="/beranda"
              data-back="true"
              className="w-9 h-9 -ml-1 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.6} />
            </Link>
            <div>
              <h1 className="text-[17px] font-black text-white tracking-tight leading-tight">
                myPilgrim Roaming
              </h1>
              <div className="flex items-center gap-1.5 text-[10.5px] text-blue-200">
                <span className="w-2 h-2 rounded-full bg-[#00F0A0] inline-block animate-pulse" />
                <span>STC / Mobily 5G Live in Makkah</span>
              </div>
            </div>
          </div>

          <Link
            href="/ala-haramain"
            className="text-[11.5px] font-extrabold text-[#00F0A0] bg-white/10 border border-[#00F0A0]/40 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all"
          >
            Haramain Wallet →
          </Link>
        </div>

        {/* Quick Menu Title */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[12.5px] font-black tracking-wide text-white uppercase">
            Quick Menu
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className="text-[11px] font-extrabold text-[#00F0A0] hover:underline"
          >
            All Menu
          </button>
        </div>

        {/* 4 Circular Action Icons (myXL Exact Match: Buy Package, Sharing, Scan Voucher, Akrab) */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* 1. Buy Package */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('store')
              const el = document.getElementById('package-store-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-[50px] h-[50px] rounded-full bg-white text-[#1037A6] flex items-center justify-center shadow-md group-hover:bg-blue-50 transition-colors">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-white mt-1.5">
              Buy Package
            </span>
          </button>

          {/* 2. Sharing */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-[50px] h-[50px] rounded-full bg-white text-[#1037A6] flex items-center justify-center shadow-md group-hover:bg-blue-50 transition-colors">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-white mt-1.5">
              Sharing
            </span>
          </button>

          {/* 3. Scan Voucher */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-[50px] h-[50px] rounded-full bg-white text-[#1037A6] flex items-center justify-center shadow-md group-hover:bg-blue-50 transition-colors">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-white mt-1.5">
              Scan Voucher
            </span>
          </button>

          {/* 4. Akrab / Jamaah */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('store')
              setCategoryFilter('keluarga')
            }}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-[50px] h-[50px] rounded-full bg-white text-[#1037A6] flex items-center justify-center shadow-md group-hover:bg-blue-50 transition-colors">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-white mt-1.5">
              Akrab
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BODY CONTENT: CARDS & STORE (Overlapping white containers per myXL)     */}
      {/* ========================================================================= */}
      <main className="flex-1 px-4 -mt-3 pb-32 space-y-3.5">
        {/* CARD 1: REMAINING BALANCE (myXL Style) */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              Remaining Balance
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[13px] font-bold text-[#1037A6]">SAR</span>
              <span className="text-[22px] font-black text-[#1A1D26] font-mono tracking-tight">
                {userBalanceSar.toFixed(2)}
              </span>
              <span className="text-[11.5px] font-semibold text-gray-400 ml-1">
                (≈ Rp{Math.round(userBalanceSar * sarRate).toLocaleString('id-ID')})
              </span>
            </div>
            <span className="text-[10.5px] text-gray-400 font-semibold block mt-0.5">
              Active Until: 28 Des 2026 • Bebas Masa Hangus
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTopUpModal(true)}
            className="py-2 px-5 bg-[#1037A6] hover:bg-[#0D2D88] text-white text-[12.5px] font-black rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Top Up
          </button>
        </div>

        {/* CARD 2: VIEW MY PACKAGE (myXL 3-Column Indicator Style) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <span className="text-[12px] font-black text-[#1A1D26] tracking-wide">
              View My Package
            </span>
            <span className="text-[10px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Roaming Aktif
            </span>
          </div>

          <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
            {/* Column 1: Internet */}
            <div className="px-2">
              <div className="flex items-center justify-center text-gray-700 mb-1">
                <Globe className="w-4 h-4 text-[#1037A6]" />
              </div>
              <span className="text-[15px] font-black text-[#1A1D26] block font-mono">
                {activeInternetGb.toFixed(1)} GB
              </span>
              <span className="inline-block mt-1 py-0.5 px-2 bg-blue-100 text-[#1037A6] rounded-full text-[9px] font-extrabold">
                + UNLIMITED
              </span>
            </div>

            {/* Column 2: Voice */}
            <div className="px-2">
              <div className="flex items-center justify-center text-gray-700 mb-1">
                <Phone className="w-4 h-4 text-[#059669]" />
              </div>
              <span className="text-[15px] font-black text-[#1A1D26] block font-mono">
                {activeVoiceMins} Minutes
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-1">
                Saudi &amp; Indo
              </span>
            </div>

            {/* Column 3: Days Remaining */}
            <div className="px-2">
              <div className="flex items-center justify-center text-gray-700 mb-1">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-[15px] font-black text-[#1A1D26] block font-mono">
                {activeDaysLeft} Hari
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-1">
                Tersisa
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDetailPackageModal(true)}
            className="w-full mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-bold text-[#1037A6] hover:underline cursor-pointer"
          >
            <span>View My Package</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CARD 3: MYREWARDS TIER & BENEFIT JAMAAH (myXL Style) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-gray-500">
              Transaction <span className="font-black text-[#1037A6]">myRewards</span>
            </span>
            <span className="text-[10.5px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" />
              Platinum Pilgrim
            </span>
          </div>

          <h3 className="text-[14.5px] font-black text-[#1A1D26]">
            Platinum Member Aladin
          </h3>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-gray-100 my-2 overflow-hidden">
            <div className="w-[82%] h-full rounded-full bg-gradient-to-r from-[#1037A6] to-[#00F0A0]" />
          </div>

          <p className="text-[11px] text-gray-500 leading-tight">
            Alhamdulillah! Kamu menikmati prioritas jaringan 5G STC Saudi, voucher diskon Al Baik, serta akses lounge bandara.
          </p>

          <button
            type="button"
            onClick={() => triggerReaction('success', 'Status Keanggotaan Resmi: Jamaah Mitra HIMPUH & AMPHURI.')}
            className="w-full mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-bold text-[#1037A6] hover:underline cursor-pointer"
          >
            <span>View Membership</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* SUB-TABS: STORE vs MERCHANTS & DARURAT */}
        <div className="flex items-center gap-2 pt-1">
          {[
            { id: 'store', label: 'Paket Roaming & eSIM' },
            { id: 'merchants', label: 'POS & Merchant Saudi' },
            { id: 'emergency', label: 'Kontak Darurat' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-1.5 px-3.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1037A6] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* VIEW A: PACKAGE STORE ("Let's select Your package" - Xtra Combo Mini)    */}
        {/* ========================================================================= */}
        {activeTab === 'store' && (
          <div id="package-store-section" className="space-y-3 animate-in fade-in duration-200">
            {/* Store Header Banner */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-[15.5px] font-black text-[#1A1D26] tracking-tight">
                  Let&apos;s select Your package
                </h2>
                <span className="text-[11px] text-gray-500 font-semibold">
                  Tersedia 6 pilihan paket haji &amp; umrah terverifikasi
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'umrah', label: 'Umrah 7-14 Hari' },
                { id: 'haji', label: 'Haji 30-45 Hari' },
                { id: 'esim', label: 'eSIM 5G Instan' },
                { id: 'keluarga', label: 'Paket Akrab' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setCategoryFilter(pill.id as any)}
                  className={`py-1 px-3 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                    categoryFilter === pill.id
                      ? 'bg-blue-100 text-[#1037A6] border border-[#1037A6]/30'
                      : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* PACKAGE CARDS LIST (Exact layout match to myXL & myIM3 tiles in image 4) */}
            <div className="space-y-3">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handleOpenBuy(pkg)}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden group active:scale-[0.99]"
                >
                  {/* Top Pill / Badge Header (myXL Blue Header Bar) */}
                  <div className="bg-[#1037A6] text-white px-4 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-tight">
                      {pkg.localQuotaPill}
                    </span>
                    {pkg.promoTag && (
                      <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        {pkg.promoTag}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      {/* Left: Quota & Duration */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <div className="flex items-center gap-1 text-[#1037A6]">
                            <Globe className="w-4 h-4 stroke-[2.5]" />
                            <span className="text-[20px] font-black text-[#1A1D26] font-mono tracking-tight">
                              {pkg.quotaTotal}
                            </span>
                          </div>
                          <span className="text-[12px] font-bold text-gray-500">
                            {pkg.duration}
                          </span>
                        </div>

                        <h4 className="text-[13px] font-bold text-gray-800 mt-1">
                          {pkg.name}
                        </h4>

                        {/* Reward Points Tag (myXL Style) */}
                        <div className="flex items-center gap-1 mt-2 text-[10.5px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-md inline-flex border border-emerald-100">
                          <Coins className="w-3 h-3 text-[#059669]" />
                          <span>+{pkg.points} Poin Berkah Aladin</span>
                        </div>
                      </div>

                      {/* Right: Chevron Arrow */}
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1037A6] group-hover:bg-blue-50 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Price & Strikethrough Row (myXL / myIM3 Style) */}
                    <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 line-through mr-1.5 font-mono">
                          IDR {pkg.originalPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[15px] font-black text-[#1037A6] font-mono tracking-tight">
                          IDR {pkg.price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <span className="text-[10.5px] font-semibold text-gray-400">
                        {pkg.operator}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW B: VERIFIED MERCHANTS & GEIDEA POS IN SAUDI                          */}
        {/* ========================================================================= */}
        {activeTab === 'merchants' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-[14px] font-black text-[#1A1D26]">
                Mitra Resmi Geidea POS Saudi
              </h3>
              <p className="text-[11.5px] text-gray-500 mt-0.5">
                Bebas markup konversi SAR saat bayar via QRIS Aladin / Kartu Debit Visa Aladin.
              </p>

              {/* City Switcher */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setCityFilter('makkah')}
                  className={`py-1.5 px-3 rounded-xl text-[11.5px] font-extrabold ${
                    cityFilter === 'makkah'
                      ? 'bg-[#1037A6] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Makkah Al-Mukarramah
                </button>
                <button
                  type="button"
                  onClick={() => setCityFilter('madinah')}
                  className={`py-1.5 px-3 rounded-xl text-[11.5px] font-extrabold ${
                    cityFilter === 'madinah'
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Madinah Al-Munawwarah
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {(cityFilter === 'makkah' ? merchantsMakkah : merchantsMadinah).map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                      {m.type}
                    </span>
                    <h4 className="text-[13.5px] font-bold text-[#1A1D26] mt-1">
                      {m.name}
                    </h4>
                    <span className="text-[11px] text-gray-500 block">
                      {m.location}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                      {m.terminal} • 0% Fee
                    </span>
                  </div>

                  <Link
                    href="/bayar-saudi"
                    className="py-1.5 px-3 bg-[#1037A6] hover:bg-[#0D2D88] text-white text-[11px] font-bold rounded-xl active:scale-95 transition-all"
                  >
                    Bayar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW C: KONTAK DARURAT JAMAAH                                             */}
        {/* ========================================================================= */}
        {activeTab === 'emergency' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-black text-rose-900">
                  Layanan Bantuan 24 Jam di Tanah Suci
                </h4>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Bebas pulsa saat dihubungi menggunakan nomor kartu roaming / eSIM Aladin.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {emergencyContacts.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-[13px] font-bold text-[#1A1D26]">{c.name}</h5>
                    <span className="text-[10.5px] text-gray-500 block">{c.role}</span>
                    <span className="text-[12px] font-mono font-extrabold text-[#1037A6] block mt-0.5">
                      {c.number}
                    </span>
                  </div>

                  <a
                    href={`tel:${c.number.replace(/\s/g, '')}`}
                    className="py-2 px-3.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black rounded-xl active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Panggil</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: BUY PACKAGE CONFIRMATION SHEET                                   */}
      {/* ========================================================================= */}
      {showBuyModal && selectedPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] bg-white rounded-t-[30px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-black text-[#1A1D26]">
                Konfirmasi Beli Paket
              </h3>
              <button
                type="button"
                onClick={() => setShowBuyModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100">
                <span className="text-[10px] font-bold uppercase text-[#1037A6] tracking-wide block">
                  {selectedPkg.localQuotaPill}
                </span>
                <h4 className="text-[15px] font-black text-[#1A1D26] mt-0.5">
                  {selectedPkg.name}
                </h4>
                <p className="text-[11.5px] text-gray-600 mt-1 leading-snug">
                  {selectedPkg.description}
                </p>
              </div>

              {/* Payment Source Selection */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentSource('sar')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentSource === 'sar'
                        ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold block">Haramain Wallet (SAR)</span>
                    <span className="text-[10px] block opacity-80">Saldo: SAR {userBalanceSar.toFixed(2)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentSource('dompet')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentSource === 'dompet'
                        ? 'border-[#1037A6] bg-blue-50 text-[#1037A6]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold block">Ala Dompet (IDR)</span>
                    <span className="text-[10px] block opacity-80">Saldo: Rp{alaDompet.toLocaleString('id-ID')}</span>
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-[12px]">
                <div className="flex justify-between text-gray-500">
                  <span>Harga Normal:</span>
                  <span className="line-through font-mono">Rp{selectedPkg.originalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#1A1D26] text-[13.5px]">
                  <span>Total Bayar:</span>
                  <span className="text-[#1037A6] font-mono">
                    Rp{selectedPkg.price.toLocaleString('id-ID')}{' '}
                    <span className="text-[11px] font-normal text-gray-500">
                      (≈ SAR {Math.round(selectedPkg.price / sarRate)})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPurchase}
              className="w-full py-3.5 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[13.5px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Aktifkan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TOP UP BALANCE SAR                                               */}
      {/* ========================================================================= */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-black text-[#1A1D26]">
                Top Up Pulsa SAR Roaming
              </h3>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Top Up (SAR)
                </label>
                <input
                  type="number"
                  value={topUpAmountSar}
                  onChange={(e) => setTopUpAmountSar(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-black text-[16px] text-[#1A1D26] focus:border-[#1037A6] outline-none font-mono"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  ≈ Rp{Math.round((parseFloat(topUpAmountSar) || 0) * sarRate).toLocaleString('id-ID')} (Kurs 1 SAR = Rp{sarRate})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['20', '50', '100'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmountSar(amt)}
                    className="py-1.5 rounded-lg border border-gray-200 hover:border-[#1037A6] text-[12px] font-bold text-gray-700 active:scale-95 transition-all"
                  >
                    SAR {amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTopUpSubmit}
              className="w-full py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Konfirmasi Top Up
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SCAN QR PROFILE ESIM                                             */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[15.5px] font-black text-[#1A1D26]">
                QR Profile eSIM Saudi
              </h3>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-5 flex flex-col items-center">
              <div className="w-44 h-44 bg-gray-100 rounded-2xl border-2 border-dashed border-[#1037A6]/40 flex items-center justify-center p-3 mb-3">
                <QrCode className="w-32 h-32 text-[#1037A6]" />
              </div>
              <span className="text-[11px] font-mono text-gray-500">
                LPA:1$smdp.aladin.sa$994821038
              </span>
              <p className="text-[11.5px] text-gray-600 mt-2 px-2">
                Buka Pengaturan HP &gt; Seluler &gt; Tambah eSIM &gt; Scan QR di atas untuk aktivasi langsung tanpa ganti kartu SIM.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowQrModal(false)
                triggerReaction('success', 'Kode aktivasi SM-DP+ disalin ke clipboard.')
              }}
              className="w-full py-2.5 rounded-xl bg-blue-50 text-[#1037A6] font-bold text-[12px] active:scale-95 transition-all"
            >
              Salin Kode Aktivasi Manual
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SHARING KUOTA (BAGI KUOTA)                                       */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[15.5px] font-black text-[#1A1D26]">
                Bagi Kuota ke Jamaah Lain
              </h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nomor HP Penerima (WA / Saudi)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789 atau +966..."
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[13.5px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Jumlah Kuota Ditransfer (GB)
                </label>
                <input
                  type="number"
                  defaultValue="2"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[14px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
                <span className="text-[10.5px] text-gray-400 mt-1 block">
                  Sisa kuota internet Anda: {activeInternetGb.toFixed(1)} GB
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowShareModal(false)
                setActiveInternetGb((prev) => Math.max(0, prev - 2))
                triggerReaction('success', 'Berhasil transfer 2 GB ke nomor tujuan!')
              }}
              className="w-full py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Kirim Kuota Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DETAIL PEMAKAIAN KUOTA (VIEW MY PACKAGE)                         */}
      {/* ========================================================================= */}
      {showDetailPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[15.5px] font-black text-[#1A1D26]">
                Rincian Pemakaian Kuota
              </h3>
              <button
                type="button"
                onClick={() => setShowDetailPackageModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-[12.5px]">
              <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kuota Utama Saudi:</span>
                  <span className="font-mono font-bold text-gray-900">{activeInternetGb.toFixed(1)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp &amp; Maps:</span>
                  <span className="font-bold text-[#059669]">UNLIMITED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Panggilan Telepon:</span>
                  <span className="font-mono font-bold text-gray-900">{activeVoiceMins} Menit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Operator Rekanan:</span>
                  <span className="font-bold text-[#1037A6]">STC / Mobily Saudi 5G</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Masa Aktif:</span>
                  <span className="font-mono font-bold text-gray-900">{activeDaysLeft} Hari</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetailPackageModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px] active:scale-95 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
