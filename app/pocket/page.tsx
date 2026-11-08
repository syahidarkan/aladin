'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import {
  useBankState,
  createPocket,
  topUpPocket,
  withdrawPocket,
  deletePocket,
  BankPocket,
} from '@/lib/bankState'

const CATEGORY_PRESETS = [
  {
    category: 'makan',
    label: 'Makan & Kuliner',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    defaultColor: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  {
    category: 'belanja',
    label: 'Belanja & Groceries',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    defaultColor: '#10B981',
    bgColor: '#D1FAE5',
  },
  {
    category: 'transport',
    label: 'Bensin & Transport',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    defaultColor: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  {
    category: 'sedekah',
    label: 'Sedekah Subuh & Zakat',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    defaultColor: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    category: 'hiburan',
    label: 'Hiburan & Healing',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
    defaultColor: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  {
    category: 'darurat',
    label: 'Dana Darurat Siaga',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    defaultColor: '#EF4444',
    bgColor: '#FEE2E2',
  },
]

export default function PocketPage() {
  const { alaDompet, pockets = [] } = useBankState()

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedPocket, setSelectedPocket] = useState<BankPocket | null>(null)

  // Create Form State
  const [newPocketName, setNewPocketName] = useState('')
  const [newCategory, setNewCategory] = useState<'makan' | 'belanja' | 'transport' | 'sedekah' | 'hiburan' | 'kesehatan' | 'darurat'>('makan')
  const [newInitialDeposit, setNewInitialDeposit] = useState('200.000')

  // Top Up & Withdraw Input State
  const [actionAmount, setActionAmount] = useState('100.000')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calculate Totals
  const totalInPockets = pockets.reduce((acc, p) => acc + (p.balance || 0), 0)

  // Handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPocketName.trim()) {
      alert('Masukkan nama Pocket terlebih dahulu.')
      return
    }

    const rawDeposit = parseInt(newInitialDeposit.replace(/\D/g, '') || '0', 10)

    if (rawDeposit > alaDompet) {
      alert('Saldo Ala Dompet tidak mencukupi untuk alokasi awal ini.')
      return
    }

    const preset = CATEGORY_PRESETS.find((c) => c.category === newCategory) || CATEGORY_PRESETS[0]

    const res = createPocket({
      name: newPocketName.trim(),
      category: newCategory,
      initialDeposit: rawDeposit,
      color: preset.defaultColor,
      icon: newCategory,
    })

    if (!res.success) {
      alert(res.error || 'Gagal membuat Pocket.')
      return
    }

    setShowCreateModal(false)
    setNewPocketName('')
    triggerToast(`Pocket "${newPocketName}" berhasil dibuat dengan saldo Rp${rawDeposit.toLocaleString('id-ID')}!`)
  }

  const handleTopUpSubmit = () => {
    if (!selectedPocket) return
    const num = parseInt(actionAmount.replace(/\D/g, '') || '0', 10)
    if (num <= 0) {
      alert('Masukkan nominal isi saldo yang valid.')
      return
    }

    const res = topUpPocket({ pocketId: selectedPocket.id, amount: num })
    if (!res.success) {
      alert(res.error || 'Saldo Ala Dompet tidak mencukupi.')
      return
    }

    setShowTopUpModal(false)
    triggerToast(`Berhasil menambahkan Rp${num.toLocaleString('id-ID')} ke Pocket "${selectedPocket.name}"!`)
  }

  const handleWithdrawSubmit = () => {
    if (!selectedPocket) return
    const num = parseInt(actionAmount.replace(/\D/g, '') || '0', 10)
    if (num <= 0) {
      alert('Masukkan nominal penarikan yang valid.')
      return
    }

    const res = withdrawPocket({ pocketId: selectedPocket.id, amount: num })
    if (!res.success) {
      alert(res.error || 'Saldo Pocket tidak mencukupi.')
      return
    }

    setShowWithdrawModal(false)
    triggerToast(`Rp${num.toLocaleString('id-ID')} berhasil ditarik kembali ke Rekening Utama (Ala Dompet)!`)
  }

  const handleDeletePocket = (pocket: BankPocket) => {
    if (confirm(`Yakin ingin menutup Pocket "${pocket.name}"? Sisa saldo Rp${pocket.balance.toLocaleString('id-ID')} akan otomatis dikembalikan ke Rekening Utama.`)) {
      const res = deletePocket(pocket.id)
      if (res.success) {
        triggerToast(`Pocket "${pocket.name}" ditutup. Saldo kembali ke Ala Dompet.`)
      }
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-[#F4F6F9] select-none text-[#1A1D26] overflow-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <StatusBar />

      {/* Top Header Bar (Clean Native Header) */}
      <div
        className="w-full bg-white border-b border-[#ECEEF2] flex items-center justify-between shrink-0"
        style={{ height: '52px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <Link
          href="/beranda"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={18}
            height={18}
            priority
          />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight text-center">
          Ala Pocket
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="text-[13px] font-extrabold text-[#1C20C4] hover:underline cursor-pointer"
        >
          + Buat
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {/* Hero Card: Overview of Balances */}
        <div
          style={{
            background: 'linear-gradient(135deg, #081D48 0%, #102A71 60%, #1C20C4 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(8, 29, 72, 0.25)',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] font-extrabold text-[#00F3AD] uppercase tracking-wider block">
                TOTAL SALDO DI SELURUH POCKET
              </span>
              <span className="text-[26px] font-black tracking-tight block mt-1">
                Rp{totalInPockets.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[10px] font-black bg-[#00F3AD] text-[#081D48] px-2.5 py-1 rounded-full uppercase">
              {pockets.length} Kantong Aktif
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[12px]">
            <div>
              <span className="text-white/70 block text-[10.5px]">Saldo Rekening Utama:</span>
              <span className="font-extrabold text-white text-[13px]">
                Rp{alaDompet.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-1.5 px-3.5 bg-white/15 hover:bg-white/25 rounded-full text-[11px] font-extrabold text-[#00F3AD] border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              + Tambah Pocket
            </button>
          </div>
        </div>

        {/* Feature Hint Banner */}
        <div className="p-3.5 bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1C20C4] text-white flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-[11.5px] text-[#1E293B] leading-tight">
            <strong>Terhubung ke Fitur Transfer!</strong> Saat transfer dana, Anda dapat langsung memilih Pocket tertentu sebagai sumber pembayaran tanpa tercampur rekening utama.
          </p>
        </div>

        {/* Pocket Cards List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[15px] font-extrabold text-[#1A1D26]">Daftar Kantong Anda</h2>
            <span className="text-[11px] text-[#64748B]">Bebas biaya pemindahan dana</span>
          </div>

          {pockets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#ECEEF2] text-center">
              <p className="text-[13px] text-gray-500 mb-3">Belum ada Pocket yang dibuat.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="py-2.5 px-5 bg-[#1C20C4] text-white rounded-full text-[12.5px] font-bold"
              >
                + Buat Pocket Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pockets.map((pocket) => {
                const preset =
                  CATEGORY_PRESETS.find((c) => c.category === pocket.category) ||
                  CATEGORY_PRESETS[0]

                return (
                  <div
                    key={pocket.id}
                    className="bg-white rounded-[24px] p-5 border border-[#ECEEF2] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  >
                    {/* Top Row: Icon + Name + Category + Delete */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Visual Category Illustration / Icon */}
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '16px',
                            backgroundColor: preset.bgColor,
                            color: preset.defaultColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {preset.icon}
                        </div>

                        <div>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: preset.defaultColor,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {preset.label}
                          </span>
                          <h3 className="text-[15.5px] font-extrabold text-[#1A1D26] leading-tight mt-0.5">
                            {pocket.name}
                          </h3>
                        </div>
                      </div>

                      {/* Pocket Options / Delete */}
                      <button
                        onClick={() => handleDeletePocket(pocket)}
                        className="text-gray-300 hover:text-red-500 p-1.5 text-[14px] cursor-pointer"
                        title="Tutup Pocket"
                      >
                        ×
                      </button>
                    </div>

                    {/* Balance */}
                    <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Saldo Tersedia di Pocket:
                        </span>
                        <span className="text-[20px] font-black text-[#1A1D26] tracking-tight">
                          Rp{pocket.balance.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Siap Ditransfer
                      </span>
                    </div>

                    {/* Action Buttons: Isi Saldo and Tarik Saldo */}
                    <div className="mt-4 pt-3.5 border-t border-gray-100 grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          setSelectedPocket(pocket)
                          setActionAmount('100.000')
                          setShowTopUpModal(true)
                        }}
                        className="py-2.5 px-3 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#1C20C4] text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Isi Saldo
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPocket(pocket)
                          setActionAmount('50.000')
                          setShowWithdrawModal(true)
                        }}
                        className="py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                        Tarik Saldo
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ISI SALDO POCKET (+ TOP UP DARI ALA DOMPET)                     */}
      {/* ========================================================================= */}
      {showTopUpModal && selectedPocket && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 48px 24px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Isi Saldo Pocket
                </h3>
                <p className="text-[11.5px] text-gray-500">
                  Pocket: <strong>{selectedPocket.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-2xl mb-4 flex justify-between items-center text-[12px]">
              <span className="text-gray-600 font-medium">Saldo Rekening Utama:</span>
              <span className="font-extrabold text-[#1C20C4]">
                Rp{alaDompet.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Quick Preset Chips */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 block mb-2">
                Pilih Cepat Nominal:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['50.000', '100.000', '250.000', '500.000'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setActionAmount(nom)}
                    className={`py-2 rounded-xl border text-[11.5px] font-bold cursor-pointer transition-all ${
                      actionAmount === nom
                        ? 'bg-[#1C20C4] text-white border-[#1C20C4]'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    Rp{nom}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-5">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Atau Ketik Nominal Sendiri:
              </label>
              <div className="flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-extrabold text-[#1C20C4] mr-2">Rp</span>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setActionAmount(raw ? Number(raw).toLocaleString('id-ID') : '0')
                  }}
                  className="w-full bg-transparent font-black text-[16px] text-[#1A1D26] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleTopUpSubmit}
              className="w-full h-12 bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              Pindahkan Dana ke Pocket Sekarang →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TARIK DARI POCKET KE REKENING UTAMA                             */}
      {/* ========================================================================= */}
      {showWithdrawModal && selectedPocket && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 48px 24px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Tarik ke Rekening Utama
                </h3>
                <p className="text-[11.5px] text-gray-500">
                  Dari: <strong>{selectedPocket.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl mb-4 flex justify-between items-center text-[12px]">
              <span className="text-gray-600 font-medium">Saldo Pocket Tersedia:</span>
              <span className="font-extrabold text-amber-700">
                Rp{selectedPocket.balance.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Quick Preset Chips */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 block mb-2">
                Pilih Nominal Tarik:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['50.000', '100.000', '250.000', 'Semua'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => {
                      if (nom === 'Semua') {
                        setActionAmount(selectedPocket.balance.toLocaleString('id-ID'))
                      } else {
                        setActionAmount(nom)
                      }
                    }}
                    className="py-2 rounded-xl border text-[11.5px] font-bold cursor-pointer transition-all bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                  >
                    {nom === 'Semua' ? 'Tarik Semua' : `Rp${nom}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-5">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Nominal Tarik:
              </label>
              <div className="flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-extrabold text-amber-600 mr-2">Rp</span>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setActionAmount(raw ? Number(raw).toLocaleString('id-ID') : '0')
                  }}
                  className="w-full bg-transparent font-black text-[16px] text-[#1A1D26] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleWithdrawSubmit}
              className="w-full h-12 bg-[#047857] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              Kembalikan ke Ala Dompet →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BUAT POCKET BARU                                                */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="absolute inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-[414px] bg-white rounded-t-[32px] max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', padding: '24px 24px 48px 24px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">
                  Buat Pocket Baru
                </h3>
                <p className="text-[11.5px] text-gray-500">
                  Pisahkan uang dari rekening utama untuk tujuan khusus
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Input Nama Pocket */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 block mb-1">
                Nama Pocket:
              </label>
              <input
                type="text"
                value={newPocketName}
                onChange={(e) => setNewPocketName(e.target.value)}
                placeholder="Misal: Jajan Kopi, Bensin & Tol"
                required
                className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[13px] text-[#1A1D26] outline-none focus:border-[#1C20C4]"
              />
            </div>

            {/* Kategori Visual & Gambar */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-gray-500 block mb-2">
                Pilih Kategori &amp; Ikon Gambar:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setNewCategory(cat.category as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                      newCategory === cat.category
                        ? 'border-[#1C20C4] bg-[#EEF2FF] shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: cat.bgColor,
                        color: cat.defaultColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-bold text-[#1A1D26] leading-tight">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Setoran Awal dari Rekening Utama */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-gray-500">
                  Alokasi Awal dari Ala Dompet:
                </label>
                <span className="text-[10.5px] font-bold text-[#1C20C4]">
                  Tersedia: Rp{alaDompet.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <span className="font-extrabold text-[#1C20C4] mr-2">Rp</span>
                <input
                  type="text"
                  value={newInitialDeposit}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setNewInitialDeposit(raw ? Number(raw).toLocaleString('id-ID') : '0')
                  }}
                  className="w-full bg-transparent font-black text-[15px] text-[#1A1D26] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-98 transition-all cursor-pointer mt-2"
            >
              Simpan &amp; Buka Pocket Baru →
            </button>
          </form>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-6 left-5 right-5 z-[200] bg-[#1A1D26] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F3AD] shrink-0" />
          <p className="text-[12px] font-bold leading-tight flex-1">{toastMessage}</p>
        </div>
      )}
    </div>
  )
}
