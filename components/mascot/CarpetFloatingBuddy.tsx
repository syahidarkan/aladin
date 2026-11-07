'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMascot } from '@/context/MascotContext'

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
      {/* 1. FLOATING MASCOT BUTTON (Bottom-Right, w-16 h-16) */}
      <div
        className="absolute bottom-20 right-4 z-40 flex items-center select-none"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          type="button"
          onClick={handleBuddyClick}
          onMouseEnter={handleHover}
          aria-label="Staff Aladin & Concierge"
          className={`relative w-15 h-15 rounded-full flex items-center justify-center cursor-pointer shadow-xl transition-all duration-300 ${
            isSpinning ? 'rotate-[360deg] scale-110' : ''
          } ${isBouncing ? '-translate-y-2' : 'hover:-translate-y-1'}`}
          style={{
            background: 'linear-gradient(135deg, #1037A6 0%, #0D2D8A 60%, #091D5C 100%)',
            border: '2.5px solid #00F0A0',
            boxShadow: '0 8px 24px rgba(16, 55, 166, 0.45), 0 0 16px rgba(0, 240, 160, 0.3)',
          }}
        >
          {/* Animated Mascot Graphic */}
          <div className="relative w-11 h-11 flex items-center justify-center animate-bounce-subtle">
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full drop-shadow-md overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Carpet Body */}
              <path
                d="M10 52 C 15 28, 30 22, 50 35 C 70 48, 85 30, 92 18 C 94 22, 90 42, 70 56 C 50 70, 25 66, 10 52 Z"
                fill="#154AD8"
              />
              <path
                d="M10 52 C 15 32, 28 26, 48 38 C 68 50, 82 34, 90 22"
                stroke="#00F0A0"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Front Lip with Chibi Face */}
              <path
                d="M8 55 C 10 40, 22 36, 38 42 C 45 46, 44 60, 32 64 C 18 68, 8 62, 8 55 Z"
                fill="#1037A6"
                stroke="#00F0A0"
                strokeWidth="3"
              />
              {/* Eyes */}
              <circle cx="20" cy="48" r="3.5" fill="#0B0D17" />
              <circle cx="30" cy="49" r="3.5" fill="#0B0D17" />
              <circle cx="19" cy="47" r="1.2" fill="#FFFFFF" />
              <circle cx="29" cy="48" r="1.2" fill="#FFFFFF" />
              {/* Blush */}
              <ellipse cx="14" cy="52" rx="3.5" ry="2" fill="#00F0A0" />
              <ellipse cx="35" cy="53" rx="3.5" ry="2" fill="#00F0A0" />
              {/* Smile */}
              <path
                d="M23 53 Q 25 57 27 53"
                stroke="#0B0D17"
                strokeWidth="1.5"
                fill="#FF4D82"
                strokeLinecap="round"
              />
              {/* Sparkle */}
              <path
                d="M78 12 L 80 8 L 82 12 L 86 14 L 82 16 L 80 20 L 78 16 L 74 14 Z"
                fill="#00F0A0"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Active Online Pulse */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0A0] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00F0A0] border-2 border-[#1037A6]" />
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
                  <span className="text-xl">🧞‍♂️</span>
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
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
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
                  <div className="w-10 h-10 rounded-xl bg-[#1037A6] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                    📹
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
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
                    <span>💬</span>
                    <span>Chat WhatsApp</span>
                  </button>

                  <Link
                    href="/mascot"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 px-3 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-[#1037A6] text-[12px] font-extrabold text-[#1037A6] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>✨</span>
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
