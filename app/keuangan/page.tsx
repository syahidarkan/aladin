'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import BottomNav from '@/components/BottomNav'
import { useBankState } from '@/lib/bankState'

export default function KeuanganPage() {
  const { alaDompet, alaImpianUmroh, alaDeposito, pockets = [], transactions } = useBankState()
  const [activeTab, setActiveTab] = useState<'simpanan' | 'pembiayaan'>('simpanan')
  const [showBalance, setShowBalance] = useState(true)
  const [showStatementModal, setShowStatementModal] = useState(false)

  const totalInPockets = pockets.reduce((acc, p) => acc + (p.balance || 0), 0)
  const totalSimpanan = alaDompet + alaImpianUmroh + alaDeposito + totalInPockets

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] select-none text-[#1A1A2E] relative">
      {/* Header with authentic soft lavender-gray gradient background (Exact Traced y=0 to y=106.5) */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #EBECFB 0%, #E8EBFB 100%)',
          paddingLeft: '23px',
          paddingRight: '23px',
          paddingBottom: '22px',
          height: '106.5px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Safe Area Spacer */}
        <StatusBar />

        {/* Top Header Row: Title 'Keuangan' & E-Statement Document Icon */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: '2px' }}
        >
          <h1 className="text-[20px] font-extrabold text-[#1A1D26] tracking-tight">
            Keuangan Saya
          </h1>

          {/* E-Statement Document Action Button */}
          <button
            onClick={() => setShowStatementModal(true)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Unduh E-Statement"
          >
            <div className="relative" style={{ width: '27.5px', height: '25px' }}>
              <Image
                src="/assets/icons/keu_doc_icon_clean.png"
                alt="E-Statement"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Tabs Row: Simpanan / Pembiayaan (Exact Traced y=106.5 to y=155, height 48.5px) */}
      <div
        className="flex border-b border-[#E5E7EB] bg-white shrink-0"
        style={{
          paddingLeft: '23px',
          paddingRight: '23px',
          height: '48.5px',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={() => setActiveTab('simpanan')}
          className={`flex-1 py-3 text-[15px] font-bold text-center relative transition-colors cursor-pointer ${
            activeTab === 'simpanan' ? 'text-[#1C20C4]' : 'text-[#9CA3AF]'
          }`}
        >
          Simpanan
          {activeTab === 'simpanan' && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1C20C4] rounded-t-full"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('pembiayaan')}
          className={`flex-1 py-3 text-[15px] font-bold text-center relative transition-colors cursor-pointer ${
            activeTab === 'pembiayaan' ? 'text-[#1C20C4]' : 'text-[#9CA3AF]'
          }`}
        >
          Pembiayaan
          {activeTab === 'pembiayaan' && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1C20C4] rounded-t-full"
            />
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingLeft: '23px',
          paddingRight: '23px',
          paddingTop: '20px',
          paddingBottom: '100px',
        }}
      >
        {activeTab === 'simpanan' ? (
          <>
            {/* Section 1: Total Simpanan (Exact Traced Bounds: y=350 to y=525 native) */}
            <div style={{ marginBottom: '6px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                <h2 className="text-[15px] font-bold text-[#1A1A2E]">Total Simpanan</h2>

                {/* Eye toggle icon */}
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-0.5 text-[#6B7280] hover:text-[#1C20C4] cursor-pointer"
                  aria-label="Toggle Saldo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    {showBalance ? (
                      <>
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                          stroke="#6B7280"
                          strokeWidth="2"
                        />
                        <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2" />
                      </>
                    ) : (
                      <>
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12A18.45 18.45 0 015.06 7.06L17.94 17.94Z"
                          stroke="#6B7280"
                          strokeWidth="2"
                        />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="#6B7280" strokeWidth="2" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {/* Total Simpanan Card (Exact Traced: width 368px, height 68px, radius 16px) */}
              <div
                className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between"
                style={{
                  height: '68px',
                  borderRadius: '16px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  boxSizing: 'border-box',
                }}
              >
                <span className="text-[13px] font-medium text-[#6B7280]">
                  Total saldo (IDR)
                </span>
                <span className="text-[18px] font-extrabold text-[#1A1A2E] tracking-tight">
                  {showBalance ? `Rp${totalSimpanan.toLocaleString('id-ID')}` : 'Rp••••••••'}
                </span>
              </div>
            </div>

            {/* Section 2: Ala Dompet (Exact Traced Bounds: y=555 to y=835 native) */}
            <div style={{ marginBottom: '6px' }}>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]" style={{ marginBottom: '6px' }}>
                Ala Dompet
              </h2>

              {/* Ala Dompet Card (Exact Traced: width 368px, height 118px, radius 20px) */}
              <div
                className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                style={{
                  height: '118px',
                  borderRadius: '20px',
                  padding: '16px',
                  boxSizing: 'border-box',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0" style={{ width: '36px', height: '36px' }}>
                      <Image
                        src="/assets/icons/keu_dompet_icon_clean.png"
                        alt="Ala Dompet"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[15px] font-bold text-[#1A1A2E]">Ala Dompet</span>
                  </div>

                  <span className="text-[11px] font-bold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Wadiah Utama
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#F3F4F6]">
                  <span className="text-[13px] text-[#6B7280]">Saldo aktif</span>
                  <span className="text-[15px] font-bold text-[#1A1A2E]">
                    {showBalance ? `Rp${alaDompet.toLocaleString('id-ID')}` : 'Rp••••••••'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Ala Pocket (Sub-wallets / Kantong Pengeluaran) */}
            <div style={{ marginBottom: '6px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                <h2 className="text-[15px] font-bold text-[#1A1A2E]">
                  Ala Pocket
                </h2>
                <span className="text-[11px] font-bold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-full">
                  {pockets.length} Kantong
                </span>
              </div>

              <div
                className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                style={{
                  height: '118px',
                  borderRadius: '20px',
                  padding: '16px',
                  boxSizing: 'border-box',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '11px',
                        flexShrink: 0,
                      }}
                    >
                      PKT
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1A1A2E] leading-tight">Kantong Harian</h3>
                      <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">Budgeting &amp; Sumber Transfer</p>
                    </div>
                  </div>

                  <Link
                    href="/pocket"
                    className="text-[13px] font-bold text-[#1C20C4] hover:underline"
                  >
                    Buka Pocket →
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#F3F4F6]">
                  <span className="text-[13px] text-[#6B7280]">Total di Pocket</span>
                  <span className="text-[15px] font-bold text-[#D97706]">
                    {showBalance ? `Rp${totalInPockets.toLocaleString('id-ID')}` : 'Rp••••••••'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Ala Impian (Exact Traced Bounds: y=865 to y=1145 native) */}
            <div style={{ marginBottom: '6px' }}>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]" style={{ marginBottom: '6px' }}>
                Ala Impian
              </h2>

              {/* Ala Impian Card (Exact Traced: width 368px, height 118px, radius 20px) */}
              <div
                className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                style={{
                  height: '118px',
                  borderRadius: '20px',
                  padding: '16px',
                  boxSizing: 'border-box',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0" style={{ width: '36px', height: '36px' }}>
                      <Image
                        src="/assets/icons/keu_impian_icon_clean.png"
                        alt="Ala Impian"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1A1A2E] leading-tight">Ala Impian Umroh</h3>
                      <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">Kantong Tabungan Umroh</p>
                    </div>
                  </div>

                  <Link
                    href="/impian"
                    className="text-[13px] font-bold text-[#1C20C4] hover:underline"
                  >
                    Buka Kantong →
                  </Link>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#F3F4F6]">
                  <span className="text-[13px] text-[#6B7280]">Terkumpul</span>
                  <span className="text-[15px] font-bold text-[#059669]">
                    {showBalance ? `Rp${alaImpianUmroh.toLocaleString('id-ID')}` : 'Rp••••••••'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Ala Deposito (Yuk, tingkatkan bagi hasilmu!) (Exact 1:1 to 04-keuangan.png) */}
            <div style={{ marginBottom: '24px' }}>
              <h2 className="text-[15px] font-bold text-[#1A1D26]" style={{ marginBottom: '14px' }}>
                Yuk, tingkatkan bagi hasilmu!
              </h2>

              {/* Ala Deposito Card (Exact 04-keuangan.png) */}
              <div
                className="bg-[#EBF1FE] border border-[#D2E1FC] rounded-[24px] p-5 relative overflow-hidden shadow-xs"
                style={{ minHeight: '175px' }}
              >
                <h3 className="text-[17px] font-black text-[#1A1D26]">
                  Ala Deposito
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#D97706] block">
                      Bagi Hasil
                    </span>
                    <span className="text-[14px] font-black text-[#D97706] leading-none">
                      8,5%p.a.*
                    </span>
                  </div>

                  <div className="w-[1px] h-7 bg-gray-300 mx-1.5" />

                  <span className="text-[12px] font-medium text-[#1A1D26] leading-tight max-w-[110px]">
                    Maksimalkan bagi hasil
                  </span>
                </div>

                <div className="mt-5">
                  <Link
                    href="/simulasi-bagi-hasil"
                    className="inline-block bg-[#1C20C4] hover:bg-[#151AA8] text-white text-[12.5px] font-extrabold px-5 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Buka Deposito
                  </Link>

                  <p className="text-[8px] text-[#6C737E] mt-2 leading-tight max-w-[220px]">
                    *Sesuai realisasi pendapatan Bank berdasarkan nisbah nasabah:bank 85%:15%, sebelum dipotong pajak.
                  </p>
                </div>

                {/* Safe Box Illustration on right side (Full Uncut Icon, Vertically Centered) */}
                <div
                  className="absolute right-4 top-4 w-[96px] h-[96px] pointer-events-none"
                >
                  <Image
                    src="/assets/icons/keu_deposito_icon_clean.png"
                    alt="Ala Deposito Safe Box"
                    fill
                    unoptimized
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Section: Aladin Wrapped 2026 (Kilas Balik Rangkuman Pengeluaran & Transaksi) */}
            <div style={{ marginBottom: '24px' }}>
              <Link
                href="/wrapped"
                className="block rounded-[24px] p-5 text-white relative overflow-hidden shadow-lg active:scale-[0.99] transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #831843 0%, #BE185D 50%, #DB2777 100%)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                    KILAS BALIK TAHUNAN
                  </span>
                  <span className="text-[11.5px] font-bold text-white/90">
                    Buka Wrapped ↗
                  </span>
                </div>
                <h3 className="text-[17px] font-black leading-tight text-white mb-1">
                  Aladin Wrapped 2026
                </h3>
                <p className="text-[11.5px] text-white/90 leading-snug">
                  Lihat rangkuman mutasi berkah, pos pengeluaran harian, dan total biaya admin yang kamu hemat!
                </p>
              </Link>
            </div>

            {/* Section 5: Mutasi Rekening Terkini (Real-Time Synced) */}
            <div style={{ marginBottom: '36px' }}>
              <div className="flex items-center justify-between mb-3 px-0.5">
                <h2 className="text-[15px] font-bold text-[#1A1A2E]">Mutasi Rekening</h2>
                <span className="text-[12px] font-semibold text-[#1C20C4]">Bulan Ini</span>
              </div>

              <div
                className="bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                style={{ padding: '16px 20px', boxSizing: 'border-box' }}
              >
                {transactions.length === 0 ? (
                  <p className="text-[12px] text-[#6B7280] text-center py-4">Belum ada mutasi transaksi.</p>
                ) : (
                  transactions.slice(0, 6).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-none gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-[#1A1A2E] leading-snug truncate">{tx.title}</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">{tx.date} • {tx.time}</p>
                      </div>
                      <span className={`text-[13.5px] font-extrabold shrink-0 text-right ${tx.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {tx.type === 'debit' ? '-' : '+'}Rp{tx.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Pembiayaan Tab State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative w-20 h-20 mb-4 opacity-80">
              <Image
                src="/assets/icons/keu_dompet_icon_clean.png"
                alt="Belum Ada Pembiayaan"
                fill
                unoptimized
                className="object-contain grayscale"
              />
            </div>
            <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-1">
              Belum Ada Pembiayaan Aktif
            </h3>
            <p className="text-[13px] text-[#6B7280] max-w-[260px] leading-relaxed">
              Ajukan pembiayaan syariah yang sesuai dengan kebutuhan dan prinsip berkahmu.
            </p>
          </div>
        )}
      </div>

      {/* E-Statement Download Modal (Fungsional Pitch Feature) */}
      {showStatementModal && (
        <div
          className="fixed inset-0 z-[250] flex items-end justify-center bg-black/60 backdrop-blur-xs"
          onClick={() => setShowStatementModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[414px] rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-200"
            style={{ boxSizing: 'border-box', padding: '24px 24px 44px 24px' }}
          >
            {/* Native Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-[18px] font-extrabold text-[#1A1A2E]">
                Unduh E-Statement
              </h3>
              <button
                onClick={() => setShowStatementModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-[13px] text-[#6B7280] mb-4">
              Pilih periode mutasi rekening untuk diunduh dalam format PDF resmi:
            </p>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Bulan Ini (November 2026)', size: '240 KB' },
                { label: 'Bulan Lalu (Oktober 2026)', size: '380 KB' },
                { label: '3 Bulan Terakhir', size: '1.1 MB' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    alert(`Mengunduh E-Statement ${item.label}... File tersimpan.`)
                    setShowStatementModal(false)
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-[#1C20C4] hover:bg-[#F7F8FC] transition-colors text-left cursor-pointer"
                >
                  <span className="text-[13.5px] font-semibold text-[#1A1A2E]">
                    {item.label}
                  </span>
                  <span className="text-[11.5px] text-[#6B7280]">{item.size}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowStatementModal(false)}
              className="w-full h-12 bg-[#1C20C4] text-white font-bold text-[14px] rounded-full active:scale-[0.99] transition-transform cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
