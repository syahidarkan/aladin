'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import CarpetModel, { CarpetPose } from './CarpetModel'
import { HelpCircle, Headphones, Video, MessageCircle, Send, X } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'cs' | 'user'
  text: string
  time: string
}

/**
 * Floating CS Companion Mascot ("Alan" - Floating Buddy)
 * Replaces the static CS button above the bottom bar with an animated 3D companion.
 * Follows User Specification:
 * - Position & Pose: Restored to previous horizontal floating idle S-curve, with followCursor.
 * - Periodic Waving: Occasionally lifts front-right corner and waves greeting "Halo!".
 * - Tap: 360° spin animation, opens Relationship Desk & Chat Concierge.
 */
export default function CarpetFloatingBuddy() {
  const pathname = usePathname()
  const { isBuddyVisible, triggerReaction } = useMascot()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'video'>('chat')
  const [buddyPose, setBuddyPose] = useState<CarpetPose>('idle')
  const [isSpinning, setIsSpinning] = useState(false)
  const [isBouncing, setIsBouncing] = useState(false)

  // Chat State
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'cs',
      text: 'Assalamu’alaikum! Saya Nadia dari Aladin Care & Relationship Desk. Ada yang bisa kami bantu seputar transaksi, tabungan Ala Impian, atau layanan syariah hari ini?',
      time: 'Baru saja',
    },
  ])

  const quickQuestions = [
    'Kendala Transfer & Sumber Dana',
    'Tanya Tabungan Umrah & Haji',
    'Kartu Debit Visa Virtual',
    'Bebas Biaya Admin Alfamart',
  ]

  // Periodic waving greeting animation in idle state
  useEffect(() => {
    if (isOpen) return

    let waveTimer: NodeJS.Timeout
    let resetTimer: NodeJS.Timeout

    const scheduleWave = () => {
      waveTimer = setTimeout(() => {
        setBuddyPose('waving')
        resetTimer = setTimeout(() => {
          setBuddyPose('idle')
          scheduleWave()
        }, 2400)
      }, 7000 + Math.random() * 4000)
    }

    scheduleWave()

    return () => {
      clearTimeout(waveTimer)
      clearTimeout(resetTimer)
    }
  }, [isOpen])

  // Hide on splash or video call screen
  if (!isBuddyVisible || pathname === '/' || pathname === '/bantu/video-call') {
    return null
  }

  const handleBuddyClick = () => {
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 500)
    setIsOpen(!isOpen)
  }

  const handleHover = () => {
    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 450)
  }

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputMsg('')

    setIsTyping(true)
    setTimeout(() => {
      let reply = 'Terima kasih atas pesan Anda. Petugas Relationship Desk Bank Aladin Syariah siap melayani Anda.'
      const lower = text.toLowerCase()

      if (lower.includes('transfer') || lower.includes('sumber dana') || lower.includes('pocket')) {
        reply = 'Di menu Transfer, Anda dapat memilih Sumber Dana langsung dari Rekening Utama (Ala Dompet) maupun dari sub-wallet (Ala Pocket) tanpa biaya admin via BI-FAST.'
      } else if (lower.includes('umrah') || lower.includes('haji') || lower.includes('baitullah')) {
        reply = 'Tabungan Ala Impian Umrah & Haji terintegrasi dengan HIMPUH, AMPHURI, dan SISKOHAT Kemenag. Setoran awal haji Rp25.012.000 untuk porsi resmi.'
      } else if (lower.includes('kartu') || lower.includes('visa') || lower.includes('cvv')) {
        reply = 'Kartu Debit Aladin Syariah contactless dilengkapi proteksi PIN 6 digit dan CVV dinamis. Anda dapat melihat detail di menu Kartu.'
      } else if (lower.includes('alfa') || lower.includes('biaya') || lower.includes('admin')) {
        reply = 'Sebagai nasabah Bank Aladin Syariah, Anda menikmati 50x transfer BI-FAST gratis dan bebas biaya setor/tarik tunai di ribuan gerai Alfamart seluruh Indonesia.'
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'cs',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setIsTyping(false)
    }, 900)
  }

  return (
    <>
      {/* 1. FLOATING 3D MASCOT BUTTON (Replaces CS Button at Bottom-Right, Above BottomNav) */}
      <div
        className="absolute bottom-[78px] right-6 z-50 flex flex-col items-end select-none"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Floating Speech Bubble Hint */}
        {!isOpen && (
          <div
            onClick={handleBuddyClick}
            className="mb-1 mr-2 bg-white/95 text-[#1037A6] text-[10.5px] font-extrabold px-3 py-1 rounded-full shadow-md border border-[#00F0A0] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            style={{
              boxShadow: '0 4px 14px rgba(0, 240, 160, 0.3)',
            }}
          >
            <span>Butuh bantuan?</span>
            <HelpCircle className="w-3.5 h-3.5 text-[#1037A6]" />
          </div>
        )}

        {/* Mascot Character Body Button */}
        <button
          type="button"
          onClick={handleBuddyClick}
          onMouseEnter={handleHover}
          aria-label="Staff Aladin & Concierge"
          className={`relative group cursor-pointer transition-all duration-300 ${
            isSpinning ? 'animate-mascot-spin' : isBouncing ? '-translate-y-2' : ''
          }`}
          style={{
            width: '84px',
            height: '76px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: 0,
          }}
        >
          {/* Subtle Ambient Glow behind Mascot */}
          <div
            className="absolute inset-0 rounded-full blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(circle, rgba(0, 240, 160, 0.45) 0%, rgba(16, 55, 166, 0.1) 70%, transparent 100%)',
            }}
          />

          {/* Sparkles / Magic Aura */}
          <span className="absolute -top-1 left-2 text-[#00F0A0] text-xs animate-pulse pointer-events-none">✦</span>
          <span className="absolute top-1 right-1 text-[#00F0A0] text-[10px] animate-ping pointer-events-none">●</span>

          {/* 3D WebGL Rigged Mascot Floating with Overflow Unconstrained */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-105"
            style={{
              width: '180px',
              height: '150px',
              filter: 'drop-shadow(0 6px 14px rgba(0, 240, 160, 0.35)) drop-shadow(0 2px 4px rgba(16, 55, 166, 0.25))',
            }}
          >
            <Canvas
              camera={{ position: [0, 0.05, 5.2], fov: 32 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={2.2} />
              <directionalLight position={[2, 4, 3]} intensity={2.6} />
              <pointLight position={[0, 0.3, 2.8]} intensity={3.0} color="#FFFFFF" />
              <pointLight position={[-1.2, -0.2, 2.2]} intensity={2.0} color="#00F0A0" />
              <pointLight position={[1.2, -0.2, 2.2]} intensity={1.5} color="#60A5FA" />
              <CarpetModel
                pose={buddyPose}
                interactive={true}
                followCursor={true}
                scale={0.62}
              />
            </Canvas>
          </div>

          {/* Online Active Status Dot */}
          <span className="absolute top-0 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0A0] opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0A0] border-2 border-white shadow-xs" />
          </span>
        </button>
      </div>

      {/* 2. SLIDE-UP RELATIONSHIP DESK & CONCIERGE MODAL */}
      {isOpen && (
        <div
          className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => {
            setIsOpen(false)
            setBuddyPose('idle')
          }}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden max-h-[84vh]"
            style={{ paddingBottom: '24px', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

            {/* Officer Header Info */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full bg-[#1037A6] flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm border border-white">
                  <Headphones className="w-5 h-5 text-[#00F0A0]" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00F0A0] border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14.5px] font-extrabold text-[#1A1D26]">
                      Aladin Care &amp; Relationship Desk
                    </h3>
                    <span className="text-[9.5px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
                      Siaga 24/7
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Layanan Resmi Bank Aladin Syariah
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setBuddyPose('idle')
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs between Chat and Video Support */}
            <div className="flex border-b border-gray-100 px-5 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`py-2.5 px-3 text-[13px] font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'border-[#1037A6] text-[#1037A6]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat Online
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`py-2.5 px-3 text-[13px] font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'border-[#1037A6] text-[#1037A6]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Video className="w-4 h-4" />
                Video Call
                <span className="text-[9.5px] bg-[#00F0A0]/20 text-[#059669] px-1.5 py-0.5 rounded-full font-bold">
                  Buku Tabungan
                </span>
              </button>
            </div>

            {/* Content Tab 1: Live Chat Concierge */}
            {activeTab === 'chat' && (
              <div className="flex flex-col flex-1 min-h-[300px]">
                {/* Chat Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-xs ${
                          m.sender === 'user'
                            ? 'bg-[#1037A6] text-white rounded-br-xs'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9.5px] text-gray-400 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1037A6] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1037A6] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>

                {/* Quick Questions Pills */}
                <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-gray-100 bg-gray-50/50">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="shrink-0 text-[11px] font-semibold text-[#1037A6] bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200/60 active:scale-95 transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Bottom Message Input */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend()
                    }}
                    placeholder="Ketik pertanyaan untuk Aladin Care..."
                    className="flex-1 text-[13px] bg-gray-100 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1037A6]/30 text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputMsg.trim()}
                    className="w-10 h-10 rounded-full bg-[#1037A6] text-white flex items-center justify-center hover:bg-[#0c2e91] active:scale-95 transition-transform disabled:opacity-40 cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Tab 2: Video Call & Direct Escalations */}
            {activeTab === 'video' && (
              <div className="p-5 space-y-4">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1037A6] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-extrabold text-[#1037A6]">
                      Tatap Muka Digital Relationship Desk
                    </h4>
                    <p className="text-[11.5px] text-[#475569] mt-0.5 leading-relaxed">
                      Hubungkan kamera dan mikrofon smartphone untuk verifikasi identitas, aktivasi buku tabungan impian, atau konsultasi finansial syariah.
                    </p>
                  </div>
                </div>

                <Link
                  href="/bantu/video-call"
                  onClick={() => {
                    setIsOpen(false)
                    triggerReaction('success', 'Menghubungkan ke Video Call Relationship Desk...')
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1037A6] hover:bg-[#0D2D8A] text-white font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                >
                  <Video className="w-4 h-4 text-white" />
                  Mulai Video Call Sekarang
                </Link>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert('Membuka WhatsApp resmi Bank Aladin Syariah (+62 811 1500 123)...')
                      setIsOpen(false)
                    }}
                    className="w-full py-3.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-[13px] font-extrabold text-[#065F46] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#10B981]" />
                    <span>Chat WhatsApp Resmi Aladin (+62 811 1500 123)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
