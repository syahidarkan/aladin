'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import CarpetModel, { CarpetPose } from './CarpetModel'
import { HelpCircle, Headphones, MessageCircle, Send, X } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'cs' | 'user'
  text: string
  time: string
}

/**
 * Floating CS Companion Mascot ("Alan" - Floating Buddy)
 * Replaces the static CS button above the bottom bar with an animated 3D companion.
 * Follows Animation Director Brief:
 * - Idle: Alan stands upright on his tassels, occasionally waving his front-right corner "Halo!".
 * - Tap: Performs an acrobatic flip salto jump, lands with a polite bow, and opens WhatsApp Concierge.
 */
export default function CarpetFloatingBuddy() {
  const pathname = usePathname()
  const { isBuddyVisible } = useMascot()

  const [isOpen, setIsOpen] = useState(false)
  const [buddyPose, setBuddyPose] = useState<CarpetPose>('stand')
  const [isSalto, setIsSalto] = useState(false)

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

  // Periodic waving greeting animation in idle state
  useEffect(() => {
    if (isOpen) return

    let waveTimer: NodeJS.Timeout
    let resetTimer: NodeJS.Timeout

    const scheduleWave = () => {
      waveTimer = setTimeout(() => {
        setBuddyPose('waving')
        resetTimer = setTimeout(() => {
          setBuddyPose('stand')
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
    // 1. Acrobatic Flip Salto Jump
    setIsSalto(true)
    setBuddyPose('polite-bow')

    setTimeout(() => {
      setIsSalto(false)
      setIsOpen(true)
    }, 480)
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
          aria-label="Staff Aladin & Concierge"
          className={`relative group cursor-pointer transition-all duration-300 ${
            isSalto ? 'animate-mascot-spin -translate-y-4 scale-110' : ''
          }`}
          style={{
            width: '84px',
            height: '72px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            outline: 'none',
          }}
        >
          {/* 3D WebGL Rigged Mascot Floating */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-105"
            style={{
              width: '220px',
              height: '180px',
              filter: 'drop-shadow(0 6px 16px rgba(0, 240, 160, 0.45)) drop-shadow(0 2px 6px rgba(16, 55, 166, 0.35))',
            }}
          >
            <Canvas
              camera={{ position: [0, 0.05, 5.6], fov: 32 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={2.2} />
              <directionalLight position={[2, 4, 3]} intensity={2.6} />
              <pointLight position={[0, 0.3, 2.8]} intensity={3.2} color="#FFFFFF" />
              <pointLight position={[-1.2, -0.2, 2.2]} intensity={2.0} color="#00F0A0" />
              <pointLight position={[1.2, -0.2, 2.2]} intensity={1.6} color="#60A5FA" />
              <CarpetModel pose={buddyPose} interactive={true} followCursor={true} scale={0.68} />
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
            setBuddyPose('stand')
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
                  setBuddyPose('stand')
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Direct Concierge Pill */}
            <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11.5px] font-bold text-emerald-900">
                  Respon Instan via WhatsApp Resmi Aladin
                </span>
              </div>
              <a
                href="https://wa.me/628118888888"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Buka WA</span>
              </a>
            </div>

            {/* Messages Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[360px] bg-gray-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed shadow-xs ${
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
        </div>
      )}
    </>
  )
}
