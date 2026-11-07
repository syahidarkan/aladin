'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  const isBeranda =
    pathname === '/beranda' ||
    pathname === '/' ||
    pathname.startsWith('/bayar') ||
    pathname.startsWith('/transfer') ||
    pathname.startsWith('/pocket') ||
    pathname.startsWith('/hijrah') ||
    pathname.startsWith('/rewards') ||
    pathname.startsWith('/ala-haramain') ||
    pathname.startsWith('/ewallet') ||
    pathname.startsWith('/bantu') ||
    pathname.startsWith('/notifikasi')
  const isQris = pathname === '/qris'
  const isKeuangan =
    pathname === '/keuangan' ||
    pathname.startsWith('/wealth') ||
    pathname.startsWith('/impian') ||
    pathname.startsWith('/simulasi') ||
    pathname.startsWith('/kartu') ||
    pathname.startsWith('/donasi')

  return (
    <div
      className="bottom-nav"
      style={{
        height: '72px',
        alignItems: 'center',
        paddingTop: '0px',
        borderTop: '1px solid #ECEEF2',
        position: 'relative',
        zIndex: 60,
        backgroundColor: '#FFFFFF',
        flexShrink: 0,
      }}
    >
      {/* Tab Beranda */}
      <Link href="/beranda" className="nav-item" style={{ height: 'auto' }}>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
              fill={isBeranda ? '#1C20C4' : 'none'}
              stroke={isBeranda ? '#1C20C4' : '#9CA3AF'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: isBeranda ? 700 : 500,
            color: isBeranda ? '#1C20C4' : '#9CA3AF',
            marginTop: '2px',
          }}
        >
          Beranda
        </span>
      </Link>

      {/* Tab QRIS Center Stadium Pill */}
      <Link href="/qris" className="nav-item" style={{ flex: 'none', width: '80px', height: 'auto', position: 'relative', zIndex: 70 }}>
        <div
          className="flex items-center justify-center transition-transform active:scale-95"
          style={{
            marginTop: '-16px',
            width: '80px',
            height: '42px',
            backgroundColor: '#1C20C4',
            borderRadius: '21px',
            boxShadow: '0 4px 16px rgba(28, 32, 196, 0.45)',
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {/* QR Scanner Frame Icon */}
            <svg width="18" height="16" viewBox="0 0 24 20" fill="none">
              <path d="M2 6V2H6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 6V2H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M2 14V18H6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 14V18H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="7" y="5" width="10" height="10" rx="1.5" stroke="white" strokeWidth="2" />
            </svg>
            <span
              style={{
                fontSize: '8px',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '0.8px',
                marginTop: '1px',
                fontFamily: 'sans-serif',
              }}
            >
              QRIS
            </span>
          </div>
        </div>
      </Link>

      {/* Tab Keuangan */}
      <Link href="/keuangan" className="nav-item" style={{ height: 'auto' }}>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="10"
              width="14"
              height="11"
              rx="2.5"
              stroke={isKeuangan ? '#1C20C4' : '#9CA3AF'}
              strokeWidth="2"
              fill={isKeuangan ? '#1C20C4' : 'none'}
            />
            <path
              d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
              stroke={isKeuangan ? '#1C20C4' : '#9CA3AF'}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="15"
              r="1.5"
              fill={isKeuangan ? 'white' : '#9CA3AF'}
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: isKeuangan ? 700 : 500,
            color: isKeuangan ? '#1C20C4' : '#9CA3AF',
            marginTop: '2px',
          }}
        >
          Keuangan
        </span>
      </Link>
    </div>
  )
}
