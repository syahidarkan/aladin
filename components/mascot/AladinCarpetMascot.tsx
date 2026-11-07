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
      camera={{ position: [0, 0.25, 4.8], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    >
      {/* 3-Point Studio Lighting with Mint & Blue Accents */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#FFFBF0" />
      <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#1037A6" />
      <pointLight position={[0, -1, 3]} intensity={1.8} color="#00F0A0" distance={8} />
      <pointLight position={[0, 2, 2.5]} intensity={1.2} color="#4361EE" distance={6} />

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
