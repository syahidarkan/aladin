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
 * Exact 3D spine curve stations measured directly from official Aladin Model Sheet
 * (Maskot All View / all 1 copy 4.jpeg - Left Side Profile View & all 1.jpeg - Front View).
 *
 * s: Arc progress along cloth from 0.0 (Hook Tip) to 1.0 (Rear Tail)
 * Z: Depth axis (positive towards camera, negative towards rear)
 * Y: Vertical height axis (+Y is up)
 */
export const SPINE_KEYPOINTS = [
  { s: 0.00, z:  0.70, y:  0.22 }, // 0: Hook tip (curled slightly inward)
  { s: 0.08, z:  0.82, y:  0.15 }, // 1: Forehead / upper front lip
  { s: 0.16, z:  0.85, y: -0.01 }, // 2: Mid face (eyes level - normal +Z straight at camera!)
  { s: 0.24, z:  0.78, y: -0.18 }, // 3: Mouth level
  { s: 0.32, z:  0.66, y: -0.28 }, // 4: Chin / fillet curve into belly
  { s: 0.42, z:  0.42, y: -0.36 }, // 5: Entry to belly trough
  { s: 0.52, z:  0.12, y: -0.38 }, // 6: Lowest point of belly trough
  { s: 0.62, z: -0.20, y: -0.30 }, // 7: Ascending glide (under Islamic star)
  { s: 0.72, z: -0.55, y: -0.12 }, // 8: Mid-body slope
  { s: 0.82, z: -0.85, y:  0.10 }, // 9: Shoulder rise
  { s: 0.91, z: -1.08, y:  0.24 }, // 10: Rear crest plateau
  { s: 1.00, z: -1.24, y:  0.28 }, // 11: Tail edge with 2 corner tassels
]

/**
 * Evaluates smooth Catmull-Rom spline along the spine curve at parameter t in [0, 1].
 */
export function getSpinePoint(t: number): { z: number; y: number } {
  const pts = SPINE_KEYPOINTS
  const clampedT = Math.max(0, Math.min(1, t))

  let i = 0
  while (i < pts.length - 1 && pts[i + 1].s < clampedT) {
    i++
  }
  if (i >= pts.length - 1) return { z: pts[pts.length - 1].z, y: pts[pts.length - 1].y }

  const p0 = pts[Math.max(0, i - 1)]
  const p1 = pts[i]
  const p2 = pts[i + 1]
  const p3 = pts[Math.min(pts.length - 1, i + 2)]

  const u = (clampedT - p1.s) / (p2.s - p1.s)
  const u2 = u * u
  const u3 = u2 * u

  const interpolate = (v0: number, v1: number, v2: number, v3: number) => {
    return (
      0.5 *
      (2 * v1 +
        (-v0 + v2) * u +
        (2 * v0 - 5 * v1 + 4 * v2 - v3) * u2 +
        (-v0 + 3 * v1 - 3 * v2 + v3) * u3)
    )
  }

  return {
    z: interpolate(p0.z, p1.z, p2.z, p3.z),
    y: interpolate(p0.y, p1.y, p2.y, p3.y),
  }
}

/**
 * Computes smooth outward surface normal along the spine curve
 */
export function getSpineOutwardNormal(s: number): { ny: number; nz: number } {
  let ny: number
  let nz: number
  if (s < 0.30) {
    // Front lip: normal faces towards camera (+Z) and slightly up
    ny = s < 0.15 ? 0.25 * (1 - s / 0.15) : 0.65 * ((s - 0.15) / 0.15)
    nz = s < 0.15 ? 0.97 : 1.0 - 0.25 * ((s - 0.15) / 0.15)
  } else {
    // Body: normal points upward (+Y)
    const tBody = (s - 0.30) / 0.70
    ny = 0.75 + 0.25 * Math.sin(tBody * Math.PI)
    nz = 0.65 * Math.cos(tBody * Math.PI * 0.85)
  }
  const len = Math.hypot(ny, nz) || 1
  return { ny: ny / len, nz: nz / len }
}

/**
 * Skeletal joint progress stations along the spine cloth
 */
export const BONE_STATIONS = [
  { name: 'Spine_0', s: 0.12 }, // Head / Front Lip (Face)
  { name: 'Spine_1', s: 0.28 }, // Throat / Chin Turn
  { name: 'Spine_2', s: 0.45 }, // Belly Trough
  { name: 'Spine_3', s: 0.72 }, // Mid-Body Rise
  { name: 'Spine_4', s: 0.96 }, // Tail with 2 Tassels
]

/**
 * Default bone rotations on top of the sculpted default geometry.
 * When all rotations are 0, it is 100% IDENTICAL to the official Model Sheet!
 */
export const POSE_DEFINITIONS: Record<CarpetPose, BoneRotations> = {
  idle: {
    Spine_0: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_1: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_2: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.0, y: 0.0, z: 0.0 },
  },
  stand: {
    Spine_0: { x: 0.2, y: 0, z: 0 },
    Spine_1: { x: 0.15, y: 0, z: 0 },
    Spine_2: { x: -0.1, y: 0, z: 0 },
    Spine_3: { x: -0.15, y: 0, z: 0 },
    Spine_4: { x: 0.2, y: 0, z: 0 },
  },
  'lay-flat': {
    Spine_0: { x: -0.2, y: 0, z: 0 },
    Spine_1: { x: -0.1, y: 0, z: 0 },
    Spine_2: { x: 0.05, y: 0, z: 0 },
    Spine_3: { x: 0.1, y: 0, z: 0 },
    Spine_4: { x: 0.15, y: 0, z: 0 },
  },
  'curious-bow': {
    Spine_0: { x: 0.25, y: 0, z: 0 },
    Spine_1: { x: 0.15, y: 0, z: 0 },
    Spine_2: { x: -0.15, y: 0, z: 0 },
    Spine_3: { x: 0.2, y: 0, z: 0 },
    Spine_4: { x: 0.35, y: 0, z: 0 },
  },
  'fold-arms': {
    Spine_0: { x: 0.15, y: 0, z: 0 },
    Spine_1: { x: -0.1, y: 0, z: 0 },
    Spine_2: { x: -0.05, y: 0, z: 0 },
    Spine_3: { x: 0.2, y: 0, z: 0 },
    Spine_4: { x: 0.3, y: 0, z: 0 },
  },
  loading: {
    Spine_0: { x: 0.05, y: -0.04, z: 0.03 },
    Spine_1: { x: -0.04, y: 0.03, z: -0.03 },
    Spine_2: { x: 0.02, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.08, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.15, y: 0.04, z: -0.04 },
  },
  'transition-sweep': {
    Spine_0: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_1: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_2: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.0, y: 0.0, z: 0.0 },
  },
}

interface CarpetModelProps {
  pose?: CarpetPose
  interactive?: boolean
  followCursor?: boolean
  onClick?: () => void
  scale?: number
}

/**
 * Creates procedural 1024x1536 texture matching Maskot All View turnaround sheet:
 * Top of canvas (Y=0) is Front Lip; Bottom of canvas (Y=1536) is Rear Tail.
 */
export function createFullCarpetCanvas(blink: boolean = false): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')!

  // 1. Royal Blue Velvet Gradient Base
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1536)
  baseGrad.addColorStop(0, '#154AD8')
  baseGrad.addColorStop(0.35, '#1037A6')
  baseGrad.addColorStop(0.85, '#0c2e91')
  baseGrad.addColorStop(1, '#081f68')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, 1024, 1536)

  // 2. Thick Vibrant Turquoise Border Piping (#00F0A0)
  const borderWidth = 42
  const margin = 52
  const cornerRadius = 90

  ctx.strokeStyle = '#00F0A0'
  ctx.lineWidth = borderWidth
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.roundRect(margin, margin, 1024 - margin * 2, 1536 - margin * 2, cornerRadius)
  ctx.stroke()

  // Inner thin border line
  ctx.strokeStyle = '#00F0A0'
  ctx.lineWidth = 14
  ctx.beginPath()
  ctx.roundRect(margin + 40, margin + 40, 1024 - (margin + 40) * 2, 1536 - (margin + 40) * 2, cornerRadius - 20)
  ctx.stroke()

  // 3. Corner Arc Motifs in all 4 corners
  const arcRadius = 140
  ctx.lineWidth = 26
  ctx.strokeStyle = '#00F0A0'

  // Front-Left Arc (Top-Left)
  ctx.beginPath()
  ctx.arc(margin + 36, margin + 36, arcRadius, 0, Math.PI / 2, false)
  ctx.stroke()

  // Front-Right Arc (Top-Right)
  ctx.beginPath()
  ctx.arc(1024 - margin - 36, margin + 36, arcRadius, Math.PI / 2, Math.PI, false)
  ctx.stroke()

  // Rear-Left Arc (Bottom-Left)
  ctx.beginPath()
  ctx.arc(margin + 36, 1536 - margin - 36, arcRadius, -Math.PI / 2, 0, false)
  ctx.stroke()

  // Rear-Right Arc (Bottom-Right)
  ctx.beginPath()
  ctx.arc(1024 - margin - 36, 1536 - margin - 36, arcRadius, Math.PI, -Math.PI / 2, false)
  ctx.stroke()

  // 4. Cute Chibi Face Directly on the Front Lip (at Y = 280, facing camera upright!)
  const faceCenterX = 512
  const faceCenterY = 275

  // 4a. Glowing Vibrant Turquoise Blush Cheeks (#00F0A0)
  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.ellipse(faceCenterX - 185, faceCenterY + 15, 60, 44, 0, 0, Math.PI * 2)
  ctx.ellipse(faceCenterX + 185, faceCenterY + 15, 60, 44, 0, 0, Math.PI * 2)
  ctx.fill()

  const eyesY = faceCenterY - 32
  if (blink) {
    ctx.strokeStyle = '#0A0A14'
    ctx.lineWidth = 16
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, eyesY, 40, 0.15 * Math.PI, 0.85 * Math.PI, false)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(faceCenterX + 110, eyesY, 40, 0.15 * Math.PI, 0.85 * Math.PI, false)
    ctx.stroke()
  } else {
    // 4b. Chibi Glossy Black Eyes (#0A0A14)
    ctx.fillStyle = '#0A0A14'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, eyesY, 54, 0, Math.PI * 2)
    ctx.arc(faceCenterX + 110, eyesY, 54, 0, Math.PI * 2)
    ctx.fill()

    // 4c. Dual White Specular Highlights in Each Eye
    ctx.fillStyle = '#FFFFFF'
    // Left eye
    ctx.beginPath()
    ctx.arc(faceCenterX - 124, eyesY - 15, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX - 94, eyesY + 15, 10, 0, Math.PI * 2)
    ctx.fill()
    // Right eye
    ctx.beginPath()
    ctx.arc(faceCenterX + 96, eyesY - 15, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX + 126, eyesY + 15, 10, 0, Math.PI * 2)
    ctx.fill()
  }

  // 4d. Cheerful Open D-Shape Smile with Pink Tongue
  const mouthY = faceCenterY + 45
  ctx.fillStyle = '#0A0A14'
  ctx.beginPath()
  ctx.arc(faceCenterX, mouthY, 46, 0, Math.PI, false)
  ctx.closePath()
  ctx.fill()

  // Vibrant Pink Tongue (#FF4D82) - sits inside lower half of smile
  ctx.save()
  ctx.clip()
  ctx.fillStyle = '#FF4D82'
  ctx.beginPath()
  ctx.arc(faceCenterX, mouthY + 28, 28, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 5. Center Motif: Rub el Hizb (8-pointed Islamic Star Symbol of Bank Aladin Syariah)
  // Drawn at center of carpet body (Y = 980, visible in 3/4 and top-down views!)
  const starCenterX = 512
  const starCenterY = 980
  const outerW = 280
  const outerH = 330
  const innerW = 150
  const innerH = 175

  const drawStarRect = (cx: number, cy: number, w: number, h: number, angleRad: number, lineWidth: number) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angleRad)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = '#00F0A0'
    ctx.beginPath()
    ctx.roundRect(-w / 2, -h / 2, w, h, 26)
    ctx.stroke()
    ctx.restore()
  }

  // Outer 8-pointed star: Two overlapping rounded rectangles (0° and 45°)
  drawStarRect(starCenterX, starCenterY, outerW, outerH, 0, 26)
  drawStarRect(starCenterX, starCenterY, outerW, outerH, Math.PI / 4, 26)

  // Inner concentric 8-pointed star
  drawStarRect(starCenterX, starCenterY, innerW, innerH, 0, 14)
  drawStarRect(starCenterX, starCenterY, innerW, innerH, Math.PI / 4, 14)

  // Central star diamond accent
  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.arc(starCenterX, starCenterY, 18, 0, Math.PI * 2)
  ctx.fill()

  return canvas
}

/**
 * Procedural Curved Carpet Geometry Generator
 * Builds an extruded 3D carpet sheet with thickness:
 * - isFront = true: Top surface (offset +0.008 outward, normal pointing outward)
 * - isFront = false: Bottom surface (offset -0.008 inward, normal pointing inward)
 */
export function createCurvedCarpetGeometry(
  width = 1.6,
  segmentW = 32,
  segmentH = 64,
  isFront = true
) {
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const halfW = width / 2
  const thickness = isFront ? 0.008 : -0.008

  for (let j = 0; j <= segmentH; j++) {
    const v = j / segmentH // 0 at hook tip, 1 at tail
    const spine = getSpinePoint(v)
    const norm = getSpineOutwardNormal(v)

    for (let i = 0; i <= segmentW; i++) {
      const u = i / segmentW // 0 left, 1 right
      const x = -halfW + u * width

      // Subtle organic side-edge curl
      const edgeCurl = Math.sin(u * Math.PI) * 0.015

      // Offset vertex along outward normal by thickness
      const vx = x
      const vy = spine.y - edgeCurl + norm.ny * thickness
      const vz = spine.z + norm.nz * thickness

      positions.push(vx, vy, vz)

      // Set explicit vertex normals
      if (isFront) {
        normals.push(0, norm.ny, norm.nz)
      } else {
        normals.push(0, -norm.ny, -norm.nz)
      }

      // UV mapping: u across width, (1 - v) so that v=0 (hook tip) maps to top of canvas (Y=0, upright face)
      uvs.push(u, 1 - v)
    }
  }

  // Generate triangles with winding order matching normal direction
  for (let j = 0; j < segmentH; j++) {
    for (let i = 0; i < segmentW; i++) {
      const a = j * (segmentW + 1) + i
      const b = j * (segmentW + 1) + (i + 1)
      const c = (j + 1) * (segmentW + 1) + i
      const d = (j + 1) * (segmentW + 1) + (i + 1)

      if (isFront) {
        // Front surface: (a, c, b) & (b, c, d)
        indices.push(a, c, b)
        indices.push(b, c, d)
      } else {
        // Back surface: opposite winding (a, b, c) & (b, d, c)
        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)

  return geometry
}

/**
 * Generator function for Rigged SkinnedMesh Curved Carpet
 * Sets up 5 progressive spine bones and computes smooth vertex skin weights.
 * Dual-Mesh Architecture: Top surface uses face CanvasTexture with FrontSide;
 * Underside surface uses solid Deep Royal Blue velvet (#1037A6) with FrontSide on inward geometry.
 * Eliminates 100% of backface texture bleed!
 */
export function createRiggedCarpet(
  frontMaterial: THREE.Material,
  backMaterial?: THREE.Material
) {
  const segmentW = 32
  const segmentH = 64

  // 1. Dual Geometries: Top Surface & Bottom Underside
  const frontGeometry = createCurvedCarpetGeometry(1.6, segmentW, segmentH, true)
  const backGeometry = createCurvedCarpetGeometry(1.6, segmentW, segmentH, false)

  // 2. Setup 5 Progressive Spine Bones along the curve
  const bones: THREE.Bone[] = []
  const boneWorldPositions: THREE.Vector3[] = []

  for (let i = 0; i < BONE_STATIONS.length; i++) {
    const station = BONE_STATIONS[i]
    const spine = getSpinePoint(station.s)
    const worldPos = new THREE.Vector3(0, spine.y, spine.z)
    boneWorldPositions.push(worldPos)

    const bone = new THREE.Bone()
    bone.name = station.name

    if (i === 0) {
      bone.position.copy(worldPos)
    } else {
      const parentPos = boneWorldPositions[i - 1]
      bone.position.subVectors(worldPos, parentPos)
      bones[i - 1].add(bone)
    }
    bones.push(bone)
  }

  // 3. Compute Smooth Vertex Skinning Weights
  const posAttr = frontGeometry.attributes.position
  const skinIndices: number[] = []
  const skinWeights: number[] = []

  for (let i = 0; i < posAttr.count; i++) {
    const j = Math.floor(i / (segmentW + 1))
    const v = j / segmentH

    let bestBone = 0
    let minDiff = 999
    for (let b = 0; b < BONE_STATIONS.length; b++) {
      const diff = Math.abs(v - BONE_STATIONS[b].s)
      if (diff < minDiff) {
        minDiff = diff
        bestBone = b
      }
    }

    let secondBone = bestBone
    if (v < BONE_STATIONS[bestBone].s && bestBone > 0) {
      secondBone = bestBone - 1
    } else if (v > BONE_STATIONS[bestBone].s && bestBone < BONE_STATIONS.length - 1) {
      secondBone = bestBone + 1
    }

    const s1 = BONE_STATIONS[bestBone].s
    const s2 = BONE_STATIONS[secondBone].s
    let weight = 1.0
    if (s1 !== s2) {
      const dist = Math.abs(v - s1)
      const totalSpan = Math.abs(s2 - s1)
      weight = Math.max(0, Math.min(1, 1 - dist / totalSpan))
    }

    skinIndices.push(bestBone, secondBone, 0, 0)
    skinWeights.push(weight, 1 - weight, 0, 0)
  }

  frontGeometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  frontGeometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

  backGeometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  backGeometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

  // 4. Materials
  frontMaterial.side = THREE.DoubleSide // Both front face and body are fully visible

  const defaultBackMaterial =
    backMaterial ||
    new THREE.MeshPhysicalMaterial({
      color: 0x1037a6, // Pure Royal Blue Velvet underside, NO face bleed!
      roughness: 0.45,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#1E4CD8'),
      sheenRoughness: 0.3,
      side: THREE.FrontSide,
    })

  // 5. Build Skeleton & Dual SkinnedMeshes
  const skeleton = new THREE.Skeleton(bones)

  const frontMesh = new THREE.SkinnedMesh(frontGeometry, frontMaterial)
  frontMesh.name = 'CarpetFront'
  frontMesh.bind(skeleton)

  const backMesh = new THREE.SkinnedMesh(backGeometry, defaultBackMaterial)
  backMesh.name = 'CarpetBack'
  backMesh.bind(skeleton)

  const carpetRig = new THREE.Group()
  carpetRig.name = 'RiggedCarpetActor'
  carpetRig.add(bones[0])
  carpetRig.add(backMesh)
  carpetRig.add(frontMesh)

  // 6. Attach 2 Rear Tail Tassels directly to Tail Bone (bones[4] - Spine_4)
  const tailSpine = getSpinePoint(1.0)
  const bone4Pos = boneWorldPositions[4]
  const tasselOffsetY = tailSpine.y - bone4Pos.y
  const tasselOffsetZ = tailSpine.z - bone4Pos.z

  const tasselMatMint = new THREE.MeshStandardMaterial({
    color: '#00F0A0',
    emissive: '#00F0A0',
    emissiveIntensity: 0.8,
  })
  const tasselMatBlue = new THREE.MeshStandardMaterial({
    color: '#1037A6',
    roughness: 0.35,
  })

  // Left Rear Tassel (attached at rear left corner x = -0.74)
  const tasselLeft = new THREE.Group()
  tasselLeft.position.set(-0.74, tasselOffsetY, tasselOffsetZ)
  tasselLeft.rotation.set(-Math.PI / 2, 0, 0.25)
  const torusL = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16), tasselMatMint)
  const coneL = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 12), tasselMatBlue)
  coneL.position.set(0, 0.11, 0)
  tasselLeft.add(torusL)
  tasselLeft.add(coneL)
  bones[4].add(tasselLeft)

  // Right Rear Tassel (attached at rear right corner x = +0.74)
  const tasselRight = new THREE.Group()
  tasselRight.position.set(0.74, tasselOffsetY, tasselOffsetZ)
  tasselRight.rotation.set(-Math.PI / 2, 0, -0.25)
  const torusR = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 16), tasselMatMint)
  const coneR = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 12), tasselMatBlue)
  coneR.position.set(0, 0.11, 0)
  tasselRight.add(torusR)
  tasselRight.add(coneR)
  bones[4].add(tasselRight)

  return { carpetRig, skinnedMesh: carpetRig, frontMesh, backMesh, bones, skeleton }
}

export default function CarpetModel({
  pose = 'idle',
  interactive = true,
  followCursor = true,
  onClick,
  scale = 1,
}: CarpetModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<THREE.Bone[]>([])
  const isSpinningRef = useRef(false)
  const isBlinkingRef = useRef(false)
  const mouseCoordsRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })

  const { pointer, gl } = useThree()

  // Global Pointer & Touch Tracking across entire screen
  useEffect(() => {
    if (!followCursor && !interactive) return

    let idleTimeout: NodeJS.Timeout
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      let clientX = 0
      let clientY = 0
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else {
        return
      }

      if (gl.domElement) {
        const rect = gl.domElement.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Normalized offset from canvas center to cursor ([-1, 1])
        const dx = Math.max(-1, Math.min(1, (clientX - centerX) / 360))
        const dy = Math.max(-1, Math.min(1, (clientY - centerY) / 360))

        mouseCoordsRef.current = { x: dx, y: dy, active: true }

        clearTimeout(idleTimeout)
        idleTimeout = setTimeout(() => {
          mouseCoordsRef.current.active = false
        }, 2500)
      }
    }

    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('touchmove', handlePointer, { passive: true })

    return () => {
      clearTimeout(idleTimeout)
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('touchmove', handlePointer)
    }
  }, [followCursor, interactive, gl])

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
      roughness: 0.42,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#2555E0'),
      sheenRoughness: 0.35,
      clearcoat: 0.08,
      clearcoatRoughness: 0.3,
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

    bonesRef.current.forEach((bone, idx) => {
      const target = targetRotations[bone.name]
      if (target) {
        let flutterX = 0
        let flutterZ = 0

        if (pose === 'loading') {
          flutterX = Math.sin(t * 6.0 + idx * 1.2) * 0.08
          flutterZ = Math.cos(t * 6.0 + idx * 1.2) * 0.05
        } else {
          flutterX = Math.sin(t * 2.2 + idx * 0.8) * 0.02
          flutterZ = Math.cos(t * 1.8 + idx * 0.8) * 0.015
        }

        bone.rotation.x = THREE.MathUtils.damp(bone.rotation.x, target.x + flutterX, 6.0, delta)
        bone.rotation.y = THREE.MathUtils.damp(bone.rotation.y, target.y, 6.0, delta)
        bone.rotation.z = THREE.MathUtils.damp(bone.rotation.z, target.z + flutterZ, 6.0, delta)
      }
    })

    // Group floating levitation & orientation
    if (groupRef.current) {
      if (pose === 'idle') {
        const levitateY = Math.sin(t * 1.8) * 0.05
        groupRef.current.position.set(0.0, 0.04 + levitateY, 0.0)

        if (isSpinningRef.current) {
          groupRef.current.rotation.y += delta * 12
        } else if (followCursor && mouseCoordsRef.current.active) {
          // Dynamic Cursor Tracking: mascot actively looks toward pointer anywhere on screen!
          const { x, y } = mouseCoordsRef.current
          // x > 0 (cursor right) -> positive yaw rotation (look right)
          // x < 0 (cursor left) -> negative yaw rotation (look left)
          const targetRotY = x * 0.42
          // y < 0 (cursor above) -> negative pitch rotation (look up)
          // y > 0 (cursor below) -> positive pitch rotation (look down)
          const targetRotX = y * 0.28
          const targetRotZ = -x * 0.10

          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5.0, delta)
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 5.0, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 5.0, delta)

          // Extra cuteness: head bone (Spine_0) tilts slightly towards the cursor
          if (bonesRef.current[0]) {
            bonesRef.current[0].rotation.y = THREE.MathUtils.damp(bonesRef.current[0].rotation.y, targetRotY * 0.35, 6.0, delta)
            bonesRef.current[0].rotation.x = THREE.MathUtils.damp(bonesRef.current[0].rotation.x, targetRotX * 0.3, 6.0, delta)
          }
        } else if (interactive) {
          const targetRotY = pointer.x * 0.25
          const targetRotX = -pointer.y * 0.15
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4.0, delta)
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4.0, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0, 4.0, delta)
        } else {
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0, 4.0, delta)
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 4.0, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0, 4.0, delta)
        }
      } else if (pose === 'loading') {
        const tFlight = t * 1.5
        groupRef.current.position.x = Math.sin(tFlight) * 0.35
        groupRef.current.position.y = 0.04 + Math.sin(tFlight * 2.0) * 0.15
        groupRef.current.position.z = Math.cos(tFlight) * 0.2

        groupRef.current.rotation.x = Math.sin(tFlight * 2.0) * 0.1
        groupRef.current.rotation.y = Math.sin(tFlight) * 0.2
        groupRef.current.rotation.z = -Math.cos(tFlight) * 0.15
      } else {
        const levitateY = Math.sin(t * 1.8) * 0.05
        groupRef.current.position.y = levitateY

        if (isSpinningRef.current) {
          groupRef.current.rotation.y += delta * 12
        } else if (interactive) {
          const targetRotY = pointer.x * 0.2
          const targetRotX = -pointer.y * 0.15
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta)
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta)
        }
      }
    }
  })

  return (
    <group ref={groupRef} onClick={handleClick} scale={[scale, scale, scale]}>
      <primitive object={skinnedMesh} />

      {/* Magical Floating 3D Sparkle Star Particles (exact match to Maskot All View) */}
      <group>
        {[
          { pos: [-0.95, 0.45, 0.35], s: 0.06 },
          { pos: [0.85, 0.65, 0.25], s: 0.075 },
          { pos: [-0.65, -0.45, 0.4], s: 0.05 },
          { pos: [0.95, -0.45, 0.2], s: 0.065 },
          { pos: [-0.3, 0.7, -0.2], s: 0.055 },
          { pos: [0.65, 0.15, 0.45], s: 0.06 }, // Offset away from center face
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
