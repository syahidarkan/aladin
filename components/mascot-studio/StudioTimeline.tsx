'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  MascotKeyframe,
  MascotPoseConfig,
  BUILTIN_ANIMATIONS,
  interpolateKeyframes,
} from '@/lib/mascot-presets'
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Download,
  Repeat,
  Sparkles,
  Check,
  FastForward,
  Clock,
  Layers,
} from 'lucide-react'

interface StudioTimelineProps {
  currentPose: MascotPoseConfig
  onPoseChange: (pose: MascotPoseConfig) => void
  onToast: (msg: string) => void
}

export default function StudioTimeline({
  currentPose,
  onPoseChange,
  onToast,
}: StudioTimelineProps) {
  const [duration, setDuration] = useState(2.0)
  const [currentTime, setCurrentTime] = useState(0.0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [keyframes, setKeyframes] = useState<MascotKeyframe[]>(() => {
    // Default to 'loading-twirl' sequence keyframes
    return BUILTIN_ANIMATIONS['loading-twirl']?.keyframes || []
  })
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null)

  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const currentTimeRef = useRef<number>(0.0)

  // Keep ref synchronized with state when user scrubs manually
  useEffect(() => {
    currentTimeRef.current = currentTime
  }, [currentTime])

  // Playback Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      lastTimeRef.current = null
      return
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }

      const delta = ((timestamp - lastTimeRef.current) / 1000) * playbackSpeed
      lastTimeRef.current = timestamp

      currentTimeRef.current += delta
      let stopped = false

      if (currentTimeRef.current >= duration) {
        if (isLooping) {
          currentTimeRef.current = currentTimeRef.current % duration
        } else {
          currentTimeRef.current = duration
          stopped = true
        }
      }

      const nextTime = Math.round(currentTimeRef.current * 100) / 100
      setCurrentTime(nextTime)

      // Compute interpolated pose and notify parent cleanly
      if (keyframes.length > 0) {
        const interpolated = interpolateKeyframes(keyframes, nextTime, isLooping)
        onPoseChange(interpolated)
      }

      if (stopped) {
        setIsPlaying(false)
      } else {
        animFrameRef.current = requestAnimationFrame(loop)
      }
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, duration, isLooping, playbackSpeed, keyframes, onPoseChange])

  // Scrub timeline manually
  const handleScrub = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, Math.round(time * 100) / 100))
    currentTimeRef.current = clamped
    setCurrentTime(clamped)

    if (keyframes.length > 0) {
      const interpolated = interpolateKeyframes(keyframes, clamped, isLooping)
      onPoseChange(interpolated)
    }
  }

  // Safe clipboard helper
  const copyToClipboard = (text: string, successMsg: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => onToast(successMsg),
        () => fallbackCopyText(text, successMsg)
      )
    } else {
      fallbackCopyText(text, successMsg)
    }
  }

  const fallbackCopyText = (text: string, successMsg: string) => {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      onToast(successMsg)
    } catch {
      onToast(successMsg)
    }
  }

  // Record Current Pose as Keyframe at Current Time
  const handleRecordKeyframe = () => {
    const time = Math.round(currentTime * 100) / 100
    // Check if keyframe exists within 0.05s
    const existingIndex = keyframes.findIndex((k) => Math.abs(k.timestamp - time) <= 0.05)

    const newKeyframe: MascotKeyframe = {
      id: existingIndex >= 0 ? keyframes[existingIndex].id : `kf-${Date.now()}`,
      timestamp: time,
      meshTransform: JSON.parse(JSON.stringify(currentPose.meshTransform)),
      bonesRotation: JSON.parse(JSON.stringify(currentPose.bonesRotation)),
    }

    let updated: MascotKeyframe[]
    if (existingIndex >= 0) {
      updated = [...keyframes]
      updated[existingIndex] = newKeyframe
      onToast(`Keyframe diperbarui pada ${time.toFixed(2)}s`)
    } else {
      updated = [...keyframes, newKeyframe].sort((a, b) => a.timestamp - b.timestamp)
      onToast(`Keyframe baru direkam pada ${time.toFixed(2)}s`)
    }

    setKeyframes(updated)
    setSelectedKeyframeId(newKeyframe.id)
  }

  // Jump to existing keyframe
  const handleSelectKeyframe = (kf: MascotKeyframe) => {
    setSelectedKeyframeId(kf.id)
    handleScrub(kf.timestamp)
  }

  // Delete selected keyframe
  const handleDeleteKeyframe = () => {
    if (!selectedKeyframeId) return
    const updated = keyframes.filter((k) => k.id !== selectedKeyframeId)
    setKeyframes(updated)
    setSelectedKeyframeId(null)
    onToast('Keyframe dihapus dari timeline')
  }

  // Load a Pre-configured Animation Template
  const handleLoadAnimation = (animKey: string) => {
    const seq = BUILTIN_ANIMATIONS[animKey]
    if (seq) {
      setDuration(seq.duration)
      setIsLooping(seq.loop)
      setKeyframes(seq.keyframes)
      setCurrentTime(0.0)
      if (seq.keyframes.length > 0) {
        onPoseChange({
          meshTransform: seq.keyframes[0].meshTransform,
          bonesRotation: seq.keyframes[0].bonesRotation,
        })
      }
      onToast(`Urutan animasi "${seq.name}" berhasil dimuat`)
    }
  }

  // Copy Single Pose JSON to clipboard
  const handleCopySinglePose = () => {
    const poseObj = {
      timestamp: currentTime,
      meshTransform: currentPose.meshTransform,
      bonesRotation: currentPose.bonesRotation,
    }
    copyToClipboard(JSON.stringify(poseObj, null, 2), 'JSON Pose saat ini berhasil disalin ke clipboard!')
  }

  // Copy Full Keyframe Sequence JSON to clipboard
  const handleCopySequence = () => {
    const seqObj = {
      duration,
      loop: isLooping,
      keyframes,
    }
    copyToClipboard(
      JSON.stringify(seqObj, null, 2),
      `JSON Rangkaian Animasi (${keyframes.length} keyframes) disalin ke clipboard!`
    )
  }

  // Download JSON File
  const handleDownloadJSON = () => {
    const seqObj = {
      name: 'Custom Mascot Animation',
      duration,
      loop: isLooping,
      keyframes,
    }
    const blob = new Blob([JSON.stringify(seqObj, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mascot-animation-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    onToast('File JSON berhasil diunduh!')
  }

  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 p-3 select-none flex flex-col gap-2.5">
      {/* Top Bar: Playback Controls & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScrub(0)}
            title="Kembali ke 0.0s"
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`px-4 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md ${
              isPlaying
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-[#00F0A0] text-slate-950 hover:bg-[#20f7b0]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Play Preview
              </>
            )}
          </button>

          <button
            onClick={() => setIsLooping((p) => !p)}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
              isLooping
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Loop Animasi"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Loop</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <FastForward className="w-3 h-3 text-slate-400" />
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                  playbackSpeed === s
                    ? 'bg-[#00F0A0] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-[#00F0A0]" />
            <span className="text-white font-bold">{currentTime.toFixed(2)}s</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{duration.toFixed(2)}s</span>
          </div>
        </div>

        {/* Center: Keyframe Recording */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRecordKeyframe}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            + Rekam Keyframe ({currentTime.toFixed(2)}s)
          </button>

          {selectedKeyframeId && (
            <button
              onClick={handleDeleteKeyframe}
              title="Hapus Keyframe Terpilih"
              className="px-2.5 py-2 bg-red-600/80 hover:bg-red-500 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          )}
        </div>

        {/* Right: Export & Templates */}
        <div className="flex items-center gap-1.5">
          {/* Quick Sequence Templates */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] font-medium text-slate-400 hidden lg:inline">Template:</span>
            <button
              onClick={() => handleLoadAnimation('loading-twirl')}
              className="px-2 py-0.5 text-[11px] text-slate-300 hover:text-[#00F0A0] font-medium"
            >
              Twirl
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => handleLoadAnimation('transition-zoom')}
              className="px-2 py-0.5 text-[11px] text-slate-300 hover:text-[#00F0A0] font-medium"
            >
              Zoom
            </button>
          </div>

          <button
            onClick={handleCopySinglePose}
            title="Salin JSON Pose Saat Ini"
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-800 transition-colors flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5 text-[#00F0A0]" />
            <span className="text-[11px] hidden sm:inline">Salin Pose</span>
          </button>

          <button
            onClick={handleCopySequence}
            title="Salin JSON Seluruh Rangkaian Animasi"
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-800 transition-colors flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] hidden sm:inline">Salin JSON Sequence</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            title="Download JSON File"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Timeline Track & Keyframe Scrubber */}
      <div className="relative w-full bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
        {/* Time ruler notches */}
        <div className="relative w-full h-4 mb-1">
          {Array.from({ length: 9 }).map((_, i) => {
            const frac = i / 8
            const timeVal = frac * duration
            return (
              <div
                key={i}
                className="absolute transform -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${frac * 100}%` }}
              >
                <div className="w-0.5 h-2 bg-slate-700" />
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                  {timeVal.toFixed(1)}s
                </span>
              </div>
            )
          })}
        </div>

        {/* Interactive Track Area */}
        <div className="relative w-full h-7 bg-slate-950 rounded-lg border border-slate-800 flex items-center px-1">
          {/* Timeline progress fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#00F0A0]/10 rounded-l-lg pointer-events-none"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />

          {/* Keyframe Markers (Diamonds) */}
          {keyframes.map((kf) => {
            const pct = (kf.timestamp / duration) * 100
            const isSelected = selectedKeyframeId === kf.id

            return (
              <button
                key={kf.id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectKeyframe(kf)
                }}
                title={`Keyframe: ${kf.timestamp.toFixed(2)}s`}
                className={`absolute z-20 transform -translate-x-1/2 transition-transform hover:scale-125 focus:outline-none ${
                  isSelected ? 'scale-125' : ''
                }`}
                style={{ left: `${Math.min(99, Math.max(1, pct))}%` }}
              >
                <div
                  className={`w-3.5 h-3.5 rotate-45 border transition-all ${
                    isSelected
                      ? 'bg-amber-400 border-white shadow-lg shadow-amber-500/50'
                      : 'bg-[#00F0A0] border-slate-950 hover:bg-white'
                  }`}
                />
              </button>
            )
          })}

          {/* Range Slider Scrubber */}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={(e) => handleScrub(parseFloat(e.target.value))}
            className="w-full accent-[#00F0A0] h-2 bg-transparent appearance-none cursor-pointer z-30 relative"
          />
        </div>

        {/* Timeline Status Legend */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 px-1">
          <span>{keyframes.length} Titik Keyframe Terekam</span>
          <span>Klik diamond untuk memilih keyframe | Geser bar untuk scrub animasi</span>
        </div>
      </div>
    </div>
  )
}
