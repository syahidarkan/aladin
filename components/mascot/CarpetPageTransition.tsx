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
        // Fast, graceful sweep: 0.65s
        const duration = 0.65
        const p = Math.min(1.0, elapsed / duration)
        const ease = p * p * (3 - 2 * p) // smoothstep

        // Starts diagonal (bottom-right cutting towards camera center)
        const curX = THREE.MathUtils.lerp(1.2, 0.0, ease)
        const curY = THREE.MathUtils.lerp(-0.8, 0.0, ease)
        const curZ = THREE.MathUtils.lerp(-5.0, 2.9, ease)

        groupRef.current.position.set(curX, curY, curZ)

        // Diagonal dynamic roll that settles flat into full blanket
        groupRef.current.rotation.x = THREE.MathUtils.lerp(0.35, 0.0, ease)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.35, 0.0, ease)
        groupRef.current.rotation.z = THREE.MathUtils.lerp(-0.45, 0.0, ease)

        // Expands wide to blanket entire viewport seamlessly
        const curScale = THREE.MathUtils.lerp(0.85, 3.4, ease)
        groupRef.current.scale.set(curScale, curScale, curScale)

        // Bones flatten smoothly to form unbroken blanket
        bonesRef.current.forEach((bone) => {
          bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, 0.0, 14.0, delta)
          bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, 0.0, 14.0, delta)
          bone.rotation.z = THREE.MathUtils.damp(bone.rotation.z, 0.0, 14.0, delta)
        })
      } else {
        // Phase 'revealing': Darts out towards top-left / top-right corner (0.42s)
        const duration = 0.42
        const p = Math.min(1.0, elapsed / duration)
        const ease = p * p // accelerating swoop out

        const curX = THREE.MathUtils.lerp(0.0, -3.6, ease)
        const curY = THREE.MathUtils.lerp(0.0, 3.4, ease)
        const curZ = THREE.MathUtils.lerp(2.9, 5.0, ease)

        groupRef.current.position.set(curX, curY, curZ)
        groupRef.current.rotation.z = THREE.MathUtils.lerp(0.0, 0.65, ease)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(0.0, -0.30, ease)
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
