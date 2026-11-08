'use client'

import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import { createFullCarpetCanvas, createRiggedCarpet } from './CarpetModel'

/**
 * 3D WebGL Rigged SkinnedMesh Carpet Transition Actor
 * Controls internal skeletal bones, 3D barrel roll, and camera swoop.
 */
function TransitionCarpetActor({ phase }: { phase: 'covering' | 'revealing' }) {
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<THREE.Bone[]>([])
  const startTimeRef = useRef<number | null>(null)

  // Procedural carpet texture
  const normalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    const canvas = createFullCarpetCanvas(false)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Material with velvet sheen
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: normalTexture || undefined,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2555E0'),
      sheenRoughness: 0.3,
      side: THREE.DoubleSide,
    })
  }, [normalTexture])

  // Rigged SkinnedMesh
  const { skinnedMesh, bones } = useMemo(() => {
    return createRiggedCarpet(material)
  }, [material])

  bonesRef.current = bones

  useFrame((state, delta) => {
    if (!startTimeRef.current) {
      startTimeRef.current = state.clock.getElapsedTime()
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current

    if (groupRef.current) {
      if (phase === 'covering') {
        // Phase 1: 0–380ms (Covering viewport with dynamic banking swoop & unfurl)
        const progress = Math.min(1, elapsed / 0.38)
        const ease = 1 - Math.pow(1 - progress, 3)

        // 3D Position: Swooping from bottom-right into full camera close-up
        groupRef.current.position.x = THREE.MathUtils.lerp(1.4, 0.0, ease)
        groupRef.current.position.y = THREE.MathUtils.lerp(-1.2, 0.0, ease)
        groupRef.current.position.z = THREE.MathUtils.lerp(-2.0, 2.2, ease)

        // 3D Dynamic Banking: Rolls gracefully then levels flat
        groupRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.45
        groupRef.current.rotation.x = THREE.MathUtils.lerp(0.35, 0.0, ease)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.4, 0.0, ease)

        // Bone Unfurl to wide blanket with head looking happily at camera
        bonesRef.current.forEach((bone, i) => {
          let targetX = 0
          if (i === 4) {
            targetX = THREE.MathUtils.lerp(-0.4, 0.1, ease) // front lip smiling towards camera
          } else {
            targetX = THREE.MathUtils.lerp(0.3 - i * 0.15, 0.0, ease)
          }
          bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, targetX, 10, delta)
        })
      } else {
        // Phase 2: Revealing (Swoop out toward top-left past camera)
        const progress = Math.min(1, elapsed / 0.3)
        const ease = progress * progress

        groupRef.current.position.x = THREE.MathUtils.lerp(0.0, -2.6, ease)
        groupRef.current.position.y = THREE.MathUtils.lerp(0.0, 2.2, ease)
        groupRef.current.position.z = THREE.MathUtils.lerp(2.2, 3.8, ease)

        groupRef.current.rotation.z = THREE.MathUtils.lerp(0.0, 0.5, ease)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(0.0, -0.4, ease)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={skinnedMesh} />
    </group>
  )
}

/**
 * Cinematic Page Transition Overlay with True 3D Aladin Flying Carpet Mascot
 * Driven 100% by Three.js SkinnedMesh internal bone dynamics & WebGL camera.
 */
export default function CarpetPageTransition() {
  const { isTransitioning, transitionPhase } = useMascot()

  if (!isTransitioning) return null

  const isCovering = transitionPhase === 'covering'

  return (
    <div
      className="absolute inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden select-none"
      style={{
        background: isCovering ? '#1037A6' : 'rgba(16, 55, 166, 0)',
        transition: isCovering ? 'background 0.25s ease-in' : 'background 0.22s ease-out',
      }}
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[3, 5, 5]} intensity={2.5} />
          <pointLight position={[-3, -2, 2]} intensity={2.0} color="#00F0A0" />
          <pointLight position={[0, 2, 4]} intensity={1.5} color="#60A5FA" />

          <TransitionCarpetActor phase={transitionPhase} />
        </Canvas>
      </div>

      {/* Dynamic Star Sparkle Particle FX */}
      <span className="absolute top-1/4 left-1/4 text-[#00F0A0] text-2xl animate-star-twinkle">✦</span>
      <span className="absolute bottom-1/3 right-1/4 text-emerald-300 text-xl animate-star-twinkle" style={{ animationDelay: '150ms' }}>★</span>
      <span className="absolute top-1/3 right-1/3 text-[#00F0A0] text-lg animate-star-twinkle" style={{ animationDelay: '300ms' }}>✦</span>

      {/* Brand Subtext during coverage */}
      {isCovering && (
        <div className="absolute bottom-16 z-20 text-center animate-in fade-in duration-150">
          <span className="text-[13px] font-black uppercase tracking-widest text-[#00F0A0] block drop-shadow-md">
            #PakaiAladin
          </span>
          <span className="text-[11.5px] text-white/90 font-medium drop-shadow-sm">
            Bikin Berkah Setiap Hari ✨
          </span>
        </div>
      )}
    </div>
  )
}
