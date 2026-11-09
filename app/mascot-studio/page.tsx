'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import StudioCanvas from '@/components/mascot-studio/StudioCanvas'
import StudioInspector from '@/components/mascot-studio/StudioInspector'
import StudioTimeline from '@/components/mascot-studio/StudioTimeline'
import {
  MascotPoseConfig,
  BUILTIN_PRESETS,
} from '@/lib/mascot-presets'
import {
  Sparkles,
  ArrowLeft,
  Sliders,
  Layers,
  Code,
  CheckCircle2,
  Bookmark,
} from 'lucide-react'

export default function MascotStudioPage() {
  const [mounted, setMounted] = useState(false)
  const [pose, setPose] = useState<MascotPoseConfig>(() => BUILTIN_PRESETS.idle)
  const [customPresets, setCustomPresets] = useState<Record<string, MascotPoseConfig>>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Visual Toggles
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [showWireframe, setShowWireframe] = useState(false)
  const [showBones, setShowBones] = useState(false)
  const [showParticles, setShowParticles] = useState(true)
  const [waveSim, setWaveSim] = useState(false)

  // Initialize and load saved presets from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('aladin_custom_mascot_presets')
      if (saved) {
        setCustomPresets(JSON.parse(saved))
      }
    } catch (e) {
      console.warn('Failed to load custom presets from localStorage', e)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 2800)
  }

  const handleLoadPreset = (presetKey: string) => {
    const target = customPresets[presetKey] || BUILTIN_PRESETS[presetKey]
    if (target) {
      setPose(JSON.parse(JSON.stringify(target)))
      showToast(`Pose "${target.name || presetKey}" dimuat ke studio`)
    }
  }

  const handleSaveCustomPreset = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '-')
    const newConfig: MascotPoseConfig = {
      name,
      description: 'Preset kustom buatan developer',
      meshTransform: JSON.parse(JSON.stringify(pose.meshTransform)),
      bonesRotation: JSON.parse(JSON.stringify(pose.bonesRotation)),
    }

    const updated = { ...customPresets, [key]: newConfig }
    setCustomPresets(updated)
    try {
      localStorage.setItem('aladin_custom_mascot_presets', JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to save preset to localStorage', e)
    }
    showToast(`Preset "${name}" berhasil disimpan!`)
  }

  const handleDeleteCustomPreset = (key: string) => {
    const updated = { ...customPresets }
    delete updated[key]
    setCustomPresets(updated)
    try {
      localStorage.setItem('aladin_custom_mascot_presets', JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to delete preset from localStorage', e)
    }
    showToast('Preset kustom berhasil dihapus')
  }

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white select-none">
        <div className="w-10 h-10 rounded-full border-3 border-[#00F0A0] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Memuat Mascot 3D Studio & Rig Inspector...
        </p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white overflow-hidden select-none font-sans">
      {/* Top Header Navigation */}
      <header className="h-12 bg-slate-950/95 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Branding & Back Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/beranda"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke App</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00F0A0] to-[#154AD8] flex items-center justify-center shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                Mascot 3D Studio & Rig Inspector
              </h1>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Bank Aladin Syariah Visual Posing & Keyframe Recorder
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Presets Bar */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
            Preset:
          </span>
          {Object.entries(BUILTIN_PRESETS)
            .slice(0, 5)
            .map(([key, item]) => (
              <button
                key={key}
                onClick={() => handleLoadPreset(key)}
                className="px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:text-[#00F0A0] hover:bg-slate-800 rounded-md transition-colors"
              >
                {item.name?.split(' ')[0] || key}
              </button>
            ))}
        </div>

        {/* Right: Status Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00F0A0]/10 border border-[#00F0A0]/30 rounded-full text-[11px] text-[#00F0A0] font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-pulse" />
            WebGL Rig Active
          </div>
        </div>
      </header>

      {/* Main Workspace (Split Screen: 70% 3D Viewport, 30% Inspector) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: 3D Viewport (70%) */}
        <div className="flex-[7] relative h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <StudioCanvas
            pose={pose}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showAxes={showAxes}
            setShowAxes={setShowAxes}
            showWireframe={showWireframe}
            setShowWireframe={setShowWireframe}
            showBones={showBones}
            setShowBones={setShowBones}
            showParticles={showParticles}
            setShowParticles={setShowParticles}
            waveSim={waveSim}
            setWaveSim={setWaveSim}
          />
        </div>

        {/* Right: Inspector Controls (30%) */}
        <div className="flex-[3] min-w-[340px] max-w-full lg:max-w-[420px] h-full overflow-hidden">
          <StudioInspector
            pose={pose}
            setPose={setPose}
            onLoadPreset={handleLoadPreset}
            onSaveCustomPreset={handleSaveCustomPreset}
            customPresets={customPresets}
            onDeleteCustomPreset={handleDeleteCustomPreset}
          />
        </div>
      </div>

      {/* Bottom: Timeline Keyframe Scrubber & Export Bar */}
      <div className="shrink-0 z-20">
        <StudioTimeline
          currentPose={pose}
          onPoseChange={(interpolatedPose) => setPose(interpolatedPose)}
          onToast={showToast}
        />
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900/95 border border-[#00F0A0]/50 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-[#00F0A0] shrink-0" />
            <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}

