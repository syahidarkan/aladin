'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { useBankState, buyHijrahItem } from '@/lib/bankState'
import {
  ArrowLeft,
  Utensils,
  Shirt,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Check,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Ticket,
} from 'lucide-react'

type CategoryId =
  | 'hub'
  | 'ormas'
  | 'ziswaf'
  | 'kajian'
  | 'umroh'
  | 'investasi'
  | 'fashion'
  | 'kuliner'
  | 'kesehatan'
  | 'pendidikan'

export default function AlaHijrahPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<CategoryId>('hub')
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string
    category: string
    price: number
    discountPrice: number
    location: string
    date: string
    time: string
    organizer: string
  } | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Dynamic header title matching current view
  const getHeaderTitle = () => {
    switch (activeCategory) {
      case 'hub':
        return 'Ala Hijrah'
      case 'kajian':
        return 'Kajian & Event'
      case 'ormas':
        return 'Ormas Islam'
      case 'ziswaf':
        return 'ZISWAF'
      case 'umroh':
        return 'Tour & Umroh'
      case 'investasi':
        return 'Investasi Emas'
      case 'fashion':
        return 'Modest Wear'
      case 'kuliner':
        return 'Kuliner Halal'
      case 'kesehatan':
        return 'Kesehatan Syariah'
      case 'pendidikan':
        return 'Pendidikan Anak'
      default:
        return 'Ala Hijrah'
    }
  }

  // 9 Categories - Livin' Sukha Authentic Clean Squircle Matrix (Zero Badges, Zero Clutter)
  const sukhaCategories = [
    {
      id: 'ormas',
      label: 'Ormas Islam',
      iconBg: '#F0FDF4',
      borderColor: '#DCFCE7',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: 'ziswaf',
      label: 'ZISWAF',
      iconBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 'kajian',
      label: 'Kajian Event',
      iconBg: '#FEF3C7',
      borderColor: '#FDE68A',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <line x1="7" y1="9" x2="17" y2="9" />
          <line x1="7" y1="13" x2="17" y2="13" />
          <line x1="7" y1="17" x2="13" y2="17" />
        </svg>
      ),
    },
    {
      id: 'umroh',
      label: 'Tour & Umroh',
      iconBg: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: 'investasi',
      label: 'Investasi Emas',
      iconBg: '#EEF2FF',
      borderColor: '#C7D2FE',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: 'fashion',
      label: 'Modest Wear',
      iconBg: '#FAF5FF',
      borderColor: '#E9D5FF',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      id: 'kuliner',
      label: 'Kuliner Halal',
      iconBg: '#FFF7ED',
      borderColor: '#FED7AA',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="2" x2="6" y2="5" />
          <line x1="10" y1="2" x2="10" y2="5" />
        </svg>
      ),
    },
    {
      id: 'kesehatan',
      label: 'Kesehatan',
      iconBg: '#F0FDF4',
      borderColor: '#BBF7D0',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      id: 'pendidikan',
      label: 'Pendidikan Anak',
      iconBg: '#F5F3FF',
      borderColor: '#DDD6FE',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
  ]

  // Event Kajian Data Lengkap & Beragam Ustadz dengan Asset Foto
  const kajianEvents = [
    {
      id: 1,
      title: 'Kunci Ketenangan Hati & Rezeki Berkah',
      category: 'Kajian Akbar Spesial',
      speaker: 'Ustadz Adi Hidayat, Lc., M.A.',
      date: 'Sabtu, 21 Nov 2026',
      time: '08:30 - 11:30 WIB',
      location: 'Masjid Istiqlal Jakarta & Live YouTube',
      normalPrice: 100000,
      discountPrice: 65000,
      badge: 'Presale Aladin -35%',
      partner: 'Quantum Akhyar Institute',
      image: '/assets/hijrah/kajian_uah.jpg',
    },
    {
      id: 2,
      title: 'Fiqih Muamalah & Bisnis Syariah Kontemporer',
      category: 'Seminar Fiqih Muamalah',
      speaker: 'Ustadz Abdul Somad, Lc., D.E.S.A.',
      date: 'Ahad, 29 Nov 2026',
      time: '13:00 - 16:30 WIB',
      location: 'Jakarta Convention Center (JCC) & Zoom',
      normalPrice: 150000,
      discountPrice: 95000,
      badge: 'Presale Aladin -36%',
      partner: 'Tafaqquh Fiddin Foundation',
      image: '/assets/hijrah/kajian_uas.jpg',
    },
    {
      id: 3,
      title: 'Shift: Youth Hijrah & Mengatasi Overthinking',
      category: 'Kajian Gen Z Akbar',
      speaker: 'Ustadz Hanan Attaki, Lc.',
      date: 'Sabtu, 05 Des 2026',
      time: '19:30 - 22:00 WIB',
      location: 'Tennis Indoor Senayan, Jakarta',
      normalPrice: 125000,
      discountPrice: 75000,
      badge: 'Gen Z Special -40%',
      partner: 'Pemuda Hijrah (Shift)',
      image: '/assets/hijrah/kajian_hanan.jpg',
    },
    {
      id: 4,
      title: 'Tuntunan Ibadah & Tazkiyatun Nafs',
      category: 'Kajian Tematik',
      speaker: 'Ustadz Dr. Khalid Basalamah, M.A.',
      date: 'Ahad, 13 Des 2026',
      time: '09:00 - 12:00 WIB',
      location: 'Masjid Al-Barkah Cileungsi & Live Al-Sofwa',
      normalPrice: 90000,
      discountPrice: 50000,
      badge: 'Bebas Admin',
      partner: 'Gazwah Islamic Center',
      image: '/assets/hijrah/kajian_khalid.jpg',
    },
    {
      id: 5,
      title: 'Merajut Sakinah: Adab Berkeluarga & Parenting Qurani',
      category: 'Kajian Keluarga',
      speaker: 'Buya Yahya (Pengasuh LPD Al-Bahjah)',
      date: 'Sabtu, 19 Des 2026',
      time: '08:30 - 11:45 WIB',
      location: 'Ballroom Hotel Bidakara Jakarta',
      normalPrice: 175000,
      discountPrice: 110000,
      badge: 'Paket Suami Istri',
      partner: 'LPD Al-Bahjah Cirebon',
      image: '/assets/hijrah/kajian_buya.jpg',
    },
    {
      id: 6,
      title: 'Muslimah Berdaya: Mendidik Generasi Penghafal Al-Quran',
      category: 'Kajian Khusus Muslimah',
      speaker: 'Ustadzah Dr. Oki Setiana Dewi, M.Pd.',
      date: 'Ahad, 27 Des 2026',
      time: '10:00 - 13:00 WIB',
      location: 'Auditorium Menara 165 Jakarta Selatan',
      normalPrice: 130000,
      discountPrice: 80000,
      badge: 'Khusus Muslimah',
      partner: 'Maskanul Huffadz Indonesia',
      image: '/assets/hijrah/kajian_oki.jpg',
    },
    {
      id: 7,
      title: 'Lapis-Lapis Keberkahan dalam Ukhuwah & Muamalah',
      category: 'Bedah Buku & Kajian',
      speaker: 'Ustadz Salim A. Fillah',
      date: 'Sabtu, 02 Jan 2027',
      time: '15:30 - 18:00 WIB',
      location: 'Masjid Jogokariyan Yogyakarta & Live Stream',
      normalPrice: 85000,
      discountPrice: 55000,
      badge: 'Bonus E-Book',
      partner: 'Pro-U Media & Jogokariyan',
      image: '/assets/hijrah/kajian_salim.jpg',
    },
  ]

  // Modest Wear Items dengan Asset Foto
  const fashionItems = [
    {
      id: 101,
      title: 'Buttonscarves Exclusive Silk Scarf - Aladin Series',
      category: 'Hijab Premium',
      partner: 'Buttonscarves Official',
      normalPrice: 395000,
      discountPrice: 315000,
      badge: 'Diskon 20%',
      desc: 'Bahan voal premium dengan laser cut presisi dan motif islami elegan.',
      image: '/assets/hijrah/fashion_buttonscarves.jpg',
    },
    {
      id: 102,
      title: 'Vanilla Hijab Daily Voal Premium Anti-Lepek',
      category: 'Daily Wear',
      partner: 'Vanilla Hijab Official',
      normalPrice: 120000,
      discountPrice: 85000,
      badge: 'Best Seller',
      desc: 'Bahan adem, nyaman dipakai harian, dan tegak sempurna di dahi.',
      image: '/assets/hijrah/fashion_voal.jpg',
    },
    {
      id: 103,
      title: 'Baju Koko Modern Atlas Jacquard Classic',
      category: 'Koko Pria',
      partner: 'Atlas Signature',
      normalPrice: 285000,
      discountPrice: 199000,
      badge: 'Hemat Rp86rb',
      desc: 'Tenun jacquard premium motif islami minimalis untuk ibadah & formal.',
      image: '/assets/hijrah/fashion_koko.jpg',
    },
    {
      id: 104,
      title: 'Sarung BHS Signature Gold Masterpiece',
      category: 'Sarung Tenun',
      partner: 'Behaestex BHS',
      normalPrice: 650000,
      discountPrice: 490000,
      badge: 'Koleksi Spesial',
      desc: 'Tenun sutra perpaduan mesres kualitas mahakarya nusantara.',
      image: '/assets/hijrah/fashion_sarung.jpg',
    },
    {
      id: 105,
      title: 'Khimar Syar’i Rabbani Polos Soft Pad',
      category: 'Khimar Syar’i',
      partner: 'Rabbani Asli',
      normalPrice: 165000,
      discountPrice: 115000,
      badge: 'Diskon 30%',
      desc: 'Khimar syar’i menutup dada dengan bahan kaos spandek adem.',
      image: '/assets/hijrah/fashion_khimar.jpg',
    },
  ]

  // Kuliner Halal Items dengan Asset Foto
  const kulinerItems = [
    {
      id: 201,
      title: 'Voucher Solaria Halal Express Rp100.000',
      category: 'Restoran Halal',
      partner: 'Solaria Halal Indonesia',
      normalPrice: 100000,
      discountPrice: 75000,
      badge: 'Hemat 25%',
      desc: 'Bersertifikat Halal MUI & BPJPH. Berlaku di seluruh outlet Solaria.',
      image: '/assets/hijrah/kuliner_solaria.jpg',
    },
    {
      id: 202,
      title: 'Paket Puas Bebek Kaleyo Halal BPJPH',
      category: 'Kuliner Nusantara',
      partner: 'Bebek Kaleyo Official',
      normalPrice: 85000,
      discountPrice: 59000,
      badge: 'Diskon 30%',
      desc: 'Bebek goreng kremes renyah + nasi uduk + sambal rica pedas mantap.',
      image: '/assets/hijrah/kuliner_bebek.jpg',
    },
    {
      id: 203,
      title: 'Kopi Kenangan Halal 2 Cups Signature Drink',
      category: 'Minuman Halal',
      partner: 'Kopi Kenangan Halal',
      normalPrice: 48000,
      discountPrice: 29000,
      badge: 'Beli 1 Dapat 2',
      desc: 'Kopi Kenangan Mantan + Cokelat Klasik bersertifikat halal resmi.',
      image: '/assets/hijrah/kuliner_kopi.jpg',
    },
    {
      id: 204,
      title: 'Waroeng Steak & Shake Dobel Beef Halal',
      category: 'Steak Halal',
      partner: 'Waroeng Steak Indonesia',
      normalPrice: 62000,
      discountPrice: 42000,
      badge: 'Cashback 32%',
      desc: 'Pelopor steak halal Indonesia dengan saus khas nusantara gurih.',
      image: '/assets/hijrah/kuliner_steak.jpg',
    },
    {
      id: 205,
      title: 'Dapur Cokelat Halal Regular Cake Signature',
      category: 'Pastry & Bakery',
      partner: 'Dapur Cokelat Halal',
      normalPrice: 180000,
      discountPrice: 135000,
      badge: 'Diskon 25%',
      desc: 'Cake cokelat lezat berlisensi halal resmi BPJPH untuk momen spesial.',
      image: '/assets/hijrah/kuliner_cokelat.jpg',
    },
  ]

  // Kesehatan Syariah Items dengan Asset Foto
  const kesehatanItems = [
    {
      id: 301,
      title: 'Paket Medical Check-Up Dasar RS Islam',
      category: 'Layanan Rumah Sakit',
      partner: 'RS Islam Jakarta',
      normalPrice: 450000,
      discountPrice: 315000,
      badge: 'Diskon 30%',
      desc: 'Pemeriksaan hematologi lengkap, gula darah puasa, kolesterol, & tensi.',
      image: '/assets/hijrah/health_checkup.jpg',
    },
    {
      id: 302,
      title: 'Paket Vaksin Meningitis Umrah Halal MUI',
      category: 'Vaksinasi Ibadah',
      partner: 'Klinik Bio Farma & Kemenkes',
      normalPrice: 380000,
      discountPrice: 290000,
      badge: 'Wajib Umrah',
      desc: 'Sertifikat vaksin internasional (ICV) resmi Kemenkes untuk syarat Umrah.',
      image: '/assets/hijrah/health_vaccine.jpg',
    },
    {
      id: 303,
      title: 'Terapi Bekam Medis Steril Thibbun Nabawi',
      category: 'Thibbun Nabawi',
      partner: 'Rumah Sehat Syariah Indonesia',
      normalPrice: 150000,
      discountPrice: 99000,
      badge: 'Steril & Higienis',
      desc: 'Terapis profesional bersertifikat ABI (Asosiasi Bekam Indonesia).',
      image: '/assets/hijrah/health_checkup.jpg',
    },
    {
      id: 304,
      title: 'Paket Madu Habbatussauda Herbal Alami (3 Botol)',
      category: 'Suplemen Alami',
      partner: 'Apotek K-24 Halal',
      normalPrice: 125000,
      discountPrice: 85000,
      badge: 'Imun Booster',
      desc: 'Madu murni trigona kaya antioksidan dan minyak jinten hitam murni.',
      image: '/assets/hijrah/health_checkup.jpg',
    },
  ]

  // Pendidikan Anak Items dengan Asset Foto
  const pendidikanItems = [
    {
      id: 401,
      title: 'Kelas Intensif Tahsin & Tahfidz Bersanad Online',
      category: 'Tahfidz Al-Qur’an',
      partner: 'Markaz Al-Qur’an Syariah',
      normalPrice: 350000,
      discountPrice: 245000,
      badge: 'E-Certificate',
      desc: '4 sesi intensif bersama ustadz bersanad riwayat Hafsh ‘an ‘Ashim.',
      image: '/assets/hijrah/edu_tahfidz.jpg',
    },
    {
      id: 402,
      title: 'Workshop Islamic Parenting Anak Zaman Now',
      category: 'Parenting Nabawiyah',
      partner: 'Sahabat Parenting Indonesia',
      normalPrice: 150000,
      discountPrice: 95000,
      badge: 'Bimbingan Ahli',
      desc: 'Kiat mendidik anak mencintai Al-Qur’an di era gempuran gadget & AI.',
      image: '/assets/hijrah/edu_tahfidz.jpg',
    },
    {
      id: 403,
      title: 'Formulir Pendaftaran Sekolah Islam Terpadu JSIT',
      category: 'Pendaftaran Sekolah',
      partner: 'Jaringan Sekolah Islam Terpadu',
      normalPrice: 250000,
      discountPrice: 125000,
      badge: 'Potongan 50%',
      desc: 'Voucher diskon formulir pendaftaran SDIT/SMPIT/SMAIT se-Indonesia.',
      image: '/assets/hijrah/edu_tahfidz.jpg',
    },
    {
      id: 404,
      title: 'Kursus Kilat Bahasa Arab & Fiqih Muamalah Dasar',
      category: 'Edukasi Syariah',
      partner: 'Aladin Academy',
      normalPrice: 200000,
      discountPrice: 140000,
      badge: 'Akses Selamanya',
      desc: 'Kuasai kosakata Al-Qur’an dan aturan jual beli syariah bebas riba.',
      image: '/assets/hijrah/edu_tahfidz.jpg',
    },
  ]

  return (
    <div
      className="app-page-container flex flex-col h-full min-h-0 max-h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Top Header Bar (Seamless White Header) */}
      <header className="shrink-0 w-full bg-white border-b border-[#ECEEF2] z-30">
        <StatusBar className="bg-white" />
        <div
          className="w-full bg-white flex items-center justify-between"
          style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
        >
          <button
            type="button"
            data-back="true"
            onClick={() => {
              if (activeCategory !== 'hub') {
                setActiveCategory('hub')
              } else {
                router.push('/beranda')
              }
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-900 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" strokeWidth={2.6} />
          </button>

          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            {getHeaderTitle()}
          </h1>

          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C20C4] hover:bg-blue-50 active:scale-95 transition-all"
            aria-label="Beranda"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        </div>
      </header>

      {/* 3. SCROLLABLE MAIN BODY */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        {/* ========================================================================= */}
        {/* VIEW 0: MAIN ALA HIJRAH HUB (LIVIN' SUKHA MODEL)                          */}
        {/* ========================================================================= */}
        {activeCategory === 'hub' && (
          <div>
            {/* HERO BANNER: Grand Photographic Mosque Architecture + 3D "HIJRAH" Text */}
            <div
              style={{
                height: '195px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 20px',
              }}
            >
              {/* Grand Photographic Backdrop */}
              <Image
                src="/assets/hijrah/hero_hijrah.jpg"
                alt="Ekosistem Syariah"
                fill
                className="object-cover object-center"
                priority
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(9, 30, 66, 0.82) 0%, rgba(28, 32, 196, 0.75) 55%, rgba(0, 179, 146, 0.88) 100%)',
                }}
              />

              {/* Bold 3D Block Text "HIJRAH" */}
              <div
                className="relative text-center select-none z-10"
                style={{
                  transform: 'perspective(500px) rotateX(8deg) rotateY(-2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <span
                  style={{
                    fontSize: '54px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '3px',
                    lineHeight: '1',
                    color: '#FFFFFF',
                    textShadow:
                      '0 2px 0 #00B48A, 0 4px 0 #00936F, 0 6px 0 #007355, 0 8px 0 #00563E, 0 10px 18px rgba(0,0,0,0.5)',
                    display: 'block',
                  }}
                >
                  HIJRAH
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '3.5px',
                    color: '#00F3AD',
                    marginTop: '8px',
                    textTransform: 'uppercase',
                    display: 'block',
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  Lifestyle &amp; Ekosistem Syariah
                </span>
              </div>
            </div>

            {/* THE SUKHA ICON GRID CONTAINER (Mirrors Livin' Sukha White Card) */}
            <div style={{ padding: '0 20px', marginTop: '-24px', position: 'relative', zIndex: 10 }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px 16px 20px 16px',
                  boxShadow: '0 8px 24px rgba(10, 37, 64, 0.08)',
                  border: '1px solid #ECEEF2',
                }}
              >
                {/* 3 COLUMNS X 3 ROWS BALANCED MATRIX (9 Categories - Zero Leftover Slots) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px 12px',
                  }}
                >
                  {sukhaCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'investasi') {
                          window.location.href = '/wealth'
                        } else if (item.id === 'umroh') {
                          window.location.href = '/pilgrim-bundle'
                        } else if (item.id === 'ziswaf') {
                          window.location.href = '/donasi'
                        } else {
                          setActiveCategory(item.id as CategoryId)
                        }
                      }}
                      className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
                    >
                      {/* Squircle Icon Box (Clean, Elegant, Zero Cluttered Badges) */}
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '20px',
                          backgroundColor: item.iconBg,
                          border: `1.5px solid ${item.borderColor}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                        className="flex items-center justify-center relative"
                      >
                        {item.icon}
                      </div>

                      {/* Clean Native Label (Livin' Sukha Style: Just The Clean Name) */}
                      <div className="h-[28px] flex items-center justify-center text-center mt-2 px-1">
                        <span className="text-[12px] font-bold text-[#1E293B] leading-tight text-center">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: "SEMUA ADA, SEMUA BERKAH" (Mirrors "Semua Ada, Semua Sukha") */}
            <div style={{ padding: '24px 20px 40px 20px' }}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-[16px] font-extrabold text-[#1C20C4]">
                    Semua Ada, Semua Berkah
                  </h3>
                  <p className="text-[11.5px] text-[#6C737E] truncate">
                    Presale tiket eksklusif &amp; kemitraan komunitas resmi
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory('kajian')}
                  className="text-[12px] font-bold text-[#1C20C4] hover:underline whitespace-nowrap shrink-0"
                >
                  Lihat Semua →
                </button>
              </div>

              {/* Promo Banner Card 1: Kajian Akbar Presale with Real Photographic Background */}
              <div
                onClick={() => setActiveCategory('kajian')}
                className="relative rounded-3xl overflow-hidden text-white shadow-lg mb-4 cursor-pointer active:scale-[0.99] transition-all border border-white/15 h-48 flex flex-col justify-between p-5"
              >
                <Image
                  src="/assets/hijrah/kajian_akbar.jpg"
                  alt="Kajian Akbar Gen Z"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081D48] via-[#081D48]/75 to-black/40 z-10" />

                <div className="relative z-20 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#00F0A0] uppercase tracking-wider bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    PRESALE EKSKLUSIF ALADIN
                  </span>
                  <span className="text-[11px] font-bold text-white/80 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    Sisa 42 Tiket
                  </span>
                </div>

                <div className="relative z-20">
                  <h4 className="text-[16px] font-black text-white leading-snug drop-shadow-sm">
                    Kajian Akbar &amp; Mental Health Gen Z
                  </h4>
                  <p className="text-[11.5px] text-gray-200 mt-0.5">
                    21 Nov 2026 • Grand Ballroom Jakarta
                  </p>
                </div>

                <div className="relative z-20 flex items-center justify-between pt-2 border-t border-white/20">
                  <div>
                    <span className="text-[10px] text-gray-300 block">Harga Spesial Nasabah:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[18px] font-black text-[#00F0A0]">
                        Rp85.000
                      </span>
                      <span className="text-[11px] line-through text-gray-400">
                        Rp125.000
                      </span>
                    </div>
                  </div>
                  <span className="h-8 px-4 rounded-full bg-[#00F0A0] text-[#081D48] text-[12px] font-black flex items-center shadow-md">
                    Beli Tiket →
                  </span>
                </div>
              </div>

              {/* Promo Banner Card 2: Kuliner Halal Solaria with Photographic Card */}
              <div
                onClick={() => setActiveCategory('kuliner')}
                className="bg-white rounded-3xl p-3.5 border border-orange-200/80 shadow-sm mb-4 cursor-pointer active:scale-[0.99] transition-all flex items-center gap-3.5"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-orange-100 shadow-2xs">
                  <Image
                    src="/assets/hijrah/kuliner_solaria.jpg"
                    alt="Voucher Solaria"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-orange-600 text-[8px] font-black text-white px-1.5 py-0.2 rounded">
                    -25%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9.5px] font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    KULINER HALAL TERVERIFIKASI
                  </span>
                  <h4 className="text-[14px] font-extrabold text-gray-900 leading-tight truncate">
                    Voucher Solaria Halal Express
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Sertifikat Resmi BPJPH • Cashback 25%
                  </p>
                </div>
                <button
                  type="button"
                  className="h-8 px-3.5 rounded-full bg-[#EA580C] text-white text-[11.5px] font-black shadow-xs shrink-0 cursor-pointer"
                >
                  Klaim →
                </button>
              </div>

              {/* Promo Banner Card 3: Modest Fashion Buttonscarves */}
              <div
                onClick={() => setActiveCategory('fashion')}
                className="bg-white rounded-3xl p-3.5 border border-purple-200/80 shadow-sm mb-4 cursor-pointer active:scale-[0.99] transition-all flex items-center gap-3.5"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-purple-100 shadow-2xs">
                  <Image
                    src="/assets/hijrah/fashion_buttonscarves.jpg"
                    alt="Buttonscarves Exclusive"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-purple-700 text-[8px] font-black text-white px-1.5 py-0.2 rounded">
                    -20%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9.5px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    MODEST WEAR EKSLUSIF
                  </span>
                  <h4 className="text-[14px] font-extrabold text-gray-900 leading-tight truncate">
                    Buttonscarves Silk Scarf Aladin
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Voal Premium Motif Islami Laser Cut
                  </p>
                </div>
                <button
                  type="button"
                  className="h-8 px-3.5 rounded-full bg-[#9333EA] text-white text-[11.5px] font-black shadow-xs shrink-0 cursor-pointer"
                >
                  Beli →
                </button>
              </div>

              {/* Redesigned Card 3: Kemitraan Resmi Ekosistem Syariah */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '18px 20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: '#64748B',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  KEMITRAAN RESMI EKOSISTEM SYARIAH
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                  {['Muhammadiyah', 'MUI', 'BAZNAS', 'HIMPUH'].map((partner) => (
                    <span
                      key={partner}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#081D48',
                        backgroundColor: '#F1F5F9',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: DEDICATED KAJIAN & EVENT TICKETING SUB-PAGE                       */}
        {/* ========================================================================= */}
        {activeCategory === 'kajian' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#1C20C4',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                TIKET KAJIAN &amp; WORKSHOP
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Event Syariah Pilihan
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Presale tiket lebih hemat khusus nasabah Bank Aladin Syariah.
              </p>
            </div>

            {/* List Events with Real Photos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kajianEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs hover:border-blue-200 transition-all flex flex-col gap-3"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                      <Image
                        src={ev.image}
                        alt={ev.speaker}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-xs">
                        {ev.badge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#1037A6] bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                        {ev.category}
                      </span>
                      <h4 className="text-[13.5px] font-black text-gray-900 mt-1 leading-snug line-clamp-2">
                        {ev.title}
                      </h4>
                      <p className="text-[11.5px] font-extrabold text-gray-700 mt-0.5 truncate">
                        {ev.speaker}
                      </p>
                      <p className="text-[11px] font-semibold text-[#1037A6] mt-1">
                        {ev.date}
                      </p>
                      <p className="text-[10.5px] text-gray-400 truncate">
                        {ev.location}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Harga Presale Aladin:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[16px] font-black text-[#1037A6]">
                          Rp{ev.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] line-through text-gray-400">
                          Rp{ev.normalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEvent({
                          title: ev.title,
                          category: ev.category,
                          price: ev.normalPrice,
                          discountPrice: ev.discountPrice,
                          location: ev.location,
                          date: ev.date,
                          time: ev.time,
                          organizer: ev.partner,
                        })
                        setShowCheckout(true)
                      }}
                      className="h-9 px-4 rounded-full bg-[#1037A6] hover:bg-[#0c2b82] text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Beli Tiket →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEDICATED ORMAS ISLAM SUB-PAGE                                    */}
        {/* ========================================================================= */}
        {activeCategory === 'ormas' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#16A34A',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                COMMUNITY PARTNERSHIP
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Program Ormas Islam Resmi
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Transaksi dan program sosial langsung bersama Muhammadiyah &amp; Majelis Ulama Indonesia (MUI).
              </p>
            </div>

            {/* Program 1: Qurban Terjadwal Lazismu */}
            <div className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-2xs space-y-3.5">
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-100 shadow-2xs">
                <Image
                  src="/assets/hijrah/ormas_muhammadiyah.jpg"
                  alt="Lazismu Qurban Terjadwal"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#16A34A] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                  Lazismu • Muhammadiyah
                </span>
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md">
                  Tabungan Qurban
                </span>
              </div>

              <div>
                <h4 className="text-[15px] font-black text-gray-900 leading-snug">
                  Program Qurban Terjadwal 1448 H
                </h4>
                <p className="text-[11.5px] text-gray-500 mt-1">
                  Pemberdayaan peternak lokal & distribusi daging olahan ke daerah 3T di seluruh Indonesia.
                </p>
              </div>

              {/* Clean feature tags */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  Daging Olahan Higienis
                </span>
                <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  Distribusi Daerah 3T
                </span>
                <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  Autodebet Bebas Riba
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Mulai Tabungan:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[16px] font-black text-[#16A34A]">
                      Rp237.500
                    </span>
                    <span className="text-[11px] text-gray-500">/bulan</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Pendaftaran Program Qurban Terjadwal Lazismu berhasil dibuka.')}
                  className="h-9 px-4 rounded-full bg-[#16A34A] hover:bg-green-700 text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Ikut Program →
                </button>
              </div>
            </div>

            {/* Program 2: Wakaf Madrasah MUI */}
            <div className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-2xs space-y-3.5">
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-100 shadow-2xs">
                <Image
                  src="/assets/hijrah/ormas_nu_istiqlal.jpg"
                  alt="Wakaf Digital Pesantren & Madrasah"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#1037A6] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                  MUI &amp; Wakaf Nasional
                </span>
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md">
                  Wakaf Uang Produktif
                </span>
              </div>

              <div>
                <h4 className="text-[15px] font-black text-gray-900 leading-snug">
                  Wakaf Digital Pesantren &amp; Madrasah
                </h4>
                <p className="text-[11.5px] text-gray-500 mt-1">
                  Dukung pembangunan fasilitas belajar santri penghafal Al-Qur’an bersama BWI dan MUI.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  Laboratorium Santri
                </span>
                <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  Pemberdayaan Umat
                </span>
                <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                  Sertifikat Wakaf BWI
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Nominal Donasi:</span>
                  <span className="text-[16px] font-black text-[#1037A6]">
                    Mulai Rp50.000
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Wakaf Tunai disalurkan ke rekening resmi Badan Wakaf Indonesia.')}
                  className="h-9 px-4 rounded-full bg-[#1037A6] hover:bg-blue-800 text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Salurkan Wakaf →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: DEDICATED MODEST WEAR (FASHION) SUB-PAGE                          */}
        {/* ========================================================================= */}
        {activeCategory === 'fashion' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#9333EA',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                MODEST WEAR &amp; BUSANA MUSLIM
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Koleksi Syar’i &amp; Halal Lifestyle
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Dapatkan voucher cashback dan diskon eksklusif dari brand muslim ternama.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fashionItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-2xs space-y-3"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="relative w-22 h-22 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-[#9333EA] text-white text-[8px] font-black px-1.5 py-0.2 rounded-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#9333EA] bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                        {item.category}
                      </span>
                      <h4 className="text-[13.5px] font-black text-gray-900 mt-1 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-[10.5px] text-purple-700 font-bold block mt-1">
                        Mitra: {item.partner}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Harga Nasabah Aladin:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[16px] font-black text-[#1037A6]">
                          Rp{item.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] line-through text-gray-400">
                          Rp{item.normalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent({
                          title: item.title,
                          category: item.category,
                          price: item.normalPrice,
                          discountPrice: item.discountPrice,
                          location: 'Pengiriman Kurir Cepat (Free Ongkir)',
                          date: 'Pesanan Diproses Hari Ini',
                          time: 'Estimasi 1-2 Hari Kerja',
                          organizer: item.partner,
                        })
                        setShowCheckout(true)
                      }}
                      className="h-9 px-4 rounded-full bg-[#9333EA] hover:bg-purple-700 text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Beli Sekarang →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: DEDICATED KULINER HALAL SUB-PAGE                                  */}
        {/* ========================================================================= */}
        {activeCategory === 'kuliner' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#EA580C',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                KULINER HALAL TERVERIFIKASI
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Resto &amp; Kafe Halal Resmi BPJPH
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Makan nikmat, tenang, dan halal dengan diskon instan via pembayaran Ala Dompet.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kulinerItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-2xs space-y-3"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="relative w-22 h-22 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-[#EA580C] text-white text-[8px] font-black px-1.5 py-0.2 rounded-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-md inline-block">
                        {item.category}
                      </span>
                      <h4 className="text-[13.5px] font-black text-gray-900 mt-1 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-[10.5px] text-orange-700 font-bold block mt-1">
                        Sertifikasi: {item.partner}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Harga Spesial Voucher:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[16px] font-black text-[#EA580C]">
                          Rp{item.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] line-through text-gray-400">
                          Rp{item.normalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent({
                          title: item.title,
                          category: item.category,
                          price: item.normalPrice,
                          discountPrice: item.discountPrice,
                          location: 'Semua Outlet Resmi Se-Indonesia',
                          date: 'Masa Berlaku 30 Hari',
                          time: 'Bisa Ditukar Langsung di Kasir',
                          organizer: item.partner,
                        })
                        setShowCheckout(true)
                      }}
                      className="h-9 px-4 rounded-full bg-[#EA580C] hover:bg-orange-700 text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Klaim Voucher →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: DEDICATED KESEHATAN SYARIAH SUB-PAGE                               */}
        {/* ========================================================================= */}
        {activeCategory === 'kesehatan' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#15803D',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                KESEHATAN SYARIAH &amp; THIBBUN NABAWI
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Layanan Medis Islami Terpercaya
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Pemeriksaan kesehatan, vaksin ibadah, dan pengobatan sunnah steril.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kesehatanItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-2xs space-y-3"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="relative w-22 h-22 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-[#15803D] text-white text-[8px] font-black px-1.5 py-0.2 rounded-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {item.category}
                      </span>
                      <h4 className="text-[13.5px] font-black text-gray-900 mt-1 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-[10.5px] text-emerald-700 font-bold block mt-1">
                        Mitra Medis: {item.partner}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Biaya Paket Nasabah:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[16px] font-black text-[#15803D]">
                          Rp{item.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] line-through text-gray-400">
                          Rp{item.normalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent({
                          title: item.title,
                          category: item.category,
                          price: item.normalPrice,
                          discountPrice: item.discountPrice,
                          location: 'Klinik / RS Mitra Terpilih',
                          date: 'Reservasi Jadwal Fleksibel',
                          time: '08:00 - 17:00 WIB',
                          organizer: item.partner,
                        })
                        setShowCheckout(true)
                      }}
                      className="h-9 px-4 rounded-full bg-[#15803D] hover:bg-emerald-800 text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Pesan Layanan →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: DEDICATED PENDIDIKAN ANAK SUB-PAGE                                 */}
        {/* ========================================================================= */}
        {activeCategory === 'pendidikan' && (
          <div style={{ padding: '16px 20px 40px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid #ECEEF2',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#6D28D9',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                PENDIDIKAN ISLAM &amp; PARENTING
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D26', margin: 0 }}>
                Sekolah, Tahfidz &amp; Generasi Qur’ani
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                Wujudkan impian masa depan buah hati dengan pendidikan syariah terpadu.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendidikanItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4.5 border border-[#ECEEF2] shadow-2xs space-y-3"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="relative w-22 h-22 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-[#6D28D9] text-white text-[8px] font-black px-1.5 py-0.2 rounded-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                        {item.category}
                      </span>
                      <h4 className="text-[13.5px] font-black text-gray-900 mt-1 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-[10.5px] text-purple-700 font-bold block mt-1">
                        Lembaga: {item.partner}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Biaya Formulir / Program:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[16px] font-black text-[#6D28D9]">
                          Rp{item.discountPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] line-through text-gray-400">
                          Rp{item.normalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent({
                          title: item.title,
                          category: item.category,
                          price: item.normalPrice,
                          discountPrice: item.discountPrice,
                          location: 'Kelas Online / Sekolah Mitra',
                          date: 'Akses Langsung Pasca Pembayaran',
                          time: 'Jadwal Fleksibel',
                          organizer: item.partner,
                        })
                        setShowCheckout(true)
                      }}
                      className="h-9 px-4 rounded-full bg-[#6D28D9] hover:bg-purple-900 text-white text-[12px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Daftar Program →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL                                                            */}
      {/* ========================================================================= */}
      {showCheckout && selectedEvent && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ padding: '24px 20px 40px 20px' }}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#1C20C4] uppercase tracking-wider block">
                  KONFIRMASI PEMESANAN TIKET
                </span>
                <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #ECEEF2',
                marginBottom: '16px',
              }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] text-[#6C737E]">Penyelenggara:</span>
                <span className="text-[11px] font-bold text-[#1A1D26]">{selectedEvent.organizer}</span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] text-[#6C737E]">Jadwal:</span>
                <span className="text-[11px] font-semibold text-[#1A1D26]">{selectedEvent.date}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#ECEEF2]">
                <span className="text-[12.5px] font-bold text-[#1A1D26]">Total Pembayaran:</span>
                <div className="text-right">
                  <span className="text-[18px] font-extrabold text-[#1C20C4] block">
                    Rp{selectedEvent.discountPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Hemat Rp{(selectedEvent.price - selectedEvent.discountPrice).toLocaleString('id-ID')} (Presale Aladin)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const res = buyHijrahItem({
                  title: selectedEvent.title,
                  category: selectedEvent.category,
                  price: selectedEvent.discountPrice,
                  partner: selectedEvent.organizer,
                })
                if (!res.success) {
                  alert(res.error || 'Saldo tidak mencukupi.')
                  return
                }
                setShowCheckout(false)
                setShowSuccess(true)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '48px',
                padding: '0 24px',
                backgroundColor: '#1C20C4',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
                cursor: 'pointer',
              }}
              className="active:scale-98 transition-all"
            >
              Bayar via Ala Dompet
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TICKET SUCCESS MODAL                                                      */}
      {/* ========================================================================= */}
      {showSuccess && selectedEvent && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div
            className="w-full max-w-[320px] bg-white rounded-[24px] shadow-2xl text-center animate-in zoom-in-95 duration-200"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <h4 className="text-[17px] font-extrabold text-[#1A1D26]">E-Ticket Berhasil Diterbitkan!</h4>
              <p className="text-[11.5px] text-[#6C737E] mt-0.5">
                Tiket resmi acara telah dikirim ke email &amp; akun Aladin Anda.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '16px',
                padding: '12px 14px',
                border: '1px solid #ECEEF2',
                textAlign: 'left',
              }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10.5px] text-[#6C737E]">Kode Tiket:</span>
                <span className="text-[11px] font-mono font-extrabold text-[#1C20C4]">
                  ALD-TKT-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10.5px] text-[#6C737E]">Acara:</span>
                <span className="text-[11px] font-bold text-[#1A1D26] text-right truncate max-w-[170px]">
                  {selectedEvent.title}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-[#ECEEF2]">
                <span className="text-[11px] font-bold text-[#1A1D26]">Total:</span>
                <span className="text-[13px] font-extrabold text-[#064E3B]">
                  Rp{selectedEvent.discountPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccess(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '46px',
                padding: '0 24px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Selesai &amp; Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
