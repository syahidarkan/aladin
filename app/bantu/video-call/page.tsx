'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'

export default function VideoCallDeskPage() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video')
  const [hasCameraStream, setHasCameraStream] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [chatLog, setChatLog] = useState([
    { sender: 'agent', text: 'Assalamu’alaikum Bapak/Ibu nasabah Aladin, saya Nadia dari Sharia Relationship Desk. Ada yang bisa kami bantu seputar transaksi syariah Anda?' },
  ])
  const [inputText, setInputText] = useState('')

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Device Camera Request with User Gesture Trigger Support
  const requestCameraAccess = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        })
        streamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          localVideoRef.current.play().catch(() => {})
        }
        setHasCameraStream(true)
        setIsCameraOff(false)
      }
    } catch (err) {
      console.warn('Camera permission request denied or hardware unavailable:', err)
      setHasCameraStream(false)
    }
  }

  useEffect(() => {
    let active = true

    async function initCamera() {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          })
          if (!active) {
            stream.getTracks().forEach((t) => t.stop())
            return
          }
          streamRef.current = stream
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
            localVideoRef.current.play().catch(() => {})
          }
          setHasCameraStream(true)
        }
      } catch {
        // Fallback gracefully if camera permission denied or unavailable
        setHasCameraStream(false)
      }
    }

    initCamera()

    return () => {
      active = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // Toggle Camera
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOff
      })
    }
  }, [isCameraOff])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleSendChat = () => {
    if (!inputText.trim()) return
    setChatLog((prev) => [...prev, { sender: 'user', text: inputText }])
    setInputText('')
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        { sender: 'agent', text: 'Baik, laporan Anda telah kami catat dengan aman di core banking Aladin Syariah.' },
      ])
    }, 1000)
  }

  return (
    <div
      className="relative w-full h-full bg-[#0A1128] select-none text-white overflow-hidden flex flex-col justify-between"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Safe Area Spacer */}
      <StatusBar dark={true} />

      {/* 2. Top Header Bar (Call Info & End Call trigger) */}
      <div className="relative z-20 px-5 py-3 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/bantu"
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <span className="text-[10px] font-extrabold text-[#00F3AD] uppercase tracking-wider block">
              Digital Relationship Desk
            </span>
            <h2 className="text-[14px] font-bold text-white">Nadia Azzahra (Sharia Officer)</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] font-mono font-bold">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* 3. Main Stage: Video View or In-Call Chat */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-3">
        {activeTab === 'video' ? (
          <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#081D48] border border-white/15 shadow-2xl flex flex-col justify-between">
            {/* Customer Service Photo Stream */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/cs_officer.jpg"
                alt="Nadia Azzahra — Sharia Officer"
                fill
                className="object-cover object-center filter brightness-[0.92]"
                priority
              />
              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Officer Label & Status Badges */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F3AD] animate-pulse" />
                <span className="text-[11px] font-extrabold text-white">Nadia Azzahra, S.E.</span>
              </div>

              {/* Audio Waveform Indicator */}
              <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
                <span className="text-[9.5px] font-bold text-[#00F3AD] uppercase">Berbicara</span>
                <div className="flex items-end gap-0.5 h-3">
                  <div className="w-0.5 h-2 bg-[#00F3AD] animate-pulse" />
                  <div className="w-0.5 h-3 bg-[#00F3AD] animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-0.5 h-1.5 bg-[#00F3AD] animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>

            {/* Bottom Security Assurance Tag */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <span className="text-[10px] text-white/80 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                Terkoneksi Aman • Enkripsi End-to-End
              </span>
            </div>

            {/* Picture-in-Picture: Real Local Device Camera Stream */}
            <div className="absolute bottom-4 right-4 w-32 h-44 rounded-[22px] bg-black/80 border-2 border-white/30 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center shadow-2xl z-20">
              {isCameraOff ? (
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/60 mb-1">
                    ✕
                  </div>
                  <span className="text-[9px] text-white/60 font-bold">Kamera Nonaktif</span>
                </div>
              ) : hasCameraStream ? (
                <>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full bg-gradient-to-b from-slate-900 to-[#081D48] relative">
                  {/* Subtle viewfinder corner reticle */}
                  <div className="absolute inset-1.5 border border-white/20 rounded-[16px] pointer-events-none" />
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-white text-[14px] font-bold mb-1.5 animate-pulse">
                    👤
                  </div>
                  <span className="text-[9px] text-white/90 font-bold mb-2">
                    Kamera Anda
                  </span>
                  <button
                    onClick={requestCameraAccess}
                    className="px-2 py-1 bg-[#1C20C4] hover:bg-[#151AA8] text-white text-[8.5px] font-extrabold rounded-full active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    📷 Buka Kamera
                  </button>
                </div>
              )}

              {/* PiP Micro Badge */}
              <div className="absolute bottom-1.5 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-white/90">
                Anda
              </div>
            </div>
          </div>
        ) : (
          /* In-Call Text Chat Tab */
          <div className="w-full h-full rounded-[28px] bg-slate-900 border border-white/10 p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 mb-3">
              {chatLog.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-[16px] text-[12.5px] max-w-[85%] leading-relaxed ${
                    c.sender === 'user'
                      ? 'ml-auto bg-[#1C20C4] text-white rounded-tr-xs'
                      : 'bg-white/10 text-white/95 rounded-tl-xs'
                  }`}
                >
                  {c.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ketik catatan obrolan..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 px-4 py-2 bg-white/10 rounded-full text-[13px] text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#00F3AD]"
              />
              <button
                onClick={handleSendChat}
                className="px-4 py-2 bg-[#1C20C4] rounded-full text-[12.5px] font-bold text-white cursor-pointer"
              >
                Kirim
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Controls Bar */}
      <div className="px-6 pb-20 pt-3 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-around shrink-0 z-20">
        {/* Toggle Mute Mic */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            isMuted ? 'bg-red-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
          }`}
          aria-label="Toggle Microphone"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Toggle Video Camera */}
        <button
          onClick={() => {
            if (isCameraOff) {
              setIsCameraOff(false)
              if (!hasCameraStream) {
                requestCameraAccess()
              }
            } else {
              setIsCameraOff(true)
            }
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            isCameraOff ? 'bg-red-500 text-white' : 'bg-white/15 text-white hover:bg-white/25'
          }`}
          aria-label="Toggle Camera"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Toggle Video / Chat Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'video' ? 'chat' : 'video')}
          className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center cursor-pointer hover:bg-white/25 transition-colors"
          aria-label="Toggle Chat"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* End Call Button */}
        <button
          onClick={() => router.push('/bantu')}
          className="w-14 h-14 rounded-full bg-[#B62821] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          aria-label="End Call"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
