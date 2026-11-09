'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  MascotPoseConfig,
  DEG2RAD,
} from '@/lib/mascot-presets'
import { createFullCarpetCanvas, createRiggedCarpet } from '@/components/mascot/CarpetModel'

interface ControlledCarpetMeshProps {
  pose: MascotPoseConfig
  showWireframe?: boolean
  showBones?: boolean
  showParticles?: boolean
  isBlinking?: boolean
  waveSim?: boolean // Subtle fabric flutter toggle
}

export default function ControlledCarpetMesh({
  pose,
  showWireframe = false,
  showBones = false,
  showParticles = true,
  isBlinking = false,
  waveSim = false,
}: ControlledCarpetMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<THREE.Bone[]>([])
  const helperRef = useRef<THREE.SkeletonHelper | null>(null)

  // Generate Canvases & Textures
  const { normalTexture, blinkTexture } = useMemo(() => {
    if (typeof window === 'undefined') return { normalTexture: null, blinkTexture: null }

    const normal = createFullCarpetCanvas(false)
    const blink = createFullCarpetCanvas(true)

    const tNormal = new THREE.CanvasTexture(normal)
    tNormal.colorSpace = THREE.SRGBColorSpace
    tNormal.wrapS = THREE.ClampToEdgeWrapping
    tNormal.wrapT = THREE.ClampToEdgeWrapping

    const tBlink = new THREE.CanvasTexture(blink)
    tBlink.colorSpace = THREE.SRGBColorSpace
    tBlink.wrapS = THREE.ClampToEdgeWrapping
    tBlink.wrapT = THREE.ClampToEdgeWrapping

    return { normalTexture: tNormal, blinkTexture: tBlink }
  }, [])

  // Material with Sheen & Rich Velvet Sheen
  const carpetMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: (isBlinking ? blinkTexture : normalTexture) || undefined,
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2555E0'),
      sheenRoughness: 0.35,
      clearcoat: 0.08,
      clearcoatRoughness: 0.3,
      side: THREE.DoubleSide,
      wireframe: showWireframe,
    })
  }, [normalTexture, blinkTexture, isBlinking, showWireframe])

  // Rigged SkinnedMesh Setup
  const { skinnedMesh, bones, skeleton } = useMemo(() => {
    return createRiggedCarpet(carpetMaterial)
  }, [carpetMaterial])

  useEffect(() => {
    bonesRef.current = bones
  }, [bones])

  // Update Bone Rotations & Global Mesh Transform on every frame
  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // 1. Apply Global Mesh Transform (Position, Rotation, Scale)
    if (groupRef.current && pose.meshTransform) {
      const [px, py, pz] = pose.meshTransform.position
      const [rx, ry, rz] = pose.meshTransform.rotation
      const [sx, sy, sz] = pose.meshTransform.scale

      groupRef.current.position.set(px, py, pz)
      groupRef.current.rotation.set(rx * DEG2RAD, ry * DEG2RAD, rz * DEG2RAD)
      groupRef.current.scale.set(sx, sy, sz)
    }

    // 2. Apply Bones Rotations
    if (bonesRef.current.length > 0 && pose.bonesRotation) {
      bonesRef.current.forEach((bone, idx) => {
        const rotDeg = pose.bonesRotation[bone.name] || [0, 0, 0]
        const wave = waveSim ? Math.sin(t * 3.0 + idx * 0.8) * 0.03 : 0

        bone.rotation.x = rotDeg[0] * DEG2RAD + wave
        bone.rotation.y = rotDeg[1] * DEG2RAD
        bone.rotation.z = rotDeg[2] * DEG2RAD + (waveSim ? Math.cos(t * 2.5 + idx * 0.8) * 0.02 : 0)
      })
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={skinnedMesh} />

      {/* Optional Visual Skeleton Helper to display bones hierarchy & joints */}
      {showBones && (
        <group>
          {bones.map((bone, idx) => (
            <mesh key={idx} position={bone.position}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#00F0A0" wireframe />
            </mesh>
          ))}
        </group>
      )}

      {/* 3D Sparkle Star Particles */}
      {showParticles && (
        <group>
          {[
            { pos: [-0.95, 0.45, 0.35], s: 0.06 },
            { pos: [0.85, 0.85, 0.25], s: 0.075 },
            { pos: [-0.55, -0.65, 0.4], s: 0.05 },
            { pos: [0.95, -0.75, 0.2], s: 0.065 },
            { pos: [-0.3, 0.9, 0.3], s: 0.055 },
            { pos: [0.4, -0.1, 0.45], s: 0.06 },
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
                emissiveIntensity={1.2}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

