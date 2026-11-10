'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'

type TabType = 'Semua' | 'Transaksi' | 'Promo' | 'Info'

export default function NotifikasiPage() {
  const { notifications } = useBankState()
  const [activeTab, setActiveTab] = useState<TabType>('Semua')

  const filtered = notifications.filter((n) => {
    if (activeTab === 'Semua') return true
    return n.type === activeTab
  })

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

      {/* 2. Top Header Bar with Prominent Back Button */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Notifikasi
        </h1>

        <button
          onClick={() => alert('Semua notifikasi ditandai sudah dibaca.')}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer text-[#1C20C4]"
        >
          <Image
            src="/assets/icons/notif_gear_clean.png"
            alt="Pengaturan"
            width={18}
            height={18}
            style={{ width: '18px', height: '18px' }}
            priority
          />
        </button>
      </div>

      {/* 3. Filter Pills Row (Evenly Padded, Beautiful Symmetrical Pills) */}
      <div
        style={{
          padding: '14px 20px 8px 20px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #ECEEF2',
          flexShrink: 0,
        }}
        className="no-scrollbar"
      >
        {(['Semua', 'Transaksi', 'Promo', 'Info'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                height: '36px',
                padding: isActive ? '0 20px' : '0 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: isActive ? 800 : 600,
                backgroundColor: isActive ? '#1C20C4' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#64748B',
                border: isActive ? '1.5px solid #1C20C4' : '1px solid #E2E8F0',
                boxShadow: isActive ? '0 2px 8px rgba(28, 32, 196, 0.25)' : 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              className="active:scale-95 transition-all shrink-0"
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* 4. Notification Items List (Block Flow, 20px Margins) */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#64748B]">
            <p className="text-[13px] font-semibold">Tidak ada notifikasi dalam kategori ini.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 18px',
                border: '1px solid #ECEEF2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                marginBottom: '12px',
              }}
              className="active:opacity-85 transition-opacity"
            >
              {/* Header row inside card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', position: 'relative' }}>
                    <Image
                      src={item.icon || '/assets/icons/notif_icon_qris_clean.png'}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: item.badgeColor,
                      backgroundColor: `${item.badgeColor}15`,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.badgeText}
                  </span>
                </div>

                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {item.date} • {item.time}
                </span>
              </div>

              {/* Title & Description */}
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#1A1D26', margin: '0 0 4px 0' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                {item.desc}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
