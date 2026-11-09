'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import { createFullCarpetCanvas, createRiggedCarpet } from './CarpetModel'

/**
 * 3D WebGL Rigged SkinnedMesh Carpet Transition Actor
 * Controls:
 * 1. Starting from very far away in 3D distance (z: -32.0, tiny magical silhouette)
 * 2. Flying smoothly & majestically towards camera without rushing
 * 3. Maintaining iconic Aladin mascot pose:
 *    - Head/front lip scooped up facing camera ('kepalanya dongak ke atas')
 *    - Body lying flat & horizontal ('badan sampai kaki tiduran normal kaya karpet biasa')
 *    - Rear tail lifted with 2 attached tassels trailing behind
 * 4. Swooping up close to blanket 100% of camera viewport
 * 5. Page swaps underneath while viewport is covered
 * 6. Swooping out past top-left camera to reveal the new page
 * BACKGROUND IS 100% TRANSPARENT - Active page remains visible underneath!
 */
function TransitionCarpetActor({ phase }: { phase: 'covering' | 'revealing' }) {
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<THREE.Bone[]>([])
  const phaseStartTimeRef = useRef<number | null>(null)
  const currentPhaseRef = useRef<'covering' | 'revealing'>('covering')

  // Reset timer on phase change
  useEffect(() => {
    phaseStartTimeRef.current = null
    currentPhaseRef.current = phase
  }, [phase])

  // Procedural carpet texture
  const normalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    const canvas = createFullCarpetCanvas(false)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Material with velvet sheen (Front side only - Back side handled by dual mesh in createRiggedCarpet)
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: normalTexture || undefined,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2555E0'),
      sheenRoughness: 0.3,
      side: THREE.FrontSide,
    })
  }, [normalTexture])

  // Rigged SkinnedMesh with Dual-Mesh architecture (Zero backface bleed)
  const { skinnedMesh, bones } = useMemo(() => {
    return createRiggedCarpet(material)
  }, [material])

  bonesRef.current = bones

  useFrame((state, delta) => {
    if (phaseStartTimeRef.current === null) {
      phaseStartTimeRef.current = state.clock.getElapsedTime()
    }

    const elapsed = state.clock.getElapsedTime() - phaseStartTimeRef.current

    if (groupRef.current) {
      if (phase === 'covering') {
        // Total covering flight: 1.55s
        const totalDuration = 1.55
        const progress = Math.min(1.0, elapsed / totalDuration)

        if (progress < 0.78) {
          // SUB-PHASE 1 (0.0s to 1.21s):
          // Deep 3D distance flight towards camera with natural flight heading and banking tangent
          const approachProg = progress / 0.78
          const easeApproach = approachProg * approachProg * (3 - 2 * approachProg)

          // Analytical flight path function:
          // X and Y weave gracefully in the distance and smoothly converge to (0, 0) at p = 1.0!
          const samplePos = (p: number) => {
            const easeZ = 0.3 * p + 0.7 * (p * p * (3 - 2 * p))
            const z = THREE.MathUtils.lerp(-30.0, -0.5, easeZ)

            // Slalom lateral weave with envelope that damps to 0 at p = 1.0
            const env = Math.pow(1 - p, 1.4)
            const phase = p * Math.PI * 2.5
            const x = Math.sin(phase) * 1.8 * env
            const y = Math.sin(phase * 1.2) * 0.4 * env

            return new THREE.Vector3(x, y, z)
          }

          const curPos = samplePos(approachProg)
          groupRef.current.position.copy(curPos)

          // Analytical tangent direction: sample small delta ahead and behind
          const deltaP = 0.008
          const pNext = Math.min(1.0, approachProg + deltaP)
          const pPrev = Math.max(0.0, approachProg - deltaP)
          const posNext = samplePos(pNext)
          const posPrev = samplePos(pPrev)

          const dx = posNext.x - posPrev.x
          const dy = posNext.y - posPrev.y
          const dz = posNext.z - posPrev.z // positive towards camera

          // Head points in direction of flight:
          // 1. Yaw turns into flight heading
          const targetYaw = -Math.atan2(dx, dz)
          // 2. Pitch nods along climb / dive
          const targetPitch = Math.atan2(dy, dz)
          // 3. Roll banks into lateral turn (smoothly straightens to 0 at approachProg = 1.0)
          const targetRoll = -Math.atan2(dx, dz) * 0.75

          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetPitch, 8.0, delta)
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetYaw, 8.0, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRoll, 8.0, delta)

          // Scale grows smoothly from distant small silhouette to full size
          const curScale = THREE.MathUtils.lerp(0.35, 1.15, easeApproach)
          groupRef.current.scale.set(curScale, curScale, curScale)

          // Subtle natural silk flutter along the curved spine
          const t = elapsed * 1.5
          const flutter1 = Math.sin(t * 5.0) * 0.06
          const targetRotations = [
            flutter1 * 0.4,
            flutter1 * 0.2,
            0,
            flutter1 * 0.3,
            flutter1 * 0.8,
          ]

          bonesRef.current.forEach((bone, idx) => {
            const baseRot = targetRotations[idx] || 0.0
            bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, baseRot, 8.0, delta)
            bone.rotation.y = 0.0
            bone.rotation.z = 0.0
          })
        } else {
          // SUB-PHASE 2 (1.21s to 1.55s):
          // Swoop straight forward to blanket 100% of camera viewport
          const swoopProg = (progress - 0.78) / 0.22
          const ease = swoopProg * swoopProg * (3 - 2 * swoopProg) // smoothstep

          const curZ = THREE.MathUtils.lerp(-0.5, 3.2, ease)
          groupRef.current.position.set(0.0, 0.0, curZ)

          // Smoothly align to face lens directly to blanket screen
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.0, ease)
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.0, ease)
          groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.0, ease)

          // Scale expands to blanket entire viewport
          const curScale = THREE.MathUtils.lerp(1.15, 2.8, ease)
          groupRef.current.scale.set(curScale, curScale, curScale)

          // Unfurl bones flat to form seamless viewport blanket
          bonesRef.current.forEach((bone) => {
            bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, 0.0, 16.0, delta)
          })
        }
      } else {
        // PHASE 2: Revealing (0.0s to 0.42s)
        // Swoop gracefully away towards top-left past camera lens to reveal new page
        const totalDuration = 0.42
        const progress = Math.min(1.0, elapsed / totalDuration)
        const ease = progress * progress // ease-in acceleration out

        const curX = THREE.MathUtils.lerp(0.0, -3.8, ease)
        const curY = THREE.MathUtils.lerp(0.0, 3.2, ease)
        const curZ = THREE.MathUtils.lerp(2.8, 5.2, ease)

        groupRef.current.position.set(curX, curY, curZ)
        groupRef.current.rotation.z = THREE.MathUtils.lerp(0.0, 0.75, ease)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(0.0, -0.35, ease)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={skinnedMesh} />

      {/* Floating Sparkle Star Particles that accompany mascot during flight */}
      <group>
        {[
          { pos: [-0.95, 0.45, 0.35], s: 0.07 },
          { pos: [0.85, 0.85, 0.25], s: 0.08 },
          { pos: [-0.55, -0.65, 0.4], s: 0.06 },
          { pos: [0.95, -0.75, 0.2], s: 0.075 },
          { pos: [-0.3, 0.9, 0.3], s: 0.065 },
          { pos: [0.4, -0.1, 0.45], s: 0.07 },
        ].map((star, idx) => (
          <mesh
            key={idx}
            position={star.pos as [number, number, number]}
            scale={[star.s, star.s, star.s]}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#00F0A0"
              emissive="#00F0A0"
              emissiveIntensity={1.5}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
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

    </div>
  )
}
