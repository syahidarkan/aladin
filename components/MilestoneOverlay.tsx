'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import confetti from 'canvas-confetti'

export type MilestoneType = 'ihram' | 'soetta' | 'pesawat' | 'jeddah' | 'kabah'

export interface MilestoneData {
  threshold: number
  title: string
  subtitle: string
  icon?: string
  soundText: string
  type: MilestoneType
  level: number
  badge: string
}

export const MILESTONES: MilestoneData[] = [
  {
    threshold: 1000000,
    title: 'Niat Suci & Kain Ihram',
    subtitle: 'Alhamdulillah, Rp 1 Juta Pertama Terlampaui!',
    soundText: 'Labbaik Allahumma Labbaik... Niat Ihram Dimulai',
    type: 'ihram',
    level: 1,
    badge: 'LANGKAH PERTAMA HIJRAH',
  },
  {
    threshold: 5000000,
    title: 'Bandara Soekarno-Hatta (CGK)',
    subtitle: 'Nabung Rp 5 Juta Berhasil Terkumpul!',
    soundText: 'Terminal 3 Gate Keberangkatan Siap',
    type: 'soetta',
    level: 2,
    badge: 'TERMINAL 3 INTERNATIONAL',
  },
  {
    threshold: 15000000,
    title: 'Pesawat Mengudara ke Tanah Suci',
    subtitle: 'Setengah Perjalanan Terpenuhi! (Rp 15 Juta)',
    soundText: 'Bismillah, Mengudara di Atas Awan Menuju Jeddah',
    type: 'pesawat',
    level: 3,
    badge: 'PENERBANGAN BERKAH',
  },
  {
    threshold: 25000000,
    title: 'Bandara King Abdulaziz (JED)',
    subtitle: 'Porsi Aman & Tiba di Terminal Haji (Rp 25 Juta)',
    soundText: 'Ahlan wa Sahlan di Terminal Haji Jeddah',
    type: 'jeddah',
    level: 4,
    badge: 'KEDATANGAN HARAMAIN',
  },
  {
    threshold: 30000000,
    title: 'Kemegahan Baitullah Makkah',
    subtitle: 'Mabruk! Target Tabungan Rp 30 Juta Terpenuhi!',
    soundText: 'Labbaik Allahumma Labbaik... Tawaf & Sa’i Dimulai',
    type: 'kabah',
    level: 5,
    badge: 'BAITULLAH TERCAPAI',
  },
]

interface MilestoneOverlayProps {
  milestone: MilestoneData | null
  onClose: () => void
}

export default function MilestoneOverlay({ milestone, onClose }: MilestoneOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visible, setVisible] = useState(false)

  // Web Audio Synthesized Chime (Peaceful Islamic Pentatonic Arpeggio)
  useEffect(() => {
    if (!milestone) return

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Triumphant Chord)
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)
          gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12)
          gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.9)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(ctx.currentTime + idx * 0.12)
          osc.stop(ctx.currentTime + idx * 0.12 + 1.0)
        })
      }
    } catch {
      // AudioContext policy fallback
    }

    // Trigger celebratory golden confetti
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#00F3AD', '#FFD700', '#1C20C4', '#FFFFFF', '#064E3B'],
      })
    } catch {
      // Confetti fallback
    }

    setVisible(true)
  }, [milestone])

  // Three.js 3D Procedural Visualizer
  useEffect(() => {
    if (!milestone || !canvasRef.current) return

    const canvas = canvasRef.current
    const width = 280
    const height = 280

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.3, 5.5)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xfff5cc, 2.8)
    dirLight.position.set(4, 7, 5)
    scene.add(dirLight)

    const cyanPoint = new THREE.PointLight(0x00f3ad, 2.5, 12)
    cyanPoint.position.set(-3, -2, 2)
    scene.add(cyanPoint)

    const goldPoint = new THREE.PointLight(0xffd700, 3.2, 10)
    goldPoint.position.set(0, 0, 3.5)
    scene.add(goldPoint)

    // Root Group
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    const modelType: MilestoneType = milestone.type || 'kabah'

    // =========================================================================
    // 1. KAIN IHRAM PUTIH SUCI (Procedural Unstitched White Cloth & Belt)
    // =========================================================================
    if (modelType === 'ihram') {
      const ihramGroup = new THREE.Group()

      // White cloth material with subtle texture and soft lighting
      const clothMat = new THREE.MeshStandardMaterial({
        color: 0xfdfdfd,
        roughness: 0.85,
        metalness: 0.05,
      })

      // Izar (Lower Garment Wrap) - Layered Flared Cylinder
      const izarGeo = new THREE.CylinderGeometry(0.7, 0.88, 1.4, 28, 4)
      const izarMesh = new THREE.Mesh(izarGeo, clothMat)
      izarMesh.position.y = -0.6
      ihramGroup.add(izarMesh)

      // Izar Folds (Layered Wraps)
      for (let i = 0; i < 3; i++) {
        const foldGeo = new THREE.TorusGeometry(0.72 + i * 0.04, 0.035, 12, 32)
        const foldMesh = new THREE.Mesh(foldGeo, clothMat)
        foldMesh.rotation.x = Math.PI / 2
        foldMesh.position.y = -0.2 - i * 0.35
        ihramGroup.add(foldMesh)
      }

      // Traditional Green Waist Belt (Sabuk Ihram)
      const beltGeo = new THREE.CylinderGeometry(0.73, 0.73, 0.16, 28)
      const beltMat = new THREE.MeshStandardMaterial({
        color: 0x065f46,
        roughness: 0.4,
        metalness: 0.2,
      })
      const beltMesh = new THREE.Mesh(beltGeo, beltMat)
      beltMesh.position.y = 0.12
      ihramGroup.add(beltMesh)

      // Gold Buckle on Belt
      const buckleGeo = new THREE.BoxGeometry(0.24, 0.22, 0.12)
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.2,
      })
      const buckleMesh = new THREE.Mesh(buckleGeo, goldMat)
      buckleMesh.position.set(0, 0.12, 0.72)
      ihramGroup.add(buckleMesh)

      // Rida' (Upper Garment) - Draped Diagonal Over Left Shoulder
      const ridaGeo = new THREE.CylinderGeometry(0.68, 0.76, 1.1, 28, 4)
      const ridaMesh = new THREE.Mesh(ridaGeo, clothMat)
      ridaMesh.position.set(0, 0.68, 0)
      ridaMesh.rotation.z = -0.15
      ihramGroup.add(ridaMesh)

      // Draped Shoulder Sash (Kain Melintang)
      const sashShape = new THREE.Shape()
      sashShape.moveTo(-0.7, 1.2)
      sashShape.lineTo(-0.2, 1.3)
      sashShape.lineTo(0.6, -0.1)
      sashShape.lineTo(0.2, -0.2)
      sashShape.closePath()
      const sashExtrude = new THREE.ExtrudeGeometry(sashShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 })
      const sashMesh = new THREE.Mesh(sashExtrude, clothMat)
      sashMesh.position.set(0, 0, 0.65)
      ihramGroup.add(sashMesh)

      // Floating Golden Halo of Blessings
      const haloGeo = new THREE.TorusGeometry(1.2, 0.025, 16, 64)
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.8,
      })
      const haloMesh = new THREE.Mesh(haloGeo, haloMat)
      haloMesh.rotation.x = Math.PI / 2.2
      haloMesh.position.y = 1.35
      ihramGroup.add(haloMesh)

      ihramGroup.position.y = 0.1
      rootGroup.add(ihramGroup)
    }

    // =========================================================================
    // 2. BANDARA SOEKARNO-HATTA (CGK Terminal 3)
    // =========================================================================
    else if (modelType === 'soetta') {
      const soettaGroup = new THREE.Group()

      // Tarmac / Runway Base
      const tarmacGeo = new THREE.BoxGeometry(3.6, 0.12, 2.4)
      const tarmacMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
      })
      const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat)
      tarmac.position.y = -1.1
      soettaGroup.add(tarmac)

      // Runway Glowing Centerline LED Strips
      for (let i = -3; i <= 3; i++) {
        const stripeGeo = new THREE.PlaneGeometry(0.28, 0.06)
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
        const stripe = new THREE.Mesh(stripeGeo, stripeMat)
        stripe.rotation.x = -Math.PI / 2
        stripe.position.set(i * 0.45, -1.03, 0.6)
        soettaGroup.add(stripe)
      }

      // Terminal 3 Modern Wave-Roof Canopy (Curved Arc Glass & Metal)
      const canopyShape = new THREE.Shape()
      canopyShape.moveTo(-1.8, 0)
      canopyShape.quadraticCurveTo(0, 1.1, 1.8, 0)
      canopyShape.lineTo(1.8, -0.6)
      canopyShape.lineTo(-1.8, -0.6)
      canopyShape.closePath()
      const canopyGeo = new THREE.ExtrudeGeometry(canopyShape, { depth: 1.6, bevelEnabled: false })
      const canopyMat = new THREE.MeshStandardMaterial({
        color: 0x1c20c4,
        roughness: 0.25,
        metalness: 0.5,
      })
      const canopyMesh = new THREE.Mesh(canopyGeo, canopyMat)
      canopyMesh.position.set(0, -0.1, -1.1)
      soettaGroup.add(canopyMesh)

      // Glass Curtain Facade (Cyan Glowing Glass)
      const glassGeo = new THREE.PlaneGeometry(3.4, 0.7)
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x00f3ad,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      })
      const glassMesh = new THREE.Mesh(glassGeo, glassMat)
      glassMesh.position.set(0, -0.5, 0.51)
      soettaGroup.add(glassMesh)

      // ATC Control Tower
      const towerStemGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.6, 16)
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 })
      const towerStem = new THREE.Mesh(towerStemGeo, towerMat)
      towerStem.position.set(-1.3, 0.2, -0.2)
      soettaGroup.add(towerStem)

      // ATC Cabin Head
      const towerCabGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.28, 16)
      const towerCabMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.2 })
      const towerCab = new THREE.Mesh(towerCabGeo, towerCabMat)
      towerCab.position.set(-1.3, 1.05, -0.2)
      soettaGroup.add(towerCab)

      // Rotating Beacon Light
      const beaconGeo = new THREE.SphereGeometry(0.06, 12, 12)
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00f3ad })
      const beacon = new THREE.Mesh(beaconGeo, beaconMat)
      beacon.position.set(-1.3, 1.25, -0.2)
      soettaGroup.add(beacon)

      // Departure Sign Pill
      const signGeo = new THREE.PlaneGeometry(2.0, 0.32)
      const signMat = new THREE.MeshBasicMaterial({ color: 0x081d48, side: THREE.DoubleSide })
      const signMesh = new THREE.Mesh(signGeo, signMat)
      signMesh.position.set(0, 0.45, 0.52)
      soettaGroup.add(signMesh)

      soettaGroup.position.y = 0.1
      rootGroup.add(soettaGroup)
    }

    // =========================================================================
    // 3. PESAWAT MENGUDARA (Realistic Sleek Widebody Airliner Soaring Over Clouds)
    // =========================================================================
    else if (modelType === 'pesawat') {
      const planeGroup = new THREE.Group()

      // Aircraft Fuselage (Smooth Streamlined Jet Body)
      const fuselageMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.35,
      })

      // Main Cylinder Body
      const bodyGeo = new THREE.CylinderGeometry(0.38, 0.34, 2.6, 32)
      const bodyMesh = new THREE.Mesh(bodyGeo, fuselageMat)
      bodyMesh.rotation.x = Math.PI / 2
      planeGroup.add(bodyMesh)

      // Aerodynamic Nose Radome
      const noseGeo = new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
      const noseMesh = new THREE.Mesh(noseGeo, fuselageMat)
      noseMesh.rotation.x = Math.PI / 2
      noseMesh.position.z = 1.3
      planeGroup.add(noseMesh)

      // Cockpit Windshield Visor (Dark Glossy Glass)
      const visorGeo = new THREE.TorusGeometry(0.36, 0.05, 12, 24, Math.PI * 0.7)
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.1,
        metalness: 0.9,
      })
      const visorMesh = new THREE.Mesh(visorGeo, glassMat)
      visorMesh.rotation.x = Math.PI / 2.3
      visorMesh.position.set(0, 0.16, 1.15)
      planeGroup.add(visorMesh)

      // Swept Wings with Aerodynamic Airfoil Shape
      const wingShape = new THREE.Shape()
      wingShape.moveTo(0, 0.4)
      wingShape.lineTo(2.5, -0.9)
      wingShape.lineTo(2.35, -1.3)
      wingShape.lineTo(0, -0.6)
      wingShape.closePath()

      const wingExtrude = new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
      })

      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x1c20c4,
        roughness: 0.25,
        metalness: 0.4,
      })

      // Right Wing
      const rightWing = new THREE.Mesh(wingExtrude, wingMat)
      rightWing.rotation.x = Math.PI / 2
      rightWing.position.set(0.2, 0, 0.3)
      planeGroup.add(rightWing)

      // Left Wing
      const leftWing = new THREE.Mesh(wingExtrude, wingMat)
      leftWing.rotation.x = Math.PI / 2
      leftWing.rotation.y = Math.PI
      leftWing.position.set(-0.2, 0, 0.3)
      planeGroup.add(leftWing)

      // Winglets (Angled Vertical Wingtips)
      const wingletGeo = new THREE.BoxGeometry(0.04, 0.35, 0.18)
      const rightWinglet = new THREE.Mesh(wingletGeo, wingMat)
      rightWinglet.position.set(2.45, 0.16, -0.7)
      rightWinglet.rotation.z = -0.3
      planeGroup.add(rightWinglet)

      const leftWinglet = new THREE.Mesh(wingletGeo, wingMat)
      leftWinglet.position.set(-2.45, 0.16, -0.7)
      leftWinglet.rotation.z = 0.3
      planeGroup.add(leftWinglet)

      // Twin High-Bypass Turbofan Jet Engines
      const engineGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.75, 24)
      const engineMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.3,
        metalness: 0.7,
      })
      const thrusterGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f3ad })

      // Left Engine
      const leftEngine = new THREE.Mesh(engineGeo, engineMat)
      leftEngine.rotation.x = Math.PI / 2
      leftEngine.position.set(-0.95, -0.28, 0.15)
      const leftGlow = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), thrusterGlowMat)
      leftGlow.position.set(-0.95, -0.28, -0.23)
      leftGlow.rotation.y = Math.PI
      planeGroup.add(leftEngine, leftGlow)

      // Right Engine
      const rightEngine = new THREE.Mesh(engineGeo, engineMat)
      rightEngine.rotation.x = Math.PI / 2
      rightEngine.position.set(0.95, -0.28, 0.15)
      const rightGlow = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), thrusterGlowMat)
      rightGlow.position.set(0.95, -0.28, -0.23)
      rightGlow.rotation.y = Math.PI
      planeGroup.add(rightEngine, rightGlow)

      // Swept Vertical Stabilizer Tail Fin
      const tailShape = new THREE.Shape()
      tailShape.moveTo(0, 0)
      tailShape.lineTo(0, 1.1)
      tailShape.lineTo(-0.7, 0.95)
      tailShape.lineTo(-0.9, 0)
      tailShape.closePath()
      const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.05, bevelEnabled: false })
      const tailMesh = new THREE.Mesh(tailGeo, wingMat)
      tailMesh.position.set(-0.025, 0.25, -1.25)
      planeGroup.add(tailMesh)

      // Horizontal Stabilizers (Tail Wings)
      const hTailGeo = new THREE.BoxGeometry(1.3, 0.04, 0.35)
      const hTailMesh = new THREE.Mesh(hTailGeo, wingMat)
      hTailMesh.position.set(0, 0.3, -1.2)
      planeGroup.add(hTailMesh)

      // Fluffy 3D Cloud Clusters Floating Below Plane
      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        transparent: true,
        opacity: 0.85,
      })

      const cloudGroup = new THREE.Group()
      const cloudPositions = [
        [-1.2, -1.2, 0.3, 0.55],
        [-0.4, -1.1, 0.5, 0.7],
        [0.5, -1.3, -0.2, 0.65],
        [1.3, -1.2, 0.2, 0.5],
        [0.1, -1.4, 0.8, 0.6],
      ]
      cloudPositions.forEach(([x, y, z, r]) => {
        const cloudSphere = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), cloudMat)
        cloudSphere.position.set(x, y, z)
        cloudGroup.add(cloudSphere)
      })
      planeGroup.add(cloudGroup)

      planeGroup.rotation.x = 0.22
      planeGroup.rotation.y = -0.35
      planeGroup.position.y = 0.2
      rootGroup.add(planeGroup)
    }

    // =========================================================================
    // 4. BANDARA KING ABDULAZIZ (JED - Iconic White Tent Hajj Terminal)
    // =========================================================================
    else if (modelType === 'jeddah') {
      const jeddahGroup = new THREE.Group()

      // Desert Tarmac Base
      const desertGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.15, 32)
      const desertMat = new THREE.MeshStandardMaterial({
        color: 0xc2a677,
        roughness: 0.9,
      })
      const desert = new THREE.Mesh(desertGeo, desertMat)
      desert.position.y = -1.1
      jeddahGroup.add(desert)

      // Iconic Jeddah White Tensile Hajj Tent Canopies
      const tentMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.45,
        metalness: 0.1,
      })

      const poleMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.8,
        roughness: 0.2,
      })

      const tentCoords = [
        [-0.85, 0, -0.5],
        [0.85, 0, -0.5],
        [0, 0, 0.45],
      ]

      tentCoords.forEach(([tx, ty, tz]) => {
        // Tent Cone Membrane
        const tentGeo = new THREE.ConeGeometry(0.85, 1.1, 16, 1, true)
        const tent = new THREE.Mesh(tentGeo, tentMat)
        tent.position.set(tx, ty, tz)
        jeddahGroup.add(tent)

        // Tension Center Pole
        const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12)
        const pole = new THREE.Mesh(poleGeo, poleMat)
        pole.position.set(tx, ty + 0.1, tz)
        jeddahGroup.add(pole)

        // Golden Crescent Finial on Peak
        const crescentGeo = new THREE.SphereGeometry(0.07, 12, 12)
        const crescentMat = new THREE.MeshBasicMaterial({ color: 0xffd700 })
        const crescent = new THREE.Mesh(crescentGeo, crescentMat)
        crescent.position.set(tx, ty + 0.85, tz)
        jeddahGroup.add(crescent)
      })

      // Saudi Date Palm Trees
      const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 })

      const palmPositions = [
        [-1.6, -1.0, 0.5],
        [1.6, -1.0, 0.5],
        [-1.5, -1.0, -0.8],
      ]

      palmPositions.forEach(([px, py, pz]) => {
        const trunkGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.7, 8)
        const trunk = new THREE.Mesh(trunkGeo, palmTrunkMat)
        trunk.position.set(px, py + 0.35, pz)
        jeddahGroup.add(trunk)

        const crownGeo = new THREE.SphereGeometry(0.26, 8, 8)
        const crown = new THREE.Mesh(crownGeo, palmFrondMat)
        crown.position.set(px, py + 0.7, pz)
        crown.scale.set(1.4, 0.5, 1.4)
        jeddahGroup.add(crown)
      })

      // Welcome Banner
      const welcomeGeo = new THREE.PlaneGeometry(1.8, 0.3)
      const welcomeMat = new THREE.MeshBasicMaterial({ color: 0x064e3b, side: THREE.DoubleSide })
      const welcome = new THREE.Mesh(welcomeGeo, welcomeMat)
      welcome.position.set(0, -0.7, 1.1)
      jeddahGroup.add(welcome)

      jeddahGroup.position.y = 0.1
      rootGroup.add(jeddahGroup)
    }

    // =========================================================================
    // 5. KEMEGAHAN BAITULLAH (Ka'bah Al-Musyarrafah di Makkah)
    // =========================================================================
    else {
      const kabahGroup = new THREE.Group()

      // Main Black Cube Body
      const bodyGeo = new THREE.BoxGeometry(2, 2.3, 2)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x111317,
        roughness: 0.35,
        metalness: 0.1,
      })
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
      kabahGroup.add(bodyMesh)

      // Gold Embroidered Kiswah Belt Band (Hizam)
      const beltGeo = new THREE.BoxGeometry(2.02, 0.28, 2.02)
      const beltMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x997a00,
        emissiveIntensity: 0.3,
      })
      const beltMesh = new THREE.Mesh(beltGeo, beltMat)
      beltMesh.position.y = 0.55
      kabahGroup.add(beltMesh)

      // Lower Gold Accent Band
      const lowBeltGeo = new THREE.BoxGeometry(2.015, 0.08, 2.015)
      const lowBeltMesh = new THREE.Mesh(lowBeltGeo, beltMat)
      lowBeltMesh.position.y = 0.32
      kabahGroup.add(lowBeltMesh)

      // Golden Door (Bab at-Tawbah) on Front Face
      const doorGeo = new THREE.PlaneGeometry(0.5, 1.1)
      const doorMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.95,
        roughness: 0.15,
        side: THREE.DoubleSide,
      })
      const doorMesh = new THREE.Mesh(doorGeo, doorMat)
      doorMesh.position.set(0.4, -0.15, 1.015)
      kabahGroup.add(doorMesh)

      // Hijr Ismail (Al-Hateem) White Curved Marble Semi-Circle Wall
      const hateemGeo = new THREE.TorusGeometry(1.6, 0.08, 12, 32, Math.PI * 0.9)
      const marbleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
      })
      const hateemMesh = new THREE.Mesh(hateemGeo, marbleMat)
      hateemMesh.rotation.x = Math.PI / 2
      hateemMesh.position.set(0, -1.15, 0)
      kabahGroup.add(hateemMesh)

      // Glowing Base Rings (Tawaf Circles)
      const ringGeo = new THREE.RingGeometry(1.8, 1.95, 48)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ad,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = Math.PI / 2
      ringMesh.position.y = -1.2
      kabahGroup.add(ringMesh)

      const outerRingGeo = new THREE.RingGeometry(2.3, 2.45, 48)
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      })
      const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat)
      outerRingMesh.rotation.x = Math.PI / 2
      outerRingMesh.position.y = -1.2
      kabahGroup.add(outerRingMesh)

      kabahGroup.position.y = 0.1
      rootGroup.add(kabahGroup)
    }

    // Floating Golden Blessing Particle Stars
    const particleCount = 100
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8
      positions[i + 1] = (Math.random() - 0.5) * 6
      positions[i + 2] = (Math.random() - 0.5) * 6
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // Smooth Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      if (modelType === 'kabah' || modelType === 'ihram' || modelType === 'jeddah') {
        rootGroup.rotation.y = elapsedTime * 0.4
        rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06
      } else if (modelType === 'soetta') {
        rootGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.35
        rootGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.05
      } else {
        // Airplane gentle flight motion
        rootGroup.rotation.y = -0.3 + Math.sin(elapsedTime * 0.7) * 0.18
        rootGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.07
        rootGroup.position.y = 0.15 + Math.sin(elapsedTime * 1.4) * 0.1
      }

      particleSystem.rotation.y = elapsedTime * 0.04

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
    }
  }, [milestone])

  if (!milestone) return null

  return (
    <div
      ref={containerRef}
      onClick={() => {
        setVisible(false)
        setTimeout(onClose, 280)
      }}
      className={`absolute inset-0 z-[300] flex flex-col items-center justify-between p-6 transition-all duration-300 cursor-pointer select-none ${
        visible ? 'opacity-100 bg-black/85 backdrop-blur-md' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Top Header Badge */}
      <div className="w-full text-center pt-8 animate-in fade-in slide-in-from-top duration-500">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#00F3AD] animate-pulse" />
          <span className="text-[10px] font-extrabold text-[#00F3AD] tracking-wider uppercase">
            {milestone.badge || 'MILESTONE TERPENUHI'}
          </span>
        </div>
      </div>

      {/* Center 3D Canvas Viewport */}
      <div className="relative flex flex-col items-center justify-center my-auto animate-in zoom-in-90 duration-700">
        {/* Glowing Radial Aura */}
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#1C20C4]/30 via-[#00F3AD]/25 to-transparent blur-2xl pointer-events-none" />

        {/* 3D Canvas */}
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="relative z-10 w-[240px] h-[240px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
        />

        {/* Chanted Soundwave Pill */}
        <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-[#00F3AD] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-[#00F3AD] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-[#00F3AD] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[11.5px] font-bold text-white tracking-wide">
            {milestone.soundText}
          </span>
        </div>
      </div>

      {/* Bottom Cinematic Card */}
      <div className="w-full max-w-[340px] bg-white/10 border border-white/20 backdrop-blur-xl rounded-[24px] p-5 text-center shadow-2xl mb-6 animate-in slide-in-from-bottom duration-500">
        <h2 className="text-[19px] font-black text-white tracking-tight">
          {milestone.title}
        </h2>
        <p className="text-[12px] text-white/80 font-medium mt-1 leading-snug">
          {milestone.subtitle}
        </p>

        {/* Progress Bar Level */}
        <div className="mt-4 pt-3 border-t border-white/15">
          <div className="flex justify-between items-center text-[10.5px] font-bold text-white/70 mb-1.5">
            <span>Milestone {milestone.level || 1} dari 5</span>
            <span className="text-[#00F3AD]">Rp{milestone.threshold.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#1C20C4] to-[#00F3AD] rounded-full"
              style={{ width: `${Math.min(100, ((milestone.level || 1) / 5) * 100)}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 280)
          }}
          className="w-full mt-4 py-3 bg-[#00F3AD] text-[#081D48] font-black text-[13px] rounded-full shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          Lanjutkan Perjalanan Berkah →
        </button>
      </div>
    </div>
  )
}
