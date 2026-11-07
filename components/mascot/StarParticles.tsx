'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * 4-Pointed Sparkle Star Mesh (Procedural 3D Diamond Star)
 */
function createStarShape(): THREE.Shape {
  const shape = new THREE.Shape()
  const outerR = 0.22
  const innerR = 0.05
  const points = 4

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i * Math.PI) / points - Math.PI / 2
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

interface StarParticlesProps {
  count?: number
}

export default function StarParticles({ count = 18 }: StarParticlesProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Pre-generate star geometry & materials
  const starGeo = useMemo(() => {
    const shape = createStarShape()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    })
  }, [])

  const starMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00f0a0,
        emissive: 0x00d084,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.3,
      }),
    []
  )

  const dotMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x2ee59d,
        emissive: 0x00f0a0,
        emissiveIntensity: 0.9,
        roughness: 0.1,
      }),
    []
  )

  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.04, 12, 12), [])

  // Generate particle initial coordinates and drift params
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isStar = i % 2 === 0
      const radius = 1.4 + Math.random() * 1.6
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const height = (Math.random() - 0.5) * 1.8
      return {
        isStar,
        baseX: Math.cos(angle) * radius,
        baseY: height,
        baseZ: Math.sin(angle) * radius,
        speed: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.5,
        rotSpeed: (Math.random() - 0.5) * 2,
      }
    })
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, idx) => {
      const p = particles[idx]
      if (!p) return

      // Orbit and vertical float oscillation
      const currentAngle = (idx / count) * Math.PI * 2 + t * p.speed * 0.3
      const currentRadius = 1.6 + Math.sin(t * p.speed + p.phase) * 0.3

      child.position.x = Math.cos(currentAngle) * currentRadius
      child.position.y = p.baseY + Math.sin(t * 1.2 + p.phase) * 0.25
      child.position.z = Math.sin(currentAngle) * currentRadius

      if (p.isStar) {
        child.rotation.z += p.rotSpeed * 0.02
        child.rotation.y += p.rotSpeed * 0.015
        const pulse = 1 + Math.sin(t * 3 + p.phase) * 0.25
        child.scale.setScalar(p.scale * pulse)
      } else {
        const pulse = 1 + Math.sin(t * 4 + p.phase) * 0.3
        child.scale.setScalar(p.scale * pulse)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) =>
        p.isStar ? (
          <mesh key={i} geometry={starGeo} material={starMaterial} />
        ) : (
          <mesh key={i} geometry={dotGeo} material={dotMaterial} />
        )
      )}
    </group>
  )
}
