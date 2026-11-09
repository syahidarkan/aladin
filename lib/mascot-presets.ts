import * as THREE from 'three'
import presetsData from './mascot-presets.json'

export interface Transform3D {
  position: [number, number, number]
  rotation: [number, number, number] // stored in degrees for user-friendly editing
  scale: [number, number, number]
}

export interface BoneRotationsDeg {
  [boneName: string]: [number, number, number] // in degrees
}

export interface BoneRotationsRad {
  [boneName: string]: { x: number; y: number; z: number }
}

export interface MascotPoseConfig {
  name?: string
  description?: string
  meshTransform: Transform3D
  bonesRotation: BoneRotationsDeg
}

export interface MascotKeyframe {
  id: string
  timestamp: number // in seconds, e.g. 0.0, 0.5, 1.2, 2.0
  meshTransform: Transform3D
  bonesRotation: BoneRotationsDeg
}

export interface MascotAnimationSequence {
  name: string
  duration: number
  loop: boolean
  keyframes: MascotKeyframe[]
}

export const DEG2RAD = Math.PI / 180
export const RAD2DEG = 180 / Math.PI

export function degToRad([x, y, z]: [number, number, number]): [number, number, number] {
  return [x * DEG2RAD, y * DEG2RAD, z * DEG2RAD]
}

export function radToDeg([x, y, z]: [number, number, number]): [number, number, number] {
  return [
    Math.round(x * RAD2DEG * 10) / 10,
    Math.round(y * RAD2DEG * 10) / 10,
    Math.round(z * RAD2DEG * 10) / 10,
  ]
}

/**
 * Converts degree bone dictionary to radian format used by Three.js bones
 */
export function boneDegreesToRadians(bonesDeg: BoneRotationsDeg): BoneRotationsRad {
  const result: BoneRotationsRad = {}
  for (const [key, [x, y, z]] of Object.entries(bonesDeg)) {
    result[key] = {
      x: x * DEG2RAD,
      y: y * DEG2RAD,
      z: z * DEG2RAD,
    }
  }
  return result
}

/**
 * Built-in default presets from mascot-presets.json
 */
export const BUILTIN_PRESETS: Record<string, MascotPoseConfig> = (presetsData as any).presets

/**
 * Built-in animation sequences from mascot-presets.json
 */
export const BUILTIN_ANIMATIONS: Record<string, MascotAnimationSequence> =
  (presetsData as any).animationSequences || {}

/**
 * Lerp helper for single numeric values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Smoothstep ease curve for natural cloth animation
 */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * Interpolates between two 3D vectors
 */
export function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

/**
 * Spherical / Angle lerp for degrees handling wrap-around gracefully
 */
export function lerpAngleDeg(a: number, b: number, t: number): number {
  let diff = (b - a) % 360
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return a + diff * t
}

export function lerpRotDeg(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    lerpAngleDeg(a[0], b[0], t),
    lerpAngleDeg(a[1], b[1], t),
    lerpAngleDeg(a[2], b[2], t),
  ]
}

/**
 * Core Interpolation Engine:
 * Given a sorted array of keyframes and a timestamp, computes the interpolated pose.
 */
export function interpolateKeyframes(
  keyframes: MascotKeyframe[],
  time: number,
  loop: boolean = false
): MascotPoseConfig {
  if (keyframes.length === 0) {
    return BUILTIN_PRESETS.idle
  }

  if (keyframes.length === 1) {
    return {
      meshTransform: keyframes[0].meshTransform,
      bonesRotation: keyframes[0].bonesRotation,
    }
  }

  // Sort keyframes by timestamp ascending
  const sorted = [...keyframes].sort((a, b) => a.timestamp - b.timestamp)
  const minTime = sorted[0].timestamp
  const maxTime = sorted[sorted.length - 1].timestamp

  let targetTime = time
  if (loop && maxTime > minTime) {
    const duration = maxTime - minTime
    targetTime = minTime + ((time - minTime) % duration)
    if (targetTime < minTime) targetTime += duration
  } else {
    targetTime = Math.max(minTime, Math.min(maxTime, time))
  }

  // Find bounding keyframes
  let prev = sorted[0]
  let next = sorted[sorted.length - 1]

  for (let i = 0; i < sorted.length - 1; i++) {
    if (targetTime >= sorted[i].timestamp && targetTime <= sorted[i + 1].timestamp) {
      prev = sorted[i]
      next = sorted[i + 1]
      break
    }
  }

  if (prev === next || prev.timestamp === next.timestamp) {
    return {
      meshTransform: prev.meshTransform,
      bonesRotation: prev.bonesRotation,
    }
  }

  const alpha = (targetTime - prev.timestamp) / (next.timestamp - prev.timestamp)
  const easeAlpha = smoothstep(alpha)

  // Interpolate mesh transform
  const pos = lerpVec3(prev.meshTransform.position, next.meshTransform.position, easeAlpha)
  const rot = lerpRotDeg(prev.meshTransform.rotation, next.meshTransform.rotation, easeAlpha)
  const scale = lerpVec3(prev.meshTransform.scale, next.meshTransform.scale, easeAlpha)

  // Interpolate bones
  const bonesRot: BoneRotationsDeg = {}
  const allBoneKeys = Array.from(
    new Set([...Object.keys(prev.bonesRotation), ...Object.keys(next.bonesRotation)])
  )

  for (const boneKey of allBoneKeys) {
    const rotA = prev.bonesRotation[boneKey] || [0, 0, 0]
    const rotB = next.bonesRotation[boneKey] || [0, 0, 0]
    bonesRot[boneKey] = lerpRotDeg(rotA, rotB, easeAlpha)
  }

  return {
    meshTransform: {
      position: pos,
      rotation: rot,
      scale: scale,
    },
    bonesRotation: bonesRot,
  }
}

