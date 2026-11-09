'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { useBankState, depositAlaDompet } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  Store,
  ArrowRightLeft,
  ShieldCheck,
  Copy,
  Check,
  Info,
  QrCode,
  Building2,
  CheckCircle2,
  Wallet,
} from 'lucide-react'

export default function SetorTunaiPage() {
  const router = useRouter()
  const { alaDompet } = useBankState()
  const { triggerReaction } = useMascot()

  const [activeTab, setActiveTab] = useState<'alfa' | 'transfer'>('alfa')
  const [selectedNominal, setSelectedNominal] = useState<number>(500000)
  const [showBarcode, setShowBarcode] = useState(false)
  const [depositSuccess, setDepositSuccess] = useState(false)
  const [copiedVa, setCopiedVa] = useState(false)
  const [copiedRek, setCopiedRek] = useState(false)

  const handleCreateSetorCode = () => {
    setShowBarcode(true)
    setDepositSuccess(false)
    triggerReaction('success', `Kode setor tunai Rp${selectedNominal.toLocaleString('id-ID')} siap ditunjukkan ke kasir!`)
  }

  const handleSimulateCashierDeposit = () => {
    const res = depositAlaDompet(selectedNominal)
    if (res.success) {
      setDepositSuccess(true)
      triggerReaction('success', `Alhamdulillah! Setor tunai Rp${selectedNominal.toLocaleString('id-ID')} berhasil masuk ke Ala Dompet!`)
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-[#F8FAFC] select-none text-[#1A1D26] overflow-x-hidden relative"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. TOP NATIVE HEADER BAR (Seamless White Header) */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shrink-0">
        <StatusBar className="bg-white" />
        <div className="w-full h-14 bg-white flex items-center justify-between px-4">
          <Link
            href="/beranda"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1D26]" />
          </Link>

          <h1 className="text-[17px] font-bold text-[#1A1D26] tracking-tight">
            Setor Tunai
          </h1>

          <button
            type="button"
            onClick={() => alert('Setor tunai ke rekening Ala Dompet di Alfamart gratis biaya admin tanpa batas nominal!')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info Setor Tunai"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <main className="flex-1 px-4 pt-4 pb-32 space-y-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-[#1037A6] to-[#0A236E] rounded-2xl p-4.5 text-white shadow-xs">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">
            Rekening Tujuan: Ala Dompet
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-[24px] font-black tracking-tight font-mono">
              Rp{alaDompet.toLocaleString('id-ID')},00
            </span>
            <span className="text-[10.5px] font-extrabold bg-[#00F0A0] text-[#0A236E] px-2.5 py-0.5 rounded-full">
              Bebas Admin
            </span>
          </div>
          <span className="text-[11.5px] text-blue-100 mt-2 block font-medium">
            a.n. <strong className="text-white">Dewan Juri IMOTION 2026</strong>
          </span>
        </div>

        {/* Channel Segmented Tabs */}
        <div className="flex bg-gray-200/70 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('alfa')
              setShowBarcode(false)
              setDepositSuccess(false)
            }}
            className={`flex-1 py-2 rounded-xl text-[12.5px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'alfa'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Store className="w-4 h-4 text-[#ED1C24]" />
            <span>Kasir Alfamart</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-2 rounded-xl text-[12.5px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'transfer'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-[#1037A6]" />
            <span>Transfer Bank / VA</span>
          </button>
        </div>

        {/* TAB 1: ALFAMART FLOW */}
        {activeTab === 'alfa' && (
          <div className="space-y-4">
            {depositSuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                <div className="w-14 h-14 bg-[#059669] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-[18px] font-black text-emerald-950">
                    Setor Tunai Berhasil!
                  </h4>
                  <p className="text-[12.5px] text-emerald-700 mt-1 leading-relaxed">
                    Uang tunai <strong className="font-mono">Rp{selectedNominal.toLocaleString('id-ID')}</strong> telah masuk ke rekening Ala Dompet. Saldo saat ini: <strong className="font-mono">Rp{alaDompet.toLocaleString('id-ID')}</strong>.
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDepositSuccess(false)
                      setShowBarcode(false)
                    }}
                    className="flex-1 py-3 bg-[#059669] text-white font-extrabold text-[13px] rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Setor Lagi
                  </button>
                  <Link
                    href="/beranda"
                    className="flex-1 py-3 bg-white border border-emerald-300 text-emerald-900 font-extrabold text-[13px] rounded-xl text-center hover:bg-emerald-100/50 transition-all cursor-pointer"
                  >
                    Ke Beranda
                  </Link>
                </div>
              </div>
            ) : !showBarcode ? (
              <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs space-y-4">
                <div>
                  <h3 className="text-[15px] font-black text-gray-900">
                    Pilih Nominal Setor Tunai
                  </h3>
                  <p className="text-[11.5px] text-gray-500 mt-0.5">
                    Uang tunai akan langsung masuk detik itu juga ke saldo Ala Dompet.
                  </p>
                </div>

                {/* Nominal Presets */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[100000, 250000, 500000, 1000000, 2000000, 5000000].map((nom) => (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => setSelectedNominal(nom)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedNominal === nom
                          ? 'border-[#1037A6] bg-blue-50/60 ring-1 ring-[#1037A6]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Nominal</span>
                      <span className="text-[15px] font-black text-gray-900 font-mono">
                        Rp{nom.toLocaleString('id-ID')}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#059669] shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-900">
                    Bebas biaya admin &amp; tanpa batas jumlah transaksi per hari.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCreateSetorCode}
                  className="w-full py-3.5 bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[14px] rounded-xl active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/20"
                >
                  Buat Barcode Setor (Rp{selectedNominal.toLocaleString('id-ID')})
                </button>
              </div>
            ) : (
              /* BARCODE SCREEN */
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#ED1C24]" />
                    <span className="text-[12px] font-black text-gray-800">Kasir Alfamart / Midi</span>
                  </div>
                  <span className="text-[10.5px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
                    Siap Discan
                  </span>
                </div>

                {/* Barcode Display */}
                <div className="py-4 px-3 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center">
                  <div className="w-48 h-20 bg-white border border-gray-300 rounded-lg p-2 flex items-center justify-center shadow-xs">
                    {/* Visual Barcode bars */}
                    <div className="w-full h-full flex items-center justify-between px-1">
                      {[3, 1, 4, 2, 1, 5, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3].map((w, i) => (
                        <div
                          key={i}
                          className="bg-gray-900 h-full rounded-2xs"
                          style={{ width: `${w * 2}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[18px] font-black text-[#1037A6] font-mono tracking-widest mt-2 block">
                    9478 2450 0081 2931
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Atas Nama: <strong>DEWAN JURI IMOTION 2026</strong>
                  </span>
                </div>

                {/* Steps */}
                <div className="text-left space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide block">
                    Cara Setor Tunai di Kasir:
                  </span>
                  <ol className="text-[11.5px] text-gray-600 space-y-1.5 list-decimal pl-4">
                    <li>Sampaikan ke kasir ingin <strong>Setor Tunai Bank Aladin</strong>.</li>
                    <li>Tunjukkan barcode atau sebutkan nomor rekening di atas.</li>
                    <li>Serahkan uang tunai <strong>Rp{selectedNominal.toLocaleString('id-ID')}</strong> ke kasir.</li>
                    <li>Kasir mengonfirmasi dan saldo langsung bertambah seketika.</li>
                  </ol>
                </div>

                {/* Instant Simulation Button */}
                <button
                  type="button"
                  onClick={handleSimulateCashierDeposit}
                  className="w-full py-3.5 bg-[#059669] hover:bg-emerald-700 text-white font-black text-[13.5px] rounded-xl active:scale-98 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Simulasikan Kasir Selesai Memproses (+Rp{selectedNominal.toLocaleString('id-ID')})
                </button>

                <button
                  type="button"
                  onClick={() => setShowBarcode(false)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[12px] rounded-xl transition-all cursor-pointer"
                >
                  Ubah Nominal
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRANSFER / VA */}
        {activeTab === 'transfer' && (
          <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-[15px] font-black text-gray-900">
                Transfer Antar Bank (BI-FAST)
              </h3>
              <p className="text-[11.5px] text-gray-500 mt-0.5">
                Transfer dari BCA, Mandiri, BRI, BSI, atau bank lain ke rekening Aladin.
              </p>
            </div>

            {/* Bank info */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-[11.5px] text-gray-500 font-medium">Bank Tujuan:</span>
                <span className="text-[13px] font-black text-[#1037A6]">Bank Aladin Syariah (947)</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Nomor Rekening Ala Dompet
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[18px] font-black text-gray-900 font-mono">
                    0812-3456-7890
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('081234567890')
                      setCopiedRek(true)
                      setTimeout(() => setCopiedRek(false), 2000)
                    }}
                    className="px-3 py-1 bg-blue-50 text-[#1037A6] rounded-lg text-[11px] font-black hover:bg-blue-100 transition-all cursor-pointer"
                  >
                    {copiedRek ? 'Tersalin ✓' : 'Salin'}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Nama Pemilik Rekening
                </span>
                <span className="text-[14px] font-black text-gray-900 block mt-0.5">
                  DEWAN JURI IMOTION 2026
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11.5px] text-gray-700 space-y-1">
              <span className="font-extrabold text-[#1037A6] block">Tips Transfer Hemat:</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Pilih metode <strong>BI-FAST</strong> di aplikasi m-banking bank pengirim untuk biaya transfer termurah (Rp2.500 atau gratis sesuai promo bank pengirim).
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

