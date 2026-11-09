'use client'

import { useState, useEffect, useCallback } from 'react'

export interface BankTransaction {
  id: string
  date: string
  time: string
  timestamp: number
  title: string
  description: string
  amount: number
  type: 'debit' | 'kredit'
  category: 'transfer' | 'tagihan' | 'topup' | 'investasi' | 'hijrah' | 'donasi' | 'saudi' | 'lainnya'
  status: 'berhasil' | 'pending' | 'gagal'
  accountNumber?: string
  recipientName?: string
  refNumber: string
}

export interface SarTransaction {
  id: string
  date: string
  time: string
  timestamp: number
  merchant: string
  terminalId: string
  amountSar: number
  amountIdr: number
  type: 'debit' | 'kredit'
  method: string
  refNumber: string
}

export interface BankNotification {
  id: string
  type: 'Transaksi' | 'Promo' | 'Info'
  title: string
  desc: string
  date: string
  time: string
  timestamp: number
  badgeColor: string
  badgeText: string
  icon?: string
}

export interface BankPocket {
  id: string
  name: string
  category: 'makan' | 'belanja' | 'transport' | 'sedekah' | 'hiburan' | 'kesehatan' | 'darurat'
  balance: number
  target?: number
  color: string
  icon: string
  createdAt: number
}

export interface BankState {
  // Balances
  alaDompet: number // IDR
  alaImpianUmroh: number // IDR
  alaDeposito: number // IDR
  dompetSar: number // SAR

  // Ala Pocket (Kantong Harian / Sub-wallets)
  pockets: BankPocket[]

  // Wealth Portfolio
  reksaDanaBalance: number
  emasGrams: number
  emasPricePerGram: number
  depositoTenor: number
  depositoRate: number

  // Transactions & History
  transactions: BankTransaction[]
  sarHistory: SarTransaction[]
  notifications: BankNotification[]

  // Meta
  lastUpdated: number
}

const STORAGE_KEY = 'aladin_bank_state_v1'
const EVENT_NAME = 'aladin_bank_state_updated'

export const DEFAULT_INITIAL_STATE: BankState = {
  alaDompet: 24500000, // Rp24.500.000 (Rekening Utama)
  alaImpianUmroh: 14500000, // Rp14.500.000 (Umrah & Haji)
  alaDeposito: 25000000, // Rp25.000.000 (Ala Deposito Mudharabah)
  dompetSar: 450.0, // SAR 450.00 (Haramain Wallet)

  pockets: [
    {
      id: 'pocket-makan',
      name: 'Makan & Kopi Harian',
      category: 'makan',
      balance: 1250000,
      target: 2000000,
      color: 'linear-gradient(135deg, #1037A6 0%, #1C20C4 100%)',
      icon: 'makan',
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'pocket-belanja',
      name: 'Belanja & Dapur Bulanan',
      category: 'belanja',
      balance: 2500000,
      target: 3500000,
      color: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      icon: 'belanja',
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: 'pocket-sedekah',
      name: 'Sedekah Subuh & Berkah',
      category: 'sedekah',
      balance: 500000,
      target: 1000000,
      color: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      icon: 'sedekah',
      createdAt: Date.now() - 86400000 * 3,
    },
  ],

  reksaDanaBalance: 5250000,
  emasGrams: 2.76,
  emasPricePerGram: 1345000,
  depositoTenor: 12,
  depositoRate: 8.5,

  transactions: [
    {
      id: 'TX-1092',
      date: '06 Nov 2026',
      time: '21:14 WIB',
      timestamp: Date.now() - 3600000 * 2,
      title: 'Pembayaran QRIS Merchant',
      description: 'SPBU Shell Lenteng Agung',
      amount: 100000,
      type: 'debit',
      category: 'tagihan',
      status: 'berhasil',
      refNumber: 'QRIS-77491029',
    },
    {
      id: 'TX-1091',
      date: '06 Nov 2026',
      time: '18:30 WIB',
      timestamp: Date.now() - 3600000 * 5,
      title: 'Transfer Masuk dari Budi Santoso',
      description: 'Transfer BI-FAST dari BCA',
      amount: 400000,
      type: 'kredit',
      category: 'transfer',
      status: 'berhasil',
      recipientName: 'Budi Santoso',
      refNumber: 'BIF-88391024',
    },
    {
      id: 'TX-1090',
      date: '05 Nov 2026',
      time: '14:20 WIB',
      timestamp: Date.now() - 86400000,
      title: 'Bagi Hasil Ala Deposito',
      description: 'Nisbah bagi hasil Mudharabah 8,5% p.a.',
      amount: 141666,
      type: 'kredit',
      category: 'investasi',
      status: 'berhasil',
      refNumber: 'DEP-55192019',
    },
  ],

  sarHistory: [
    {
      id: 'SAR-201',
      date: '06 Nov 2026',
      time: '14:15 AST',
      timestamp: Date.now() - 3600000 * 8,
      merchant: 'Al Baik Restaurant Ajyad',
      terminalId: 'D360-POS #GD-9842',
      amountSar: 32.0,
      amountIdr: 135040,
      type: 'debit',
      method: 'D360 Saudi Network',
      refNumber: 'D360-SA-9812401',
    },
    {
      id: 'SAR-200',
      date: '04 Nov 2026',
      time: '10:00 AST',
      timestamp: Date.now() - 86400000 * 2,
      merchant: 'Nahdi Pharmacy Clock Tower',
      terminalId: 'D360-POS #GD-1024',
      amountSar: 18.0,
      amountIdr: 75960,
      type: 'debit',
      method: 'D360 Saudi Network',
      refNumber: 'D360-SA-4410293',
    },
    {
      id: 'SAR-199',
      date: '01 Nov 2026',
      time: '09:00 AST',
      timestamp: Date.now() - 86400000 * 5,
      merchant: 'Konversi dari Ala Impian Umroh',
      terminalId: 'D360-BPKH-RAIL #SA-7721',
      amountSar: 300.0,
      amountIdr: 1266000,
      type: 'kredit',
      method: 'D360 × BPKH Rail',
      refNumber: 'D360-TX-109248',
    },
  ],

  notifications: [
    {
      id: 'NOTIF-1',
      type: 'Transaksi',
      title: 'Transaksi QRIS Berhasil',
      desc: 'Pembayaran QRIS di SPBU Shell Lenteng Agung sebesar Rp100.000 berhasil didebit dari Ala Dompet.',
      date: '06 Nov 2026',
      time: '21:14 WIB',
      timestamp: Date.now() - 3600000 * 2,
      badgeColor: '#059669',
      badgeText: 'Debit',
    },
    {
      id: 'NOTIF-2',
      type: 'Transaksi',
      title: 'Uang Masuk Berhasil',
      desc: 'Transfer masuk dari Budi Santoso (BCA) sebesar Rp400.000 berhasil diterima di Ala Dompet.',
      date: '06 Nov 2026',
      time: '18:30 WIB',
      timestamp: Date.now() - 3600000 * 5,
      badgeColor: '#1C20C4',
      badgeText: 'Kredit',
    },
    {
      id: 'NOTIF-3',
      type: 'Promo',
      title: 'Diskon JSM 25% di Alfamidi',
      desc: 'Nikmati belanja hemat di seluruh gerai Alfamidi dengan scan barcode member Aladin sebelum pembayaran.',
      date: '06 Nov 2026',
      time: '10:00 WIB',
      timestamp: Date.now() - 3600000 * 12,
      badgeColor: '#EA580C',
      badgeText: 'Promo JSM',
    },
    {
      id: 'NOTIF-4',
      type: 'Info',
      title: 'Akad Mudharabah Deposito Diperbarui',
      desc: 'Nisbah bagi hasil Ala Deposito bulan ini telah diperbarui menjadi ekuivalen 8,5% p.a. resmi diawasi DPS.',
      date: '05 Nov 2026',
      time: '14:20 WIB',
      timestamp: Date.now() - 86400000,
      badgeColor: '#4F46E5',
      badgeText: 'Syariah',
    },
  ],

  lastUpdated: Date.now(),
}

// ----------------------------------------------------------------------
// Core Helper Functions (SSR safe)
// ----------------------------------------------------------------------

export function getBankState(): BankState {
  if (typeof window === 'undefined') {
    return DEFAULT_INITIAL_STATE
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_STATE))
      return DEFAULT_INITIAL_STATE
    }
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_INITIAL_STATE,
      ...parsed,
      pockets: parsed.pockets && parsed.pockets.length > 0 ? parsed.pockets : DEFAULT_INITIAL_STATE.pockets,
    }
  } catch (err) {
    console.error('Failed to parse bank state from localStorage', err)
    return DEFAULT_INITIAL_STATE
  }
}

export function saveBankState(state: BankState): void {
  if (typeof window === 'undefined') return
  try {
    state.lastUpdated = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }))
  } catch (err) {
    console.error('Failed to save bank state to localStorage', err)
  }
}

export function resetBankState(): BankState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
  saveBankState(DEFAULT_INITIAL_STATE)
  return DEFAULT_INITIAL_STATE
}

function formatDateNow(): { dateStr: string; timeStr: string } {
  const d = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())} WIB`
  return { dateStr, timeStr }
}

// ----------------------------------------------------------------------
// Unified Financial Transaction Handlers
// ----------------------------------------------------------------------

/**
 * 1. Transfer Dana (BI-FAST / Antar Aladin / Dari Pocket)
 */
export function executeTransfer(params: {
  bankName: string
  accountNumber: string
  recipientName: string
  amount: number
  fee: number
  note?: string
  sourcePocketId?: string
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  const totalDeduct = params.amount + params.fee

  let sourceName = 'Ala Dompet (Rekening Utama)'
  let targetPocket: BankPocket | undefined

  if (params.sourcePocketId && params.sourcePocketId !== 'ala_dompet') {
    targetPocket = (state.pockets || []).find((p) => p.id === params.sourcePocketId)
    if (!targetPocket) {
      return { success: false, refNumber: '', error: 'Pocket sumber dana tidak ditemukan.' }
    }
    if (targetPocket.balance < totalDeduct) {
      return { success: false, refNumber: '', error: `Saldo Pocket "${targetPocket.name}" tidak mencukupi.` }
    }
    targetPocket.balance -= totalDeduct
    sourceName = `Pocket ${targetPocket.name}`
  } else {
    if (state.alaDompet < totalDeduct) {
      return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
    }
    state.alaDompet -= totalDeduct
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `TRF-${Math.floor(10000000 + Math.random() * 90000000)}`

  const newTx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Transfer ke ${params.bankName}`,
    description: `${params.recipientName} • Rek ${params.accountNumber} (${sourceName})`,
    amount: params.amount,
    type: 'debit',
    category: 'transfer',
    status: 'berhasil',
    accountNumber: params.accountNumber,
    recipientName: params.recipientName,
    refNumber,
  }

  const newNotif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Transfer Keluar Berhasil',
    desc: `Transfer ${params.bankName} sebesar Rp${params.amount.toLocaleString('id-ID')} ke ${params.recipientName} berhasil diproses dari ${sourceName}.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#DC2626',
    badgeText: 'Transfer',
  }

  state.transactions = [newTx, ...state.transactions]
  state.notifications = [newNotif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 1.1 Pocket Management (Ala Pocket - Kantong Harian & Belanja)
 */
export function createPocket(params: {
  name: string
  category: 'makan' | 'belanja' | 'transport' | 'sedekah' | 'hiburan' | 'kesehatan' | 'darurat'
  initialDeposit: number
  color: string
  icon: string
  target?: number
}): { success: boolean; pocket?: BankPocket; error?: string } {
  const state = getBankState()
  if (params.initialDeposit > 0 && state.alaDompet < params.initialDeposit) {
    return { success: false, error: 'Saldo Ala Dompet tidak mencukupi untuk setoran awal.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const pocketId = `pocket-${Date.now()}`
  const newPocket: BankPocket = {
    id: pocketId,
    name: params.name,
    category: params.category,
    balance: params.initialDeposit,
    target: params.target || 0,
    color: params.color,
    icon: params.icon,
    createdAt: Date.now(),
  }

  if (params.initialDeposit > 0) {
    state.alaDompet -= params.initialDeposit
    state.transactions.unshift({
      id: `TX-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      timestamp: Date.now(),
      title: `Alokasi ke Pocket "${params.name}"`,
      description: 'Pemisahan dana dari Rekening Utama ke Pocket',
      amount: params.initialDeposit,
      type: 'debit',
      category: 'transfer',
      status: 'berhasil',
      refNumber: `PCK-${Math.floor(10000000 + Math.random() * 90000000)}`,
    })
  }

  state.pockets = state.pockets || []
  state.pockets.push(newPocket)
  saveBankState(state)
  return { success: true, pocket: newPocket }
}

export function topUpPocket(params: {
  pocketId: string
  amount: number
}): { success: boolean; error?: string } {
  const state = getBankState()
  if (state.alaDompet < params.amount) {
    return { success: false, error: 'Saldo Ala Dompet tidak mencukupi.' }
  }
  const pocket = (state.pockets || []).find((p) => p.id === params.pocketId)
  if (!pocket) return { success: false, error: 'Pocket tidak ditemukan.' }

  const { dateStr, timeStr } = formatDateNow()
  state.alaDompet -= params.amount
  pocket.balance += params.amount

  state.transactions.unshift({
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Isi Saldo Pocket "${pocket.name}"`,
    description: 'Pindah dana dari Rekening Utama (Ala Dompet)',
    amount: params.amount,
    type: 'debit',
    category: 'transfer',
    status: 'berhasil',
    refNumber: `TOP-${Math.floor(10000000 + Math.random() * 90000000)}`,
  })

  saveBankState(state)
  return { success: true }
}

export function withdrawPocket(params: {
  pocketId: string
  amount: number
}): { success: boolean; error?: string } {
  const state = getBankState()
  const pocket = (state.pockets || []).find((p) => p.id === params.pocketId)
  if (!pocket) return { success: false, error: 'Pocket tidak ditemukan.' }
  if (pocket.balance < params.amount) {
    return { success: false, error: 'Saldo Pocket tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  pocket.balance -= params.amount
  state.alaDompet += params.amount

  state.transactions.unshift({
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Tarik dari Pocket "${pocket.name}"`,
    description: 'Kembalikan dana ke Rekening Utama (Ala Dompet)',
    amount: params.amount,
    type: 'kredit',
    category: 'transfer',
    status: 'berhasil',
    refNumber: `WDR-${Math.floor(10000000 + Math.random() * 90000000)}`,
  })

  saveBankState(state)
  return { success: true }
}

export function deletePocket(pocketId: string): { success: boolean } {
  const state = getBankState()
  const pocket = (state.pockets || []).find((p) => p.id === pocketId)
  if (!pocket) return { success: false }

  if (pocket.balance > 0) {
    state.alaDompet += pocket.balance
  }
  state.pockets = (state.pockets || []).filter((p) => p.id !== pocketId)
  saveBankState(state)
  return { success: true }
}

/**
 * 2. Bayar & Beli (Pulsa, PLN, Tagihan)
 */
export function executeBillPayment(params: {
  serviceName: string
  itemTitle: string
  customerId: string
  amount: number
  adminFee?: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  const fee = params.adminFee || 0
  const total = params.amount + fee

  if (state.alaDompet < total) {
    return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `BYR-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet -= total

  const newTx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `${params.serviceName}: ${params.itemTitle}`,
    description: `No. Pelanggan ${params.customerId}`,
    amount: params.amount,
    type: 'debit',
    category: 'tagihan',
    status: 'berhasil',
    refNumber,
  }

  const newNotif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Pembayaran Tagihan Berhasil',
    desc: `Pembayaran ${params.serviceName} ${params.itemTitle} sebesar Rp${params.amount.toLocaleString('id-ID')} berhasil.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Lunas',
  }

  state.transactions = [newTx, ...state.transactions]
  state.notifications = [newNotif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 3. Bayar QRIS (Merchant Indonesia)
 */
export function executeQrisPayment(params: {
  merchantName: string
  nmid: string
  amount: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.alaDompet < params.amount) {
    return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `QRIS-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet -= params.amount

  const newTx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `QRIS: ${params.merchantName}`,
    description: `NMID ${params.nmid}`,
    amount: params.amount,
    type: 'debit',
    category: 'tagihan',
    status: 'berhasil',
    refNumber,
  }

  const newNotif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Transaksi QRIS Berhasil',
    desc: `Pembayaran QRIS di ${params.merchantName} sebesar Rp${params.amount.toLocaleString('id-ID')} berhasil didebit.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Debit',
  }

  state.transactions = [newTx, ...state.transactions]
  state.notifications = [newNotif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 4. Pindah Saldo ke Saudi (IDR -> SAR via D360 × BPKH Rail)
 */
export function convertIdrToSar(params: {
  fundingSource: 'ala_impian' | 'ala_dompet'
  idrAmount: number
  sarRate?: number
}): { success: boolean; sarAdded: number; refNumber: string; error?: string } {
  const state = getBankState()
  const rate = params.sarRate || 4220

  if (params.fundingSource === 'ala_impian') {
    if (state.alaImpianUmroh < params.idrAmount) {
      return { success: false, sarAdded: 0, refNumber: '', error: 'Saldo Ala Impian Umroh tidak cukup.' }
    }
    state.alaImpianUmroh -= params.idrAmount
  } else {
    if (state.alaDompet < params.idrAmount) {
      return { success: false, sarAdded: 0, refNumber: '', error: 'Saldo Ala Dompet tidak cukup.' }
    }
    state.alaDompet -= params.idrAmount
  }

  const sarAdded = parseFloat((params.idrAmount / rate).toFixed(2))
  state.dompetSar = parseFloat((state.dompetSar + sarAdded).toFixed(2))

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `D360-TX-${Math.floor(100000 + Math.random() * 900000)}`

  // SAR transaction
  const sarTx: SarTransaction = {
    id: `SAR-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    merchant: `Konversi dari ${params.fundingSource === 'ala_impian' ? 'Ala Impian Umroh' : 'Ala Dompet'}`,
    terminalId: 'D360-BPKH-RAIL #SA-7721',
    amountSar: sarAdded,
    amountIdr: params.idrAmount,
    type: 'kredit',
    method: 'D360 × BPKH Rail (Zero Markup)',
    refNumber,
  }

  // IDR transaction
  const idrTx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: 'Beli Saldo Riyal Saudi (SAR)',
    description: `Dikonversi ke SAR ${sarAdded.toFixed(2)} via D360 × BPKH`,
    amount: params.idrAmount,
    type: 'debit',
    category: 'saudi',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Konversi Riyal Berhasil',
    desc: `Saldo SAR +${sarAdded.toFixed(2)} berhasil dimuat ke Dompet Saudi dari ${params.fundingSource === 'ala_impian' ? 'Ala Impian' : 'Ala Dompet'}.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'SAR Masuk',
  }

  state.sarHistory = [sarTx, ...state.sarHistory]
  state.transactions = [idrTx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, sarAdded, refNumber }
}

/**
 * 5. Pembayaran di Merchant Saudi (Geidea POS terminal / NFC / QR)
 */
export function paySaudiMerchant(params: {
  merchantName: string
  terminalId: string
  amountSar: number
  method: string
  sarRate?: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.dompetSar < params.amountSar) {
    return { success: false, refNumber: '', error: 'Saldo SAR tidak mencukupi.' }
  }

  const rate = params.sarRate || 4220
  const amountIdr = Math.round(params.amountSar * rate)
  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `GD-SA-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.dompetSar = parseFloat((state.dompetSar - params.amountSar).toFixed(2))

  const sarTx: SarTransaction = {
    id: `SAR-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    merchant: params.merchantName,
    terminalId: params.terminalId,
    amountSar: params.amountSar,
    amountIdr,
    type: 'debit',
    method: params.method,
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Pembayaran di Saudi Sukses',
    desc: `Pembayaran ke ${params.merchantName} sebesar SAR ${params.amountSar.toFixed(2)} via Geidea berhasil.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Saudi Geidea',
  }

  state.sarHistory = [sarTx, ...state.sarHistory]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 6. Pembelian di Ala Hijrah (Kajian / Kuliner / Tiket)
 */
export function buyHijrahItem(params: {
  title: string
  category: string
  price: number
  partner: string
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.alaDompet < params.price) {
    return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `HJR-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet -= params.price

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Ala Hijrah: ${params.title}`,
    description: `${params.category} • Mitra: ${params.partner}`,
    amount: params.price,
    type: 'debit',
    category: 'hijrah',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Pesanan Hijrah Sukses',
    desc: `Pembelian presale ${params.title} sebesar Rp${params.price.toLocaleString('id-ID')} berhasil. E-Ticket tersimpan.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#1C20C4',
    badgeText: 'Ala Hijrah',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 7. Investasi Reksa Dana Syariah
 */
export function investReksaDana(params: {
  productName: string
  manager: string
  amount: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.alaDompet < params.amount) {
    return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `INV-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet -= params.amount
  state.reksaDanaBalance += params.amount

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Beli Reksa Dana: ${params.productName}`,
    description: `${params.manager} • Manajer Investasi Berizin OJK`,
    amount: params.amount,
    type: 'debit',
    category: 'investasi',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Beli Reksa Dana Berhasil',
    desc: `Pembelian ${params.productName} sebesar Rp${params.amount.toLocaleString('id-ID')} berhasil. Portofolio bertambah.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#1C20C4',
    badgeText: 'Investasi',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 8. Jual / Cairkan Reksa Dana (Talangan Qardh T+0)
 */
export function redeemReksaDana(params: {
  productName: string
  amount: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.reksaDanaBalance < params.amount) {
    return { success: false, refNumber: '', error: 'Saldo Reksa Dana tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `QARDH-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.reksaDanaBalance -= params.amount
  state.alaDompet += params.amount

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Pencairan T+0: ${params.productName}`,
    description: 'Dana talangan likuiditas Qardh syariah masuk seketika',
    amount: params.amount,
    type: 'kredit',
    category: 'investasi',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Pencairan T+0 Berhasil',
    desc: `Dana cair Rp${params.amount.toLocaleString('id-ID')} langsung masuk ke Ala Dompet tanpa tunggu 2 hari bursa.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Cair T+0',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 9. Transaksi Emas Digital (Beli / Jual)
 */
export function tradeEmas(params: {
  mode: 'beli' | 'jual'
  grams: number
  pricePerGram: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  const totalCost = Math.round(params.grams * params.pricePerGram)

  if (params.mode === 'beli') {
    if (state.alaDompet < totalCost) {
      return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
    }
    state.alaDompet -= totalCost
    state.emasGrams = parseFloat((state.emasGrams + params.grams).toFixed(3))
  } else {
    if (state.emasGrams < params.grams) {
      return { success: false, refNumber: '', error: 'Gramasi emas Anda tidak mencukupi.' }
    }
    state.emasGrams = parseFloat((state.emasGrams - params.grams).toFixed(3))
    state.alaDompet += totalCost
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `GLD-${Math.floor(10000000 + Math.random() * 90000000)}`

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `${params.mode === 'beli' ? 'Beli' : 'Jual'} Emas Digital`,
    description: `${params.grams} gram emas fisik LBMA murni 99,99%`,
    amount: totalCost,
    type: params.mode === 'beli' ? 'debit' : 'kredit',
    category: 'investasi',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: `${params.mode === 'beli' ? 'Beli' : 'Jual'} Emas Sukses`,
    desc: `Transaksi ${params.grams} gram emas (Rp${totalCost.toLocaleString('id-ID')}) telah dicatat di brankas digital.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#D97706',
    badgeText: 'Emas LBMA',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 10. Donasi & ZISWAF
 */
export function executeDonation(params: {
  title: string
  category: string
  amount: number
  institution: string
  isAnonymous?: boolean
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.alaDompet < params.amount) {
    return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `ZIS-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet -= params.amount

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Donasi: ${params.title}`,
    description: `Penyalur: ${params.institution} (${params.category})`,
    amount: params.amount,
    type: 'debit',
    category: 'donasi',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Donasi Tersalurkan',
    desc: `Infaq/Sedekah Rp${params.amount.toLocaleString('id-ID')} tersalur via ${params.institution}. Semoga berkah.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Sedekah',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 11. Top Up Saldo Ala Impian (Target/Tanpa Target)
 */
export function depositAlaImpian(params: {
  targetPocket: 'umroh' | 'haji' | 'qurban' | 'bebas'
  amount: number
}): { success: boolean; refNumber: string; error?: string } {
  const state = getBankState()
  if (state.alaDompet < params.amount) {
    return { success: false, refNumber: '', error: 'Saldo Ala Dompet tidak mencukupi.' }
  }

  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `IMP-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet -= params.amount
  if (params.targetPocket === 'umroh') {
    state.alaImpianUmroh += params.amount
  }

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: `Nabung Ala Impian: ${params.targetPocket.toUpperCase()}`,
    description: 'Pindah dana otomatis dari Ala Dompet',
    amount: params.amount,
    type: 'debit',
    category: 'lainnya',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Nabung Impian Berhasil',
    desc: `Dana Rp${params.amount.toLocaleString('id-ID')} berhasil ditambahkan ke kantong ${params.targetPocket}.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Impian',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

/**
 * 12. Top Up Saldo Utama Ala Dompet
 */
export function depositAlaDompet(amount: number): { success: boolean; refNumber: string } {
  const state = getBankState()
  const { dateStr, timeStr } = formatDateNow()
  const refNumber = `DEP-${Math.floor(10000000 + Math.random() * 90000000)}`

  state.alaDompet += amount

  const tx: BankTransaction = {
    id: `TX-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    title: 'Top Up Masuk ke Ala Dompet',
    description: 'Setoran dana via Transfer / Alfa / Top Up',
    amount,
    type: 'kredit',
    category: 'topup',
    status: 'berhasil',
    refNumber,
  }

  const notif: BankNotification = {
    id: `NOTIF-${Date.now()}`,
    type: 'Transaksi',
    title: 'Top Up Ala Dompet Berhasil',
    desc: `Dana sebesar Rp${amount.toLocaleString('id-ID')} berhasil ditambahkan ke saldo Ala Dompet Anda.`,
    date: dateStr,
    time: timeStr,
    timestamp: Date.now(),
    badgeColor: '#059669',
    badgeText: 'Top Up',
  }

  state.transactions = [tx, ...state.transactions]
  state.notifications = [notif, ...state.notifications]
  saveBankState(state)

  return { success: true, refNumber }
}

// ----------------------------------------------------------------------
// React Hook for Instant Real-Time State Syncing Across All Pages
// ----------------------------------------------------------------------

export function useBankState() {
  const [state, setState] = useState<BankState>(DEFAULT_INITIAL_STATE)
  const [mounted, setMounted] = useState(false)

  const refreshState = useCallback(() => {
    setState(getBankState())
  }, [])

  useEffect(() => {
    setMounted(true)
    refreshState()

    const handleCustomUpdate = () => refreshState()
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        refreshState()
      }
    }

    window.addEventListener(EVENT_NAME, handleCustomUpdate)
    window.addEventListener('storage', handleStorageUpdate)

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [refreshState])

  return {
    ...state,
    isMounted: mounted,
    totalPortfolio: state.reksaDanaBalance + Math.round(state.emasGrams * state.emasPricePerGram),
    refreshState,
    resetState: resetBankState,
  }
}

