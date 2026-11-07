'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface ChatMessage {
  id: string
  sender: 'cs' | 'user'
  text: string
  time: string
}

export default function FloatingConcierge() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'video'>('chat')
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'cs',
      text: 'Assalamu’alaikum Kak Syahid! Saya Nadia dari Aladin Concierge. Ada yang bisa kami bantu seputar transaksi, tabungan, atau layanan syariah Anda hari ini?',
      time: 'Baru saja',
    },
  ])

  const quickQuestions = [
    'Kendala Transfer & Sumber Dana',
    'Tanya Tabungan Umrah & Haji',
    'Kartu Debit Visa Virtual',
    'Bebas Biaya Admin Alfamart',
  ]

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

    // Simulate smart Aladin staff response
    setIsTyping(true)
    setTimeout(() => {
      let reply = 'Terima kasih atas pertanyaan Anda. Petugas Relationship Desk kami siap mendampingi Anda.'
      const lower = text.toLowerCase()

      if (lower.includes('transfer') || lower.includes('sumber dana') || lower.includes('pocket')) {
        reply = 'Di menu Transfer, Anda kini dapat memilih Sumber Dana langsung dari Rekening Utama (Ala Dompet) maupun dari sub-wallet (Ala Pocket) tanpa biaya admin via BI-FAST.'
      } else if (lower.includes('umrah') || lower.includes('haji') || lower.includes('baitullah')) {
        reply = 'Tabungan Ala Impian Umrah & Haji terintegrasi dengan HIMPUH, AMPHURI, dan SISKOHAT Kemenag. Target awal haji Rp25.012.000 untuk penerbitan porsi resmi.'
      } else if (lower.includes('kartu') || lower.includes('visa') || lower.includes('cvv')) {
        reply = 'Kartu Visa Virtual Anda dapat diakses di menu Kartu. Anda dapat melihat CVV, menyalin 16-digit nomor kartu, atau membekukan kartu sementara secara instan.'
      } else if (lower.includes('alfamart') || lower.includes('gratis') || lower.includes('biaya')) {
        reply = 'Nasabah Aladin mendapatkan kuota 5x tarik tunai gratis di Alfamart dan 50x transfer gratis BI-FAST setiap bulannya.'
      }

      const csReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'cs',
        text: reply,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, csReply])
      setIsTyping(false)
    }, 900)
  }

  const pathname = usePathname()

  // Do not show on splash screen or intro walkthrough pages
  if (pathname === '/' || pathname.includes('/intro/')) {
    return null
  }

  return (
    <>
      {/* 1. Sleek Floating Concierge Chatbot Button (Bottom-Right, Above BottomNav) */}
      <div
        className="absolute z-50 flex items-center"
        style={{
          bottom: '80px',
          right: '16px',
        }}
      >
        {/* Circular Floating Action Button (Compact 48px, No Obtrusive Text Pill) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Aladin Concierge & Relationship Desk"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #081D48 0%, #162477 50%, #1C20C4 100%)',
            boxShadow: '0 6px 18px rgba(28, 32, 196, 0.4)',
          }}
          className="flex items-center justify-center text-white active:scale-90 transition-transform relative cursor-pointer border-2 border-white/70"
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          ) : (
            <>
              {/* Headset / Concierge Staff Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                <path d="M12 19v3" />
              </svg>

              {/* Glowing Pulse Online Badge */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F3AD] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00F3AD] border-2 border-white" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* 2. SLIDE-UP CONCIERGE & RELATIONSHIP DESK MODAL */}
      {isOpen && (
        <div
          className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden max-h-[82vh]"
            style={{
              paddingBottom: '24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Native Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

            {/* Officer Header Info */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full bg-[#1C20C4] flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm border border-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00F3AD] border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14.5px] font-extrabold text-[#1A1D26]">
                      Nadia — Relationship Desk
                    </h3>
                    <span className="text-[9.5px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Layanan Resmi Bank Aladin Syariah 24/7
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="px-5 pt-3 pb-2 flex gap-2 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-[#1C20C4] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Chat Concierge Resmi
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-[#1C20C4] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                Video Relationship Desk
              </button>
            </div>

            {/* TAB CONTENT 1: INTERACTIVE CHAT CONCIERGE */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 max-h-[320px]">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-[#1C20C4] text-white rounded-br-xs shadow-xs'
                            : 'bg-gray-100 text-[#1A1D26] rounded-bl-xs border border-gray-200/50'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {m.time}
                      </span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 p-2 bg-gray-100 rounded-full w-14">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>

                {/* Quick Chips */}
                <div className="px-4 py-1.5 overflow-x-auto no-scrollbar flex gap-1.5 shrink-0 border-t border-gray-100 bg-gray-50/50">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-white border border-gray-200 text-[#1C20C4] hover:bg-blue-50 active:scale-95 transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tulis kendala Anda di sini..."
                    className="flex-1 h-10 px-3.5 rounded-full bg-gray-100 text-[12.5px] text-[#1A1D26] outline-none focus:ring-1 focus:ring-[#1C20C4]"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputMsg.trim()}
                    className="h-10 px-4 rounded-full bg-[#1C20C4] disabled:opacity-40 text-white text-[12px] font-extrabold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: VIDEO RELATIONSHIP DESK */}
            {activeTab === 'video' && (
              <div className="p-5 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1C20C4] flex items-center justify-center mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <h4 className="text-[16px] font-extrabold text-[#1A1D26]">
                  Digital Relationship Desk
                </h4>
                <p className="text-[12px] text-gray-500 max-w-[280px] mt-1 mb-4 leading-relaxed">
                  Konsultasi tatap muka langsung via video call terenkripsi dengan petugas resmi Bank Aladin Syariah.
                </p>

                <Link
                  href="/bantu/video-call"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#1C20C4] text-white font-extrabold text-[13.5px] shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  Mulai Panggilan Video Sekarang →
                </Link>
              </div>
            )}

            {/* Official Security Notice */}
            <div className="px-5 pt-2">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-left">
                <span className="text-amber-600 font-extrabold text-sm">🔒</span>
                <span className="text-[10px] text-amber-900 leading-tight">
                  <strong>Peringatan Keamanan:</strong> Petugas resmi Aladin tidak pernah meminta PIN, password, atau OTP Anda.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

