'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBar from '@/components/StatusBar'
import { useBankState, executeTransfer } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'

const POPULAR_BANKS = [
  { id: 'bca', name: 'BCA (Bank Central Asia)', code: '014', color: '#0066AE' },
  { id: 'mandiri', name: 'Bank Mandiri', code: '008', color: '#003366' },
  { id: 'bsi', name: 'Bank Syariah Indonesia (BSI)', code: '451', color: '#00A39D' },
  { id: 'bri', name: 'BRI (Bank Rakyat Indonesia)', code: '002', color: '#00529C' },
  { id: 'bni', name: 'BNI (Bank Negara Indonesia)', code: '009', color: '#F15A24' },
  { id: 'cimb', name: 'CIMB Niaga / CIMB Syariah', code: '022', color: '#ED1B24' },
  { id: 'muamalat', name: 'Bank Muamalat', code: '147', color: '#5B2C82' },
  { id: 'permata', name: 'Permata Bank Syariah', code: '013', color: '#00857C' },
  { id: 'jago', name: 'Bank Jago Syariah', code: '542', color: '#FF7A00' },
  { id: 'seabank', name: 'SeaBank Indonesia', code: '535', color: '#0083FF' },
]

const RECENT_RECIPIENTS = [
  { name: 'Budi Santoso', bank: 'BCA', accNumber: '8920192841', initials: 'BS', bg: '#EFF6FF', text: '#1D4ED8' },
  { name: 'Siti Rahma', bank: 'Mandiri', accNumber: '12001928491', initials: 'SR', bg: '#ECFDF5', text: '#059669' },
  { name: 'Ahmad Fauzi', bank: 'BSI', accNumber: '7192837461', initials: 'AF', bg: '#FAF5FF', text: '#9333EA' },
  { name: 'Dewi Lestari', bank: 'BRI', accNumber: '029381928491', initials: 'DL', bg: '#FFF7ED', text: '#EA580C' },
]

export default function TransferPage() {
  const { alaDompet, pockets = [] } = useBankState()
  const { triggerReaction, showLoader, hideLoader } = useMascot()
  const [selectedSource, setSelectedSource] = useState<string>('ala_dompet')
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false)

  const [transferType, setTransferType] = useState<'bank' | 'aladin'>('bank')
  const [selectedBank, setSelectedBank] = useState(POPULAR_BANKS[0])
  const [showBankModal, setShowBankModal] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [verifiedName, setVerifiedName] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const [transferAmount, setTransferAmount] = useState('50.000')
  const [transferNote, setTransferNote] = useState('')
  const [transferMethod, setTransferMethod] = useState<'bifast' | 'online'>('bifast')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  // Current active source info
  const activePocket = pockets.find((p) => p.id === selectedSource)
  const activeSourceBalance = activePocket ? activePocket.balance : alaDompet
  const activeSourceName = activePocket ? `Pocket: ${activePocket.name}` : 'Ala Dompet (Rekening Utama)'

  // Verify Account Number
  const handleVerifyAccount = () => {
    if (!accountNumber) return
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (transferType === 'aladin') {
        setVerifiedName('MUHAMMAD ALIF RAMADHAN (Aladin)')
      } else {
        const mockNames: Record<string, string> = {
          bca: 'BUDI SANTOSO',
          mandiri: 'SITI RAHMAWATI',
          bsi: 'AHMAD FAUZI SYAHID',
          bri: 'DEWI LESTARI',
        }
        setVerifiedName(mockNames[selectedBank.id] || 'SYAHID ARKAN FASHIHHURROHMAN')
      }
    }, 700)
  }

  // Handle Quick Select
  const handleSelectRecent = (rec: typeof RECENT_RECIPIENTS[0]) => {
    const foundBank = POPULAR_BANKS.find((b) => b.name.includes(rec.bank)) || POPULAR_BANKS[0]
    setSelectedBank(foundBank)
    setAccountNumber(rec.accNumber)
    setVerifiedName(rec.name.toUpperCase())
  }

  const handleOpenConfirm = () => {
    const num = parseInt(transferAmount.replace(/\D/g, '') || '0', 10)
    if (num <= 0) {
      alert('Masukkan nominal transfer yang valid.')
      return
    }
    if (!verifiedName) {
      handleVerifyAccount()
    }
    setShowConfirmModal(true)
  }

  const handleConfirmPin = () => {
    setShowConfirmModal(false)
    setShowPin(true)
  }

  const handlePinSuccess = () => {
    setShowPin(false)
    const num = parseInt(transferAmount.replace(/\D/g, '') || '0', 10)

    const bankName = transferType === 'aladin' ? 'Bank Aladin Syariah' : selectedBank.name
    const recipient = verifiedName || 'SYAHID ARKAN'
    const acc = accountNumber || '8920192841'

    const res = executeTransfer({
      bankName,
      accountNumber: acc,
      recipientName: recipient,
      amount: num,
      fee: 0,
      note: transferNote,
      sourcePocketId: selectedSource === 'ala_dompet' ? undefined : selectedSource,
    })

    if (!res.success) {
      alert(res.error || 'Saldo tidak mencukupi.')
      return
    }

    showLoader('Memproses pengiriman via BI-FAST Rp0...')
    setTimeout(() => {
      hideLoader()
      setReceiptData({
        refNumber: res.refNumber,
        date: '07 Nov 2026 • ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        recipientName: recipient,
        recipientBank: bankName,
        recipientAccount: acc,
        amount: num,
        method: transferType === 'aladin' ? 'Sesama Aladin (Gratis)' : transferMethod === 'bifast' ? 'BI-FAST (Rp0)' : 'Real-time Online (Rp0 Promo)',
        note: transferNote ? `${transferNote} (Sumber: ${activeSourceName})` : `Transfer dari ${activeSourceName}`,
        source: activeSourceName,
      })
      setIsSuccess(true)
      triggerReaction('success', `Transfer Rp${num.toLocaleString('id-ID')} berhasil dikirim!`)
    }, 600)
  }

  const filteredBanks = POPULAR_BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) || b.code.includes(bankSearch)
  )

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
        style={{ height: '46px', paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          href="/beranda"
          className="flex items-center justify-center p-1 -ml-1 active:opacity-60 transition-opacity"
        >
          <Image
            src="/assets/icons/header_back_clean.png"
            alt="Kembali"
            width={16}
            height={16}
            style={{ width: '15.5px', height: '15.5px' }}
            priority
          />
        </Link>

        <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
          Transfer Dana
        </h1>

        <button
          onClick={() => alert('Riwayat Transfer: Semua transaksi transfer Anda tercatat di menu Riwayat.')}
          className="text-[12.5px] font-extrabold text-[#1C20C4] hover:underline cursor-pointer"
        >
          Riwayat
        </button>
      </div>

      {/* 3. Main Scrollable Container (Generous 20px Margins, Block Flow) */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '16px 20px 40px 20px',
        }}
      >
        {/* Source Account / Pocket Selector Card */}
        <div
          onClick={() => setShowSourceModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '16px 18px',
            border: '1.5px solid #C7D2FE',
            boxShadow: '0 2px 10px rgba(28, 32, 196, 0.05)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          className="active:scale-[0.99] transition-transform"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                backgroundColor: activePocket ? '#ECFDF5' : '#EEF2FF',
                color: activePocket ? '#059669' : '#1C20C4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '12px',
              }}
            >
              {activePocket ? 'PKT' : 'IDR'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: '10.5px', color: '#1C20C4', fontWeight: 800, textTransform: 'uppercase' }}>
                  {activePocket ? 'SUMBER DANA: POCKET' : 'SUMBER DANA: REKENING UTAMA'}
                </span>
                <span className="text-[10px] text-gray-400">▼ Ganti</span>
              </div>
              <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#1A1D26', display: 'block', marginTop: '1px' }}>
                {activePocket ? activePocket.name : 'Ala Dompet (0892 1029 4819)'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Saldo Tersedia</span>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#059669' }}>
              Rp{activeSourceBalance.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Transfer Destination Tabs (Bank Lain vs Antar Aladin) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '6px',
            border: '1px solid #ECEEF2',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => {
              setTransferType('bank')
              setVerifiedName(null)
            }}
            style={{
              height: '38px',
              borderRadius: '18px',
              fontSize: '12.5px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: transferType === 'bank' ? '#1C20C4' : 'transparent',
              color: transferType === 'bank' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.2s',
            }}
          >
            Transfer ke Bank Lain
          </button>
          <button
            onClick={() => {
              setTransferType('aladin')
              setVerifiedName(null)
            }}
            style={{
              height: '38px',
              borderRadius: '18px',
              fontSize: '12.5px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: transferType === 'aladin' ? '#1C20C4' : 'transparent',
              color: transferType === 'aladin' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.2s',
            }}
          >
            Antar Rekening Aladin
          </button>
        </div>

        {/* Quick Recent Recipients */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B', letterSpacing: '0.6px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            PENERIMA TERAKHIR
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {RECENT_RECIPIENTS.map((rec) => (
              <button
                key={rec.accNumber}
                onClick={() => handleSelectRecent(rec)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="active:opacity-60 transition-opacity"
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '16px',
                    backgroundColor: rec.bg,
                    color: rec.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 900,
                    marginBottom: '6px',
                  }}
                >
                  {rec.initials}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A1D26', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '64px' }}>
                  {rec.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '9.5px', color: '#64748B', textAlign: 'center' }}>
                  {rec.bank}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Transfer Destination Form Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid #ECEEF2',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1D26', display: 'block', marginBottom: '16px' }}>
            Tujuan Transfer
          </span>

          {/* Select Bank (Only for transfer to other banks) */}
          {transferType === 'bank' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                Bank Tujuan:
              </label>
              <button
                type="button"
                onClick={() => setShowBankModal(true)}
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 16px',
                  borderRadius: '16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #ECEEF2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '999px', backgroundColor: selectedBank.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1D26' }}>
                    {selectedBank.name}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1C20C4' }}>Ubah →</span>
              </button>
            </div>
          )}

          {/* Account Number Input */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              {transferType === 'bank' ? 'Nomor Rekening Tujuan:' : 'Nomor Rekening Aladin / Ponsel:'}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="tel"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value)
                  setVerifiedName(null)
                }}
                placeholder="Contoh: 8920192841"
                style={{
                  flex: 1,
                  height: '46px',
                  padding: '0 16px',
                  borderRadius: '16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #ECEEF2',
                  fontSize: '14px',
                  fontWeight: 800,
                  outline: 'none',
                  color: '#1A1D26',
                  fontFamily: 'monospace',
                }}
              />
              <button
                type="button"
                onClick={handleVerifyAccount}
                disabled={!accountNumber || isVerifying}
                style={{
                  height: '46px',
                  padding: '0 18px',
                  borderRadius: '16px',
                  backgroundColor: verifiedName ? '#ECFDF5' : '#1C20C4',
                  color: verifiedName ? '#059669' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: accountNumber ? 'pointer' : 'not-allowed',
                  opacity: !accountNumber ? 0.6 : 1,
                }}
              >
                {isVerifying ? 'Cek...' : verifiedName ? ' Terverifikasi' : 'Periksa'}
              </button>
            </div>
          </div>

          {/* Verified Account Name Alert */}
          {verifiedName && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                borderRadius: '14px',
                padding: '12px 14px',
                border: '1px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '999px', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900 }}>
                
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', display: 'block', textTransform: 'uppercase' }}>
                  PEMILIK REKENING VALID
                </span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#064E3B' }}>
                  {verifiedName}
                </span>
              </div>
            </div>
          )}

          {/* Nominal Transfer Input */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              Nominal Transfer:
            </label>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '10px 16px',
                border: '1px solid #ECEEF2',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#1C20C4', marginRight: '6px' }}>
                Rp
              </span>
              <input
                type="text"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '20px',
                  fontWeight: 900,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#1A1D26',
                }}
              />
            </div>

            {/* Quick Nominal Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '8px' }}>
              {['50.000', '100.000', '250.000', '500.000'].map((nom) => (
                <button
                  key={nom}
                  type="button"
                  onClick={() => setTransferAmount(nom)}
                  style={{
                    height: '32px',
                    borderRadius: '12px',
                    backgroundColor: transferAmount === nom ? '#EEF2FF' : '#F1F5F9',
                    color: transferAmount === nom ? '#1C20C4' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  +{nom.split('.')[0]}rb
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Note (Optional) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              Catatan Transfer (Opsional):
            </label>
            <input
              type="text"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="Contoh: Bayar tagihan arisan / titip beli"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                borderRadius: '14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #ECEEF2',
                fontSize: '12.5px',
                fontWeight: 600,
                outline: 'none',
                color: '#1A1D26',
              }}
            />
          </div>

          {/* Transfer Method Selector (BI-FAST vs Online) */}
          {transferType === 'bank' && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                Jalur Layanan Transfer:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div
                  onClick={() => setTransferMethod('bifast')}
                  style={{
                    padding: '12px',
                    borderRadius: '16px',
                    border: transferMethod === 'bifast' ? '1.5px solid #1C20C4' : '1px solid #ECEEF2',
                    backgroundColor: transferMethod === 'bifast' ? '#EEF2FF' : '#F8FAFC',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1A1D26', display: 'block' }}>
                    BI-FAST
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', display: 'block', marginTop: '2px' }}>
                    Biaya Rp0 (Gratis)
                  </span>
                </div>

                <div
                  onClick={() => setTransferMethod('online')}
                  style={{
                    padding: '12px',
                    borderRadius: '16px',
                    border: transferMethod === 'online' ? '1.5px solid #1C20C4' : '1px solid #ECEEF2',
                    backgroundColor: transferMethod === 'online' ? '#EEF2FF' : '#F8FAFC',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1A1D26', display: 'block' }}>
                    Real-time Online
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', display: 'block', marginTop: '2px' }}>
                    Bebas Biaya Promo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={handleOpenConfirm}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '999px',
              backgroundColor: '#1C20C4',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(28, 32, 196, 0.25)',
            }}
            className="active:scale-95 transition-all"
          >
            Lanjutkan Transfer →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SOURCE FUND SELECTION MODAL (REKENING UTAMA VS POCKETS)                   */}
      {/* ========================================================================= */}
      {showSourceModal && (
        <div className="absolute inset-0 z-[105] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] px-6 pt-5 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Pilih Sumber Dana</h3>
                <p className="text-[11.5px] text-gray-500">Pilih dari rekening utama atau kantong pengeluaran</p>
              </div>
              <button
                onClick={() => setShowSourceModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {/* Option 1: Rekening Utama (Ala Dompet) */}
              <div
                onClick={() => {
                  setSelectedSource('ala_dompet')
                  setShowSourceModal(false)
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                  selectedSource === 'ala_dompet'
                    ? 'border-[#1C20C4] bg-[#EEF2FF]'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#1C20C4] text-white flex items-center justify-center font-black text-[12px]">
                    IDR
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#1C20C4] uppercase block">
                      REKENING UTAMA
                    </span>
                    <h4 className="text-[14.5px] font-extrabold text-[#1A1D26] mt-0.5">
                      Ala Dompet • 0892 1029 4819
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-bold">Saldo</span>
                  <span className="text-[13.5px] font-black text-[#059669]">
                    Rp{alaDompet.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Sub-header Pockets */}
              <div className="pt-2">
                <span className="text-[10.5px] font-extrabold text-gray-400 uppercase tracking-wider block px-1">
                  PILIH DARI ALA POCKET ({pockets.length})
                </span>
              </div>

              {/* Options: Active Pockets */}
              {pockets.map((pkt) => (
                <div
                  key={pkt.id}
                  onClick={() => {
                    setSelectedSource(pkt.id)
                    setShowSourceModal(false)
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                    selectedSource === pkt.id
                      ? 'border-[#1C20C4] bg-[#EEF2FF]'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-[12px]"
                      style={{ backgroundColor: `${pkt.color}20`, color: pkt.color }}
                    >
                      PKT
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-extrabold uppercase block"
                        style={{ color: pkt.color }}
                      >
                        POCKET {pkt.category.toUpperCase()}
                      </span>
                      <h4 className="text-[14.5px] font-extrabold text-[#1A1D26] mt-0.5">
                        {pkt.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-bold">Saldo</span>
                    <span className="text-[13.5px] font-black text-[#059669]">
                      Rp{pkt.balance.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3.5 border-t border-gray-100 flex justify-between items-center">
              <Link
                href="/pocket"
                className="text-[12.5px] font-extrabold text-[#1C20C4] hover:underline"
              >
                + Kelola / Buat Pocket Baru →
              </Link>
              <button
                onClick={() => setShowSourceModal(false)}
                className="py-2 px-5 rounded-full bg-gray-100 text-gray-700 text-[12.5px] font-bold hover:bg-gray-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BANK SELECTION MODAL                                                      */}
      {/* ========================================================================= */}
      {showBankModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] px-6 pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80%] flex flex-col"
            style={{ boxSizing: 'border-box', paddingBottom: '54px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-1 mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Pilih Bank Tujuan</h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Cari nama bank atau kode..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-gray-100 text-[13px] font-medium outline-none mb-3"
            />

            <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-100">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => {
                    setSelectedBank(bank)
                    setShowBankModal(false)
                    setVerifiedName(null)
                  }}
                  className="w-full py-3 px-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: bank.color }} />
                    <span className="text-[13.5px] font-bold text-[#1A1D26]">{bank.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">{bank.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION BOTTOM SHEET                                                 */}
      {/* ========================================================================= */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] px-6 pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', paddingBottom: '54px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-1 mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Konfirmasi Transfer</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-[#ECEEF2] rounded-2xl p-4 mb-5 space-y-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Sumber Dana:</span>
                <span className="font-bold text-[#1C20C4]">{activeSourceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Bank Tujuan:</span>
                <span className="font-bold text-[#1A1D26]">{transferType === 'aladin' ? 'Bank Aladin Syariah' : selectedBank.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Nomor Rekening:</span>
                <span className="font-mono font-bold text-[#1A1D26]">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Nama Penerima:</span>
                <span className="font-bold text-[#059669]">{verifiedName || 'PENERIMA TERVALIDASI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Biaya Admin:</span>
                <span className="font-bold text-[#059669]">Rp0 (Gratis)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#ECEEF2]">
                <span className="font-extrabold text-[#1A1D26] text-[13px]">Total Transfer:</span>
                <span className="font-extrabold text-[#1C20C4] text-[18px]">Rp{transferAmount}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPin}
              className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Lanjut ke PIN Aladin
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PIN CONFIRMATION MODAL                                                    */}
      {/* ========================================================================= */}
      {showPin && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div
            className="w-full max-w-[414px] bg-white rounded-t-[32px] px-6 pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ boxSizing: 'border-box', paddingBottom: '54px' }}
          >
            {/* Top Drag Handle */}
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-1 mb-4 shrink-0" />

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[17px] font-extrabold text-[#1A1D26]">Masukkan PIN Aladin</h3>
              <button
                onClick={() => setShowPin(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
              >
                ×
              </button>
            </div>
            <p className="text-[12px] text-[#64748B] mb-6">
              Konfirmasi transfer Rp{transferAmount} dari <strong>{activeSourceName}</strong> ke <strong>{verifiedName}</strong>.
            </p>

            {/* 6 Dots PIN with ample margin to NEVER touch button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px',
                marginBottom: '32px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((dot) => (
                <div key={dot} className="w-4 h-4 rounded-full bg-[#1C20C4]" />
              ))}
            </div>

            <button
              onClick={handlePinSuccess}
              className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Konfirmasi &amp; Transfer
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRANSFER SUCCESS RECEIPT                                                  */}
      {/* ========================================================================= */}
      {isSuccess && receiptData && (
        <div className="absolute inset-0 z-[120] bg-white text-[#1A1D26] flex flex-col justify-between p-6">
          <div className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-[20px] font-extrabold text-[#1A1D26]">
              Transfer Berhasil!
            </h2>
            <span className="text-[11px] font-mono text-[#64748B] block mt-1 mb-5">
              Ref: {receiptData.refNumber}
            </span>

            <div className="bg-[#F8FAFC] border border-[#ECEEF2] rounded-2xl p-4 text-left space-y-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Waktu:</span>
                <span className="font-semibold text-[#1A1D26]">{receiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Penerima:</span>
                <span className="font-bold text-[#1A1D26]">{receiptData.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Bank &amp; Rekening:</span>
                <span className="font-mono text-[#1A1D26]">{receiptData.recipientBank} • {receiptData.recipientAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Layanan:</span>
                <span className="font-bold text-[#059669]">{receiptData.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Catatan:</span>
                <span className="italic text-[#1A1D26]">{receiptData.note}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#ECEEF2]">
                <span className="font-extrabold text-[#1A1D26] text-[13px]">Jumlah Transfer:</span>
                <span className="font-extrabold text-[#1C20C4] text-[18px]">
                  Rp{receiptData.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => alert('Struk transfer resmi berhasil disimpan!')}
              className="w-full h-[46px] bg-[#EEF2FF] text-[#1C20C4] rounded-full font-extrabold text-[13.5px] border border-[#C7D2FE] active:scale-95 transition-all"
            >
              Bagikan Bukti Transfer
            </button>
            <Link
              href="/beranda"
              className="w-full h-[48px] bg-[#1C20C4] text-white rounded-full font-extrabold text-[14px] flex items-center justify-center shadow-lg active:scale-95 transition-all"
            >
              Selesai &amp; Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

