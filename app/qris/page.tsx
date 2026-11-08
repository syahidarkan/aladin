'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { executeQrisPayment } from '@/lib/bankState'

export default function QrisScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [flashOn, setFlashOn] = useState(false)
  const [showMyQr, setShowMyQr] = useState(false)
  const [scanMessage, setScanMessage] = useState<string | null>(null)

  // Payment Bottom Sheet Simulation State
  const [scannedMerchant, setScannedMerchant] = useState<{
    name: string
    nmid: string
    location: string
    amount?: number
  } | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('45.000')
  const [showPin, setShowPin] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Initialize Real Camera Stream
  useEffect(() => {
    let active = true

    async function initCamera() {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) {
          throw new Error('WebRTC Camera API tidak didukung di browser ini.')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setCameraActive(true)
        setCameraError(null)
      } catch (err: any) {
        console.warn('Camera access:', err?.message || err)
        if (active) {
          setCameraActive(false)
          setCameraError(
            err?.name === 'NotAllowedError'
              ? 'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser.'
              : 'Kamera tidak terdeteksi atau sedang digunakan aplikasi lain.'
          )
        }
      }
    }

    initCamera()

    return () => {
      active = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Toggle Flashlight / Torch
  const toggleFlash = async () => {
    const nextState = !flashOn
    setFlashOn(nextState)

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      if (track) {
        try {
          const capabilities = (track.getCapabilities?.() as any) || {}
          if (capabilities.torch) {
            await (track as any).applyConstraints({
              advanced: [{ torch: nextState }],
            })
          }
        } catch (e) {
          // Torch not hardware supported, software simulation used
        }
      }
    }
  }

  // Gallery Picker
  const handleSimulateGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScanMessage('Memindai QRIS dari foto...')
      setTimeout(() => {
        setScanMessage(null)
        setScannedMerchant({
          name: 'Kopi Kenangan - Grand Indonesia',
          nmid: 'ID1020039201948',
          location: 'Jakarta Pusat',
          amount: 38000,
        })
        setPaymentAmount('38.000')
      }, 1000)
    }
  }

  // Trigger Mock Scan on Viewfinder Tap
  const handleTapToScan = () => {
    setScanMessage('Memindai barcode QRIS...')
    setTimeout(() => {
      setScanMessage(null)
      setScannedMerchant({
        name: 'SPBU Shell Lenteng Agung',
        nmid: 'ID1029481029381',
        location: 'Jakarta Selatan',
        amount: 100000,
      })
      setPaymentAmount('100.000')
    }, 800)
  }

  const handleConfirmPay = () => {
    setShowPin(true)
  }

  const handlePinSuccess = () => {
    const rawNum = parseInt(paymentAmount.replace(/\D/g, '') || '0', 10)
    if (scannedMerchant && rawNum > 0) {
      const res = executeQrisPayment({
        merchantName: scannedMerchant.name,
        nmid: scannedMerchant.nmid,
        amount: rawNum,
      })
      if (!res.success) {
        alert(res.error || 'Saldo tidak mencukupi')
        return
      }
    }
    setShowPin(false)
    setIsSuccess(true)
  }

  return (
    <div
      className="relative w-full h-full bg-[#111317] overflow-hidden select-none text-white flex flex-col justify-between"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. iOS Status Bar & Top Navigation Bar */}
      <div className="relative z-30 w-full shrink-0">
        <StatusBar time="22.25" batteryLevel={33} dark={true} />
        <div
          className="flex items-center justify-between"
          style={{ height: '48px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <Link
            href="/beranda"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label="Kembali ke Beranda"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>

          <div className="text-center">
            <h1 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md">
              Pindai QRIS
            </h1>
            <span className="text-[10px] font-semibold text-[#00F3AD] tracking-wider uppercase block">
              {cameraActive ? 'Kamera Aktif' : 'Simulasi Kamera'}
            </span>
          </div>

          {/* Info Icon */}
          <button
            onClick={() => alert('Arahkan kamera ke QRIS statis atau dinamis berlogo QRIS resmi BI & ASPI.')}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Live Camera Viewport / Simulated Scanning Backdrop */}
      <div className="absolute inset-0 z-10 overflow-hidden bg-[#0A0D14]">
        {/* Real Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback Viewport simulation when camera is pending or unavailable */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {/* Ambient animated gradient */}
            <div className="absolute inset-0 bg-radial from-slate-900/60 via-[#071739] to-black opacity-90" />
            <div className="relative z-10 max-w-[280px]">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00F3AD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="text-[12.5px] font-medium text-slate-300 mb-2">
                {cameraError || 'Menghubungkan ke sensor kamera...'}
              </p>
              <button
                onClick={handleTapToScan}
                className="mt-2 px-4 py-2 bg-[#1C20C4] text-white text-[12px] font-bold rounded-full shadow-lg active:scale-95 transition-transform"
              >
                Tap untuk Simulasi Scan QR
              </button>
            </div>
          </div>
        )}

        {/* Flashlight Lighting Overlay Effect */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xs pointer-events-none transition-opacity duration-150 z-20" />
        )}

        {/* Central QR Viewfinder Brackets */}
        <div
          onClick={handleTapToScan}
          className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] z-20 cursor-pointer pointer-events-auto"
        >
          {/* Top-Left Bracket */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3.5px] border-l-[3.5px] border-[#00F3AD] rounded-tl-xl" />
          {/* Top-Right Bracket */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3.5px] border-r-[3.5px] border-[#00F3AD] rounded-tr-xl" />
          {/* Bottom-Left Bracket */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3.5px] border-l-[3.5px] border-[#00F3AD] rounded-bl-xl" />
          {/* Bottom-Right Bracket */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3.5px] border-r-[3.5px] border-[#00F3AD] rounded-br-xl" />

          {/* Animated Laser Scanning Line */}
          <div
            className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#00F3AD] to-transparent shadow-[0_0_12px_#00F3AD] animate-pulse"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />

          <span className="absolute -bottom-8 left-0 right-0 text-center text-[11px] font-medium text-white/80 drop-shadow-md">
            Posisikan kode QR di dalam kotak
          </span>
        </div>
      </div>

      {/* 4. Scanner Controls Toolbar (Flashlight, Gallery, Terima Uang) */}
      <div className="relative z-30 pb-10" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        {/* Floating Quick Action Row */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Torch / Flashlight Button */}
          <button
            onClick={toggleFlash}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
              flashOn
                ? 'bg-amber-400 text-slate-900 shadow-[0_0_16px_rgba(251,191,36,0.5)]'
                : 'bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70'
            }`}
            aria-label="Toggle Flashlight"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={flashOn ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </button>

          {/* Gallery Button */}
          <button
            onClick={handleSimulateGallery}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer"
            aria-label="Upload dari Galeri"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
        </div>

        {/* Tampilkan QR Terima Uang Pill Button */}
        <button
          onClick={() => setShowMyQr(true)}
          className="w-full h-[50px] bg-white text-[#1C20C4] rounded-full font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-transform cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Tampilkan QR untuk Terima Uang
        </button>
      </div>

      {/* Notification Toast Message */}
      {scanMessage && (
        <div className="absolute top-[120px] left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-5 py-2.5 rounded-full text-[12.5px] font-bold backdrop-blur-md shadow-2xl border border-white/10">
          {scanMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAYMENT CONFIRMATION BOTTOM SHEET (SCANNED QRIS)                          */}
      {/* ========================================================================= */}
      {scannedMerchant && !isSuccess && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="w-full bg-white text-[#1A1D26] rounded-t-[32px] p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  QRIS TERVERIFIKASI
                </span>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26] mt-1">
                  {scannedMerchant.name}
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  NMID: {scannedMerchant.nmid} • {scannedMerchant.location}
                </p>
              </div>
              <button
                onClick={() => setScannedMerchant(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold"
              >
                ×
              </button>
            </div>

            {/* Nominal Input / Confirmation */}
            <div className="bg-[#F8FAFC] border border-[#ECEEF2] rounded-2xl p-4 mb-4">
              <span className="text-[11px] font-bold text-[#64748B] block mb-1">
                Nominal Pembayaran (IDR)
              </span>
              <div className="flex items-center text-[24px] font-extrabold text-[#1C20C4]">
                <span>Rp</span>
                <input
                  type="text"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-extrabold ml-1.5 text-[#1C20C4]"
                />
              </div>
              <span className="text-[10.5px] text-[#059669] font-bold block mt-1">
                Biaya Transaksi Rp0 (Gratis) • Sumber: Ala Dompet
              </span>
            </div>

            <button
              onClick={handleConfirmPay}
              className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all"
            >
              Lanjutkan Pembayaran →
            </button>
          </div>
        </div>
      )}

      {/* PIN CONFIRMATION MODAL */}
      {showPin && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="w-full bg-white text-[#1A1D26] rounded-t-[32px] p-6 pb-9 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                Masukkan PIN Aladin
              </h3>
              <button
                onClick={() => setShowPin(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold"
              >
                ×
              </button>
            </div>
            <p className="text-[12px] text-[#64748B] mb-6">
              Konfirmasi pembayaran QRIS ke <strong>{scannedMerchant?.name}</strong> sebesar <strong>Rp{paymentAmount}</strong>.
            </p>

            {/* 6 Dots PIN with ample margin to NEVER touch button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px',
                marginBottom: '32px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((dot) => (
                <div key={dot} className="w-4 h-4 rounded-full bg-[#1C20C4]" />
              ))}
            </div>

            <button
              onClick={handlePinSuccess}
              className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all"
            >
              Konfirmasi &amp; Bayar
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT SUCCESS RECEIPT */}
      {isSuccess && (
        <div className="absolute inset-0 z-[120] bg-white text-[#1A1D26] flex flex-col justify-between p-6">
          <div className="pt-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-[20px] font-extrabold text-[#1A1D26]">
              Pembayaran QRIS Berhasil!
            </h2>
            <p className="text-[12px] text-[#64748B] mt-1 mb-6">
              Transaksi telah diteruskan ke {scannedMerchant?.name}.
            </p>

            <div className="bg-[#F8FAFC] border border-[#ECEEF2] rounded-2xl p-4 text-left space-y-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Merchant:</span>
                <span className="font-bold text-[#1A1D26]">{scannedMerchant?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">NMID:</span>
                <span className="font-mono font-bold text-[#1A1D26]">{scannedMerchant?.nmid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Sumber Dana:</span>
                <span className="font-bold text-[#1A1D26]">Ala Dompet</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#ECEEF2]">
                <span className="font-bold text-[#1A1D26]">Total Bayar:</span>
                <span className="font-extrabold text-[#1C20C4] text-[16px]">Rp{paymentAmount}</span>
              </div>
            </div>
          </div>

          <Link
            href="/beranda"
            className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      )}

      {/* Interactive Bottom Sheet: Tampilkan QR Saya (Terima Uang) */}
      {showMyQr && (
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-xs z-[100] flex items-end justify-center"
          onClick={() => setShowMyQr(false)}
        >
          <div
            className="w-full bg-white text-[#1A1D26] rounded-t-[32px] shadow-2xl relative animate-in slide-in-from-bottom duration-250 text-center max-h-[85vh] overflow-y-auto no-scrollbar"
            style={{ paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '48px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                QRIS Terima Uang
              </h3>
              <button
                onClick={() => setShowMyQr(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer active:scale-95 transition-transform"
              >
                ×
              </button>
            </div>

            <p className="text-[11.5px] text-gray-500 mb-3">
              Pindai QR ini dari aplikasi perbankan atau e-wallet apa pun
            </p>

            {/* QR Code Container with crisp native SVG QR matrix */}
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-3.5 inline-block mx-auto mb-3 shadow-xs">
              <div className="w-[145px] h-[145px] relative bg-white p-2.5 rounded-xl border border-gray-100 mx-auto flex items-center justify-center shadow-xs">
                {/* SVG QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full" shapeRendering="crispEdges">
                  {/* Outer corner 1 (top-left) */}
                  <rect x="5" y="5" width="26" height="26" fill="#1A1D26" rx="3" />
                  <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#1C20C4" rx="1.5" />

                  {/* Outer corner 2 (top-right) */}
                  <rect x="69" y="5" width="26" height="26" fill="#1A1D26" rx="3" />
                  <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#1C20C4" rx="1.5" />

                  {/* Outer corner 3 (bottom-left) */}
                  <rect x="5" y="69" width="26" height="26" fill="#1A1D26" rx="3" />
                  <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#1C20C4" rx="1.5" />

                  {/* Data modules */}
                  <rect x="36" y="8" width="5" height="5" fill="#1A1D26" />
                  <rect x="46" y="8" width="5" height="5" fill="#1A1D26" />
                  <rect x="56" y="8" width="5" height="5" fill="#1A1D26" />
                  <rect x="36" y="18" width="5" height="5" fill="#1A1D26" />
                  <rect x="51" y="18" width="5" height="5" fill="#1A1D26" />
                  <rect x="61" y="18" width="5" height="5" fill="#1A1D26" />

                  <rect x="8" y="36" width="5" height="5" fill="#1A1D26" />
                  <rect x="18" y="36" width="5" height="5" fill="#1A1D26" />
                  <rect x="28" y="36" width="5" height="5" fill="#1A1D26" />
                  <rect x="8" y="46" width="5" height="5" fill="#1A1D26" />
                  <rect x="23" y="46" width="5" height="5" fill="#1A1D26" />
                  <rect x="28" y="56" width="5" height="5" fill="#1A1D26" />

                  <rect x="69" y="36" width="5" height="5" fill="#1A1D26" />
                  <rect x="79" y="36" width="5" height="5" fill="#1A1D26" />
                  <rect x="89" y="36" width="5" height="5" fill="#1A1D26" />
                  <rect x="74" y="46" width="5" height="5" fill="#1A1D26" />
                  <rect x="84" y="46" width="5" height="5" fill="#1A1D26" />
                  <rect x="69" y="56" width="5" height="5" fill="#1A1D26" />

                  <rect x="36" y="69" width="5" height="5" fill="#1A1D26" />
                  <rect x="46" y="69" width="5" height="5" fill="#1A1D26" />
                  <rect x="56" y="69" width="5" height="5" fill="#1A1D26" />
                  <rect x="36" y="79" width="5" height="5" fill="#1A1D26" />
                  <rect x="51" y="79" width="5" height="5" fill="#1A1D26" />
                  <rect x="61" y="79" width="5" height="5" fill="#1A1D26" />
                  <rect x="41" y="89" width="5" height="5" fill="#1A1D26" />
                  <rect x="56" y="89" width="5" height="5" fill="#1A1D26" />
                  <rect x="84" y="84" width="5" height="5" fill="#1A1D26" />

                  {/* Center Aladin Emblem */}
                  <rect x="38" y="38" width="24" height="24" fill="#FFFFFF" rx="4" />
                  <rect x="40" y="40" width="20" height="20" fill="#081D48" rx="3" />
                  <text x="50" y="54" textAnchor="middle" fill="#00F3AD" fontSize="13" fontWeight="900" fontFamily="sans-serif">A</text>
                </svg>
              </div>

              <div className="mt-3.5">
                <span className="font-extrabold text-[15px] text-[#1A1D26] block">
                  Syahid Arkan Fashihurrohman
                </span>
                <span className="text-[11.5px] text-gray-500 font-medium block mt-0.5">
                  NMID: ID1020039201948 • Bank Aladin Syariah
                </span>
              </div>
            </div>

            {/* Action Buttons: Simpan & Bagikan with generous bottom spacing */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                onClick={() => alert('QRIS berhasil disimpan ke galeri foto!')}
                className="h-[46px] rounded-full bg-gray-100 text-[#1A1D26] font-extrabold text-[13.5px] hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
              >
                Simpan Gambar
              </button>
              <button
                onClick={() => alert('Link QRIS berhasil disalin!')}
                className="h-[46px] rounded-full bg-[#1C20C4] text-white font-extrabold text-[13.5px] shadow-md hover:bg-blue-800 active:scale-95 transition-all cursor-pointer"
              >
                Bagikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
