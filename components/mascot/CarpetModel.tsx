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
 * Procedural texture generator for Aladin's Magic Carpet.
 * Renders the vibrant royal blue velvet base, glowing neon mint border piping,
 * corner circular arcs, and central diamond motif identical to reference photo.
 */
function createCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // 1. Rich Satin / Velvet Royal Blue Base
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1536)
  baseGrad.addColorStop(0, '#154AD8')
  baseGrad.addColorStop(0.4, '#1037A6')
  baseGrad.addColorStop(1, '#0A2578')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, 1024, 1536)

  // 2. Thick Vibrant Mint/Turquoise Outer Border Piping
  const borderWidth = 48
  const margin = 64
  const cornerRadius = 110

  ctx.strokeStyle = '#00F0A0'
  ctx.lineWidth = borderWidth
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.roundRect(margin, margin, 1024 - margin * 2, 1536 - margin * 2, cornerRadius)
  ctx.stroke()

  // 3. Corner Arc Motifs in all 4 corners
  const arcRadius = 150
  ctx.lineWidth = 34
  ctx.strokeStyle = '#00F0A0'

  // Front-Left Arc
  ctx.beginPath()
  ctx.arc(margin + 24, margin + 24, arcRadius, 0, Math.PI / 2, false)
  ctx.stroke()

  // Front-Right Arc
  ctx.beginPath()
  ctx.arc(1024 - margin - 24, margin + 24, arcRadius, Math.PI / 2, Math.PI, false)
  ctx.stroke()

  // Rear-Left Arc
  ctx.beginPath()
  ctx.arc(margin + 24, 1536 - margin - 24, arcRadius, -Math.PI / 2, 0, false)
  ctx.stroke()

  // Rear-Right Arc
  ctx.beginPath()
  ctx.arc(1024 - margin - 24, 1536 - margin - 24, arcRadius, Math.PI, -Math.PI / 2, false)
  ctx.stroke()

  // 4. Center Stylized Geometric Diamond / Rectangle Motif
  const midX = 512
  const midY = 920
  const boxW = 280
  const boxH = 360

  ctx.lineWidth = 36
  ctx.strokeStyle = '#00F0A0'
  ctx.beginPath()
  ctx.roundRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH, 44)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.flipY = false
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

export default function CarpetModel({
  pose = 'idle',
  interactive = true,
  onClick,
}: CarpetModelProps) {
  const rootGroupRef = useRef<THREE.Group>(null)
  const carpetMeshRef = useRef<THREE.Mesh>(null)
  const faceGroupRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Group>(null)
  const rightEyeRef = useRef<THREE.Group>(null)
  const leftTasselRef = useRef<THREE.Group>(null)
  const rightTasselRef = useRef<THREE.Group>(null)

  // Track cursor position for smooth pointer banking
  const { pointer } = useThree()

  // Animation internal state
  const spinProgressRef = useRef(0)
  const isSpinningRef = useRef(false)
  const [blinkScale, setBlinkScale] = useState(1)

  // Generate carpet texture on mount
  const carpetTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createCarpetTexture()
  }, [])

  // Procedural Carpet Mesh Geometry (Oriented in XZ plane: X is width, Z is length)
  const { geometry: baseGeometry, initialCoords } = useMemo(() => {
    const width = 2.4
    const length = 3.6
    const segX = 54
    const segZ = 72
    const geo = new THREE.PlaneGeometry(width, length, segX, segZ)

    // Store base coordinates: X is width [-1.2, 1.2], Y is length [-1.8, 1.8]
    const posAttr = geo.attributes.position
    const count = posAttr.count
    const coords = new Float32Array(count * 2)

    for (let i = 0; i < count; i++) {
      coords[i * 2] = posAttr.getX(i) // width x
      coords[i * 2 + 1] = posAttr.getY(i) // length z
    }

    return { geometry: geo, initialCoords: coords }
  }, [])

  // Velvet/Sheen Materials (White base so Canvas Texture colors render at 100% pure saturation)
  const carpetMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: carpetTexture || undefined,
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.08,
      sheen: 0.85,
      sheenColor: new THREE.Color(0x4361ee),
      sheenRoughness: 0.35,
      side: THREE.DoubleSide,
    })
  }, [carpetTexture])

  // Neon Mint Border Piping Ring Material
  const mintMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00f0a0,
        emissive: 0x00f0a0,
        emissiveIntensity: 0.9,
        roughness: 0.25,
      }),
    []
  )

  // Chibi Glossy Eye Material
  const eyeBallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x070d19,
        roughness: 0.08,
        metalness: 0.9,
      }),
    []
  )

  const eyeHighlightMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
    []
  )

  // Glowing Mint Blush Cheek Material
  const blushMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00f0a0,
        emissive: 0x00f0a0,
        emissiveIntensity: 1.5,
        roughness: 0.1,
      }),
    []
  )

  // Open Smiling Mouth Material
  const mouthBackMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x831843,
        roughness: 0.25,
      }),
    []
  )

  const tongueMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.3,
      }),
    []
  )

  // Automatic periodic chibi blinking (every 3.5 - 5 seconds)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout

    const triggerBlink = () => {
      setBlinkScale(0.08)
      setTimeout(() => {
        setBlinkScale(1)
        const nextDelay = 3200 + Math.random() * 2500
        blinkTimeout = setTimeout(triggerBlink, nextDelay)
      }, 130)
    }

    blinkTimeout = setTimeout(triggerBlink, 2800)
    return () => clearTimeout(blinkTimeout)
  }, [])

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

  // Frame Loop: Parametric Aerodynamic Wave Deformation & Interactive Posing
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (!carpetMeshRef.current || !rootGroupRef.current) return

    // 1. Interactive Pointer Banking & Tilting (Smooth Lerp)
    const targetPointerX = interactive ? pointer.x : 0
    const targetPointerY = interactive ? pointer.y : 0

    // Base isometric 3/4 flying orientation (matching reference photo: heading front-left, tail rear-right)
    const baseRotX = 0.22
    const baseRotY = -0.68
    const baseRotZ = -0.16

    let posePitch = 0
    let poseRoll = 0
    let poseElevation = 0
    let waveSpeed = 2.5
    let waveAmp = 0.13

    if (pose === 'fly-forward') {
      posePitch = 0.26 // dive forward
      waveSpeed = 4.2
      waveAmp = 0.16
    } else if (pose === 'curious') {
      posePitch = -0.16 // head up
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

    // Apply Root Rotation & Floating Bobbing (Raised slightly so face is prominently centered)
    const floatY = Math.sin(t * 1.6) * 0.12 + poseElevation + 0.28
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(
      rootGroupRef.current.position.y,
      floatY,
      0.08
    )
    rootGroupRef.current.position.x = 0.08

    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      baseRotX + targetPointerY * -0.2 + posePitch,
      0.06
    )
    rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.y,
      baseRotY + targetPointerX * 0.3,
      0.06
    )
    rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.z,
      baseRotZ + targetPointerX * -0.22 + poseRoll,
      0.06
    )

    // 2. Parametric S-Curve & Dynamic Cloth Wave Deformation in Local Mesh Space
    // Note: The PlaneGeometry local axes are X (width [-1.2, 1.2]) and Y (length [-1.8, 1.8]).
    // We deform Z (normal thickness) to create the 3D flying carpet curl!
    const posAttr = carpetMeshRef.current.geometry.attributes.position
    const count = posAttr.count

    // Track front head coordinates and normal tangent for face attachment
    let facePosX = 0
    let facePosY = 0
    let facePosZ = 0
    let rearLeftZ = 0
    let rearRightZ = 0

    for (let i = 0; i < count; i++) {
      const uX = initialCoords[i * 2]
      const uY = initialCoords[i * 2 + 1] // length axis: -1.8 (front) to +1.8 (rear)

      // Normalized length progress: -1 (front) to +1 (rear)
      const v = uY / 1.8

      // Characteristic Aladin S-Curve Profile:
      // Front (v < -0.25): curls smoothly UPWARD out of the plane (Z > 0)
      // Mid (-0.25 <= v <= 0.45): dips down into a graceful aerodynamic trough (Z < 0)
      // Rear (v > 0.45): sweeps back up and flattens out
      let baseZ = 0

      if (v < -0.25) {
        // Front upward head curl
        const curlT = (-v - 0.25) / 0.75 // 0 at -0.25, 1 at -1.0
        baseZ = Math.pow(curlT, 1.6) * 1.25
      } else if (v <= 0.45) {
        // Mid trough
        const dipT = (v + 0.25) / 0.7 // 0 at -0.25, 1 at 0.45
        baseZ = -Math.sin(dipT * Math.PI) * 0.32
      } else {
        // Rear upward scoop
        const rearT = (v - 0.45) / 0.55 // 0 at 0.45, 1 at 1.0
        baseZ = Math.pow(rearT, 1.3) * 0.65
      }

      // Traveling sinusoidal wind wave rippling from front to rear
      const wave = Math.sin(uY * 2.8 - t * waveSpeed) * waveAmp * (0.65 + Math.abs(v) * 0.35)

      // Subtle edge flutter
      const edgeFlutter = Math.sin(t * 3.5 + uX * 2.2) * 0.04 * (uX * uX)

      const finalZ = baseZ + wave + edgeFlutter

      // Deform Z in local plane space
      posAttr.setZ(i, finalZ)

      // Sample face attachment point on front curled chest (v ~ -0.48, uX ~ 0)
      if (Math.abs(v - -0.48) < 0.06 && Math.abs(uX) < 0.06) {
        facePosX = uX
        facePosY = uY
        facePosZ = finalZ
      }

      // Sample rear corners for tassels (v ~ 0.96, uX ~ ±1.12)
      if (v > 0.92 && uX < -1.05) rearLeftZ = finalZ
      if (v > 0.92 && uX > 1.05) rearRightZ = finalZ
    }

    posAttr.needsUpdate = true
    carpetMeshRef.current.geometry.computeVertexNormals()

    // 3. Attach Face Group Directly as Child of Mesh
    if (faceGroupRef.current) {
      // Place right on the outer surface of the front curled lip
      faceGroupRef.current.position.set(facePosX, facePosY + 0.1, facePosZ + 0.06)
      // Tilt face normal to align with the curled lip
      faceGroupRef.current.rotation.x = Math.PI / 4.2
    }

    // 4. Smooth Blinking Scale
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blinkScale
      rightEyeRef.current.scale.y = blinkScale
    }

    // 5. Tassels Wind Inertia Flapping at Rear Corners
    const tasselSwayL = Math.sin(t * 3.8 + 0.5) * 0.22 + (pose === 'fly-forward' ? 0.35 : 0.08)
    const tasselSwayR = Math.sin(t * 3.8 + 1.2) * 0.22 + (pose === 'fly-forward' ? 0.35 : 0.08)

    if (leftTasselRef.current) {
      leftTasselRef.current.position.set(-1.18, 1.82, rearLeftZ)
      leftTasselRef.current.rotation.x = -tasselSwayL
    }
    if (rightTasselRef.current) {
      rightTasselRef.current.position.set(1.18, 1.82, rearRightZ)
      rightTasselRef.current.rotation.x = -tasselSwayR
    }
  })

  return (
    <group ref={rootGroupRef} onClick={handleClick}>
      {/* ========================================================================= */}
      {/* 1. MAIN CARPET DEFORMABLE PLANE MESH                                     */}
      {/* ========================================================================= */}
      <mesh
        ref={carpetMeshRef}
        geometry={baseGeometry}
        material={carpetMaterial}
        castShadow
        receiveShadow
      >
        {/* ======================================================================= */}
        {/* 2. CHIBI FACE CLUSTER (Parented Directly to Carpet Mesh)                */}
        {/* ======================================================================= */}
        <group ref={faceGroupRef}>
          {/* Left Eye */}
          <group ref={leftEyeRef} position={[-0.38, 0.08, 0.08]}>
            {/* Glossy Black Eye Sphere */}
            <mesh material={eyeBallMaterial}>
              <sphereGeometry args={[0.145, 24, 24]} />
            </mesh>
            {/* Big White Specular Highlight (Top-Left) */}
            <mesh
              material={eyeHighlightMaterial}
              position={[-0.042, 0.046, 0.12]}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
            </mesh>
            {/* Small White Specular Highlight (Bottom-Right) */}
            <mesh
              material={eyeHighlightMaterial}
              position={[0.045, -0.048, 0.11]}
            >
              <sphereGeometry args={[0.026, 12, 12]} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group ref={rightEyeRef} position={[0.38, 0.08, 0.08]}>
            {/* Glossy Black Eye Sphere */}
            <mesh material={eyeBallMaterial}>
              <sphereGeometry args={[0.145, 24, 24]} />
            </mesh>
            {/* Big White Specular Highlight (Top-Left) */}
            <mesh
              material={eyeHighlightMaterial}
              position={[-0.042, 0.046, 0.12]}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
            </mesh>
            {/* Small White Specular Highlight (Bottom-Right) */}
            <mesh
              material={eyeHighlightMaterial}
              position={[0.045, -0.048, 0.11]}
            >
              <sphereGeometry args={[0.026, 12, 12]} />
            </mesh>
          </group>

          {/* Left Glowing Mint Blush Cheek */}
          <mesh
            material={blushMaterial}
            position={[-0.64, -0.03, 0.06]}
            scale={[1.3, 0.85, 0.4]}
          >
            <sphereGeometry args={[0.115, 16, 16]} />
          </mesh>

          {/* Right Glowing Mint Blush Cheek */}
          <mesh
            material={blushMaterial}
            position={[0.64, -0.03, 0.06]}
            scale={[1.3, 0.85, 0.4]}
          >
            <sphereGeometry args={[0.115, 16, 16]} />
          </mesh>

          {/* Cheerful Curved Open Smile Mouth */}
          <group position={[0, -0.08, 0.07]}>
            {/* Mouth Cavity (Dark Magenta/Pink) */}
            <mesh material={mouthBackMaterial} scale={[1.2, 0.9, 0.5]}>
              <sphereGeometry
                args={[0.125, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
              />
            </mesh>
            {/* Cute Pink Tongue */}
            <mesh
              material={tongueMaterial}
              position={[0, -0.05, 0.03]}
              scale={[0.8, 0.5, 0.4]}
            >
              <sphereGeometry args={[0.09, 16, 16]} />
            </mesh>
          </group>
        </group>

        {/* ======================================================================= */}
        {/* 3. REAR CORNER TASSELS (Parented to Carpet Mesh)                        */}
        {/* ======================================================================= */}
        {/* Left Rear Tassel */}
        <group ref={leftTasselRef} position={[-1.18, 1.82, 0.5]}>
          {/* Mint Binding Ring */}
          <mesh material={mintMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.022, 12, 24]} />
          </mesh>
          {/* Flared Blue Tassel Brush Strands */}
          <mesh
            material={carpetMaterial}
            position={[0, 0.22, 0]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.095, 0.32, 16]} />
          </mesh>
        </group>

        {/* Right Rear Tassel */}
        <group ref={rightTasselRef} position={[1.18, 1.82, 0.5]}>
          {/* Mint Binding Ring */}
          <mesh material={mintMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.022, 12, 24]} />
          </mesh>
          {/* Flared Blue Tassel Brush Strands */}
          <mesh
            material={carpetMaterial}
            position={[0, 0.22, 0]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.095, 0.32, 16]} />
          </mesh>
        </group>
      </mesh>
    </group>
  )
}
