'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBar from '@/components/StatusBar'
import { useBankState } from '@/lib/bankState'
import { useMascot } from '@/context/MascotContext'
import {
  ArrowLeft,
  Store,
  CreditCard,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  Info,
  HelpCircle,
  RefreshCw,
  QrCode,
} from 'lucide-react'

export default function TarikTunaiPage() {
  const router = useRouter()
  const { alaDompet } = useBankState()
  const { triggerReaction } = useMascot()

  const [activeTab, setActiveTab] = useState<'alfa' | 'atm'>('alfa')
  const [selectedNominal, setSelectedNominal] = useState<number>(200000)
  const [tokenGenerated, setTokenGenerated] = useState(false)
  const [tokenCode, setTokenCode] = useState('839 214')
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (tokenGenerated && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [tokenGenerated, timeLeft])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleGenerateToken = () => {
    if (selectedNominal > alaDompet) {
      triggerReaction('shake-warning', 'Saldo Ala Dompet tidak mencukupi untuk penarikan ini.')
      return
    }
    const randCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`
    setTokenCode(randCode)
    setTimeLeft(900)
    setTokenGenerated(true)
    triggerReaction('success', `Token tarik tunai Rp${selectedNominal.toLocaleString('id-ID')} berhasil dibuat!`)
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
            Tarik Tunai
          </h1>

          <button
            type="button"
            onClick={() => alert('Tarik tunai tanpa kartu di Alfamart bebas biaya admin 100% khusus nasabah Bank Aladin Syariah.')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Info Tarik Tunai"
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
            Sumber Dana: Ala Dompet
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-[24px] font-black tracking-tight font-mono">
              Rp{alaDompet.toLocaleString('id-ID')},00
            </span>
            <span className="text-[10.5px] font-extrabold bg-[#00F0A0] text-[#0A236E] px-2.5 py-0.5 rounded-full">
              Bebas Admin
            </span>
          </div>
        </div>

        {/* Channel Segmented Tabs */}
        <div className="flex bg-gray-200/70 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('alfa')
              setTokenGenerated(false)
            }}
            className={`flex-1 py-2 rounded-xl text-[12.5px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'alfa'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Store className="w-4 h-4 text-[#ED1C24]" />
            <span>Alfamart / Midi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('atm')}
            className={`flex-1 py-2 rounded-xl text-[12.5px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'atm'
                ? 'bg-white text-[#1037A6] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#1037A6]" />
            <span>ATM Bersama / Link</span>
          </button>
        </div>

        {/* TAB 1: ALFAMART FLOW */}
        {activeTab === 'alfa' && (
          <div className="space-y-4">
            {!tokenGenerated ? (
              <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs space-y-4">
                <div>
                  <h3 className="text-[15px] font-black text-gray-900">
                    Pilih Nominal Tarik Tunai
                  </h3>
                  <p className="text-[11.5px] text-gray-500 mt-0.5">
                    Tarik uang tunai di kasir tanpa kartu debit fisik.
                  </p>
                </div>

                {/* Nominal Presets */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((nom) => (
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
                    Gratis biaya admin tarik tunai di lebih dari 20.000 gerai Alfamart se-Indonesia.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateToken}
                  className="w-full py-3.5 bg-[#1037A6] hover:bg-[#0D2D88] text-white font-black text-[14px] rounded-xl active:scale-98 transition-all cursor-pointer shadow-md shadow-[#1037A6]/20"
                >
                  Buat Kode Tarik Tunai (Rp{selectedNominal.toLocaleString('id-ID')})
                </button>
              </div>
            ) : (
              /* TOKEN ACTIVE SCREEN */
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#ED1C24]" />
                    <span className="text-[12px] font-black text-gray-800">Kasir Alfamart</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimer(timeLeft)}</span>
                  </div>
                </div>

                {/* Token Display */}
                <div>
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                    Kode Tarik Tunai 6-Digit
                  </span>
                  <div className="mt-2 py-3 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-[#1037A6]/30 flex items-center justify-center gap-3">
                    <span className="text-[32px] font-black text-[#1037A6] font-mono tracking-widest">
                      {tokenCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(tokenCode.replace(/\s/g, ''))
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2500)
                      }}
                      className="p-2 bg-blue-100 text-[#1037A6] rounded-xl hover:bg-blue-200 transition-all cursor-pointer"
                      title="Salin Kode"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Nominal summary */}
                <div className="py-2.5 px-4 bg-gray-50 rounded-xl flex items-center justify-between text-[12px]">
                  <span className="text-gray-500 font-medium">Nominal Penarikan:</span>
                  <span className="font-black text-gray-900 font-mono">
                    Rp{selectedNominal.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Steps */}
                <div className="text-left space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide block">
                    Cara Tarik Tunai di Kasir:
                  </span>
                  <ol className="text-[11.5px] text-gray-600 space-y-1.5 list-decimal pl-4">
                    <li>Sampaikan ke kasir ingin melakukan <strong>Tarik Tunai Bank Aladin</strong>.</li>
                    <li>Sebutkan atau tunjukkan <strong>Kode Tarik Tunai</strong> di atas.</li>
                    <li>Kasir akan mengonfirmasi nama nasabah: <strong>Dewan Juri</strong>.</li>
                    <li>Terima uang tunai dan struk penarikan tanpa biaya admin.</li>
                  </ol>
                </div>

                <button
                  type="button"
                  onClick={() => setTokenGenerated(false)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[12px] rounded-xl transition-all cursor-pointer"
                >
                  Ubah Nominal / Batalkan
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATM LINK / BERSAMA */}
        {activeTab === 'atm' && (
          <div className="bg-white rounded-2xl p-4.5 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-[15px] font-black text-gray-900">
                Tarik Tunai di Mesin ATM
              </h3>
              <p className="text-[11.5px] text-gray-500 mt-0.5">
                Gunakan Kartu Debit Fisik Bank Aladin di ATM Link, ATM Bersama, &amp; Prima.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#1037A6] uppercase tracking-wide">
                  Kartu Debit Aladin Syariah
                </span>
                <span className="text-[10px] font-extrabold text-[#059669] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  Aktif &amp; Terproteksi
                </span>
              </div>
              <span className="text-[16px] font-black text-gray-800 font-mono block">
                4111 2233 4455 7890
              </span>
              <span className="text-[11px] text-gray-500 block">
                Atas Nama: <strong className="text-gray-900">DEWAN JURI IMOTION</strong>
              </span>
            </div>

            <div className="space-y-2 text-[12px] text-gray-600">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span>Limit Tarik Tunai Harian:</span>
                <span className="font-bold text-gray-900 font-mono">Rp10.000.000</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span>Jaringan ATM:</span>
                <span className="font-bold text-[#1037A6]">ATM Bersama, Link, Prima</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Status Kartu:</span>
                <span className="font-bold text-[#059669]">Tidak Terkunci</span>
              </div>
            </div>

            <Link
              href="/kartu"
              className="w-full py-3 bg-[#1037A6] hover:bg-[#0D2D88] text-white font-extrabold text-[13px] rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              <span>Kelola Pengaturan Kartu Debit</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
