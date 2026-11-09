'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import CarpetModel, { CarpetPose } from './CarpetModel'
import StarParticles from './StarParticles'

export interface CarpetMascotProps {
  className?: string
  pose?: CarpetPose
  interactive?: boolean
  showParticles?: boolean
  onClick?: () => void
}

/**
 * Internal 3D Canvas Scene for Aladin Flying Carpet Mascot
 */
function CarpetCanvas({
  pose = 'idle',
  interactive = true,
  showParticles = true,
  onClick,
}: Omit<CarpetMascotProps, 'className'>) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 4.2], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    >
      {/* 3-Point Studio Lighting with Rich Velvet Depth & Mint Accents */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#FFFFFF" />
      <directionalLight position={[-3, -1, -2]} intensity={0.9} color="#1037A6" />
      <pointLight position={[0, 1.2, 3.0]} intensity={0.6} color="#00F0A0" distance={6} />
      <pointLight position={[1, 2, 1.5]} intensity={1.0} color="#3B82F6" distance={5} />

      <Suspense fallback={null}>
        <CarpetModel pose={pose} interactive={interactive} onClick={onClick} />
        {showParticles && <StarParticles count={16} />}
      </Suspense>
    </Canvas>
  )
}

/**
 * Aladin Flying Carpet 3D Mascot Component
 * Fully interactive, rigged procedural 3D mascot identical to Aladin brand visual.
 */
export default function AladinCarpetMascot({
  className = '',
  pose = 'idle',
  interactive = true,
  showParticles = true,
  onClick,
}: CarpetMascotProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure client-side mount only for WebGL
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center select-none ${className}`}
        style={{ minHeight: '180px' }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-[#00F0A0] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div
      className={`relative select-none overflow-visible cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <CarpetCanvas
        pose={pose}
        interactive={interactive}
        showParticles={showParticles}
        onClick={onClick}
      />
    </div>
  )
}

