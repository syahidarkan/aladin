'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import CarpetModel from './CarpetModel'
import { Sparkles, Video, MessageCircle, Send, X } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'cs' | 'user'
  text: string
  time: string
}

/**
 * Floating CS Companion Mascot ("Carpet Floating Buddy")
 * Replaces the static CS/Help button in the bottom-right corner.
 * Features 3D chibi flying carpet mascot, gentle levitation, hover bounce,
 * 360° spin on click, and integrated Relationship Desk & Chat Concierge.
 */
export default function CarpetFloatingBuddy() {
  const pathname = usePathname()
  const { isBuddyVisible, triggerReaction } = useMascot()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'video'>('chat')
  const [isBouncing, setIsBouncing] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)

  // Chat State
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'cs',
      text: 'Assalamu’alaikum! Saya Nadia dari Aladin Concierge. Ada yang bisa kami bantu seputar transaksi, tabungan Ala Impian, atau layanan syariah hari ini?',
      time: 'Baru saja',
    },
  ])

  const quickQuestions = [
    'Kendala Transfer & Sumber Dana',
    'Tanya Tabungan Umrah & Haji',
    'Kartu Debit Visa Virtual',
    'Bebas Biaya Admin Alfamart',
  ]

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
        className="absolute bottom-[80px] right-3 z-50 flex flex-col items-end select-none"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Floating Speech Bubble Hint */}
        {!isOpen && (
          <div
            onClick={handleBuddyClick}
            className="mb-1 bg-white/95 text-[#1037A6] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md border border-[#00F0A0] flex items-center gap-1 cursor-pointer"
            style={{
              boxShadow: '0 4px 12px rgba(0, 240, 160, 0.25)',
            }}
          >
            <span>Butuh bantuan?</span>
            <Sparkles className="w-3 h-3 text-[#00F0A0]" />
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
            width: '76px',
            height: '66px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            outline: 'none',
          }}
        >
          {/* 3D WebGL Rigged Mascot Floating in Horizontal Idle S-Curve */}
          <div
            className="w-full h-full pointer-events-none transition-all duration-300 group-hover:scale-105"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0, 240, 160, 0.45)) drop-shadow(0 2px 6px rgba(16, 55, 166, 0.4))',
            }}
          >
            <Canvas
              camera={{ position: [0, 0, 4.2], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={1.6} />
              <directionalLight position={[3, 4, 3]} intensity={2.2} />
              <pointLight position={[-2, -1, 2]} intensity={1.5} color="#00F0A0" />
              <CarpetModel pose="idle" interactive={false} scale={0.72} />
            </Canvas>
          </div>

          {/* Online Active Status Dot */}
          <span className="absolute top-1 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0A0] opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0A0] border-2 border-white shadow-xs" />
          </span>

          {/* Twinkling Magical Star */}
          <span
            className="absolute top-0 left-2 text-[#00F0A0] pointer-events-none"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#00F0A0]" />
          </span>
        </button>
      </div>

      {/* 2. SLIDE-UP RELATIONSHIP DESK & CONCIERGE MODAL */}
      {isOpen && (
        <div
          className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden max-h-[84vh]"
            style={{ paddingBottom: '24px', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

            {/* Officer Header Info */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full bg-[#1037A6] flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm border border-white">
                  <Sparkles className="w-5 h-5 text-[#00F0A0]" />
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

              <div className="flex items-center gap-2">
                <Link
                  href="/mascot-studio"
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#1037A6] text-[10px] font-bold rounded-lg border border-[#00F0A0]/40 flex items-center gap-1 transition-colors"
                  title="Buka Mascot 3D Studio & Rig Inspector"
                >
                  <Sparkles className="w-3 h-3 text-[#00F0A0]" />
                  <span>3D Studio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="px-5 pt-3 pb-2 flex gap-2 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-[#1037A6] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Chat Concierge
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-[#1037A6] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                Video Call Desk
              </button>
            </div>

            {/* Content Tab 1: Live Chat Concierge */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Scroll Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px] max-h-[320px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-2xs ${
                          msg.sender === 'user'
                            ? 'bg-[#1037A6] text-white rounded-tr-xs'
                            : 'bg-gray-100 text-[#1A1D26] rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 p-2 bg-gray-100 rounded-full w-14 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
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

                {/* Chat Input Bar */}
                <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ketik pertanyaan untuk relationship desk..."
                    className="flex-1 bg-gray-100 text-[#1A1D26] text-[13px] px-4 py-2.5 rounded-full outline-hidden focus:ring-2 focus:ring-[#1037A6]/30 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputMsg.trim()}
                    className="w-10 h-10 rounded-full bg-[#1037A6] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-transform cursor-pointer shadow-xs"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
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
                    className="flex-1 py-3 px-3 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-500 text-[12px] font-extrabold text-[#1A1D26] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#10B981]" />
                    <span>Chat WhatsApp</span>
                  </button>

                  <Link
                    href="/mascot"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 px-3 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-[#1037A6] text-[12px] font-extrabold text-[#1037A6] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#1037A6]" />
                    <span>Atraksi 3D Karpet</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
