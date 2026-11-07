'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

export type CarpetPose = 'idle' | 'fly-forward' | 'happy-spin' | 'curious'

interface CarpetModelProps {
  pose?: CarpetPose
  interactive?: boolean
  onClick?: () => void
}

/**
 * Procedural face texture generator for Aladin's Magic Carpet (512x512 CanvasTexture)
 * Implements chibi glossy black eyes with dual white specular highlights,
 * glowing turquoise blush cheeks, and cheerful open D-shape smile with pink tongue.
 */
export function createCarpetFaceTexture(blink: boolean = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.clearRect(0, 0, 512, 512)

  // 1. Blush Pipi (Toska Terang Glowing)
  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.ellipse(125, 275, 46, 28, 0, 0, Math.PI * 2)
  ctx.ellipse(387, 275, 46, 28, 0, 0, Math.PI * 2)
  ctx.fill()

  if (blink) {
    // Cute curved smiling line eyes when blinking
    ctx.strokeStyle = '#0b0d17'
    ctx.lineWidth = 12
    ctx.lineCap = 'round'

    // Left blinking eye arc
    ctx.beginPath()
    ctx.arc(175, 225, 28, 0.85 * Math.PI, 0.15 * Math.PI, true)
    ctx.stroke()

    // Right blinking eye arc
    ctx.beginPath()
    ctx.arc(337, 225, 28, 0.85 * Math.PI, 0.15 * Math.PI, true)
    ctx.stroke()
  } else {
    // 2. Mata Hitam Besar (Chibi Glossy Black)
    ctx.fillStyle = '#0b0d17'
    ctx.beginPath()
    ctx.arc(175, 225, 42, 0, Math.PI * 2)
    ctx.arc(337, 225, 42, 0, Math.PI * 2)
    ctx.fill()

    // Highlight Putih Mata (Besar & Kecil)
    ctx.fillStyle = '#ffffff'
    // Mata Kiri
    ctx.beginPath()
    ctx.arc(164, 212, 16, 0, Math.PI * 2) // Utama bulat besar kiri-atas
    ctx.arc(190, 238, 7.5, 0, Math.PI * 2) // Kedua bulat kecil kanan-bawah
    ctx.fill()
    // Mata Kanan
    ctx.beginPath()
    ctx.arc(326, 212, 16, 0, Math.PI * 2) // Utama bulat besar kiri-atas
    ctx.arc(352, 238, 7.5, 0, Math.PI * 2) // Kedua bulat kecil kanan-bawah
    ctx.fill()
  }

  // 3. Mulut Senyum Terbuka Ceria (D-Shape)
  ctx.fillStyle = '#0b0d17'
  ctx.beginPath()
  ctx.arc(256, 258, 38, 0.05 * Math.PI, 0.95 * Math.PI, false)
  ctx.closePath()
  ctx.fill()

  // Lidah Pink Ceria
  ctx.save()
  ctx.clip()
  ctx.fillStyle = '#FF4D82'
  ctx.beginPath()
  ctx.arc(256, 292, 28, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * Composite texture generator for Aladin's Magic Carpet surface (1024x1536).
 * Creates the exact Royal Blue velvet base, vibrant glowing turquoise border piping,
 * corner arc motifs, central diamond/rectangle emblem, and seamlessly anchors the face
 * on the front curled lip at the top of the canvas (V = 1.0).
 */
function createFullCarpetCanvas(blink: boolean = false): HTMLCanvasElement {
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
  // Occupies 48-52% width centered horizontally at X = 512
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
    // Left eye highlights
    ctx.beginPath()
    ctx.arc(faceCenterX - 124, faceCenterY - 32, 21, 0, Math.PI * 2) // big top-left
    ctx.arc(faceCenterX - 93, faceCenterY + 8, 10, 0, Math.PI * 2) // small bottom-right
    ctx.fill()
    // Right eye highlights
    ctx.beginPath()
    ctx.arc(faceCenterX + 96, faceCenterY - 32, 21, 0, Math.PI * 2) // big top-left
    ctx.arc(faceCenterX + 127, faceCenterY + 8, 10, 0, Math.PI * 2) // small bottom-right
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

export default function CarpetModel({
  pose = 'idle',
  interactive = true,
  onClick,
}: CarpetModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null)
  const carpetMeshRef = useRef<THREE.Mesh>(null)

  // 4 Tassels at rear corners (2 left, 2 right)
  const tasselL1Ref = useRef<THREE.Group>(null)
  const tasselL2Ref = useRef<THREE.Group>(null)
  const tasselR1Ref = useRef<THREE.Group>(null)
  const tasselR2Ref = useRef<THREE.Group>(null)

  const { pointer } = useThree()

  // Animation internal state
  const spinProgressRef = useRef(0)
  const isSpinningRef = useRef(false)
  const isBlinkingRef = useRef(false)

  // Pre-created canvases & textures
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

  // Procedural Deformable Grid Geometry
  // segX: width (u in [-1, 1]), segZ: length (v in [0, 1] from front lip v=0 to rear tail v=1)
  const { geometry, gridInfo } = useMemo(() => {
    const segX = 50
    const segZ = 70
    const numVerts = (segX + 1) * (segZ + 1)

    const positions = new Float32Array(numVerts * 3)
    const uvs = new Float32Array(numVerts * 2)
    const indices: number[] = []

    // Store base parametric u, v for each vertex
    const uArr = new Float32Array(numVerts)
    const vArr = new Float32Array(numVerts)

    let idx = 0
    for (let j = 0; j <= segZ; j++) {
      const v = j / segZ // 0 = front lip, 1 = rear edge
      for (let i = 0; i <= segX; i++) {
        const u = (i / segX) * 2 - 1 // -1 = left, +1 = right

        uArr[idx] = u
        vArr[idx] = v

        // UV mapping: v=0 (front lip) -> top of canvas (V_uv = 1.0)
        // v=1 (rear tail) -> bottom of canvas (V_uv = 0.0)
        uvs[idx * 2] = i / segX
        uvs[idx * 2 + 1] = 1.0 - v

        // Initial positions (will be deformed in useFrame)
        positions[idx * 3] = u * 1.15
        positions[idx * 3 + 1] = 0
        positions[idx * 3 + 2] = (v - 0.5) * 3.4

        idx++
      }
    }

    // Build triangle indices
    for (let j = 0; j < segZ; j++) {
      for (let i = 0; i < segX; i++) {
        const a = j * (segX + 1) + i
        const b = a + 1
        const c = a + (segX + 1)
        const d = c + 1

        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()

    return {
      geometry: geo,
      gridInfo: { uArr, vArr, count: numVerts },
    }
  }, [])

  // Velvet/Sheen Materials with Royal Blue base & Turquoise emissive highlights
  const carpetMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: normalTexture || undefined,
      color: 0xffffff,
      roughness: 0.28,
      metalness: 0.02,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2A5DFE'),
      sheenRoughness: 0.3,
      clearcoat: 0.25,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    })
  }, [normalTexture])

  // Neon Mint Ring Material for Tassels
  const mintRingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00f0a0,
        emissive: 0x00f0a0,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      }),
    []
  )

  // Tassel Skirt Material (Royal Blue velvet)
  const tasselBrushMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1037a6,
        roughness: 0.35,
        metalness: 0.1,
      }),
    []
  )

  // Automatic periodic chibi blinking (every 3.2 - 5 seconds)
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

  // Trigger happy spin on pose change or click
  useEffect(() => {
    if (pose === 'happy-spin') {
      isSpinningRef.current = true
      spinProgressRef.current = 0
    }
  }, [pose])

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    isSpinningRef.current = true
    spinProgressRef.current = 0
    onClick?.()
  }

  // Frame Loop: Parametric 3D Toboggan S-Curve with FROZEN Front Lip & Dynamic Cloth Wave
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (!carpetMeshRef.current || !rootGroupRef.current) return

    // 1. Interactive Pointer Banking & Tilting (Smooth Lerp)
    const targetPointerX = interactive ? pointer.x : 0
    const targetPointerY = interactive ? pointer.y : 0

    // Base semi-isometric front-facing diagonal orientation matching reference image:
    // Front lip with face is lower-left in foreground facing camera warmly, tail extends towards upper-right into depth
    const baseRotX = 0.18
    const baseRotY = -0.65
    const baseRotZ = -0.06

    let posePitch = 0
    let poseRoll = 0
    let poseElevation = 0
    let waveSpeed = 2.6
    let waveAmp = 0.12

    if (pose === 'fly-forward') {
      posePitch = 0.2
      waveSpeed = 4.4
      waveAmp = 0.15
    } else if (pose === 'curious') {
      posePitch = -0.16
      poseElevation = 0.15
      waveSpeed = 1.8
    }

    // Handle Happy 360 Spin Roll
    if (isSpinningRef.current) {
      spinProgressRef.current += delta * 4.2
      poseRoll += spinProgressRef.current * Math.PI * 2
      poseElevation += Math.sin(spinProgressRef.current * Math.PI) * 0.45
      if (spinProgressRef.current >= 1) {
        isSpinningRef.current = false
        spinProgressRef.current = 0
      }
    }

    // Apply Root Floating Bobbing & Rotation
    const floatY = Math.sin(t * 1.6) * 0.1 + poseElevation + 0.05
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(
      rootGroupRef.current.position.y,
      floatY,
      0.08
    )
    rootGroupRef.current.position.x = 0.05

    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      baseRotX + targetPointerY * -0.18 + posePitch,
      0.06
    )
    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.y,
      baseRotY + targetPointerX * 0.28,
      0.06
    )
    rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.z,
      baseRotZ + targetPointerX * -0.16 + poseRoll,
      0.06
    )

    // 2. Parametric 3D Toboggan S-Curve & Dynamic Cloth Wave Deformation
    const posAttr = carpetMeshRef.current.geometry.attributes.position
    const { uArr, vArr, count } = gridInfo

    let rearLeftPos = { x: -1.15, y: 0.5, z: 1.7 }
    let rearRightPos = { x: 1.15, y: 0.5, z: 1.7 }

    for (let i = 0; i < count; i++) {
      const u = uArr[i] // -1 (left) to +1 (right)
      const v = vArr[i] // 0 (front lip) to 1 (rear edge)

      // Width coordinates
      const posX = u * 1.15

      // 2a. BASE PARAMETRIC S-CURVE (Toboggan Front Lip + Valley Trough + Rear Sweep)
      let posY = 0
      let posZ = 0

      if (v < 0.28) {
        // FRONT LIP (v in [0, 0.28]): Smooth J-Hook curl curving UP into +Y and facing camera (+Z)
        const tCurl = (0.28 - v) / 0.28 // 1 at v=0 (tip), 0 at v=0.28
        const angle = tCurl * (Math.PI * 0.52) // ~93.6 degrees

        posY = -0.32 + Math.sin(angle) * 0.76
        posZ = 0.5 - (1 - Math.cos(angle)) * 0.42
      } else if (v <= 0.68) {
        // MID-BODY AERODYNAMIC TROUGH (v in [0.28, 0.68]): Gentle valley flowing into depth (-Z)
        const tMid = (v - 0.28) / 0.4 // 0 to 1
        posZ = 0.5 - tMid * 1.5
        posY = -0.32 - Math.sin(tMid * Math.PI) * 0.16
      } else {
        // REAR TAIL (v in [0.68, 1.0]): Sweeps back up gracefully into the air and depth (-Z)
        const tRear = (v - 0.68) / 0.32 // 0 to 1
        posZ = -1.0 - tRear * 0.95
        posY = -0.32 + Math.pow(tRear, 1.25) * 1.18
      }

      // 2b. FROZEN FRONT LIP REQUIREMENT:
      // Wave weight is strictly 0.0 for v < 0.28 so the front lip and face NEVER distort or jitter!
      let waveWeight = 0
      if (v > 0.28) {
        waveWeight = Math.min(1.0, (v - 0.28) / 0.35)
      }

      // Dynamic sinusoidal cloth wave traveling down the body
      const wave = Math.sin(v * 7.5 - t * waveSpeed) * waveAmp * waveWeight

      // Edge flutter on rear corners
      const edgeFlutter = Math.sin(t * 3.8 + u * 2.5) * 0.04 * (u * u) * waveWeight

      const finalY = posY + wave + edgeFlutter

      posAttr.setXYZ(i, posX, finalY, posZ)

      // Sample rear corners for tassels at v >= 0.98 (-Z is background)
      if (v >= 0.98) {
        if (u < -0.85) rearLeftPos = { x: posX, y: finalY, z: posZ }
        if (u > 0.85) rearRightPos = { x: posX, y: finalY, z: posZ }
      }
    }

    posAttr.needsUpdate = true
    carpetMeshRef.current.geometry.computeVertexNormals()

    // 3. Tassels Wind Flapping (4 Tassels at Rear Corners)
    const tasselSwayL = Math.sin(t * 3.8 + 0.5) * 0.22 + (pose === 'fly-forward' ? 0.35 : 0.06)
    const tasselSwayR = Math.sin(t * 3.8 + 1.2) * 0.22 + (pose === 'fly-forward' ? 0.35 : 0.06)

    // Rear-Left Corner Tassels (Pair of 2)
    if (tasselL1Ref.current) {
      tasselL1Ref.current.position.set(rearLeftPos.x - 0.08, rearLeftPos.y + 0.04, rearLeftPos.z - 0.08)
      tasselL1Ref.current.rotation.x = -tasselSwayL
      tasselL1Ref.current.rotation.z = -0.25
    }
    if (tasselL2Ref.current) {
      tasselL2Ref.current.position.set(rearLeftPos.x + 0.06, rearLeftPos.y + 0.02, rearLeftPos.z - 0.06)
      tasselL2Ref.current.rotation.x = -tasselSwayL * 0.85
      tasselL2Ref.current.rotation.z = -0.15
    }

    // Rear-Right Corner Tassels (Pair of 2)
    if (tasselR1Ref.current) {
      tasselR1Ref.current.position.set(rearRightPos.x + 0.08, rearRightPos.y + 0.04, rearRightPos.z - 0.08)
      tasselR1Ref.current.rotation.x = -tasselSwayR
      tasselR1Ref.current.rotation.z = 0.25
    }
    if (tasselR2Ref.current) {
      tasselR2Ref.current.position.set(rearRightPos.x - 0.06, rearRightPos.y + 0.02, rearRightPos.z - 0.06)
      tasselR2Ref.current.rotation.x = -tasselSwayR * 0.85
      tasselR2Ref.current.rotation.z = 0.15
    }
  })

  return (
    <group ref={rootGroupRef} onClick={handleClick}>
      {/* 1. Main Carpet 3D Surface with Full Face & Border Texture */}
      <mesh
        ref={carpetMeshRef}
        geometry={geometry}
        material={carpetMaterial}
        castShadow
        receiveShadow
      />

      {/* 2. Rear Corner Tassels: 4 Rumbai Silinder dengan Aksen Ring Toska */}
      {/* Tassel L1 */}
      <group ref={tasselL1Ref} position={[-1.15, 0.8, -1.9]}>
        <mesh material={mintRingMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.018, 12, 24]} />
        </mesh>
        <mesh material={tasselBrushMaterial} position={[0, 0.02, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.08, 0.26, 16]} />
        </mesh>
      </group>

      {/* Tassel L2 */}
      <group ref={tasselL2Ref} position={[-1.02, 0.78, -1.9]}>
        <mesh material={mintRingMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.016, 12, 24]} />
        </mesh>
        <mesh material={tasselBrushMaterial} position={[0, 0.02, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.07, 0.24, 16]} />
        </mesh>
      </group>

      {/* Tassel R1 */}
      <group ref={tasselR1Ref} position={[1.15, 0.8, -1.9]}>
        <mesh material={mintRingMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.018, 12, 24]} />
        </mesh>
        <mesh material={tasselBrushMaterial} position={[0, 0.02, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.08, 0.26, 16]} />
        </mesh>
      </group>

      {/* Tassel R2 */}
      <group ref={tasselR2Ref} position={[1.02, 0.78, -1.9]}>
        <mesh material={mintRingMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.016, 12, 24]} />
        </mesh>
        <mesh material={tasselBrushMaterial} position={[0, 0.02, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.07, 0.24, 16]} />
        </mesh>
      </group>
    </group>
  )
}
