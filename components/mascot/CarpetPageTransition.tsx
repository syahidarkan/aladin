'use client'

import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import { createFullCarpetCanvas, createRiggedCarpet } from './CarpetModel'
import { Sparkles } from 'lucide-react'

/**
 * 3D WebGL Rigged SkinnedMesh Carpet Transition Actor
 * Controls:
 * 1. Starting far away in 3D distance (z: -9.0, small size)
 * 2. High-speed 3D Figure-8 aerobatic looping flight across the active page
 * 3. Swooping up close to the camera lens until carpet body blankets the viewport
 * 4. Swooping away past top-left camera to reveal the newly mounted page
 * BACKGROUND IS 100% TRANSPARENT - The user's active page remains visible underneath!
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
        // Phase 1: 0 to 580ms
        // Far away in 3D (z: -9.0) looping in figure-8, then swooping into camera
        const progress = Math.min(1, elapsed / 0.55)

        if (progress < 0.7) {
          // Loop 1: Far away figure-8 acrobatics across screen (z: -9.0 to -2.0)
          const loopProg = progress / 0.7
          const tAngle = loopProg * Math.PI * 2.5

          // Figure-8 infinity path
          const fig8X = Math.sin(tAngle) * 1.8 * (1 - loopProg * 0.4)
          const fig8Y = Math.sin(tAngle * 2.0) * 0.9 * (1 - loopProg * 0.4)
          const curZ = THREE.MathUtils.lerp(-9.0, -1.5, loopProg)

          groupRef.current.position.set(fig8X, fig8Y, curZ)

          // Dynamic banking roll & pitch
          groupRef.current.rotation.z = -Math.cos(tAngle) * 0.65
          groupRef.current.rotation.y = Math.sin(tAngle) * 0.4
          groupRef.current.rotation.x = 0.3 + Math.sin(tAngle * 2.0) * 0.25

          // Ripple fabric oscillation during high-speed acrobatics
          bonesRef.current.forEach((bone, idx) => {
            const ripple = Math.sin(tAngle * 4.0 + idx * 1.2) * 0.22
            bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, ripple, 12, delta)
          })
        } else {
          // Loop 2: 0.7 to 1.0 -> Rapid close-up swoop to blanket camera viewport
          const swoopProg = (progress - 0.7) / 0.3
          const ease = swoopProg * swoopProg * (3 - 2 * swoopProg) // smoothstep

          const curX = THREE.MathUtils.lerp(groupRef.current.position.x, 0.0, ease)
          const curY = THREE.MathUtils.lerp(groupRef.current.position.y, 0.0, ease)
          const curZ = THREE.MathUtils.lerp(-1.5, 2.5, ease)

          groupRef.current.position.set(curX, curY, curZ)

          groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.0, ease)
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.0, ease)
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.0, ease)

          // Unfurl to wide blanket covering viewport
          bonesRef.current.forEach((bone, idx) => {
            const targetX = idx === 4 ? 0.05 : 0.0
            bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, targetX, 15, delta)
          })
        }
      } else {
        // Phase 2: Revealing (Swoop out toward top-left past camera)
        const progress = Math.min(1, elapsed / 0.35)
        const ease = progress * progress

        groupRef.current.position.x = THREE.MathUtils.lerp(0.0, -3.2, ease)
        groupRef.current.position.y = THREE.MathUtils.lerp(0.0, 2.6, ease)
        groupRef.current.position.z = THREE.MathUtils.lerp(2.5, 4.2, ease)

        groupRef.current.rotation.z = THREE.MathUtils.lerp(0.0, 0.6, ease)
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
 * 100% TRANSPARENT BACKGROUND - Active page remains visible underneath!
 * Zero raw emojis.
 */
export default function CarpetPageTransition() {
  const { isTransitioning, transitionPhase } = useMascot()

  if (!isTransitioning) return null

  const isCovering = transitionPhase === 'covering'

  return (
    <div
      className="absolute inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden select-none"
      style={{
        background: 'transparent',
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

      {/* Vector Sparkle Indicator during close-up */}
      {isCovering && (
        <div className="absolute bottom-16 z-20 flex flex-col items-center animate-in fade-in duration-150 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-[#051937]/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#00F0A0]/40 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0A0] animate-spin" />
            <span className="text-[11.5px] font-black uppercase tracking-wider text-white">
              #PakaiAladin
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
