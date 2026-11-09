'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import { createFullCarpetCanvas, createRiggedCarpet } from './CarpetModel'
import { Sparkles } from 'lucide-react'

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

  // Rigged SkinnedMesh (with 2 tail tassels attached to bones[4])
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
          // SUB-PHASE 1 (0.0s to 1.20s):
          // Majestic flight from deep 3D distance towards camera
          const approachProg = progress / 0.78
          // Smooth progressive easing
          const easeApproach = approachProg * approachProg * (3 - 2 * approachProg)

          // Smooth distance flight from deep 3D space
          const curZ = THREE.MathUtils.lerp(-28.0, -0.6, easeApproach)

          // Centered gentle flight path (NO extreme diagonal deviation)
          const curveAngle = approachProg * Math.PI * 1.5
          const curX = Math.sin(curveAngle) * 0.35 * (1 - approachProg * 0.4)
          const curY = -0.2 + Math.sin(curveAngle * 1.2) * 0.12

          groupRef.current.position.set(curX, curY, curZ)

          // Upright & Level orientation - ZERO CROOKED / MIRING TILT:
          // Pushed slightly forward (0.35 rad = 20°) so user looks at the flying carpet comfortably
          // Roll and Yaw kept minimal/level
          const pitchX = -0.12
          const gentleYaw = Math.sin(curveAngle) * 0.05
          const gentleRoll = -Math.cos(curveAngle) * 0.04

          groupRef.current.rotation.set(pitchX, gentleYaw, gentleRoll)

          // Scale grows smoothly
          const curScale = THREE.MathUtils.lerp(0.35, 1.05, easeApproach)
          groupRef.current.scale.set(curScale, curScale, curScale)

          // ICONIC POSE: Front lip scooped UP so cute chibi face looks directly at camera
          // Spine_0 (Head): scooped UP 77° (1.35 rad) - face smiling directly at camera
          // Spine_1: -48° (-0.85 rad) - levels body to horizontal flight plane
          // Spine_2: -0.15 rad - gentle aerodynamic curve
          // Spine_3: 0.12 rad - horizontal flight body
          // Spine_4: 0.45 rad - rear tail lifted with 2 attached tassels trailing
          const targetRotations = [0.0, -1.35, 0.25, -0.2, 0.45]

          bonesRef.current.forEach((bone, idx) => {
            const baseRot = targetRotations[idx] || 0.0
            // Subtle aerodynamic flutter
            const flutter = Math.sin(elapsed * 5.0 + idx * 0.8) * 0.03
            bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, baseRot + flutter, 8.0, delta)
            bone.rotation.y = 0.0
            bone.rotation.z = 0.0
          })
        } else {
          // SUB-PHASE 2 (1.20s to 1.55s):
          // Swoop close to blanket 100% of camera viewport
          const swoopProg = (progress - 0.78) / 0.22
          const ease = swoopProg * swoopProg * (3 - 2 * swoopProg) // smoothstep

          const curX = THREE.MathUtils.lerp(groupRef.current.position.x, 0.0, ease)
          const curY = THREE.MathUtils.lerp(groupRef.current.position.y, 0.0, ease)
          const curZ = THREE.MathUtils.lerp(-0.6, 3.2, ease)

          groupRef.current.position.set(curX, curY, curZ)

          // Smoothly align to face lens directly to blanket screen
          groupRef.current.rotation.x = THREE.MathUtils.lerp(0.35, 0.0, ease)
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.0, ease)
          groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.0, ease)

          // Scale expands to blanket entire viewport
          const curScale = THREE.MathUtils.lerp(1.05, 2.6, ease)
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

      {/* Vector Sparkle Indicator during close-up */}
      {isCovering && (
        <div className="absolute bottom-16 z-20 flex flex-col items-center animate-in fade-in duration-200 pointer-events-none">
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
