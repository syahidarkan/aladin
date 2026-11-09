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
  | 'loading'
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
  // 1. Idle: Exact 1:1 matching official Aladin brand mascot render (media_1794188384447_112d8ee2.jpg)
  // Head/front lip scooped UP facing camera (Spine_3: 0.3, Spine_4: 0.85), body horizontal aerodynamic S-curve, tail slightly lifted
  idle: {
    Spine_0: { x: 0.28, y: 0.0, z: 0.0 },  // Tail (belakang) terangkat sedikit dengan 2 rumbai terpasang
    Spine_1: { x: -0.15, y: 0.0, z: 0.0 }, // Meratakan badan horizontal ke arah bidang terbang
    Spine_2: { x: -0.1, y: 0.0, z: 0.0 },  // Lengkungan aerodinamis S-wave
    Spine_3: { x: 0.3, y: 0.0, z: 0.0 },   // Mulai melengkung naik
    Spine_4: { x: 0.85, y: 0.0, z: 0.0 },  // Kepala depan tempat wajah: lipatan melipat tegak ke atas menghadap kamera
  },

  // 2. Stand: Standing upright
  stand: {
    Spine_0: { x: -0.2, y: 0, z: 0 },
    Spine_1: { x: 0.1, y: 0, z: 0 },
    Spine_2: { x: 0.0, y: 0, z: 0 },
    Spine_3: { x: 0.15, y: 0, z: 0 },
    Spine_4: { x: 0.25, y: 0, z: 0 },
  },

  // 3. Lay-Flat: Relaxed horizontal flight
  'lay-flat': {
    Spine_0: { x: 0.1, y: 0, z: 0 },
    Spine_1: { x: 0.0, y: 0, z: 0 },
    Spine_2: { x: 0.0, y: 0, z: 0 },
    Spine_3: { x: 0.1, y: 0, z: 0 },
    Spine_4: { x: 0.3, y: 0, z: 0 },
  },

  // 4. Curious-Bow: Polite greeting bow (Sharia Salam)
  'curious-bow': {
    Spine_0: { x: 0.1, y: 0, z: 0 },
    Spine_1: { x: -0.2, y: 0, z: 0 },
    Spine_2: { x: -0.2, y: 0, z: 0 },
    Spine_3: { x: 0.4, y: 0, z: 0 },
    Spine_4: { x: 0.9, y: 0, z: 0 },
  },

  // 5. Fold-Arms: Confident hero pose
  'fold-arms': {
    Spine_0: { x: 0.2, y: 0, z: 0 },
    Spine_1: { x: -0.1, y: 0, z: 0 },
    Spine_2: { x: 0.0, y: 0, z: 0 },
    Spine_3: { x: 0.35, y: 0, z: 0 },
    Spine_4: { x: 0.9, y: 0, z: 0 },
  },

  // 6. Loading: High-energy flight pose with head scooped up & aerodynamic wave flutter
  loading: {
    Spine_0: { x: 0.35, y: 0.0, z: 0.0 },
    Spine_1: { x: -0.2, y: 0.0, z: 0.0 },
    Spine_2: { x: -0.1, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.3, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.85, y: 0.0, z: 0.0 },
  },

  // 7. Transition-Sweep: Dynamic wide swoop covering camera viewport
  'transition-sweep': {
    Spine_0: { x: 0.1, y: 0.0, z: 0.0 },
    Spine_1: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_2: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.1, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.2, y: 0.0, z: 0.0 },
  },
}

interface CarpetModelProps {
  pose?: CarpetPose
  interactive?: boolean
  onClick?: () => void
  scale?: number
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

  // 5. Draw Cute Chibi Face Directly on the Front Lip (Top of canvas, near Spine_4, facing camera)
  const faceCenterX = 512
  const faceCenterY = 320

  // 5a. Glowing Vibrant Turquoise Blush Cheeks (#00F0A0)
  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.ellipse(faceCenterX - 180, faceCenterY + 15, 58, 44, 0, 0, Math.PI * 2)
  ctx.ellipse(faceCenterX + 180, faceCenterY + 15, 58, 44, 0, 0, Math.PI * 2)
  ctx.fill()

  if (blink) {
    // Blinking eye arcs (smiling squinting arcs ^ ^)
    ctx.strokeStyle = '#0A0A14'
    ctx.lineWidth = 16
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, faceCenterY - 20, 38, 1.15 * Math.PI, 1.85 * Math.PI, false)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(faceCenterX + 110, faceCenterY - 20, 38, 1.15 * Math.PI, 1.85 * Math.PI, false)
    ctx.stroke()
  } else {
    // 5b. Chibi Glossy Black Eyes (#0A0A14)
    ctx.fillStyle = '#0A0A14'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, faceCenterY - 25, 54, 0, Math.PI * 2)
    ctx.arc(faceCenterX + 110, faceCenterY - 25, 54, 0, Math.PI * 2)
    ctx.fill()

    // 5c. Dual White Specular Highlights in Each Eye (Large top-left, small bottom-right)
    ctx.fillStyle = '#FFFFFF'
    // Left eye
    ctx.beginPath()
    ctx.arc(faceCenterX - 124, faceCenterY - 40, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX - 93, faceCenterY - 10, 10, 0, Math.PI * 2)
    ctx.fill()
    // Right eye
    ctx.beginPath()
    ctx.arc(faceCenterX + 96, faceCenterY - 40, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX + 127, faceCenterY - 10, 10, 0, Math.PI * 2)
    ctx.fill()
  }

  // 5d. Cheerful Open D-Shape Smile with Pink Tongue (below eyes)
  const mouthY = faceCenterY + 45
  ctx.fillStyle = '#0A0A14'
  ctx.beginPath()
  ctx.arc(faceCenterX, mouthY, 48, 0.05 * Math.PI, 0.95 * Math.PI, false)
  ctx.closePath()
  ctx.fill()

  // Vibrant Pink Tongue (#FF4D82)
  ctx.save()
  ctx.clip()
  ctx.fillStyle = '#FF4D82'
  ctx.beginPath()
  ctx.arc(faceCenterX, mouthY + 36, 38, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  return canvas
}

/**
 * Generator function for Rigged SkinnedMesh Carpet
 * Sets up 5 progressive spine bones and computes smooth vertex skin weights.
 * Dual-Mesh Architecture: Front surface uses face CanvasTexture with FrontSide;
 * Underside surface uses solid Deep Royal Blue velvet (#1037A6) with BackSide.
 * Eliminates 100% of backface texture bleed!
 */
export function createRiggedCarpet(
  frontMaterial: THREE.Material,
  backMaterial?: THREE.Material
) {
  const width = 1.6
  const height = 2.4
  const segmentW = 32
  const segmentH = 48

  // 1. Plane Geometry with dense subdivision
  const frontGeometry = new THREE.PlaneGeometry(width, height, segmentW, segmentH)

  // 2. Setup Bones (5 progressive spine bones):
  // Spine_0 is Tail at -height/2 (-1.2)
  // Spine_1, Spine_2 (body)
  // Spine_3, Spine_4 is Head at +height/2 (+1.2)
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
  const position = frontGeometry.attributes.position
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

  frontGeometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  frontGeometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

  // 4. Back Geometry with identical skinning
  const backGeometry = frontGeometry.clone()

  // 5. Ensure Front & Back materials have strict sides to eliminate texture bleed
  frontMaterial.side = THREE.FrontSide

  const defaultBackMaterial =
    backMaterial ||
    new THREE.MeshPhysicalMaterial({
      color: 0x1037a6, // Pure Royal Blue Velvet, NO face bleed!
      roughness: 0.45,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#1E4CD8'),
      sheenRoughness: 0.3,
      side: THREE.BackSide,
    })
  defaultBackMaterial.side = THREE.BackSide

  // 6. Build Skeleton & Dual SkinnedMeshes
  const skeleton = new THREE.Skeleton(bones)

  const frontMesh = new THREE.SkinnedMesh(frontGeometry, frontMaterial)
  frontMesh.name = 'CarpetFront'
  frontMesh.bind(skeleton)

  const backMesh = new THREE.SkinnedMesh(backGeometry, defaultBackMaterial)
  backMesh.name = 'CarpetBack'
  backMesh.bind(skeleton)

  const carpetRig = new THREE.Group()
  carpetRig.name = 'RiggedCarpetActor'
  carpetRig.add(bones[0]) // Add root bone to hierarchy
  carpetRig.add(frontMesh)
  carpetRig.add(backMesh)

  // 7. Attach 2 Rear Tail Tassels directly to Tail Bone (bones[0] - Spine_0)
  const tasselMatMint = new THREE.MeshStandardMaterial({
    color: '#00F0A0',
    emissive: '#00F0A0',
    emissiveIntensity: 0.8,
  })
  const tasselMatBlue = new THREE.MeshStandardMaterial({
    color: '#1037A6',
    roughness: 0.35,
  })

  // Left Rear Tassel
  const tasselLeft = new THREE.Group()
  tasselLeft.position.set(-0.76, -0.06, 0)
  tasselLeft.rotation.set(0, 0, 0.25)
  const torusL = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16), tasselMatMint)
  const coneL = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 12), tasselMatBlue)
  coneL.position.set(0, -0.09, 0)
  coneL.rotation.set(Math.PI, 0, 0)
  tasselLeft.add(torusL)
  tasselLeft.add(coneL)
  bones[0].add(tasselLeft)

  // Right Rear Tassel
  const tasselRight = new THREE.Group()
  tasselRight.position.set(0.76, -0.06, 0)
  tasselRight.rotation.set(0, 0, -0.25)
  const torusR = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16), tasselMatMint)
  const coneR = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 12), tasselMatBlue)
  coneR.position.set(0, -0.09, 0)
  coneR.rotation.set(Math.PI, 0, 0)
  tasselRight.add(torusR)
  tasselRight.add(coneR)
  bones[0].add(tasselRight)

  return { carpetRig, skinnedMesh: carpetRig, frontMesh, backMesh, bones, skeleton }
}

export default function CarpetModel({
  pose = 'idle',
  interactive = true,
  onClick,
  scale = 1,
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

  // MeshPhysicalMaterial with Sheen & Rich Velvet Sheen (Front side only)
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
      side: THREE.FrontSide,
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

    bonesRef.current.forEach((bone, idx) => {
      const target = targetRotations[bone.name]
      if (target) {
        let flutterX = 0
        let flutterZ = 0

        if (pose === 'loading') {
          // Dynamic fluttering/flapping when curving
          flutterX = Math.sin(t * 6.0 + idx * 1.2) * 0.12
          flutterZ = Math.cos(t * 6.0 + idx * 1.2) * 0.08
        } else {
          // Natural silk cloth flutter/breathing
          flutterX = Math.sin(t * 2.2 + idx * 0.8) * 0.03
          flutterZ = Math.cos(t * 1.8 + idx * 0.8) * 0.02
        }

        bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, target.x + flutterX, 6.0, delta)
        bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, target.y, 6.0, delta)
        bone.rotation.z = THREE.MathUtils.damp(bone.rotation.z, target.z + flutterZ, 6.0, delta)
      }
    })

    // Group floating levitation & orientation
    if (groupRef.current) {
      if (pose === 'idle') {
        // Isometric 3/4 Perspective: front-left head scoop facing camera, flat horizontal body, rear tail lifted
        const baseX = -0.38 // ~-22 deg tilt towards camera
        const baseY = 0.49 // ~28 deg 3/4 isometric perspective
        const baseZ = -0.21 // ~-12 deg aerodynamic banking roll

        // Vertical levitation bobbing
        const levitateY = Math.sin(t * 1.8) * 0.1
        groupRef.current.position.y = levitateY

        if (isSpinningRef.current) {
          groupRef.current.rotation.y += delta * 12
        } else if (interactive) {
          const targetRotY = baseY + pointer.x * 0.2
          const targetRotX = baseX - pointer.y * 0.15
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta)
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, baseZ, 4, delta)
        } else {
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, baseX, 4, delta)
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, baseY, 4, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, baseZ, 4, delta)
        }
      } else if (pose === 'loading') {
        // Continuous 3D Acrobatic Lemniscate Figure-8 Loop with Banking
        const tFlight = t * 1.5
        groupRef.current.position.x = Math.sin(tFlight) * 1.2
        groupRef.current.position.y = Math.sin(tFlight * 2.0) * 0.4
        groupRef.current.position.z = Math.cos(tFlight) * 0.5

        // Banking roll, pitch & yaw
        groupRef.current.rotation.z = -Math.cos(tFlight) * 0.45
        groupRef.current.rotation.x = 0.45 + Math.cos(tFlight * 2.0) * 0.25
        groupRef.current.rotation.y = -Math.cos(tFlight) * 0.3
      } else {
        // Stand or other poses
        const levitateY = Math.sin(t * 1.8) * 0.08
        groupRef.current.position.y = levitateY

        if (isSpinningRef.current) {
          groupRef.current.rotation.y += delta * 12
        } else if (interactive) {
          const targetRotY = pointer.x * 0.25
          const targetRotX = -pointer.y * 0.2
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta)
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta)
        }
      }
    }
  })

  return (
    <group ref={groupRef} onClick={handleClick} scale={[scale, scale, scale]}>
      <primitive object={skinnedMesh} />

      {/* Magical Floating 3D Sparkle Star Particles (exact 1:1 to reference media_fa94c464.jpg) */}
      <group>
        {[
          { pos: [-0.95, 0.45, 0.35], s: 0.06 },
          { pos: [0.85, 0.85, 0.25], s: 0.075 },
          { pos: [-0.55, -0.65, 0.4], s: 0.05 },
          { pos: [0.95, -0.75, 0.2], s: 0.065 },
          { pos: [-0.3, 0.9, 0.3], s: 0.055 },
          { pos: [0.4, -0.1, 0.45], s: 0.06 },
        ].map((star, idx) => (
          <mesh key={idx} position={star.pos as [number, number, number]} scale={[star.s, star.s, star.s]}>
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
    </group>
  )
}
