'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function TemanIbadahSaudiPage() {
  const [sarRate, setSarRate] = useState(4220)
  const [sarCalcInput, setSarCalcInput] = useState('50')
  const [activeTab, setActiveTab] = useState<'roaming' | 'esim' | 'merchant' | 'darurat'>('roaming')
  const [cityFilter, setCityFilter] = useState<'makkah' | 'madinah'>('makkah')

  // Modals
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [travelName, setTravelName] = useState('Maktour Travel')
  const [passportNumber, setPassportNumber] = useState('')
  const [claimSuccess, setClaimSuccess] = useState(false)

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [packagePrice, setPackagePrice] = useState<number>(0)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isMitraRegistered, setIsMitraRegistered] = useState(false)

  // Live ticking SAR rate simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSarRate((r) => r + (Math.random() > 0.5 ? 1 : -1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const sarInputNumber = parseFloat(sarCalcInput) || 0
  const idrEquivalent = Math.round(sarInputNumber * sarRate)

  const roamingPackages = [
    {
      id: 'tsel-15',
      provider: 'Telkomsel RoaMAX Umrah',
      operator: 'Telkomsel',
      quota: '15 GB',
      duration: '14 Hari',
      price: 275000,
      partner: 'STC / Mobily Saudi 5G',
      features: 'Tetap pakai no WA Indonesia • Nelpon 30 Menit',
    },
    {
      id: 'indosat-20',
      provider: 'Indosat Umrah & Haji Plus',
      operator: 'Indosat Ooredoo',
      quota: '20 GB',
      duration: '20 Hari',
      price: 310000,
      partner: 'Zain / STC Saudi 5G',
      features: 'Bebas Roaming Tanpa Ganti SIM • SMS Gratis',
    },
    {
      id: 'xl-pass',
      provider: 'XL Pass Ibadah Saudi',
      operator: 'XL Axiata',
      quota: '12 GB',
      duration: '12 Hari',
      price: 240000,
      partner: 'Mobily Saudi 5G',
      features: 'Aktif Otomatis di Bandara Jeddah • Kuota Utama',
    },
  ]

  const esimPackages = [
    {
      id: 'airalo-5',
      name: 'Airalo Saudi Hajj & Umrah eSIM',
      quota: '5 GB',
      duration: '15 Hari',
      price: 185000,
      type: 'eSIM QR Profile',
      features: 'Instan scan QR • Langsung aktif di pesawat mendarat',
    },
    {
      id: 'holafly-unli',
      name: 'Holafly Saudi Unlimited 5G',
      quota: 'Unlimited Data',
      duration: '10 Hari',
      price: 340000,
      type: 'eSIM Tanpa FUP',
      features: 'Internet tanpa batas • Kecepatan maksimal 5G',
    },
    {
      id: 'baitullah-10',
      name: 'Baitullah Connect Long Stay',
      quota: '10 GB',
      duration: '30 Hari',
      price: 260000,
      type: 'eSIM Jamaah Haji',
      features: 'Masa aktif panjang 30 hari • Kompatibel iPhone/Android',
    },
  ]

  const merchantsMakkah = [
    {
      id: 1,
      name: 'Al Baik Restaurant Ajyad',
      type: 'Kuliner Halal',
      location: '150m dari Masjidil Haram',
      terminal: 'Geidea POS #GD-9842',
    },
    {
      id: 2,
      name: 'Nahdi Pharmacy Clock Tower',
      type: 'Farmasi & Kesehatan',
      location: 'Abraj Al Bait Lt. 2 Zamzam',
      terminal: 'Geidea POS #GD-1024',
    },
    {
      id: 3,
      name: 'Bin Dawood Supermarket',
      type: 'Supermarket & Oleh-Oleh',
      location: 'Lantai Dasar Abraj Al Bait',
      terminal: 'Geidea POS #GD-5519',
    },
    {
      id: 4,
      name: 'Al Tazaj BBQ Chicken',
      type: 'Kuliner Cepat Saji',
      location: 'Misfalah (Dekat Hotel Jemaah)',
      terminal: 'Geidea POS #GD-3312',
    },
  ]

  const merchantsMadinah = [
    {
      id: 5,
      name: 'Jarir Bookstore Madinah',
      type: 'Kitab & Cinderamata',
      location: '300m dari Pintu Utama Masjid Nabawi',
      terminal: 'Geidea POS #GD-7731',
    },
    {
      id: 6,
      name: 'Nahdi Central Nabawi',
      type: 'Apotek & Kebutuhan Medis',
      location: 'Pusat Pertokoan Northern Central',
      terminal: 'Geidea POS #GD-2241',
    },
    {
      id: 7,
      name: 'Bin Dawood Madinah Station',
      type: 'Supermarket & Kurma',
      location: 'Dekat Stasiun Haramain Madinah',
      terminal: 'Geidea POS #GD-8812',
    },
    {
      id: 8,
      name: 'Taksi Resmi Bandara Madinah',
      type: 'Transportasi Jemaah',
      location: 'Prince Mohammad Bin Abdulaziz Airport',
      terminal: 'Geidea Smart POS #GD-4421',
    },
  ]

  const emergencyContacts = [
    {
      name: 'Posko Haji & Umrah Kemenag RI',
      role: 'Pelayanan Jemaah Indonesia di Saudi',
      number: '+966 54 892 0111',
      action: 'Hubungi',
    },
    {
      name: 'Konsulat Jenderal RI (KJRI) Jeddah',
      role: 'Perlindungan WNI & Paspor Hilang',
      number: '+966 12 671 1271',
      action: 'Hubungi',
    },
    {
      name: 'Bantuan Medis Darurat Saudi (Red Crescent)',
      role: 'Ambulans Cepat Tanggap 24 Jam',
      number: '997',
      action: 'Panggil 997',
    },
    {
      name: 'Polisi & Keamanan Wilayah Haramain',
      role: 'Keamanan Darurat Makkah & Madinah',
      number: '999',
      action: 'Panggil 999',
    },
  ]

  const handleClaimSubmit = () => {
    setShowClaimModal(false)
    setClaimSuccess(true)
  }

  const handlePackageBuy = () => {
    setShowBuyModal(false)
    setSuccessMessage(`Paket ${selectedPackage} berhasil diaktifkan. Siap digunakan setibanya di Arab Saudi.`)
    setIsSuccess(true)
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

      {/* 2. Top Header Bar (Clean Native Mobile Header) */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={18}
            height={18}
            priority
          />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight text-center">
          Pilgrim Bundle
        </h1>

        <Link
          href="/ala-haramain"
          className="text-[12.5px] font-extrabold text-[#1C20C4] hover:underline"
        >
          Haramain →
        </Link>
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {/* Authentic Membership Badge: Mitra HIMPUH & AMPHURI */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px 18px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block' }}>
                STATUS KEANGGOTAAN RESMI
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26', display: 'block', marginTop: '2px' }}>
                Jamaah Mitra HIMPUH &amp; AMPHURI
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Bundling Roaming &amp; Perlengkapan Aktif
              </span>
            </div>
          </div>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              backgroundColor: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0',
            }}
          >
            Gratis
          </span>
        </div>
        {/* BANNER 1: KLAIM BENEFIT GRATIS JEMAAH HIMPUH / AMPHURI */}
        <div
          onClick={() => setShowClaimModal(true)}
          className="cursor-pointer active:scale-98 transition-all"
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #047857 55%, #059669 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '145px',
            flexShrink: 0,
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '9.5px',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              MITRA HIMPUH & AMPHURI
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#A7F3D0' }}>
              Klaim Sekarang →
            </span>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '6px 0 2px 0' }}>
            Gratis eSIM & Roaming untuk Jemaah
          </h3>
          <p style={{ fontSize: '11.5px', color: '#D1FAE5', margin: 0, lineHeight: 1.35, maxWidth: '270px' }}>
            Berangkat lewat biro travel rekanan? Dapatkan paket internet gratis selama ibadah di Makkah & Madinah.
          </p>
        </div>

        {/* SECTION 2: LIVE KURS SAR & KALKULATOR BELANJA CEPAT */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            minHeight: '160px',
            flexShrink: 0,
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              KURS RIYAL SAUDI REAL-TIME
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '999px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: '#10B981' }} />
              Live Ticking
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 12px 0' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#1A1D26', letterSpacing: '-0.5px' }}>
              1 SAR = Rp{sarRate.toLocaleString('id-ID')}
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#064E3B', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '999px' }}>
              0% Markup Kurs
            </span>
          </div>

          {/* Quick Calculator */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              padding: '12px 16px',
              border: '1px solid #ECEEF2',
            }}
          >
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '4px' }}>
              Kalkulator Belanja di Toko Saudi:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#064E3B' }}>SAR</span>
                <input
                  type="number"
                  value={sarCalcInput}
                  onChange={(e) => setSarCalcInput(e.target.value)}
                  style={{ width: '80px', fontSize: '18px', fontWeight: 900, border: 'none', outline: 'none', background: 'transparent', color: '#1A1D26' }}
                />
              </div>

              <span style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8' }}>≈</span>

              <span style={{ fontSize: '18px', fontWeight: 900, color: '#1C20C4' }}>
                Rp{idrEquivalent.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: SQUIRCLE QUICK ACCESS MENU (Livin' Sukha Style) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 14px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingLeft: '6px', paddingRight: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#6C737E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              FASILITAS DI TANAH SUCI
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#064E3B' }}>
              Makkah & Madinah
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {/* 1. Roaming */}
            <button
              onClick={() => setActiveTab('roaming')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              className="active:opacity-60 transition-opacity"
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: activeTab === 'roaming' ? '#1C20C4' : '#EEF2FF',
                  color: activeTab === 'roaming' ? '#FFFFFF' : '#1C20C4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                </svg>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A1D26', textAlign: 'center' }}>
                Roaming
              </span>
            </button>

            {/* 2. eSIM */}
            <button
              onClick={() => setActiveTab('esim')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              className="active:opacity-60 transition-opacity"
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: activeTab === 'esim' ? '#064E3B' : '#ECFDF5',
                  color: activeTab === 'esim' ? '#FFFFFF' : '#064E3B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A1D26', textAlign: 'center' }}>
                eSIM Instan
              </span>
            </button>

            {/* 3. Peta Toko */}
            <button
              onClick={() => setActiveTab('merchant')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              className="active:opacity-60 transition-opacity"
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: activeTab === 'merchant' ? '#D97706' : '#FEF3C7',
                  color: activeTab === 'merchant' ? '#FFFFFF' : '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A1D26', textAlign: 'center' }}>
                Peta Toko
              </span>
            </button>

            {/* 4. Bantuan */}
            <button
              onClick={() => setActiveTab('darurat')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              className="active:opacity-60 transition-opacity"
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: activeTab === 'darurat' ? '#EF4444' : '#FEE2E2',
                  color: activeTab === 'darurat' ? '#FFFFFF' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A1D26', textAlign: 'center' }}>
                Bantuan
              </span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: PAKET ROAMING                                                  */}
        {/* ===================================================================== */}
        {activeTab === 'roaming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {roamingPackages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#1C20C4',
                      backgroundColor: '#EEF2FF',
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {pkg.operator}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#1C20C4' }}>
                    Rp{pkg.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#1A1D26', margin: '0 0 2px 0' }}>
                  {pkg.provider}
                </h4>
                <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '0 0 10px 0' }}>
                  Kuota {pkg.quota} • Masa Aktif {pkg.duration}
                </p>
                <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700, display: 'block', marginBottom: '14px' }}>
                  Jaringan Mitra: {pkg.partner}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F4F5F9' }}>
                  <span style={{ fontSize: '10.5px', color: '#6C737E' }}>
                    {pkg.features}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedPackage(pkg.provider)
                      setPackagePrice(pkg.price)
                      setShowBuyModal(true)
                    }}
                    style={{
                      height: '38px',
                      padding: '0 22px',
                      borderRadius: '999px',
                      backgroundColor: '#1C20C4',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(28, 32, 196, 0.25)',
                      flexShrink: 0,
                    }}
                    className="active:opacity-80 transition-opacity"
                  >
                    Beli Paket →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: ESIM BAITULLAH                                                 */}
        {/* ===================================================================== */}
        {activeTab === 'esim' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {esimPackages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#064E3B',
                      backgroundColor: '#D1FAE5',
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {pkg.type}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#064E3B' }}>
                    Rp{pkg.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#1A1D26', margin: '0 0 2px 0' }}>
                  {pkg.name}
                </h4>
                <p style={{ fontSize: '11.5px', color: '#6C737E', margin: '0 0 10px 0' }}>
                  Kuota {pkg.quota} • Masa Aktif {pkg.duration}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F4F5F9' }}>
                  <span style={{ fontSize: '10.5px', color: '#6C737E' }}>
                    {pkg.features}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedPackage(pkg.name)
                      setPackagePrice(pkg.price)
                      setShowBuyModal(true)
                    }}
                    style={{
                      height: '38px',
                      padding: '0 22px',
                      borderRadius: '999px',
                      backgroundColor: '#064E3B',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(6, 78, 59, 0.25)',
                      flexShrink: 0,
                    }}
                    className="active:opacity-80 transition-opacity"
                  >
                    Klaim eSIM →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: PETA TOKO GEIDEA                                               */}
        {/* ===================================================================== */}
        {activeTab === 'merchant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCityFilter('makkah')}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  backgroundColor: cityFilter === 'makkah' ? '#1C20C4' : '#FFFFFF',
                  color: cityFilter === 'makkah' ? '#FFFFFF' : '#6C737E',
                  cursor: 'pointer',
                  boxShadow: cityFilter === 'makkah' ? '0 2px 6px rgba(28, 32, 196, 0.2)' : 'none',
                }}
              >
                Makkah Al-Mukarramah
              </button>
              <button
                onClick={() => setCityFilter('madinah')}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  backgroundColor: cityFilter === 'madinah' ? '#1C20C4' : '#FFFFFF',
                  color: cityFilter === 'madinah' ? '#FFFFFF' : '#6C737E',
                  cursor: 'pointer',
                  boxShadow: cityFilter === 'madinah' ? '0 2px 6px rgba(28, 32, 196, 0.2)' : 'none',
                }}
              >
                Madinah Al-Munawwarah
              </button>
            </div>

            {(cityFilter === 'makkah' ? merchantsMakkah : merchantsMadinah).map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '18px 20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '999px' }}>
                    {m.type}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#064E3B' }}>
                    {m.terminal}
                  </span>
                </div>

                <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#1A1D26', margin: '0 0 2px 0' }}>
                  {m.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#6C737E', margin: '0 0 12px 0' }}>
                  {m.location}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #F4F5F9' }}>
                  <Link
                    href="/bayar-saudi"
                    style={{
                      height: '34px',
                      padding: '0 20px',
                      borderRadius: '999px',
                      backgroundColor: '#064E3B',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                    }}
                  >
                    Bayar di Kasir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: BANTUAN DARURAT                                                */}
        {/* ===================================================================== */}
        {activeTab === 'darurat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {emergencyContacts.map((c, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '18px 20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#1A1D26', margin: '0 0 2px 0' }}>
                    {c.name}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#6C737E', margin: '0 0 4px 0' }}>
                    {c.role}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444' }}>
                    {c.number}
                  </span>
                </div>

                <a
                  href={`tel:${c.number.replace(/\s+/g, '')}`}
                  style={{
                    height: '36px',
                    padding: '0 18px',
                    borderRadius: '999px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                  }}
                >
                  {c.action}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Co-branding Footer */}
        <div className="pt-6 pb-4 text-center">
          <p className="text-[10.5px] text-gray-400 font-extrabold tracking-wider uppercase">
            Powered by Bank Aladin Syariah
          </p>
        </div>
      </div>

      {/* MODAL 1: KLAIM HIMPUH / AMPHURI */}
      {showClaimModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              padding: '24px',
              paddingBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#064E3B', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  KEMITRAAN RESMI
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26', margin: 0 }}>
                  Klaim Benefit Jemaah Umroh
                </h3>
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                style={{ width: '32px', height: '32px', borderRadius: '999px', backgroundColor: '#F4F5F9', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#6C737E', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Masukkan nomor paspor dan pilih biro travel umroh tempat Anda terdaftar.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '4px' }}>
                Nama Biro Travel:
              </label>
              <select
                value={travelName}
                onChange={(e) => setTravelName(e.target.value)}
                style={{ width: '100%', height: '42px', borderRadius: '14px', border: '1px solid #ECEEF2', padding: '0 12px', fontSize: '13px', fontWeight: 700, backgroundColor: '#F8FAFC' }}
              >
                <option value="Maktour Travel">Maktour Travel (HIMPUH)</option>
                <option value="Arminareka Perdana">Arminareka Perdana (AMPHURI)</option>
                <option value="Khalifa Tour">Khalifa Tour Syariah</option>
                <option value="Patuna Tour & Travel">Patuna Umroh & Haji</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#6C737E', display: 'block', marginBottom: '4px' }}>
                Nomor Paspor Jemaah:
              </label>
              <input
                type="text"
                placeholder="Contoh: C8192841"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                style={{ width: '100%', height: '42px', borderRadius: '14px', border: '1px solid #ECEEF2', padding: '0 12px', fontSize: '14px', fontWeight: 800, backgroundColor: '#F8FAFC' }}
              />
            </div>

            <button
              onClick={handleClaimSubmit}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(6, 78, 59, 0.25)',
              }}
            >
              Verifikasi & Dapatkan Kuota Gratis
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: BUY PACKAGE CONFIRMATION */}
      {showBuyModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              padding: '24px',
              paddingBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#1C20C4', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  PEMBELIAN PAKET DATA
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1A1D26', margin: 0 }}>
                  {selectedPackage}
                </h3>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                style={{ width: '32px', height: '32px', borderRadius: '999px', backgroundColor: '#F4F5F9', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #ECEEF2', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6C737E', marginBottom: '4px' }}>
                <span>Sumber Dana:</span>
                <span style={{ fontWeight: 800, color: '#1A1D26' }}>Ala Dompet IDR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '6px', borderTop: '1px solid #ECEEF2' }}>
                <span style={{ fontWeight: 700, color: '#1A1D26' }}>Total Harga:</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#1C20C4' }}>
                  Rp{packagePrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePackageBuy}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                backgroundColor: '#1C20C4',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
              }}
            >
              Konfirmasi & Bayar
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: GLOBAL SUCCESS FEEDBACK */}
      {(isSuccess || claimSuccess) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#1A1D26', margin: '0 0 6px 0' }}>
              {claimSuccess ? 'Klaim Berhasil Diverifikasi!' : 'Aktivasi Berhasil!'}
            </h4>
            <p style={{ fontSize: '12px', color: '#6C737E', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              {claimSuccess
                ? `Paspor terverifikasi di ${travelName}. Paket 10 GB eSIM aktif dan siap digunakan di Arab Saudi.`
                : successMessage}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false)
                setClaimSuccess(false)
              }}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '999px',
                backgroundColor: '#064E3B',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
