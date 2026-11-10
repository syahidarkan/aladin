'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'

export default function AladinBantuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategory, setOpenCategory] = useState<string | null>('akun')
  const [showChatModal, setShowChatModal] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'cs',
      text: 'Assalamu’alaikum! Selamat datang di Aladin Concierge Resmi. Ada yang bisa kami bantu seputar rekening atau transaksi syariah Anda?',
      time: '22:25',
    },
  ])
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const faqs = [
    {
      category: 'akun',
      title: 'Akun & Keamanan Syariah',
      items: [
        {
          q: 'Bagaimana cara mengganti PIN transaksi?',
          a: 'Buka menu Profil > Keamanan & Akun > Ubah PIN Transaksi. Masukkan PIN lama, lalu tentukan 6 digit PIN baru Anda.',
        },
        {
          q: 'Apakah simpanan di Bank Aladin dijamin LPS?',
          a: 'Ya, Bank Aladin Syariah adalah bank umum syariah berizin dan diawasi oleh OJK serta seluruh simpanan nasabah dijamin oleh LPS hingga Rp2 Miliar per nasabah.',
        },
        {
          q: 'Apa itu Proxy BI-FAST?',
          a: 'Proxy BI-FAST menghubungkan nomor handphone atau email Anda ke rekening Aladin, sehingga pengirim dana cukup mengetik nomor HP/email Anda tanpa perlu menghafal nomor rekening.',
        },
      ],
    },
    {
      category: 'impian',
      title: 'Ala Impian, Haji & Umrah',
      items: [
        {
          q: 'Apa keunggulan Tabungan Ala Impian?',
          a: 'Nabung dengan target mendapatkan bagi hasil syariah kompetitif hingga 8,5% p.a. dengan nisbah yang transparan serta fleksibilitas auto-debet atau kunci tabungan.',
        },
        {
          q: 'Kapan nomor porsi Haji didapatkan?',
          a: 'Nomor porsi resmi Kemenag/BPKH diterbitkan segera setelah akumulasi saldo Setoran Awal Haji Anda mencapai target Rp25.012.000 (termasuk bea materai & saldo endap).',
        },
      ],
    },
    {
      category: 'pocket',
      title: 'Ala Pocket & Sumber Dana Transfer',
      items: [
        {
          q: 'Apa perbedaan Ala Pocket dan Ala Impian?',
          a: 'Ala Pocket adalah pos anggaran harian (sub-wallets) untuk belanja, makan, atau darurat. Dana di Pocket dapat langsung dipilih sebagai Sumber Dana saat transfer tanpa memotong tabungan berjangka.',
        },
        {
          q: 'Apakah pemindahan dana ke Pocket dikenakan biaya?',
          a: 'Tidak ada biaya sama sekali (Rp0). Anda bebas mengalokasikan dan menarik kembali dana antar Rekening Utama dan Pocket kapan pun.',
        },
      ],
    },
    {
      category: 'transaksi',
      title: 'Transaksi, Alfamart & Saudi',
      items: [
        {
          q: 'Bagaimana cara transaksi di Arab Saudi?',
          a: 'Gunakan Ala Haramain Wallet untuk transaksi QRIS Saudi (jaringan Geidea) tanpa markup kurs, atau gunakan Kartu Fisik Aladin di mesin EDC Tanah Suci.',
        },
        {
          q: 'Berapa kuota gratis tarik & setor di Alfamart?',
          a: 'Nasabah Aladin mendapatkan kuota 5 kali gratis tarik/setor tunai di ribuan gerai Alfamart serta 50 kali transfer gratis BI-FAST setiap bulannya.',
        },
      ],
    },
  ]

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMsg
    if (!text.trim()) return

    const userMessage = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
    setChatMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInputMsg('')

    // Simulate CS response
    setIsTyping(true)
    setTimeout(() => {
      let reply = 'Terima kasih atas pertanyaannya. Tim Aladin Syariah siap melayani Anda sepenuh hati.'
      const lower = text.toLowerCase()
      if (lower.includes('qris') || lower.includes('saudi') || lower.includes('sar')) {
        reply = 'Transaksi di Arab Saudi dapat dilakukan langsung dengan QRIS Aladin yang terintegrasi dengan jaringan Geidea di Arab Saudi tanpa markup kurs 3-5% seperti bank konvensional.'
      } else if (lower.includes('deposito') || lower.includes('bagi hasil') || lower.includes('8.5')) {
        reply = 'Ala Deposito memberikan nisbah hingga 85:15 dengan estimasi bagi hasil 8,5% p.a. Anda dapat membuka langsung dari menu Keuangan.'
      } else if (lower.includes('haji') || lower.includes('umrah')) {
        reply = 'Tabungan Haji Aladin tersinkronisasi langsung dengan Siskohat Kemenag dengan target setoran awal porsi haji Rp25.012.000.'
      } else if (lower.includes('pocket') || lower.includes('sumber dana')) {
        reply = 'Anda dapat memilih sub-wallet Ala Pocket sebagai sumber dana langsung saat melakukan transfer di halaman Transfer.'
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'cs',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setIsTyping(false)
    }, 900)
  }

  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Safe Area Spacer */}
      <StatusBar />

      {/* 2. Top Header Bar */}
      <div
        className="w-full h-[46px] flex items-center justify-between bg-white border-b border-[#ECEEF2] shrink-0"
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/beranda"
          className="w-8 h-8 -ml-1 rounded-full bg-gray-100/90 hover:bg-gray-200 border border-gray-200/80 flex items-center justify-center text-[#1A1D26] active:scale-95 transition-all cursor-pointer shadow-2xs"
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft className="w-4 h-4 text-[#1A1D26] stroke-[2.4]" />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Aladin Bantu &amp; Hub
        </h1>

        <div style={{ width: '20px' }} />
      </div>

      {/* 3. Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 100px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Search Bar Input */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '10px 16px',
            border: '1px solid #ECEEF2',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Cari solusi kendala atau topik bantuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              fontSize: '13px',
              border: 'none',
              outline: 'none',
              color: '#1A1D26',
              fontWeight: 500,
            }}
          />
        </div>

        {/* Priority Action Cards: Concierge Chat & Video Desk */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Chat Concierge Card */}
          <button
            onClick={() => setShowChatModal(true)}
            style={{
              background: 'linear-gradient(135deg, #081D48 0%, #162477 60%, #1C20C4 100%)',
              borderRadius: '22px',
              padding: '16px',
              color: 'white',
              textAlign: 'left',
              border: 'none',
              boxShadow: '0 4px 16px rgba(8, 29, 72, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '145px',
            }}
            className="active:scale-[0.98] transition-all"
          >
            <div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 243, 173, 0.15)',
                  color: '#00F3AD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>
                Chat Concierge
              </h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '3px 0 0 0', lineHeight: 1.3 }}>
                Layanan pesan resmi 24/7
              </p>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#00F3AD', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Mulai Chat →
            </span>
          </button>

          {/* Relationship Desk Video Card */}
          <Link
            href="/bantu/video-call"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '22px',
              padding: '16px',
              border: '1px solid #ECEEF2',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              textDecoration: 'none',
              color: '#1A1D26',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '145px',
            }}
            className="active:scale-[0.98] transition-all"
          >
            <div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#EEF2FF',
                  color: '#1C20C4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>
                Relationship Desk
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '3px 0 0 0', lineHeight: 1.3 }}>
                Video call petugas syariah
              </p>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1C20C4', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Panggil Desk →
            </span>
          </Link>
        </div>

        {/* Security & Official Trust Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '14px 18px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
            <strong style={{ color: '#1A1D26' }}>Perlindungan Nasabah:</strong> Bank Aladin Syariah tidak pernah meminta PIN, password, atau kode OTP melalui kanal apapun.
          </p>
        </div>

        {/* Accordion FAQ Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D26', margin: '4px 0 2px 0' }}>
            Kategori Bantuan Populer
          </h2>

          {(searchQuery ? filteredFaqs : faqs).map((cat) => {
            const isOpen = openCategory === cat.category
            return (
              <div
                key={cat.category}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #ECEEF2',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.category)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1D26' }}>
                    {cat.title}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2.2"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 16px 20px',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: '#FAFBFD',
                    }}
                  >
                    {cat.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#1C20C4', margin: 0 }}>
                          {item.q}
                        </h4>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Regulatory Trust Badge Footer */}
        <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
          <p style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            PT Bank Aladin Syariah Tbk berizin &amp; diawasi oleh Otoritas Jasa Keuangan (OJK) serta peserta penjaminan LPS.
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* IN-APP CHAT CONCIERGE MODAL                                           */}
      {/* ===================================================================== */}
      {showChatModal && (
        <div
          className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowChatModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden max-h-[85vh]"
            style={{
              paddingBottom: '24px',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2 shrink-0" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1C20C4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-extrabold text-[#1A1D26]">
                      Concierge Resmi Aladin
                    </h3>
                    <span className="text-[9px] font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Melayani 24/7 dengan prinsip amanah
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowChatModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 max-h-[340px]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1C20C4] text-white rounded-br-xs shadow-xs'
                        : 'bg-gray-100 text-[#1A1D26] rounded-bl-xs border border-gray-200/50'
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
                <div className="flex items-center gap-1.5 p-2 bg-gray-100 rounded-full w-14">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>

            {/* Quick Chips */}
            <div className="px-4 py-1.5 overflow-x-auto no-scrollbar flex gap-1.5 shrink-0 border-t border-gray-100 bg-gray-50/50">
              {['Kendala Transfer', 'Tanya Tabungan Umrah', 'Kartu Visa', 'Bebas Biaya Admin'].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tulis pesan Anda..."
                className="flex-1 h-10 px-3.5 rounded-full bg-gray-100 text-[12.5px] text-[#1A1D26] outline-none focus:ring-1 focus:ring-[#1C20C4]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMsg.trim()}
                className="h-10 px-4 rounded-full bg-[#1C20C4] disabled:opacity-40 text-white text-[12px] font-extrabold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
