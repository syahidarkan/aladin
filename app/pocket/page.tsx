'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import {
  useBankState,
  createPocket,
  topUpPocket,
  withdrawPocket,
  deletePocket,
  BankPocket,
} from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  MoreHorizontal,
  FileText,
  Eye,
  EyeOff,
  Plus,
  Lock,
  Unlock,
  ArrowUp,
  Target,
  Search,
  SlidersHorizontal,
  Home,
  UtensilsCrossed,
  Palmtree,
  ShieldAlert,
  Users,
  Wallet,
  Check,
  X,
  ChevronRight,
  Share2,
  Coins,
} from 'lucide-react'

// Extended UI Pocket interface
interface JagoPocketItem {
  id: string
  name: string
  balance: number
  type: 'main' | 'spending' | 'savings' | 'emergency'
  badge: string
  iconName: 'main' | 'food' | 'renovation' | 'vacation' | 'emergency'
  targetAmount?: number
  sharedCount?: number
  isLocked?: boolean
}

export default function PocketsPage() {
  const router = useRouter()
  const { alaDompet, pockets = [] } = useBankState()
  const { triggerReaction, startTransition } = useMascot()

  // Active View: 'list' (File 3) vs 'detail' (File 4: Rincian Kantong)
  const [activeView, setActiveView] = useState<'list' | 'detail'>('list')
  const [selectedPocket, setSelectedPocket] = useState<JagoPocketItem | null>(null)

  // Filter Pills: 'all' | 'my' | 'shared'
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'shared'>('all')

  // Eye toggle to hide balance
  const [isMasked, setIsMasked] = useState(false)

  // Search in detail view
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTambahUangModal, setShowTambahUangModal] = useState(false)
  const [showPindahkanModal, setShowPindahkanModal] = useState(false)
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [actionAmount, setActionAmount] = useState('500.000')

  // Add Pocket Form State
  const [newPocketName, setNewPocketName] = useState('')
  const [newPocketType, setNewPocketType] = useState<'spending' | 'savings' | 'emergency'>('spending')
  const [newInitialDeposit, setNewInitialDeposit] = useState('100.000')

  // Default initial pockets matching Bank Jago File 3 1:1
  const [pocketList, setPocketList] = useState<JagoPocketItem[]>([
    {
      id: 'main-pocket',
      name: 'Main Pocket',
      balance: alaDompet > 0 ? alaDompet : 5000000,
      type: 'main',
      badge: 'Main Pocket',
      iconName: 'main',
    },
    {
      id: 'food-pocket',
      name: 'Food',
      balance: 80000,
      type: 'spending',
      badge: 'Spending Pocket',
      iconName: 'food',
    },
    {
      id: 'renovation-pocket',
      name: 'Renovation',
      balance: 50000000,
      targetAmount: 100000000,
      type: 'savings',
      badge: 'Savings Pocket',
      iconName: 'renovation',
    },
    {
      id: 'vacation-pocket',
      name: 'Vacation',
      balance: 25000000,
      sharedCount: 5,
      type: 'savings',
      badge: 'Savings Pocket',
      iconName: 'vacation',
    },
    {
      id: 'emergency-pocket',
      name: 'Emergency',
      balance: 8000000,
      type: 'emergency',
      badge: 'Saving Pocket',
      iconName: 'emergency',
    },
  ])

  // Computed total balance
  const totalBalance = pocketList.reduce((acc, p) => acc + p.balance, 0)

  // Filtered pockets
  const filteredPockets = pocketList.filter((p) => {
    if (activeFilter === 'my') return p.type !== 'savings' || !p.sharedCount
    if (activeFilter === 'shared') return Boolean(p.sharedCount)
    return true
  })

  // Handlers
  const handleOpenDetail = (pocket: JagoPocketItem) => {
    setSelectedPocket(pocket)
    setActiveView('detail')
  }

  const handleCreatePocket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPocketName.trim()) return

    const raw = parseInt(newInitialDeposit.replace(/\D/g, '') || '0', 10)
    if (raw > alaDompet) {
      alert('Saldo Ala Dompet tidak mencukupi untuk setoran awal ini.')
      return
    }

    const newPocket: JagoPocketItem = {
      id: `pocket-${Date.now()}`,
      name: newPocketName.trim(),
      balance: raw,
      type: newPocketType,
      badge: newPocketType === 'spending' ? 'Spending Pocket' : newPocketType === 'savings' ? 'Savings Pocket' : 'Saving Pocket',
      iconName: newPocketType === 'spending' ? 'food' : newPocketType === 'savings' ? 'renovation' : 'emergency',
    }

    setPocketList((prev) => [...prev, newPocket])
    setShowAddModal(false)
    setNewPocketName('')
    triggerReaction('success', `Pocket "${newPocket.name}" berhasil dibuat!`)
  }

  const handleTambahUangSubmit = () => {
    if (!selectedPocket) return
    const raw = parseInt(actionAmount.replace(/\D/g, '') || '0', 10)
    if (raw <= 0) return
    if (raw > alaDompet) {
      alert('Saldo Ala Dompet tidak mencukupi.')
      return
    }

    setPocketList((prev) =>
      prev.map((p) => (p.id === selectedPocket.id ? { ...p, balance: p.balance + raw } : p))
    )
    setSelectedPocket((prev) => (prev ? { ...prev, balance: prev.balance + raw } : null))
    setShowTambahUangModal(false)
    triggerReaction('success', `Berhasil menambahkan Rp${raw.toLocaleString('id-ID')} ke ${selectedPocket.name}!`)
  }

  const handlePindahkanSubmit = () => {
    if (!selectedPocket) return
    const raw = parseInt(actionAmount.replace(/\D/g, '') || '0', 10)
    if (raw <= 0) return
    if (raw > selectedPocket.balance) {
      alert('Saldo di Pocket ini tidak mencukupi untuk dipindahkan.')
      return
    }

    setPocketList((prev) =>
      prev.map((p) => (p.id === selectedPocket.id ? { ...p, balance: p.balance - raw } : p))
    )
    setSelectedPocket((prev) => (prev ? { ...prev, balance: prev.balance - raw } : null))
    setShowPindahkanModal(false)
    triggerReaction('success', `Rp${raw.toLocaleString('id-ID')} berhasil dipindahkan ke Rekening Utama!`)
  }

  const handleToggleLock = () => {
    if (!selectedPocket) return
    const next = !selectedPocket.isLocked
    setPocketList((prev) =>
      prev.map((p) => (p.id === selectedPocket.id ? { ...p, isLocked: next } : p))
    )
    setSelectedPocket((prev) => (prev ? { ...prev, isLocked: next } : null))
    if (next) {
      triggerReaction('lock-action', `Pocket "${selectedPocket.name}" berhasil dikunci demi disiplin menabung!`)
    } else {
      triggerReaction('success', `Kunci Pocket "${selectedPocket.name}" berhasil dibuka.`)
    }
  }

  // Render Category Icon Helper
  const renderPocketIcon = (iconName: JagoPocketItem['iconName'], isLarge = false) => {
    const sizeCls = isLarge ? 'w-8 h-8' : 'w-6 h-6'
    switch (iconName) {
      case 'main':
        return <Wallet className={`${sizeCls} text-[#1037A6] stroke-[2.2]`} />
      case 'food':
        return <UtensilsCrossed className={`${sizeCls} text-[#059669] stroke-[2.2]`} />
      case 'renovation':
        return <Home className={`${sizeCls} text-[#1037A6] stroke-[2.2]`} />
      case 'vacation':
        return <Palmtree className={`${sizeCls} text-teal-600 stroke-[2.2]`} />
      case 'emergency':
        return <ShieldAlert className={`${sizeCls} text-rose-600 stroke-[2.2]`} />
      default:
        return <Coins className={`${sizeCls} text-[#1037A6] stroke-[2.2]`} />
    }
  }

  // Mock transactions for detail view
  const mockTransactions = [
    {
      id: 1,
      name: 'Kantong Utama',
      date: '17 Okt 2026',
      amount: '+Rp500.000',
      note: 'Tabungan',
      isPlus: true,
      month: 'OKT 2026',
    },
    {
      id: 2,
      name: 'Top Up Auto-Debit',
      date: '02 Okt 2026',
      amount: '+Rp1.000.000',
      note: 'Nabung Rutin',
      isPlus: true,
      month: 'OKT 2026',
    },
    {
      id: 3,
      name: 'Kantong Utama',
      date: '25 Sep 2026',
      amount: '+Rp500.000',
      note: 'Tabungan',
      isPlus: true,
      month: 'SEP 2026',
    },
  ]

  return (
    <div
      className="flex flex-col min-h-screen bg-[#FBFBFA] select-none text-[#1A1D26] overflow-x-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 0. Top Status Bar (Prevents notch clipping) */}
      <StatusBar time="22.25" batteryLevel={33} dark={false} />

      {/* ========================================================================= */}
      {/* VIEW 1: MAIN POCKETS 2-COLUMN VIEW                                        */}
      {/* ========================================================================= */}
      {activeView === 'list' && (
        <div className="flex flex-col flex-1">
          {/* 1. TOP HEADER with proper breathing room */}
          <header className="sticky top-0 z-30 w-full bg-[#FBFBFA]/95 backdrop-blur-md flex items-center justify-between px-5 pt-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Link
                href="/beranda"
                className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-200/60 active:scale-95 transition-all cursor-pointer"
                aria-label="Kembali ke Beranda"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
              </Link>
              <h1 className="text-[24px] font-black text-[#1037A6] tracking-tight">
                Ala Pocket
              </h1>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => alert('Opsi Ala Pocket: Atur urutan kantong, ekspor mutasi, atau hubungkan kartu visa.')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => triggerReaction('success', 'Membuka e-Statement mutasi kantong...')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-5 pt-2 pb-32">
            {/* 2. FILTER PILLS: All, My Pockets, Shared with me (File 3) */}
            <div className="flex items-center gap-2 mb-4">
              {[
                { id: 'all', label: 'All' },
                { id: 'my', label: 'My Pockets' },
                { id: 'shared', label: 'Shared with me' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`py-1.5 px-4 rounded-full text-[12.5px] font-bold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-gray-200/80 text-gray-900 shadow-xs'
                      : 'bg-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3. TOTAL BALANCE ROW: My balance Rp88.080.000 with Eye Icon (File 3) */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[13.5px] font-bold text-gray-900">
                My balance
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[14px] font-black text-gray-900 font-mono tracking-tight">
                  {isMasked ? '••••••••' : `Rp${totalBalance.toLocaleString('id-ID')}`}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMasked(!isMasked)}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. 2-COLUMN GRID OF POCKET CARDS (Bank Jago File 3 Exact Match) */}
            <div className="grid grid-cols-2 gap-3.5">
              {filteredPockets.map((pocket) => (
                <div
                  key={pocket.id}
                  onClick={() => handleOpenDetail(pocket)}
                  className="bg-white rounded-[22px] p-4 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.98] flex flex-col justify-between min-h-[148px] relative overflow-hidden"
                >
                  {/* Top: Icon + Optional Circular Progress or Shared Badge */}
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      {/* Renovation Circular Progress Ring */}
                      {pocket.targetAmount && (
                        <div className="absolute -inset-1 rounded-full border-2 border-[#00F0A0] border-t-transparent animate-spin-slow pointer-events-none" />
                      )}
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {renderPocketIcon(pocket.iconName)}
                      </div>
                    </div>

                    {/* Shared Badge (Vacation Shared 5 - File 3) */}
                    {pocket.sharedCount && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span>{pocket.sharedCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Name, Balance & Badge */}
                  <div className="mt-3">
                    <h3 className="text-[13.5px] font-bold text-[#1A1D26] leading-tight">
                      {pocket.name}
                    </h3>
                    <span className="text-[13px] font-black text-gray-900 block mt-1 font-mono">
                      {isMasked ? '••••••••' : `Rp${pocket.balance.toLocaleString('id-ID')}`}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                      {pocket.badge}
                    </span>
                  </div>
                </div>
              ))}

              {/* CARD 6: ADD POCKET BUTTON CARD (Bank Aladin Blue & Cyan) */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="rounded-[22px] p-4 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-all cursor-pointer active:scale-[0.98] flex flex-col items-center justify-center min-h-[148px] text-center"
              >
                <div className="w-11 h-11 rounded-full bg-[#1037A6] text-[#00F0A0] flex items-center justify-center shadow-md mb-2.5">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[13.5px] font-bold text-[#1037A6]">
                  Tambah Kantong
                </span>
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: POCKET DETAIL VIEW - "RINCIAN KANTONG"                            */}
      {/* ========================================================================= */}
      {activeView === 'detail' && selectedPocket && (
        <div className="flex flex-col flex-1 animate-in fade-in duration-200">
          {/* Top Header: ← Back, Rincian Kantong, Undang button, ••• */}
          <header className="sticky top-0 z-30 w-full bg-[#FBFBFA]/95 backdrop-blur-md flex items-center justify-between px-4 h-14 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
              </button>
              <h1 className="text-[16.5px] font-bold text-[#1A1D26]">
                Rincian Kantong
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerReaction('success', `Tautan undangan Pocket "${selectedPocket.name}" disalin!`)}
                className="py-1.5 px-4 rounded-full bg-[#1037A6] hover:bg-[#0D2D88] text-white text-[12px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Undang
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Tutup Pocket "${selectedPocket.name}"? Saldo akan dikembalikan ke Rekening Utama.`)) {
                    setPocketList((prev) => prev.filter((p) => p.id !== selectedPocket.id))
                    setActiveView('list')
                    triggerReaction('success', 'Pocket berhasil ditutup.')
                  }
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-5 pt-5 pb-32">
            {/* HERO CENTER: Large Icon, Subtitle, Pocket Name, Big Balance */}
            <div className="flex flex-col items-center justify-center text-center py-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
                {renderPocketIcon(selectedPocket.iconName, true)}
              </div>

              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                {selectedPocket.badge}
              </span>
              <h2 className="text-[22px] font-black text-[#1A1D26] mt-0.5 tracking-tight">
                {selectedPocket.name}
              </h2>
              <span className="text-[28px] font-black text-[#1037A6] mt-1 font-mono tracking-tight">
                Rp{selectedPocket.balance.toLocaleString('id-ID')}
              </span>
            </div>

            {/* 3 CIRCULAR ACTION BUTTONS: Tambah Uang, Pindahkan Uang, Kirim & Bayar (Bank Aladin Blue) */}
            <div className="grid grid-cols-3 gap-3 my-6 max-w-[320px] mx-auto text-center">
              {/* Button 1: Tambah Uang */}
              <button
                type="button"
                onClick={() => setShowTambahUangModal(true)}
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#1037A6] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0D2D88] transition-colors">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[12px] font-bold text-[#1A1D26] mt-2">
                  Tambah Uang
                </span>
              </button>

              {/* Button 2: Pindahkan Uang */}
              <button
                type="button"
                onClick={() => setShowPindahkanModal(true)}
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#1037A6] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0D2D88] transition-colors">
                  <ArrowUp className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[12px] font-bold text-[#1A1D26] mt-2">
                  Pindahkan Uang
                </span>
              </button>

              {/* Button 3: Kirim & Bayar */}
              <button
                type="button"
                onClick={() => {
                  startTransition('/transfer')
                  router.push('/transfer')
                }}
                className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#1037A6] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0D2D88] transition-colors">
                  <Lock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[12px] font-bold text-[#1A1D26] mt-2">
                  Kirim & Bayar
                </span>
              </button>
            </div>

            {/* SECTION: OPSI TAMBAHAN (Kunci Kantong, Buat Target - File 4) */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#1A1D26]">
                  Opsi Tambahan
                </span>
                <Plus className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>

              <div className="space-y-2.5">
                {/* Row 1: Kunci Kantong */}
                <div
                  onClick={handleToggleLock}
                  className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                      {selectedPocket.isLocked ? <Lock className="w-5 h-5 text-red-500" /> : <Unlock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#1A1D26]">
                        {selectedPocket.isLocked ? 'Kunci Kantong (Aktif)' : 'Kunci Kantong'}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {selectedPocket.isLocked ? 'Disiplin mengunci saldo sampai target tercapai' : 'Kunci saldo untuk cegah belanja impulsif'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                {/* Row 2: Buat Target */}
                <div
                  onClick={() => setShowTargetModal(true)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#1A1D26]">
                        {selectedPocket.targetAmount ? `Target: Rp${selectedPocket.targetAmount.toLocaleString('id-ID')}` : 'Buat Target'}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Tentukan target tabungan dan batas waktu
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* SECTION: SEARCH TRANSAKSI & RIWAYAT (File 4) */}
            <div className="mt-8">
              {/* Search Bar with filter icon */}
              <div className="relative flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari transaksi"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 border-none text-[13px] text-[#1A1D26] placeholder-gray-400 outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Transactions List Grouped by Month */}
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    OKT 2026
                  </span>
                  <div className="bg-white rounded-2xl p-3 border border-gray-100 divide-y divide-gray-100">
                    {mockTransactions.slice(0, 2).map((tx) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center">
                            <Wallet className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div>
                            <h5 className="text-[13px] font-bold text-[#1A1D26]">{tx.name}</h5>
                            <span className="text-[11px] text-gray-400">{tx.date}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[13px] font-extrabold text-[#059669] block font-mono">
                            {tx.amount}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {tx.note}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    SEP 2026
                  </span>
                  <div className="bg-white rounded-2xl p-3 border border-gray-100">
                    <div className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1037A6] flex items-center justify-center">
                          <Wallet className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <h5 className="text-[13px] font-bold text-[#1A1D26]">Kantong Utama</h5>
                          <span className="text-[11px] text-gray-400">25 Sep 2026</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[13px] font-extrabold text-[#059669] block font-mono">
                          +Rp500.000
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Tabungan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD POCKET (CREATE FORM)                                        */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-extrabold text-[#1A1D26]">Buat Pocket Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePocket} className="my-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nama Pocket
                </label>
                <input
                  type="text"
                  value={newPocketName}
                  onChange={(e) => setNewPocketName(e.target.value)}
                  placeholder="Misal: Belanja Bulanan / Kopi"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[14px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Kategori Pocket
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'spending', label: 'Spending' },
                    { id: 'savings', label: 'Savings' },
                    { id: 'emergency', label: 'Emergency' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewPocketType(cat.id as any)}
                      className={`py-2 rounded-xl text-[11.5px] font-bold border transition-all cursor-pointer ${
                        newPocketType === cat.id
                          ? 'bg-[#1037A6]/10 border-[#1037A6] text-[#1037A6]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Setoran Awal (Rp)
                </label>
                <input
                  type="text"
                  value={newInitialDeposit}
                  onChange={(e) => setNewInitialDeposit(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[14px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
                <span className="text-[10.5px] text-gray-400 mt-1 block">
                  Dari Ala Dompet (Tersedia: Rp{alaDompet.toLocaleString('id-ID')})
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
              >
                Buat Pocket Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH UANG (TOP UP)                                            */}
      {/* ========================================================================= */}
      {showTambahUangModal && selectedPocket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                Tambah Uang ke {selectedPocket.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowTambahUangModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl text-[12px] text-[#1037A6] flex justify-between items-center border border-blue-100">
                <span>Dari Ala Dompet:</span>
                <span className="font-bold">Rp{alaDompet.toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Tambah (Rp)
                </label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[15px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['100.000', '250.000', '500.000'].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setActionAmount(nom)}
                    className="py-1.5 rounded-lg border border-gray-200 hover:border-[#1037A6] text-[11px] font-bold text-gray-700 active:scale-95 transition-all cursor-pointer"
                  >
                    Rp{nom}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTambahUangSubmit}
              className="w-full py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Konfirmasi Tambah Uang
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PINDAHKAN UANG (WITHDRAW)                                       */}
      {/* ========================================================================= */}
      {showPindahkanModal && selectedPocket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                Pindahkan ke Ala Dompet
              </h3>
              <button
                type="button"
                onClick={() => setShowPindahkanModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl text-[12px] text-gray-800 flex justify-between items-center">
                <span>Saldo Pocket Tersedia:</span>
                <span className="font-bold">Rp{selectedPocket.balance.toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Pindahkan (Rp)
                </label>
                <input
                  type="text"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[15px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePindahkanSubmit}
              className="w-full py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Pindahkan ke Rekening Utama
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: BUAT TARGET TABUNGAN                                             */}
      {/* ========================================================================= */}
      {showTargetModal && selectedPocket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-[16px] font-extrabold text-[#1A1D26]">
                Target {selectedPocket.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowTargetModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Nominal Target Akhir (Rp)
                </label>
                <input
                  type="text"
                  defaultValue="100.000.000"
                  id="targetInput"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[15px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Batas Waktu (Tenggat)
                </label>
                <input
                  type="date"
                  defaultValue="2027-12-31"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 font-bold text-[13px] text-[#1A1D26] focus:border-[#1037A6] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const val = (document.getElementById('targetInput') as HTMLInputElement)?.value
                const raw = parseInt(val?.replace(/\D/g, '') || '100000000', 10)
                setSelectedPocket((prev) => (prev ? { ...prev, targetAmount: raw } : null))
                setPocketList((prev) =>
                  prev.map((p) => (p.id === selectedPocket.id ? { ...p, targetAmount: raw } : p))
                )
                setShowTargetModal(false)
                triggerReaction('success', 'Target tabungan berhasil disimpan!')
              }}
              className="w-full py-3 rounded-xl bg-[#1037A6] hover:bg-[#0D2D88] text-white font-extrabold text-[13px] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/25"
            >
              Simpan Target
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
