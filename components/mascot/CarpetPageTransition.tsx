'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import { createFullCarpetCanvas, createRiggedCarpet } from './CarpetModel'

/**
 * 3D WebGL Rigged SkinnedMesh Cinematic Blanket Sweep Actor
 * Follows Animation Director Brief:
 * 1. Swoops forward quickly cutting diagonally across camera.
 * 2. Spreads cloth body wide to blanket 100% of viewport.
 * 3. Page swaps beneath while covered.
 * 4. Darts out to top corner leaving shimmering star trail.
 */
function TransitionCarpetActor({ phase }: { phase: 'covering' | 'revealing' }) {
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<THREE.Bone[]>([])
  const phaseStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    phaseStartTimeRef.current = null
  }, [phase])

  const normalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    const canvas = createFullCarpetCanvas(false, 'cheerful')
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

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
        // Full majestic distance flight: 1.40s
        const totalDuration = 1.40
        const progress = Math.min(1.0, elapsed / totalDuration)

        if (progress < 0.75) {
          // SUB-PHASE 1 (0.0s to 1.05s): Deep 3D distance flight from z = -28.0 towards camera
          const approachProg = progress / 0.75
          const easeApproach = approachProg * approachProg * (3 - 2 * approachProg)

          // Analytical flight path function:
          const samplePos = (p: number) => {
            const easeZ = 0.3 * p + 0.7 * (p * p * (3 - 2 * p))
            const z = THREE.MathUtils.lerp(-28.0, -0.6, easeZ)

            // Slalom lateral weave with envelope that damps to 0 at p = 1.0
            const env = Math.pow(1 - p, 1.4)
            const phaseAngle = p * Math.PI * 2.8
            const x = Math.sin(phaseAngle) * 2.2 * env
            const y = Math.sin(phaseAngle * 1.3) * 0.55 * env

            return new THREE.Vector3(x, y, z)
          }

          const curPos = samplePos(approachProg)
          groupRef.current.position.copy(curPos)

          // Analytical tangent direction for pitch, yaw & roll banking
          const deltaP = 0.01
          const pNext = Math.min(1.0, approachProg + deltaP)
          const pPrev = Math.max(0.0, approachProg - deltaP)
          const posNext = samplePos(pNext)
          const posPrev = samplePos(pPrev)

          const dx = posNext.x - posPrev.x
          const dy = posNext.y - posPrev.y
          const dz = posNext.z - posPrev.z

          const targetYaw = -Math.atan2(dx, dz)
          const targetPitch = Math.atan2(dy, dz)
          const targetRoll = -Math.atan2(dx, dz) * 0.75

          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetPitch, 8.0, delta)
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetYaw, 8.0, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRoll, 8.0, delta)

          // Scale grows smoothly from small distant silhouette to full size
          const curScale = THREE.MathUtils.lerp(0.35, 1.25, easeApproach)
          groupRef.current.scale.set(curScale, curScale, curScale)

          // Natural silk fluttering along spine
          const t = elapsed * 1.8
          const flutter1 = Math.sin(t * 5.5) * 0.08
          bonesRef.current.forEach((bone, idx) => {
            bone.rotation.x = Math.sin(t * 6.0 + idx * 0.5) * 0.06
            bone.rotation.y = Math.cos(t * 4.0 + idx * 0.4) * 0.04
            bone.rotation.z = flutter1 * 0.5
          })
        } else {
          // SUB-PHASE 2 (1.05s to 1.40s): Swoop forward to blanket 100% of camera viewport
          const swoopProg = (progress - 0.75) / 0.25
          const ease = swoopProg * swoopProg * (3 - 2 * swoopProg) // smoothstep

          const curX = THREE.MathUtils.lerp(groupRef.current.position.x, 0.0, ease)
          const curY = THREE.MathUtils.lerp(groupRef.current.position.y, 0.0, ease)
          const curZ = THREE.MathUtils.lerp(-0.6, 3.2, ease)

          groupRef.current.position.set(curX, curY, curZ)

          // Smoothly align perpendicular to lens to blanket screen completely
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.0, ease)
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.0, ease)
          groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.0, ease)

          // Scale expands wide to cover entire phone viewport
          const curScale = THREE.MathUtils.lerp(1.25, 3.4, ease)
          groupRef.current.scale.set(curScale, curScale, curScale)

          // Unfurl bones flat
          bonesRef.current.forEach((bone) => {
            bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, 0.0, 16.0, delta)
            bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, 0.0, 16.0, delta)
            bone.rotation.z = THREE.MathUtils.damp(bone.rotation.z, 0.0, 16.0, delta)
          })
        }
      } else {
        // Phase 'revealing': Swoops away towards top-right corner with grand flourish (0.65s)
        const duration = 0.65
        const p = Math.min(1.0, elapsed / duration)
        const ease = p * p // accelerating swoop out

        const curX = THREE.MathUtils.lerp(0.0, -4.5, ease)
        const curY = THREE.MathUtils.lerp(0.0, 4.2, ease)
        const curZ = THREE.MathUtils.lerp(3.2, 6.8, ease)

        groupRef.current.position.set(curX, curY, curZ)
        groupRef.current.rotation.z = THREE.MathUtils.lerp(0.0, 0.75, ease)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(0.0, -0.45, ease)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={skinnedMesh} />

      {/* Sparkling trail stars */}
      <group>
        {[
          { pos: [-0.95, 0.45, 0.35], s: 0.08 },
          { pos: [0.85, 0.85, 0.25], s: 0.09 },
          { pos: [-0.55, -0.65, 0.4], s: 0.07 },
          { pos: [0.95, -0.75, 0.2], s: 0.085 },
          { pos: [-0.3, 0.9, 0.3], s: 0.075 },
          { pos: [0.4, -0.1, 0.45], s: 0.08 },
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
              emissiveIntensity={1.8}
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
 */
export default function CarpetPageTransition() {
  const { isTransitioning, transitionPhase } = useMascot()

  if (!isTransitioning) return null

  return (
    <div
      className="absolute inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden select-none"
      style={{
        background: 'transparent',
      }}
    >
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
