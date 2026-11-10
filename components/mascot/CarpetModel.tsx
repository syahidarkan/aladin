'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

export type CarpetPose =
  | 'idle'
  | 'stand'
  | 'waving'
  | 'pointing'
  | 'clapping'
  | 'polite-bow'
  | 'shielding'
  | 'curious-think'
  | 'peek-a-boo-hide'
  | 'peek-a-boo-reveal'
  | 'thumbs-up'
  | 'shiver-freeze'
  | 'celebrate-max'
  | 'roll-cylinder'
  | 'ihrom-bow'
  | 'jet-glide'
  | 'tawaf-spiral'
  | 'barrel-roll'
  | 'nfc-tap'
  | 'peeking'
  | 'host-proud'
  | 'curious-bow'
  | 'lay-flat'
  | 'fold-arms'
  | 'loading'
  | 'transition-sweep'

export type MascotFace = 'cheerful' | 'wink' | 'blink' | 'curious' | 'proud' | 'chill'

interface BoneRotations {
  [boneName: string]: { x: number; y: number; z: number }
}

/**
 * Exact 3D spine curve stations measured directly from official Aladin Model Sheet
 * (Maskot All View / all 1 copy 4.jpeg - Left Side Profile View & all 1.jpeg - Front View).
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
  { s: 1.00, z: -1.24, y:  0.28 }, // 11: Tail edge with 4 rear tassels
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
 * Skeletal joint stations along spine cloth
 */
export const BONE_STATIONS = [
  { name: 'Spine_0', s: 0.12 }, // Head / Front Lip (Face)
  { name: 'Spine_1', s: 0.28 }, // Throat / Chin Turn
  { name: 'Spine_2', s: 0.45 }, // Belly Trough
  { name: 'Spine_3', s: 0.72 }, // Mid-Body Rise
  { name: 'Spine_4', s: 0.96 }, // Tail with 4 Tassels
]

/**
 * Comprehensive Bone Rotations for all Alan's Acting Poses.
 * Masterfully blends spine posture and 4 corner articulations.
 */
export const POSE_DEFINITIONS: Record<CarpetPose, BoneRotations> = {
  idle: {
    Spine_0: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_1: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_2: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_FL: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_FR: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_RL: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_RR: { x: 0.0, y: 0.0, z: 0.0 },
  },
  stand: {
    Spine_0: { x: 0.22, y: 0, z: 0 },
    Spine_1: { x: 0.18, y: 0, z: 0 },
    Spine_2: { x: -0.12, y: 0, z: 0 },
    Spine_3: { x: -0.22, y: 0, z: 0 },
    Spine_4: { x: 0.26, y: 0, z: 0 },
    Corner_FL: { x: -0.05, y: 0.08, z: 0.04 },
    Corner_FR: { x: -0.05, y: -0.08, z: -0.04 },
    Corner_RL: { x: 0.12, y: 0, z: 0 },
    Corner_RR: { x: 0.12, y: 0, z: 0 },
  },
  waving: {
    Spine_0: { x: 0.18, y: 0.05, z: 0.02 },
    Spine_1: { x: 0.12, y: 0, z: 0 },
    Spine_2: { x: -0.08, y: 0, z: 0 },
    Spine_3: { x: -0.16, y: 0, z: 0 },
    Spine_4: { x: 0.22, y: 0, z: 0 },
    Corner_FL: { x: -0.04, y: 0.06, z: 0.02 },
    Corner_FR: { x: 0.35, y: -0.25, z: -0.45 }, // Right corner lifted high & waving
    Corner_RL: { x: 0.1, y: 0, z: 0 },
    Corner_RR: { x: 0.1, y: 0, z: 0 },
  },
  pointing: {
    Spine_0: { x: 0.14, y: 0.20, z: -0.08 },
    Spine_1: { x: 0.08, y: 0.12, z: -0.04 },
    Spine_2: { x: -0.06, y: 0.06, z: 0.0 },
    Spine_3: { x: 0.08, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.15, y: -0.05, z: 0.0 },
    Corner_FL: { x: -0.1, y: 0.05, z: 0.05 },
    Corner_FR: { x: 0.55, y: -0.38, z: -0.65 }, // Pointing index corner straight ahead
    Corner_RL: { x: 0.05, y: 0, z: 0 },
    Corner_RR: { x: 0.05, y: 0, z: 0 },
  },
  clapping: {
    Spine_0: { x: 0.20, y: 0, z: 0 },
    Spine_1: { x: 0.10, y: 0, z: 0 },
    Spine_2: { x: -0.08, y: 0, z: 0 },
    Spine_3: { x: -0.14, y: 0, z: 0 },
    Spine_4: { x: 0.20, y: 0, z: 0 },
    Corner_FL: { x: 0.42, y: 0.38, z: 0.55 }, // Left corner bent inward
    Corner_FR: { x: 0.42, y: -0.38, z: -0.55 }, // Right corner bent inward to meet
    Corner_RL: { x: 0.08, y: 0, z: 0 },
    Corner_RR: { x: 0.08, y: 0, z: 0 },
  },
  'polite-bow': {
    Spine_0: { x: 0.38, y: 0, z: 0 }, // Head gracefully bowed
    Spine_1: { x: 0.28, y: 0, z: 0 },
    Spine_2: { x: -0.22, y: 0, z: 0 },
    Spine_3: { x: 0.28, y: 0, z: 0 },
    Spine_4: { x: 0.42, y: 0, z: 0 },
    Corner_FL: { x: 0.18, y: 0.15, z: 0.1 },
    Corner_FR: { x: 0.18, y: -0.15, z: -0.1 },
    Corner_RL: { x: 0.25, y: 0, z: 0 },
    Corner_RR: { x: 0.25, y: 0, z: 0 },
  },
  shielding: {
    Spine_0: { x: -0.24, y: 0, z: 0 }, // Arching upward like a protective dome
    Spine_1: { x: -0.32, y: 0, z: 0 },
    Spine_2: { x: 0.25, y: 0, z: 0 },
    Spine_3: { x: 0.35, y: 0, z: 0 },
    Spine_4: { x: -0.18, y: 0, z: 0 },
    Corner_FL: { x: -0.45, y: 0.25, z: 0.35 }, // Corners anchored down firmly
    Corner_FR: { x: -0.45, y: -0.25, z: -0.35 },
    Corner_RL: { x: -0.45, y: 0.25, z: 0.25 },
    Corner_RR: { x: -0.45, y: -0.25, z: -0.25 },
  },
  'curious-think': {
    Spine_0: { x: 0.18, y: 0.22, z: 0.18 }, // Curious tilted head
    Spine_1: { x: 0.08, y: 0.12, z: 0.10 },
    Spine_2: { x: -0.04, y: 0.0, z: -0.05 },
    Spine_3: { x: 0.06, y: -0.08, z: -0.08 },
    Spine_4: { x: 0.14, y: 0.0, z: 0.0 },
    Corner_FL: { x: 0.15, y: 0.12, z: 0.15 },
    Corner_FR: { x: 0.32, y: -0.18, z: -0.25 }, // Chin rest corner gesture
    Corner_RL: { x: 0.0, y: 0, z: 0 },
    Corner_RR: { x: 0.0, y: 0, z: 0 },
  },
  'peek-a-boo-hide': {
    Spine_0: { x: 0.12, y: 0, z: 0 },
    Spine_1: { x: 0.04, y: 0, z: 0 },
    Spine_2: { x: 0.0, y: 0, z: 0 },
    Spine_3: { x: 0.06, y: 0, z: 0 },
    Spine_4: { x: 0.12, y: 0, z: 0 },
    Corner_FL: { x: 0.65, y: 0.45, z: 0.75 }, // Folded completely over face eyes
    Corner_FR: { x: 0.65, y: -0.45, z: -0.75 },
    Corner_RL: { x: 0.05, y: 0, z: 0 },
    Corner_RR: { x: 0.05, y: 0, z: 0 },
  },
  'peek-a-boo-reveal': {
    Spine_0: { x: 0.22, y: 0, z: 0 },
    Spine_1: { x: 0.14, y: 0, z: 0 },
    Spine_2: { x: -0.08, y: 0, z: 0 },
    Spine_3: { x: -0.15, y: 0, z: 0 },
    Spine_4: { x: 0.25, y: 0, z: 0 },
    Corner_FL: { x: -0.25, y: -0.35, z: -0.45 }, // Open wide like a joyous tada!
    Corner_FR: { x: -0.25, y: 0.35, z: 0.45 },
    Corner_RL: { x: 0.15, y: 0, z: 0 },
    Corner_RR: { x: 0.15, y: 0, z: 0 },
  },
  'thumbs-up': {
    Spine_0: { x: 0.15, y: -0.08, z: 0.04 },
    Spine_1: { x: 0.08, y: 0, z: 0 },
    Spine_2: { x: -0.04, y: 0, z: 0 },
    Spine_3: { x: 0.06, y: 0, z: 0 },
    Spine_4: { x: 0.16, y: 0, z: 0 },
    Corner_FL: { x: -0.05, y: 0.05, z: 0.05 },
    Corner_FR: { x: 0.72, y: -0.42, z: -0.58 }, // Folded upward like a firm thumbs-up!
    Corner_RL: { x: 0.04, y: 0, z: 0 },
    Corner_RR: { x: 0.04, y: 0, z: 0 },
  },
  'shiver-freeze': {
    Spine_0: { x: 0.08, y: 0, z: 0 },
    Spine_1: { x: -0.05, y: 0, z: 0 },
    Spine_2: { x: -0.04, y: 0, z: 0 },
    Spine_3: { x: 0.10, y: 0, z: 0 },
    Spine_4: { x: 0.18, y: 0, z: 0 },
    Corner_FL: { x: 0.55, y: 0.40, z: 0.65 }, // Corners hugging body tight
    Corner_FR: { x: 0.55, y: -0.40, z: -0.65 },
    Corner_RL: { x: 0.35, y: 0.25, z: 0.35 },
    Corner_RR: { x: 0.35, y: -0.25, z: -0.35 },
  },
  'celebrate-max': {
    Spine_0: { x: 0.28, y: 0, z: 0 }, // Puffed chest & raised head
    Spine_1: { x: 0.20, y: 0, z: 0 },
    Spine_2: { x: -0.18, y: 0, z: 0 },
    Spine_3: { x: -0.22, y: 0, z: 0 },
    Spine_4: { x: 0.32, y: 0, z: 0 },
    Corner_FL: { x: 0.35, y: -0.25, z: -0.45 },
    Corner_FR: { x: 0.35, y: 0.25, z: 0.45 },
    Corner_RL: { x: 0.28, y: -0.15, z: -0.25 },
    Corner_RR: { x: 0.28, y: 0.15, z: 0.25 },
  },
  'roll-cylinder': {
    Spine_0: { x: 0.85, y: 0, z: 0 }, // Rolling into cylinder scroll
    Spine_1: { x: 0.85, y: 0, z: 0 },
    Spine_2: { x: 0.75, y: 0, z: 0 },
    Spine_3: { x: 0.70, y: 0, z: 0 },
    Spine_4: { x: 0.65, y: 0, z: 0 },
    Corner_FL: { x: 0.3, y: 0.1, z: 0.1 },
    Corner_FR: { x: 0.3, y: -0.1, z: -0.1 },
    Corner_RL: { x: 0.2, y: 0.1, z: 0.1 },
    Corner_RR: { x: 0.2, y: -0.1, z: -0.1 },
  },
  'ihrom-bow': {
    Spine_0: { x: 0.35, y: 0, z: 0 }, // Sacred tranquil ihram wrap
    Spine_1: { x: 0.22, y: 0, z: 0 },
    Spine_2: { x: -0.15, y: 0, z: 0 },
    Spine_3: { x: 0.20, y: 0, z: 0 },
    Spine_4: { x: 0.30, y: 0, z: 0 },
    Corner_FL: { x: 0.55, y: 0.45, z: 0.55 }, // 4 corners wrapped across chest
    Corner_FR: { x: 0.55, y: -0.45, z: -0.55 },
    Corner_RL: { x: 0.35, y: 0.30, z: 0.35 },
    Corner_RR: { x: 0.35, y: -0.30, z: -0.35 },
  },
  'jet-glide': {
    Spine_0: { x: -0.15, y: 0, z: 0 },
    Spine_1: { x: -0.08, y: 0, z: 0 },
    Spine_2: { x: 0.04, y: 0, z: 0 },
    Spine_3: { x: 0.08, y: 0, z: 0 },
    Spine_4: { x: 0.12, y: 0, z: 0 },
    Corner_FL: { x: -0.12, y: 0.15, z: -0.25 }, // Stiff jet wingtips
    Corner_FR: { x: -0.12, y: -0.15, z: 0.25 },
    Corner_RL: { x: 0.10, y: 0.15, z: -0.15 },
    Corner_RR: { x: 0.10, y: -0.15, z: 0.15 },
  },
  'tawaf-spiral': {
    Spine_0: { x: 0.12, y: 0.15, z: -0.15 },
    Spine_1: { x: 0.06, y: 0.10, z: -0.10 },
    Spine_2: { x: -0.02, y: 0.05, z: -0.05 },
    Spine_3: { x: 0.08, y: -0.05, z: 0.05 },
    Spine_4: { x: 0.16, y: -0.10, z: 0.10 },
    Corner_FL: { x: 0.15, y: 0.12, z: 0.20 },
    Corner_FR: { x: -0.15, y: -0.12, z: -0.20 },
    Corner_RL: { x: 0.12, y: 0.10, z: 0.15 },
    Corner_RR: { x: -0.12, y: -0.10, z: -0.15 },
  },
  'barrel-roll': {
    Spine_0: { x: 0.05, y: 0.1, z: 0 },
    Spine_1: { x: 0.0, y: 0, z: 0 },
    Spine_2: { x: 0.0, y: 0, z: 0 },
    Spine_3: { x: 0.0, y: 0, z: 0 },
    Spine_4: { x: 0.1, y: -0.1, z: 0 },
    Corner_FL: { x: 0.1, y: 0.1, z: 0 },
    Corner_FR: { x: -0.1, y: -0.1, z: 0 },
    Corner_RL: { x: 0.1, y: 0.1, z: 0 },
    Corner_RR: { x: -0.1, y: -0.1, z: 0 },
  },
  'nfc-tap': {
    Spine_0: { x: 0.45, y: 0, z: 0 }, // Forehead dip tapping the sensor
    Spine_1: { x: 0.25, y: 0, z: 0 },
    Spine_2: { x: -0.10, y: 0, z: 0 },
    Spine_3: { x: 0.12, y: 0, z: 0 },
    Spine_4: { x: 0.20, y: 0, z: 0 },
    Corner_FL: { x: 0.25, y: 0.15, z: 0.1 },
    Corner_FR: { x: 0.25, y: -0.15, z: -0.1 },
    Corner_RL: { x: 0.1, y: 0, z: 0 },
    Corner_RR: { x: 0.1, y: 0, z: 0 },
  },
  peeking: {
    Spine_0: { x: 0.42, y: 0, z: 0 }, // Looking down curiously over top frame
    Spine_1: { x: 0.22, y: 0, z: 0 },
    Spine_2: { x: -0.08, y: 0, z: 0 },
    Spine_3: { x: -0.15, y: 0, z: 0 },
    Spine_4: { x: 0.20, y: 0, z: 0 },
    Corner_FL: { x: 0.45, y: 0.15, z: 0.2 }, // Corners holding edge of frame
    Corner_FR: { x: 0.45, y: -0.15, z: -0.2 },
    Corner_RL: { x: 0.1, y: 0, z: 0 },
    Corner_RR: { x: 0.1, y: 0, z: 0 },
  },
  'host-proud': {
    Spine_0: { x: 0.24, y: 0, z: 0 },
    Spine_1: { x: 0.16, y: 0, z: 0 },
    Spine_2: { x: -0.14, y: 0, z: 0 },
    Spine_3: { x: -0.20, y: 0, z: 0 },
    Spine_4: { x: 0.26, y: 0, z: 0 },
    Corner_FL: { x: 0.42, y: 0.25, z: 0.35 }, // Crossed corners proudly
    Corner_FR: { x: 0.42, y: -0.25, z: -0.35 },
    Corner_RL: { x: 0.15, y: 0, z: 0 },
    Corner_RR: { x: 0.15, y: 0, z: 0 },
  },
  'curious-bow': {
    Spine_0: { x: 0.25, y: 0, z: 0 },
    Spine_1: { x: 0.15, y: 0, z: 0 },
    Spine_2: { x: -0.15, y: 0, z: 0 },
    Spine_3: { x: 0.2, y: 0, z: 0 },
    Spine_4: { x: 0.35, y: 0, z: 0 },
    Corner_FL: { x: 0.15, y: 0.1, z: 0.1 },
    Corner_FR: { x: 0.15, y: -0.1, z: -0.1 },
    Corner_RL: { x: 0.2, y: 0, z: 0 },
    Corner_RR: { x: 0.2, y: 0, z: 0 },
  },
  'lay-flat': {
    Spine_0: { x: -0.2, y: 0, z: 0 },
    Spine_1: { x: -0.1, y: 0, z: 0 },
    Spine_2: { x: 0.05, y: 0, z: 0 },
    Spine_3: { x: 0.1, y: 0, z: 0 },
    Spine_4: { x: 0.15, y: 0, z: 0 },
    Corner_FL: { x: 0, y: 0, z: 0 },
    Corner_FR: { x: 0, y: 0, z: 0 },
    Corner_RL: { x: 0, y: 0, z: 0 },
    Corner_RR: { x: 0, y: 0, z: 0 },
  },
  'fold-arms': {
    Spine_0: { x: 0.15, y: 0, z: 0 },
    Spine_1: { x: -0.1, y: 0, z: 0 },
    Spine_2: { x: -0.05, y: 0, z: 0 },
    Spine_3: { x: 0.2, y: 0, z: 0 },
    Spine_4: { x: 0.3, y: 0, z: 0 },
    Corner_FL: { x: 0.35, y: 0.2, z: 0.3 },
    Corner_FR: { x: 0.35, y: -0.2, z: -0.3 },
    Corner_RL: { x: 0.1, y: 0, z: 0 },
    Corner_RR: { x: 0.1, y: 0, z: 0 },
  },
  loading: {
    Spine_0: { x: 0.05, y: -0.04, z: 0.03 },
    Spine_1: { x: -0.04, y: 0.03, z: -0.03 },
    Spine_2: { x: 0.02, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.08, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.15, y: 0.04, z: -0.04 },
    Corner_FL: { x: 0.12, y: 0.08, z: 0.1 },
    Corner_FR: { x: -0.12, y: -0.08, z: -0.1 },
    Corner_RL: { x: 0.15, y: 0.08, z: 0.1 },
    Corner_RR: { x: -0.15, y: -0.08, z: -0.1 },
  },
  'transition-sweep': {
    Spine_0: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_1: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_2: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_3: { x: 0.0, y: 0.0, z: 0.0 },
    Spine_4: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_FL: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_FR: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_RL: { x: 0.0, y: 0.0, z: 0.0 },
    Corner_RR: { x: 0.0, y: 0.0, z: 0.0 },
  },
}

interface CarpetModelProps {
  pose?: CarpetPose
  face?: MascotFace
  interactive?: boolean
  followCursor?: boolean
  onClick?: () => void
  scale?: number
}

/**
 * Creates procedural 1024x1536 texture matching Maskot All View turnaround sheet:
 * Top of canvas (Y=0) is Front Lip; Bottom of canvas (Y=1536) is Rear Tail.
 */
export function createFullCarpetCanvas(
  blink: boolean = false,
  expression: MascotFace = 'cheerful'
): HTMLCanvasElement {
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

  // Front-Left Arc
  ctx.beginPath()
  ctx.arc(margin + 36, margin + 36, arcRadius, 0, Math.PI / 2, false)
  ctx.stroke()

  // Front-Right Arc
  ctx.beginPath()
  ctx.arc(1024 - margin - 36, margin + 36, arcRadius, Math.PI / 2, Math.PI, false)
  ctx.stroke()

  // Rear-Left Arc
  ctx.beginPath()
  ctx.arc(margin + 36, 1536 - margin - 36, arcRadius, -Math.PI / 2, 0, false)
  ctx.stroke()

  // Rear-Right Arc
  ctx.beginPath()
  ctx.arc(1024 - margin - 36, 1536 - margin - 36, arcRadius, Math.PI, -Math.PI / 2, false)
  ctx.stroke()

  // 4. Cute Chibi Face Directly on the Front Lip (at Y = 275, facing camera upright!)
  const faceCenterX = 512
  const faceCenterY = 275

  // 4a. Glowing Vibrant Turquoise Blush Cheeks (#00F0A0)
  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.ellipse(faceCenterX - 185, faceCenterY + 15, 60, 44, 0, 0, Math.PI * 2)
  ctx.ellipse(faceCenterX + 185, faceCenterY + 15, 60, 44, 0, 0, Math.PI * 2)
  ctx.fill()

  const eyesY = faceCenterY - 32
  const isWinking = expression === 'wink'

  if (blink || expression === 'blink') {
    // Both eyes closed in gentle happy sleeping arcs
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
    // Left Eye
    ctx.fillStyle = '#0A0A14'
    ctx.beginPath()
    ctx.arc(faceCenterX - 110, eyesY, 54, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(faceCenterX - 124, eyesY - 15, 21, 0, Math.PI * 2)
    ctx.arc(faceCenterX - 94, eyesY + 15, 10, 0, Math.PI * 2)
    ctx.fill()

    // Right Eye: check if winking
    if (isWinking) {
      ctx.strokeStyle = '#0A0A14'
      ctx.lineWidth = 18
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(faceCenterX + 110, eyesY - 4, 44, 0.15 * Math.PI, 0.85 * Math.PI, false)
      ctx.stroke()
    } else {
      ctx.fillStyle = '#0A0A14'
      ctx.beginPath()
      ctx.arc(faceCenterX + 110, eyesY, 54, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(faceCenterX + 96, eyesY - 15, 21, 0, Math.PI * 2)
      ctx.arc(faceCenterX + 126, eyesY + 15, 10, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 4d. Mouth: Cheerful Open D-Shape Smile with Pink Tongue
  const mouthY = faceCenterY + 45
  ctx.fillStyle = '#0A0A14'
  ctx.beginPath()
  ctx.arc(faceCenterX, mouthY, 46, 0, Math.PI, false)
  ctx.closePath()
  ctx.fill()

  // Vibrant Pink Tongue (#FF4D82)
  ctx.save()
  ctx.clip()
  ctx.fillStyle = '#FF4D82'
  ctx.beginPath()
  ctx.arc(faceCenterX, mouthY + 28, 28, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 5. Center Motif: Rub el Hizb (8-pointed Islamic Star Symbol of Bank Aladin Syariah)
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

  drawStarRect(starCenterX, starCenterY, outerW, outerH, 0, 26)
  drawStarRect(starCenterX, starCenterY, outerW, outerH, Math.PI / 4, 26)

  drawStarRect(starCenterX, starCenterY, innerW, innerH, 0, 14)
  drawStarRect(starCenterX, starCenterY, innerW, innerH, Math.PI / 4, 14)

  ctx.fillStyle = '#00F0A0'
  ctx.beginPath()
  ctx.arc(starCenterX, starCenterY, 18, 0, Math.PI * 2)
  ctx.fill()

  return canvas
}

/**
 * Procedural Curved Carpet Geometry Generator
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

      const vx = x
      const vy = spine.y - edgeCurl + norm.ny * thickness
      const vz = spine.z + norm.nz * thickness

      positions.push(vx, vy, vz)

      if (isFront) {
        normals.push(0, norm.ny, norm.nz)
      } else {
        normals.push(0, -norm.ny, -norm.nz)
      }

      uvs.push(u, 1 - v)
    }
  }

  for (let j = 0; j < segmentH; j++) {
    for (let i = 0; i < segmentW; i++) {
      const a = j * (segmentW + 1) + i
      const b = j * (segmentW + 1) + (i + 1)
      const c = (j + 1) * (segmentW + 1) + i
      const d = (j + 1) * (segmentW + 1) + (i + 1)

      if (isFront) {
        indices.push(a, c, b)
        indices.push(b, c, d)
      } else {
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
 * Generator function for Rigged SkinnedMesh Curved Carpet with 4-Corner Bones
 * Sets up 5 progressive spine bones AND 4 expressive corner bones.
 * Dual-Mesh Architecture: Top surface uses face CanvasTexture with DoubleSide;
 * Underside surface uses solid Deep Royal Blue velvet (#1037A6) with FrontSide.
 * Zero backface texture bleed!
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

  // 2. Setup 5 Progressive Spine Bones along curve
  const spineBones: THREE.Bone[] = []
  const spineWorldPositions: THREE.Vector3[] = []

  for (let i = 0; i < BONE_STATIONS.length; i++) {
    const station = BONE_STATIONS[i]
    const spine = getSpinePoint(station.s)
    const worldPos = new THREE.Vector3(0, spine.y, spine.z)
    spineWorldPositions.push(worldPos)

    const bone = new THREE.Bone()
    bone.name = station.name

    if (i === 0) {
      bone.position.copy(worldPos)
    } else {
      const parentPos = spineWorldPositions[i - 1]
      bone.position.subVectors(worldPos, parentPos)
      spineBones[i - 1].add(bone)
    }
    spineBones.push(bone)
  }

  // 3. Setup 4 Expressive Corner Bones (Children of Spine_0 and Spine_4)
  const cornerFL = new THREE.Bone()
  cornerFL.name = 'Corner_FL'
  cornerFL.position.set(-0.65, 0, 0.08)
  spineBones[0].add(cornerFL)

  const cornerFR = new THREE.Bone()
  cornerFR.name = 'Corner_FR'
  cornerFR.position.set(0.65, 0, 0.08)
  spineBones[0].add(cornerFR)

  const cornerRL = new THREE.Bone()
  cornerRL.name = 'Corner_RL'
  cornerRL.position.set(-0.65, 0, 0)
  spineBones[4].add(cornerRL)

  const cornerRR = new THREE.Bone()
  cornerRR.name = 'Corner_RR'
  cornerRR.position.set(0.65, 0, 0)
  spineBones[4].add(cornerRR)

  // Complete bone hierarchy array for Skeleton:
  // Indices:
  // 0: Spine_0, 1: Spine_1, 2: Spine_2, 3: Spine_3, 4: Spine_4
  // 5: Corner_FL, 6: Corner_FR, 7: Corner_RL, 8: Corner_RR
  const allBones: THREE.Bone[] = [
    spineBones[0],
    spineBones[1],
    spineBones[2],
    spineBones[3],
    spineBones[4],
    cornerFL,
    cornerFR,
    cornerRL,
    cornerRR,
  ]

  // 4. Compute Smooth Vertex Skinning Weights across Spine & Corners
  const posAttr = frontGeometry.attributes.position
  const skinIndices: number[] = []
  const skinWeights: number[] = []

  for (let idx = 0; idx < posAttr.count; idx++) {
    const j = Math.floor(idx / (segmentW + 1))
    const i = idx % (segmentW + 1)
    const v = j / segmentH
    const u = i / segmentW

    // Primary spine bones selection
    let bestSpine = 0
    let minDiff = 999
    for (let b = 0; b < BONE_STATIONS.length; b++) {
      const diff = Math.abs(v - BONE_STATIONS[b].s)
      if (diff < minDiff) {
        minDiff = diff
        bestSpine = b
      }
    }

    let secondSpine = bestSpine
    if (v < BONE_STATIONS[bestSpine].s && bestSpine > 0) {
      secondSpine = bestSpine - 1
    } else if (v > BONE_STATIONS[bestSpine].s && bestSpine < BONE_STATIONS.length - 1) {
      secondSpine = bestSpine + 1
    }

    const s1 = BONE_STATIONS[bestSpine].s
    const s2 = BONE_STATIONS[secondSpine].s
    let spineWeight = 1.0
    if (s1 !== s2) {
      const dist = Math.abs(v - s1)
      const totalSpan = Math.abs(s2 - s1)
      spineWeight = Math.max(0, Math.min(1, 1 - dist / totalSpan))
    }

    // Check corner influence
    let cornerBoneIdx = -1
    let cornerStrength = 0

    if (v < 0.32 && u < 0.35) {
      // Front-Left Corner
      const lat = (0.35 - u) / 0.35
      const lon = (0.32 - v) / 0.32
      cornerStrength = lat * lon * 0.85
      cornerBoneIdx = 5 // Corner_FL
    } else if (v < 0.32 && u > 0.65) {
      // Front-Right Corner
      const lat = (u - 0.65) / 0.35
      const lon = (0.32 - v) / 0.32
      cornerStrength = lat * lon * 0.85
      cornerBoneIdx = 6 // Corner_FR
    } else if (v > 0.70 && u < 0.35) {
      // Rear-Left Corner
      const lat = (0.35 - u) / 0.35
      const lon = (v - 0.70) / 0.30
      cornerStrength = lat * lon * 0.85
      cornerBoneIdx = 7 // Corner_RL
    } else if (v > 0.70 && u > 0.65) {
      // Rear-Right Corner
      const lat = (u - 0.65) / 0.35
      const lon = (v - 0.70) / 0.30
      cornerStrength = lat * lon * 0.85
      cornerBoneIdx = 8 // Corner_RR
    }

    if (cornerBoneIdx >= 0 && cornerStrength > 0.02) {
      // Blend primary spine bone with corner bone
      const finalCornerW = cornerStrength
      const finalSpineW = (1 - finalCornerW) * spineWeight
      const finalSecondSpineW = (1 - finalCornerW) * (1 - spineWeight)

      skinIndices.push(bestSpine, cornerBoneIdx, secondSpine, 0)
      skinWeights.push(finalSpineW, finalCornerW, finalSecondSpineW, 0)
    } else {
      skinIndices.push(bestSpine, secondSpine, 0, 0)
      skinWeights.push(spineWeight, 1 - spineWeight, 0, 0)
    }
  }

  frontGeometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  frontGeometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

  backGeometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
  backGeometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

  // 5. Materials
  frontMaterial.side = THREE.DoubleSide

  const defaultBackMaterial =
    backMaterial ||
    new THREE.MeshPhysicalMaterial({
      color: 0x1037a6,
      roughness: 0.45,
      metalness: 0.05,
      sheen: 1.0,
      sheenColor: new THREE.Color('#1E4CD8'),
      sheenRoughness: 0.3,
      side: THREE.FrontSide,
    })

  // 6. Build Skeleton & Dual SkinnedMeshes
  const skeleton = new THREE.Skeleton(allBones)

  const frontMesh = new THREE.SkinnedMesh(frontGeometry, frontMaterial)
  frontMesh.name = 'CarpetFront'
  frontMesh.bind(skeleton)

  const backMesh = new THREE.SkinnedMesh(backGeometry, defaultBackMaterial)
  backMesh.name = 'CarpetBack'
  backMesh.bind(skeleton)

  const carpetRig = new THREE.Group()
  carpetRig.name = 'RiggedCarpetActor'
  carpetRig.add(spineBones[0])
  carpetRig.add(backMesh)
  carpetRig.add(frontMesh)

  // 7. Attach 4 Rear Tassels directly to Tail Bone (Spine_4)
  const tailSpine = getSpinePoint(1.0)
  const bone4Pos = spineWorldPositions[4]
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

  // Create 4 rear tassels along tail edge (User brief: 4 rumbai di bagian belakang)
  const tasselXCoords = [-0.74, -0.25, 0.25, 0.74]
  tasselXCoords.forEach((tx) => {
    const tasselGroup = new THREE.Group()
    tasselGroup.position.set(tx, tasselOffsetY, tasselOffsetZ)
    tasselGroup.rotation.set(-Math.PI / 2, 0, (tx / 0.74) * 0.25)

    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.015, 8, 16), tasselMatMint)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.15, 12), tasselMatBlue)
    cone.position.set(0, 0.10, 0)
    tasselGroup.add(torus)
    tasselGroup.add(cone)
    spineBones[4].add(tasselGroup)
  })

  return { carpetRig, skinnedMesh: carpetRig, frontMesh, backMesh, bones: allBones, skeleton }
}

export default function CarpetModel({
  pose = 'idle',
  face = 'cheerful',
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

  // Pointer & Touch Tracking across screen
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

  // Generate Canvases & CanvasTextures based on current expression
  const { normalTexture, blinkTexture, winkTexture } = useMemo(() => {
    if (typeof window === 'undefined') return { normalTexture: null, blinkTexture: null, winkTexture: null }

    const normal = createFullCarpetCanvas(false, face)
    const blink = createFullCarpetCanvas(true, 'blink')
    const wink = createFullCarpetCanvas(false, 'wink')

    const tNormal = new THREE.CanvasTexture(normal)
    tNormal.colorSpace = THREE.SRGBColorSpace
    tNormal.wrapS = THREE.ClampToEdgeWrapping
    tNormal.wrapT = THREE.ClampToEdgeWrapping

    const tBlink = new THREE.CanvasTexture(blink)
    tBlink.colorSpace = THREE.SRGBColorSpace
    tBlink.wrapS = THREE.ClampToEdgeWrapping
    tBlink.wrapT = THREE.ClampToEdgeWrapping

    const tWink = new THREE.CanvasTexture(wink)
    tWink.colorSpace = THREE.SRGBColorSpace
    tWink.wrapS = THREE.ClampToEdgeWrapping
    tWink.wrapT = THREE.ClampToEdgeWrapping

    return { normalTexture: tNormal, blinkTexture: tBlink, winkTexture: tWink }
  }, [face])

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

  // Rigged SkinnedMesh Setup with 4-Corner Skeleton
  const { skinnedMesh, bones } = useMemo(() => {
    return createRiggedCarpet(carpetMaterial)
  }, [carpetMaterial])

  useEffect(() => {
    bonesRef.current = bones
  }, [bones])

  // Dynamic Chibi Blinking & Winking
  useEffect(() => {
    if (face === 'wink') {
      if (carpetMaterial && winkTexture) {
        carpetMaterial.map = winkTexture
        carpetMaterial.needsUpdate = true
      }
      return
    }

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
  }, [carpetMaterial, normalTexture, blinkTexture, winkTexture, face])

  const handleClick = (e: any) => {
    e.stopPropagation()
    isSpinningRef.current = true
    setTimeout(() => {
      isSpinningRef.current = false
    }, 600)
    if (onClick) onClick()
  }

  // Smooth Skeletal Pose Interpolation & Micro-flutter in useFrame
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const targetRotations = POSE_DEFINITIONS[pose] || POSE_DEFINITIONS.idle

    bonesRef.current.forEach((bone, idx) => {
      const target = targetRotations[bone.name]
      if (target) {
        let flutterX = 0
        let flutterZ = 0

        if (pose === 'clapping') {
          // Rapid energetic clapping motion
          if (bone.name === 'Corner_FL') {
            flutterZ = Math.sin(t * 14.0) * 0.28
          } else if (bone.name === 'Corner_FR') {
            flutterZ = -Math.sin(t * 14.0) * 0.28
          }
        } else if (pose === 'waving') {
          // Friendly waving flap on front-right corner
          if (bone.name === 'Corner_FR') {
            flutterZ = Math.sin(t * 9.0) * 0.22
            flutterX = Math.cos(t * 9.0) * 0.15
          }
        } else if (pose === 'shiver-freeze') {
          // Rapid freezing tremble
          flutterX = (Math.random() - 0.5) * 0.12
          flutterZ = (Math.random() - 0.5) * 0.12
        } else if (pose === 'celebrate-max') {
          // Joyous fluttering
          flutterX = Math.sin(t * 8.0 + idx * 0.8) * 0.08
          flutterZ = Math.cos(t * 8.0 + idx * 0.8) * 0.06
        } else if (pose === 'loading') {
          flutterX = Math.sin(t * 6.0 + idx * 1.2) * 0.08
          flutterZ = Math.cos(t * 6.0 + idx * 1.2) * 0.05
        } else {
          // Gentle organic breathing wave
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
          const { x, y } = mouseCoordsRef.current
          const targetRotY = x * 0.36
          const targetRotX = y * 0.22
          const targetRotZ = -x * 0.08

          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5.0, delta)
          groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 5.0, delta)
          groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 5.0, delta)

          if (bonesRef.current[0]) {
            bonesRef.current[0].rotation.y = THREE.MathUtils.damp(bonesRef.current[0].rotation.y, targetRotY * 0.28, 6.0, delta)
            bonesRef.current[0].rotation.x = THREE.MathUtils.damp(bonesRef.current[0].rotation.x, targetRotX * 0.25, 6.0, delta)
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
      } else if (pose === 'stand' || pose === 'waving' || pose === 'clapping') {
        const levitateY = Math.sin(t * 1.5) * 0.02
        groupRef.current.position.set(0.0, -0.04 + levitateY, 0.0)

        if (isSpinningRef.current) {
          groupRef.current.rotation.y += delta * 12
        } else if (followCursor && mouseCoordsRef.current.active) {
          const { x } = mouseCoordsRef.current
          groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, x * 0.3, 5.0, delta)
        } else {
          groupRef.current.rotation.set(0, 0, 0)
        }
      } else if (pose === 'celebrate-max') {
        const levitateY = Math.sin(t * 3.5) * 0.12
        groupRef.current.position.set(0.0, 0.15 + levitateY, 0.0)
        groupRef.current.rotation.y += delta * 1.5
      } else if (pose === 'barrel-roll') {
        groupRef.current.rotation.z += delta * 8.0
        groupRef.current.position.y = Math.sin(t * 4.0) * 0.08
      } else if (pose === 'loading') {
        const tFlight = t * 1.5
        groupRef.current.position.x = Math.sin(tFlight) * 0.35
        groupRef.current.position.y = 0.04 + Math.sin(tFlight * 2.0) * 0.15
        groupRef.current.position.z = Math.cos(tFlight) * 0.2

        groupRef.current.rotation.x = Math.sin(tFlight * 2.0) * 0.1
        groupRef.current.rotation.y = Math.sin(tFlight) * 0.2
        groupRef.current.rotation.z = -Math.cos(tFlight) * 0.15
      } else {
        const levitateY = Math.sin(t * 1.8) * 0.04
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

      {/* Floating 3D Sparkle Star Particles */}
      <group>
        {[
          { pos: [-0.95, 0.45, 0.35], s: 0.06 },
          { pos: [0.85, 0.65, 0.25], s: 0.075 },
          { pos: [-0.65, -0.45, 0.4], s: 0.05 },
          { pos: [0.95, -0.45, 0.2], s: 0.065 },
          { pos: [-0.3, 0.7, -0.2], s: 0.055 },
          { pos: [0.65, 0.15, 0.45], s: 0.06 },
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
