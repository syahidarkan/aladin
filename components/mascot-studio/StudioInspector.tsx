'use client'

import React, { useState } from 'react'
import {
  MascotPoseConfig,
  BUILTIN_PRESETS,
  Transform3D,
  BoneRotationsDeg,
} from '@/lib/mascot-presets'
import {
  Sliders,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Plus,
  Trash2,
  Copy,
  Check,
  Flame,
} from 'lucide-react'

interface StudioInspectorProps {
  pose: MascotPoseConfig
  setPose: React.Dispatch<React.SetStateAction<MascotPoseConfig>>
  onLoadPreset: (presetKey: string) => void
  onSaveCustomPreset: (name: string) => void
  customPresets: Record<string, MascotPoseConfig>
  onDeleteCustomPreset: (key: string) => void
}

const BONES_METADATA = [
  {
    key: 'Spine_0',
    name: 'Spine 0 (Root / Ekor Belakang)',
    desc: 'Tumpuan pangkal belakang dan sudut kemiringan dasar karpet',
    color: '#3B82F6',
  },
  {
    key: 'Spine_1',
    name: 'Spine 1 (Punggung Bawah)',
    desc: 'Melengkungkan badan bawah mendekati perut',
    color: '#06B6D4',
  },
  {
    key: 'Spine_2',
    name: 'Spine 2 (Palung / Lembah Perut)',
    desc: 'Pusat lengkungan huruf S (trough / cekungan melayang)',
    color: '#10B981',
  },
  {
    key: 'Spine_3',
    name: 'Spine 3 (Punggung Atas / Leher)',
    desc: 'Mengarahkan kenaikan leher menuju kepala depan',
    color: '#F59E0B',
  },
  {
    key: 'Spine_4',
    name: 'Spine 4 (Head / Bibir Depan Chibi)',
    desc: 'Mengontrol orientasi bibir depan tempat wajah menghadap',
    color: '#EC4899',
  },
]

export default function StudioInspector({
  pose,
  setPose,
  onLoadPreset,
  onSaveCustomPreset,
  customPresets,
  onDeleteCustomPreset,
}: StudioInspectorProps) {
  const [activeTab, setActiveTab] = useState<'bones' | 'global' | 'presets'>('bones')
  const [collapsedBones, setCollapsedBones] = useState<Record<string, boolean>>({})
  const [customNameInput, setCustomNameInput] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Toggle accordion for individual bone
  const toggleBoneCollapse = (key: string) => {
    setCollapsedBones((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Update Global Mesh Transform
  const updateGlobalPosition = (axis: 0 | 1 | 2, val: number) => {
    setPose((prev) => {
      const newPos = [...prev.meshTransform.position] as [number, number, number]
      newPos[axis] = Math.round(val * 100) / 100
      return {
        ...prev,
        meshTransform: {
          ...prev.meshTransform,
          position: newPos,
        },
      }
    })
  }

  const updateGlobalRotation = (axis: 0 | 1 | 2, val: number) => {
    setPose((prev) => {
      const newRot = [...prev.meshTransform.rotation] as [number, number, number]
      newRot[axis] = Math.round(val)
      return {
        ...prev,
        meshTransform: {
          ...prev.meshTransform,
          rotation: newRot,
        },
      }
    })
  }

  const updateGlobalScale = (val: number) => {
    setPose((prev) => ({
      ...prev,
      meshTransform: {
        ...prev.meshTransform,
        scale: [val, val, val],
      },
    }))
  }

  const resetGlobalTransform = () => {
    setPose((prev) => ({
      ...prev,
      meshTransform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
    }))
  }

  // Update Individual Bone Rotation
  const updateBoneRotation = (boneKey: string, axis: 0 | 1 | 2, val: number) => {
    setPose((prev) => {
      const current = prev.bonesRotation[boneKey] || [0, 0, 0]
      const updated = [...current] as [number, number, number]
      updated[axis] = Math.round(val * 10) / 10

      return {
        ...prev,
        bonesRotation: {
          ...prev.bonesRotation,
          [boneKey]: updated,
        },
      }
    })
  }

  const zeroBoneRotation = (boneKey: string) => {
    setPose((prev) => ({
      ...prev,
      bonesRotation: {
        ...prev.bonesRotation,
        [boneKey]: [0, 0, 0],
      },
    }))
  }

  const handleCopyCodeSnippet = (presetName: string, config: MascotPoseConfig) => {
    const jsonStr = JSON.stringify(config, null, 2)
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonStr).catch(() => {
        try {
          const ta = document.createElement('textarea')
          ta.value = jsonStr
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        } catch {}
      })
    }
    setCopiedKey(presetName)
    setTimeout(() => setCopiedKey(null), 1800)
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-100 overflow-hidden">
      {/* Inspector Header & Navigation Tabs */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00F0A0]" />
            <span className="font-bold text-[14px] text-white tracking-wide">
              Mascot Inspector
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#00F0A0] bg-[#00F0A0]/10 px-2 py-0.5 rounded-full border border-[#00F0A0]/30 font-semibold">
            SkinnedMesh Rig
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('bones')}
            className={`py-1.5 text-[12px] font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bones'
                ? 'bg-[#00F0A0] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Tulang Rig
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`py-1.5 text-[12px] font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'global'
                ? 'bg-[#00F0A0] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Transform
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-1.5 text-[12px] font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-[#00F0A0] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Preset ({Object.keys(BUILTIN_PRESETS).length + Object.keys(customPresets).length})
          </button>
        </div>
      </div>

      {/* Tab 1: Bone Hierarchy Sliders (Rigging) */}
      {activeTab === 'bones' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
            <span>5 Segmen Rantai Tulang Spine:</span>
            <button
              onClick={() => {
                const zeroBones: BoneRotationsDeg = {}
                BONES_METADATA.forEach((b) => (zeroBones[b.key] = [0, 0, 0]))
                setPose((p) => ({ ...p, bonesRotation: zeroBones }))
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Nolkan Semua Tulang
            </button>
          </div>

          {BONES_METADATA.map((boneMeta) => {
            const rot = pose.bonesRotation[boneMeta.key] || [0, 0, 0]
            const isCollapsed = collapsedBones[boneMeta.key]

            return (
              <div
                key={boneMeta.key}
                className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Bone Header */}
                <div
                  onClick={() => toggleBoneCollapse(boneMeta.key)}
                  className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 select-none"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: boneMeta.color }}
                    />
                    <div>
                      <div className="text-[12px] font-bold text-white leading-tight">
                        {boneMeta.name}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {boneMeta.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        zeroBoneRotation(boneMeta.key)
                      }}
                      title="Nolkan Rotasi Tulang Ini"
                      className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono"
                    >
                      Zero
                    </button>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Bone Sliders Content */}
                {!isCollapsed && (
                  <div className="p-3 pt-1 space-y-2.5 border-t border-slate-800/60 bg-slate-900/40">
                    {/* X Axis Slider (Pitch / Bend Up-Down) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-red-400 font-mono">Rotasi X (Tekuk / Pitch):</span>
                        <div className="flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            step="1"
                            value={rot[0]}
                            onChange={(e) =>
                              updateBoneRotation(boneMeta.key, 0, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-950 border border-slate-700 rounded text-red-300 font-mono"
                          />
                          <span className="text-slate-500 text-[10px]">°</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rot[0]}
                        onChange={(e) =>
                          updateBoneRotation(boneMeta.key, 0, parseFloat(e.target.value))
                        }
                        className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Y Axis Slider (Yaw / Twist Left-Right) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-emerald-400 font-mono">Rotasi Y (Puntir / Yaw):</span>
                        <div className="flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            step="1"
                            value={rot[1]}
                            onChange={(e) =>
                              updateBoneRotation(boneMeta.key, 1, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-950 border border-slate-700 rounded text-emerald-300 font-mono"
                          />
                          <span className="text-slate-500 text-[10px]">°</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rot[1]}
                        onChange={(e) =>
                          updateBoneRotation(boneMeta.key, 1, parseFloat(e.target.value))
                        }
                        className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Z Axis Slider (Roll / Tilt Side-to-Side) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-blue-400 font-mono">Rotasi Z (Miring / Roll):</span>
                        <div className="flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            step="1"
                            value={rot[2]}
                            onChange={(e) =>
                              updateBoneRotation(boneMeta.key, 2, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-950 border border-slate-700 rounded text-blue-300 font-mono"
                          />
                          <span className="text-slate-500 text-[10px]">°</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rot[2]}
                        onChange={(e) =>
                          updateBoneRotation(boneMeta.key, 2, parseFloat(e.target.value))
                        }
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 2: Global Mesh Transform */}
      {activeTab === 'global' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs text-slate-400">Transform Mesh Utama:</span>
            <button
              onClick={resetGlobalTransform}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Transform
            </button>
          </div>

          {/* Position Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="text-[12px] font-bold text-white flex items-center justify-between">
              <span>Posisi (XYZ):</span>
              <button
                onClick={() =>
                  setPose((p) => ({
                    ...p,
                    meshTransform: { ...p.meshTransform, position: [0, 0, 0] },
                  }))
                }
                className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono"
              >
                Reset
              </button>
            </div>

            {/* Pos X */}
            <div>
              <div className="flex justify-between text-[11px] text-red-400 mb-1">
                <span>Posisi X:</span>
                <input
                  type="number"
                  step="0.05"
                  value={pose.meshTransform.position[0]}
                  onChange={(e) => updateGlobalPosition(0, parseFloat(e.target.value) || 0)}
                  className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-red-300 font-mono"
                />
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.05"
                value={pose.meshTransform.position[0]}
                onChange={(e) => updateGlobalPosition(0, parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pos Y */}
            <div>
              <div className="flex justify-between text-[11px] text-emerald-400 mb-1">
                <span>Posisi Y:</span>
                <input
                  type="number"
                  step="0.05"
                  value={pose.meshTransform.position[1]}
                  onChange={(e) => updateGlobalPosition(1, parseFloat(e.target.value) || 0)}
                  className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-emerald-300 font-mono"
                />
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.05"
                value={pose.meshTransform.position[1]}
                onChange={(e) => updateGlobalPosition(1, parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pos Z */}
            <div>
              <div className="flex justify-between text-[11px] text-blue-400 mb-1">
                <span>Posisi Z:</span>
                <input
                  type="number"
                  step="0.05"
                  value={pose.meshTransform.position[2]}
                  onChange={(e) => updateGlobalPosition(2, parseFloat(e.target.value) || 0)}
                  className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-blue-300 font-mono"
                />
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.05"
                value={pose.meshTransform.position[2]}
                onChange={(e) => updateGlobalPosition(2, parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Rotation Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="text-[12px] font-bold text-white flex items-center justify-between">
              <span>Rotasi Mesh (Derajat):</span>
              <button
                onClick={() =>
                  setPose((p) => ({
                    ...p,
                    meshTransform: { ...p.meshTransform, rotation: [0, 0, 0] },
                  }))
                }
                className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono"
              >
                Reset
              </button>
            </div>

            {/* Rot X */}
            <div>
              <div className="flex justify-between text-[11px] text-red-400 mb-1">
                <span>Rotasi X (Pitch):</span>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    step="1"
                    value={pose.meshTransform.rotation[0]}
                    onChange={(e) => updateGlobalRotation(0, parseFloat(e.target.value) || 0)}
                    className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-red-300 font-mono"
                  />
                  <span className="text-slate-500 text-[10px]">°</span>
                </div>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={pose.meshTransform.rotation[0]}
                onChange={(e) => updateGlobalRotation(0, parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rot Y */}
            <div>
              <div className="flex justify-between text-[11px] text-emerald-400 mb-1">
                <span>Rotasi Y (Yaw):</span>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    step="1"
                    value={pose.meshTransform.rotation[1]}
                    onChange={(e) => updateGlobalRotation(1, parseFloat(e.target.value) || 0)}
                    className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-emerald-300 font-mono"
                  />
                  <span className="text-slate-500 text-[10px]">°</span>
                </div>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={pose.meshTransform.rotation[1]}
                onChange={(e) => updateGlobalRotation(1, parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rot Z */}
            <div>
              <div className="flex justify-between text-[11px] text-blue-400 mb-1">
                <span>Rotasi Z (Roll):</span>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    step="1"
                    value={pose.meshTransform.rotation[2]}
                    onChange={(e) => updateGlobalRotation(2, parseFloat(e.target.value) || 0)}
                    className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-blue-300 font-mono"
                  />
                  <span className="text-slate-500 text-[10px]">°</span>
                </div>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={pose.meshTransform.rotation[2]}
                onChange={(e) => updateGlobalRotation(2, parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Scale Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-[12px] font-bold text-white mb-1">
              <span>Skala Keseluruhan:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="3.0"
                  value={pose.meshTransform.scale[0]}
                  onChange={(e) => updateGlobalScale(parseFloat(e.target.value) || 1)}
                  className="w-16 px-1.5 py-0.5 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-[#00F0A0] font-mono"
                />
                <span className="text-slate-500 text-[10px]">x</span>
              </div>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              value={pose.meshTransform.scale[0]}
              onChange={(e) => updateGlobalScale(parseFloat(e.target.value))}
              className="w-full accent-[#00F0A0] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Presets Library */}
      {activeTab === 'presets' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Save New Preset Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="text-[12px] font-bold text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#00F0A0]" />
              Simpan Pose Ini Sebagai Preset Baru:
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama preset (misal: salam-ramah)..."
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0A0]"
              />
              <button
                onClick={() => {
                  if (customNameInput.trim()) {
                    onSaveCustomPreset(customNameInput.trim())
                    setCustomNameInput('')
                  }
                }}
                disabled={!customNameInput.trim()}
                className="px-3 py-1.5 bg-[#00F0A0] disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>

          {/* Built-in Presets */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400">Preset Bawaan Resmi:</div>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(BUILTIN_PRESETS).map(([key, config]) => (
                <div
                  key={key}
                  className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-all"
                >
                  <div className="cursor-pointer flex-1 mr-2" onClick={() => onLoadPreset(key)}>
                    <div className="text-[12px] font-bold text-white group-hover:text-[#00F0A0] transition-colors flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#00F0A0]" />
                      {config.name || key}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {config.description || 'Preset resmi pose maskot'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyCodeSnippet(key, config)}
                      title="Salin JSON Preset"
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                    >
                      {copiedKey === key ? (
                        <Check className="w-3.5 h-3.5 text-[#00F0A0]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onLoadPreset(key)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-[#00F0A0] text-slate-200 hover:text-slate-950 rounded-lg transition-colors border border-slate-700"
                    >
                      Muat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom User Presets */}
          {Object.keys(customPresets).length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400">Preset Kustom Anda:</div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(customPresets).map(([key, config]) => (
                  <div
                    key={key}
                    className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-all"
                  >
                    <div className="cursor-pointer flex-1 mr-2" onClick={() => onLoadPreset(key)}>
                      <div className="text-[12px] font-bold text-white group-hover:text-[#00F0A0] transition-colors flex items-center gap-1.5">
                        <Bookmark className="w-3 h-3 text-amber-400" />
                        {config.name || key}
                      </div>
                      <div className="text-[10px] text-slate-400">Tersimpan di browser lokal</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyCodeSnippet(key, config)}
                        title="Salin JSON Preset"
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                      >
                        {copiedKey === key ? (
                          <Check className="w-3.5 h-3.5 text-[#00F0A0]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onLoadPreset(key)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-[#00F0A0] text-slate-200 hover:text-slate-950 rounded-lg transition-colors border border-slate-700"
                      >
                        Muat
                      </button>
                      <button
                        onClick={() => onDeleteCustomPreset(key)}
                        title="Hapus Preset Kustom"
                        className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
