'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

export type CarpetPose =
  | 'idle'
  | 'stand'
  | 'lay-flat'
  | 'curious-bow'
  | 'fold-arms'
  | 'transition-sweep'

interface BoneRotations {
  [boneName: string]: { x: number; y: number; z: number }
}

/**
 * Target bone rotations (in radians) per pose definition.
 * Controls the skeletal spine chain:
 * Spine_0 (Root) -> Spine_1 -> Spine_2 -> Spine_3 -> Spine_4 (Head / Front Lip)
 */
export const POSE_DEFINITIONS: Record<CarpetPose, BoneRotations> = {
  // 1. Stand: Standing upright 90°, chest proudly forward, greeting friendly
  stand: {
    Spine_0: { x: 0.1, y: 0, z: 0 },
    Spine_1: { x: 0.2, y: 0, z: 0 },
    Spine_2: { x: -0.15, y: 0, z: 0 },
    Spine_3: { x: -0.2, y: 0, z: 0 },
    Spine_4: { x: 0.25, y: 0, z: 0 }, // Head upright looking at user
  },

  // 2. Lay-Flat: Relaxed horizontal flight
  'lay-flat': {
    Spine_0: { x: Math.PI / 2.2, y: 0, z: 0 },
    Spine_1: { x: 0.05, y: 0, z: 0 },
    Spine_2: { x: 0, y: 0, z: 0 },
    Spine_3: { x: 0, y: 0, z: 0 },
    Spine_4: { x: -0.3, y: 0, z: 0 }, // Front lip slightly raised
  },

  // 3. Curious-Bow: Polite greeting bow (Sharia Salam)
  'curious-bow': {
    Spine_0: { x: 0.3, y: 0, z: 0 },
    Spine_1: { x: 0.4, y: 0, z: 0 },
    Spine_2: { x: 0.3, y: 0, z: 0 },
    Spine_3: { x: -0.2, y: 0, z: 0 },
    Spine_4: { x: -0.4, y: 0, z: 0 },
  },

  // 4. Fold-Arms: Confident hero pose
  'fold-arms': {
    Spine_0: { x: 0.15, y: 0, z: 0 },
    Spine_1: { x: 0.25, y: 0, z: 0 },
    Spine_2: { x: -0.1, y: 0, z: 0 },
    Spine_3: { x: -0.3, y: 0, z: 0 },
    Spine_4: { x: 0.4, y: 0, z: 0 },
  },

  // 5. Transition-Sweep: Dynamic wide swoop covering camera viewport
  'transition-sweep': {
    Spine_0: { x: 0.4, y: 0.6, z: 0.2 },
    Spine_1: { x: 0.6, y: 0.3, z: 0.4 },
    Spine_2: { x: 0.5, y: -0.2, z: 0.3 },
    Spine_3: { x: 0.4, y: -0.4, z: 0.2 },
    Spine_4: { x: 0.2, y: 0, z: 0 },
  },

  // 6. Idle: Default graceful flying S-curve
  idle: {
    Spine_0: { x: 0.2, y: 0, z: 0 },
    Spine_1: { x: -0.1, y: 0, z: 0 },
    Spine_2: { x: 0.15, y: 0, z: 0 },
    Spine_3: { x: -0.1, y: 0, z: 0 },
    Spine_4: { x: 0.35, y: 0, z: 0 }, // Front lip curled upwards
  },
}

interface CarpetModelProps {
  pose?: CarpetPose
  interactive?: boolean
  onClick?: () => void
}

/**
 * Creates procedural 1024x1536 texture:
 * Royal blue velvet gradient base, thick glowing turquoise border piping,
 * corner motifs, central motif, and cute chibi face on front lip.
 */
export function createFullCarpetCanvas(blink: boolean = false): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')!

  // 1. Royal Blue Velvet Gradient Base
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1536)
  baseGrad.addColorStop(0, '#154AD8')
  baseGrad.addColorStop(0.3, '#1037A6')
  baseGrad.addColorStop(1, '#092372')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, 1024, 1536)

  // 2. Thick Vibrant Turquoise Border Piping (#00F0A0)
  const borderWidth = 48
  const margin = 64
  const cornerRadius = 100

  ctx.strokeStyle = '#00F0A0'
  ctx.lineWidth = borderWidth
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.roundRect(margin, margin, 1024 - margin * 2, 1536 - margin * 2, cornerRadius)
  ctx.stroke()

  // 3. Corner Arc Motifs in all 4 corners
  const arcRadius = 150
  ctx.lineWidth = 32
  ctx.strokeStyle = '#00F0A0'

  // Front-Left Arc (Top-Left)
  ctx.beginPath()
  ctx.arc(margin + 20, margin + 20, arcRadius, 0, Math.PI / 2, false)
  ctx.stroke()

  // Front-Right Arc (Top-Right)
  ctx.beginPath()
  ctx.arc(1024 - margin - 20, margin + 20, arcRadius, Math.PI / 2, Math.PI, false)
  ctx.stroke()

  // Rear-Left Arc (Bottom-Left)
  ctx.beginPath()
  ctx.arc(margin + 20, 1536 - margin - 20, arcRadius, -Math.PI / 2, 0, false)
  ctx.stroke()

  // Rear-Right Arc (Bottom-Right)
  ctx.beginPath()
  ctx.arc(1024 - margin - 20, 1536 - margin - 20, arcRadius, Math.PI, -Math.PI / 2, false)
  ctx.stroke()

  // 4. Center Stylized Geometric Diamond / Rectangle Motif
  const midX = 512
  const midY = 960
  const boxW = 270
  const boxH = 340

  ctx.lineWidth = 32
  ctx.strokeStyle = '#00F0A0'
  ctx.beginPath()
  ctx.roundRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH, 40)
  ctx.stroke()

  // 5. Draw Cute Chibi Face Directly on the Front Lip (Top of canvas, Y = 100 to 360)
  const faceCenterX = 512
  const faceCenterY = 220

  // 5a. Glowing Turquoise Blush Cheeks (#00F0A0)
  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.ellipse(faceCenterX - 175, faceCenterY + 45, 62, 38, 0, 0, Math.PI * 2)
  ctx.ellipse(faceCenterX + 175, faceCenterY + 45, 62, 38, 0, 0, Math.PI * 2)
  ctx.fill()

  if (blink) {
    // Blinking eye arcs
    ctx.strokeStyle = '#0b0d17'
    ctx.lineWidth = 16
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, faceCenterY - 10, 42, 0.85 * Math.PI, 0.15 * Math.PI, true)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(faceCenterX + 110, faceCenterY - 10, 42, 0.85 * Math.PI, 0.15 * Math.PI, true)
    ctx.stroke()
  } else {
    // 5b. Chibi Glossy Black Eyes (#0b0d17)
    ctx.fillStyle = '#0b0d17'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, faceCenterY - 15, 54, 0, Math.PI * 2)
    ctx.arc(faceCenterX + 110, faceCenterY - 15, 54, 0, Math.PI * 2)
    ctx.fill()

    // 5c. Dual White Specular Highlights in Each Eye
    ctx.fillStyle = '#ffffff'
    // Left eye
    ctx.beginPath()
    ctx.arc(faceCenterX - 124, faceCenterY - 32, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX - 93, faceCenterY + 8, 10, 0, Math.PI * 2)
    ctx.fill()
    // Right eye
    ctx.beginPath()
    ctx.arc(faceCenterX + 96, faceCenterY - 32, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX + 127, faceCenterY + 8, 10, 0, Math.PI * 2)
    ctx.fill()
  }

  // 5d. Cheerful Open D-Shape Smile with Pink Tongue
  ctx.fillStyle = '#0b0d17'
  ctx.beginPath()
  ctx.arc(faceCenterX, faceCenterY + 30, 48, 0.05 * Math.PI, 0.95 * Math.PI, false)
  ctx.closePath()
  ctx.fill()

  // Vibrant Pink Tongue (#FF4D82)
  ctx.save()
  ctx.clip()
  ctx.fillStyle = '#FF4D82'
  ctx.beginPath()
  ctx.arc(faceCenterX, faceCenterY + 74, 38, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  return canvas
}

/**
 * Generator function for Rigged SkinnedMesh Carpet
 * Sets up 5 spine bones and calculates smooth vertex skin weights.
 */
export function createRiggedCarpet(material: THREE.Material) {
  const width = 1.6
  const height = 2.4
  const segmentW = 32
  const segmentH = 48

  // 1. Plane Geometry with dense subdivision
  const geometry = new THREE.PlaneGeometry(width, height, segmentW, segmentH)

  // 2. Setup Bones (5 progressive spine bones)
  const bones: THREE.Bone[] = []
  const numBones = 5
  const segmentHeight = height / (numBones - 1)

  let prevBone: THREE.Bone | null = null
  for (let i = 0; i < numBones; i++) {
    const bone = new THREE.Bone()
    bone.name = `Spine_${i}`
    bone.position.y = i === 0 ? -height / 2 : segmentHeight

    if (prevBone) {
      prevBone.add(bone)
    }
    bones.push(bone)
    prevBone = bone
  }

  // 3. Compute Vertex Skinning Indices and Weights
  const position = geometry.attributes.position
  const skinIndices: number[] = []
  const skinWeights: number[] = []

  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i) + height / 2 // normalize 0 to height
    const normalizedY = Math.max(0, Math.min(1, y / height))

    // Determine nearest bone based on normalized Y position
    const boneIndex = normalizedY * (numBones - 1)
    const primaryBone = Math.floor(boneIndex)
    const secondaryBone = Math.min(numBones - 1, primaryBone + 1)
    const weight = boneIndex - primaryBone

    skinIndices.push(primaryBone, secondaryBone, 0, 0)
    skinWeights.push(1 - weight, weight, 0, 0)
  }

  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

  // 4. Build Skeleton & SkinnedMesh
  const skeleton = new THREE.Skeleton(bones)
  const skinnedMesh = new THREE.SkinnedMesh(geometry, material)
  skinnedMesh.add(bones[0]) // add root bone
  skinnedMesh.bind(skeleton)

  return { skinnedMesh, bones, skeleton }
}

export default function CarpetModel({
  pose = 'idle',
  interactive = true,
  onClick,
}: CarpetModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<THREE.Bone[]>([])
  const isSpinningRef = useRef(false)
  const isBlinkingRef = useRef(false)

  const { pointer } = useThree()

  // Generate Canvases & CanvasTextures
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

  // MeshPhysicalMaterial with Sheen & Rich Velvet Sheen
  const carpetMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: normalTexture || undefined,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2555E0'),
      sheenRoughness: 0.3,
      clearcoat: 0.2,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    })
  }, [normalTexture])

  // Rigged SkinnedMesh Setup
  const { skinnedMesh, bones } = useMemo(() => {
    return createRiggedCarpet(carpetMaterial)
  }, [carpetMaterial])

  useEffect(() => {
    bonesRef.current = bones
  }, [bones])

  // Periodic Chibi Blinking
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout

    const triggerBlink = () => {
      isBlinkingRef.current = true
      if (carpetMaterial && blinkTexture) {
        carpetMaterial.map = blinkTexture
        carpetMaterial.needsUpdate = true
      }

      setTimeout(() => {
        isBlinkingRef.current = false
        if (carpetMaterial && normalTexture) {
          carpetMaterial.map = normalTexture
          carpetMaterial.needsUpdate = true
        }
        const nextDelay = 3200 + Math.random() * 2500
        blinkTimeout = setTimeout(triggerBlink, nextDelay)
      }, 150)
    }

    blinkTimeout = setTimeout(triggerBlink, 2800)
    return () => clearTimeout(blinkTimeout)
  }, [carpetMaterial, normalTexture, blinkTexture])

  const handleClick = (e: any) => {
    e.stopPropagation()
    isSpinningRef.current = true
    setTimeout(() => {
      isSpinningRef.current = false
    }, 600)
    if (onClick) onClick()
  }

  // Skeletal Pose Interpolation & Micro-flutter in useFrame
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const targetRotations = POSE_DEFINITIONS[pose] || POSE_DEFINITIONS.idle

    bonesRef.current.forEach((bone) => {
      const target = targetRotations[bone.name]
      if (target) {
        // Natural silk cloth flutter/breathing
        const breathX = Math.sin(t * 2.2 + bone.position.y) * 0.035
        const breathZ = Math.cos(t * 1.8 + bone.position.y) * 0.025

        bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, target.x + breathX, 5.5, delta)
        bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, target.y, 5.5, delta)
        bone.rotation.z = THREE.MathUtils.damp(bone.rotation.z, target.z + breathZ, 5.5, delta)
      }
    })

    // Group floating levitation & interactive tilt
    if (groupRef.current) {
      // Gentle vertical levitation bobbing
      const levitateY = Math.sin(t * 1.8) * 0.08
      groupRef.current.position.y = levitateY

      // Click Spin
      if (isSpinningRef.current) {
        groupRef.current.rotation.y += delta * 12
      } else if (interactive) {
        // Subtly track user cursor
        const targetRotY = pointer.x * 0.25
        const targetRotX = -pointer.y * 0.2
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta)
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta)
      }
    }
  })

  return (
    <group ref={groupRef} onClick={handleClick}>
      <primitive object={skinnedMesh} />

      {/* 4 Corner Tassels attached to rear/front */}
      <group position={[-0.8, -1.2, 0]}>
        <mesh>
          <torusGeometry args={[0.04, 0.015, 8, 16]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshStandardMaterial color="#1037A6" roughness={0.4} />
        </mesh>
      </group>

      <group position={[0.8, -1.2, 0]}>
        <mesh>
          <torusGeometry args={[0.04, 0.015, 8, 16]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshStandardMaterial color="#1037A6" roughness={0.4} />
        </mesh>
      </group>

      <group position={[-0.8, 1.2, 0]}>
        <mesh>
          <torusGeometry args={[0.04, 0.015, 8, 16]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshStandardMaterial color="#1037A6" roughness={0.4} />
        </mesh>
      </group>

      <group position={[0.8, 1.2, 0]}>
        <mesh>
          <torusGeometry args={[0.04, 0.015, 8, 16]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshStandardMaterial color="#1037A6" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}
