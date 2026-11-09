'use client'

import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ControlledCarpetMesh from './ControlledCarpetMesh'
import { MascotPoseConfig } from '@/lib/mascot-presets'
import {
  Grid,
  Sparkles,
  Compass,
  Eye,
  RotateCcw,
  Layers,
  Activity,
  Maximize2,
} from 'lucide-react'

interface StudioCanvasProps {
  pose: MascotPoseConfig
  showGrid: boolean
  setShowGrid: (val: boolean | ((prev: boolean) => boolean)) => void
  showAxes: boolean
  setShowAxes: (val: boolean | ((prev: boolean) => boolean)) => void
  showWireframe: boolean
  setShowWireframe: (val: boolean | ((prev: boolean) => boolean)) => void
  showBones: boolean
  setShowBones: (val: boolean | ((prev: boolean) => boolean)) => void
  showParticles: boolean
  setShowParticles: (val: boolean | ((prev: boolean) => boolean)) => void
  waveSim: boolean
  setWaveSim: (val: boolean | ((prev: boolean) => boolean)) => void
}

export default function StudioCanvas({
  pose,
  showGrid,
  setShowGrid,
  showAxes,
  setShowAxes,
  showWireframe,
  setShowWireframe,
  showBones,
  setShowBones,
  showParticles,
  setShowParticles,
  waveSim,
  setWaveSim,
}: StudioCanvasProps) {
  const controlsRef = useRef<any>(null)
  const [isBlinking, setIsBlinking] = useState(false)

  // Quick Camera Presets
  const setCameraView = (pos: [number, number, number], target: [number, number, number] = [0, 0, 0]) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...pos)
      controlsRef.current.target.set(...target)
      controlsRef.current.update()
    }
  }

  const handleBlinkTrigger = () => {
    setIsBlinking(true)
    setTimeout(() => setIsBlinking(false), 200)
  }

  return (
    <div className="relative w-full h-full bg-radial from-[#0d1633] via-[#080d21] to-[#040612] overflow-hidden select-none">
      {/* 3D Viewport Controls HUD (Top Bar) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Side: View Angle Presets */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#00F0A0]" />
            Kamera:
          </span>
          <button
            onClick={() => setCameraView([2.2, 1.4, 2.8])}
            className="px-2 py-1 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            3/4 Isometrik
          </button>
          <button
            onClick={() => setCameraView([0, 0.12, 3.8])}
            className="px-2 py-1 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            Depan
          </button>
          <button
            onClick={() => setCameraView([-4.0, 0.0, 0])}
            className="px-2 py-1 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            Samping
          </button>
          <button
            onClick={() => setCameraView([0, 4.2, 0.01])}
            className="px-2 py-1 text-[11px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            Atas
          </button>
          <button
            onClick={() => setCameraView([0, 1.2, 3.5])}
            title="Reset Posisi Kamera"
            className="p-1 text-slate-400 hover:text-[#00F0A0] bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side: Visual Debug Toggles */}
        <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            onClick={() => setShowGrid((p) => !p)}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
              showGrid
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Lantai Grid"
          >
            <Grid className="w-3 h-3" />
            Grid
          </button>

          <button
            onClick={() => setShowAxes((p) => !p)}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
              showAxes
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Sumbu Koordinat XYZ"
          >
            <Layers className="w-3 h-3" />
            Axes
          </button>

          <button
            onClick={() => setShowWireframe((p) => !p)}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
              showWireframe
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Wireframe Mesh"
          >
            <Maximize2 className="w-3 h-3" />
            Wireframe
          </button>

          <button
            onClick={() => setShowBones((p) => !p)}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
              showBones
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Visual Sendi Tulang"
          >
            <Activity className="w-3 h-3" />
            Bones
          </button>

          <button
            onClick={() => setShowParticles((p) => !p)}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
              showParticles
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Partikel Bintang 3D"
          >
            <Sparkles className="w-3 h-3" />
            Stars
          </button>

          <button
            onClick={() => setWaveSim((p) => !p)}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 border ${
              waveSim
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border-[#00F0A0]/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Simulasi Ombak Kain Sutra"
          >
            Ombak
          </button>

          <button
            onClick={handleBlinkTrigger}
            className="px-2 py-1 text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-[#00F0A0] rounded-lg transition-colors flex items-center gap-1 border border-slate-700"
            title="Uji Kedip Mata Chibi"
          >
            <Eye className="w-3 h-3" />
            Kedip
          </button>
        </div>
      </div>

      {/* Helper Legend / Compass Overlay (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-3 text-[11px] text-slate-400 bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> X (Merah)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Y (Hijau)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Z (Biru)
        </span>
        <span className="text-slate-500">| Klik Kiri: Putar | Klik Kanan: Geser | Scroll: Zoom</span>
      </div>

      {/* Main Three.js WebGL Canvas */}
      <Canvas
        camera={{ position: [2.5, 1.8, 3.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Orbit Controls with Smooth Damping */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={1.0}
          maxDistance={15.0}
        />

        {/* Studio 3-Point Lighting */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-4, -1, -2]} intensity={0.9} color="#1037A6" />
        <pointLight position={[0, 0.5, 2.5]} intensity={0.8} color="#00F0A0" distance={6} />
        <pointLight position={[1, 2, 1.5]} intensity={1.0} color="#3B82F6" distance={5} />

        {/* Optional 3D Visual Helpers */}
        {showGrid && (
          <gridHelper
            args={[12, 24, '#00F0A0', '#1e293b']}
            position={[0, -1.2, 0]}
          />
        )}
        {showAxes && <axesHelper args={[2.0]} position={[0, -1.19, 0]} />}

        {/* Live Rigged SkinnedMesh Carpet driven by Studio State */}
        <ControlledCarpetMesh
          pose={pose}
          showWireframe={showWireframe}
          showBones={showBones}
          showParticles={showParticles}
          isBlinking={isBlinking}
          waveSim={waveSim}
        />
      </Canvas>
    </div>
  )
}

