'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CarpetModel, { CarpetPose, MascotFace } from './CarpetModel'

type PropKind =
  | 'investasi'
  | 'qris'
  | 'kartu'
  | 'deposito'
  | 'bayar-beli'
  | 'impian'
  | 'haramain'
  | 'onboarding'
  | 'wrapped'
  | 'pocket'
  | 'alfa'

interface FeatureWelcomeConfig {
  key: string
  pose: CarpetPose
  face: MascotFace
  propKind: PropKind
  accentColor: string
}

const FEATURE_CONFIGS: Record<string, FeatureWelcomeConfig> = {
  '/investasi': {
    key: 'investasi',
    pose: 'pointing',
    face: 'cheerful',
    propKind: 'investasi',
    accentColor: '#00F0A0',
  },
  '/qris': {
    key: 'qris',
    pose: 'peeking',
    face: 'curious',
    propKind: 'qris',
    accentColor: '#00F0A0',
  },
  '/kartu': {
    key: 'kartu',
    pose: 'peek-a-boo-hide',
    face: 'curious',
    propKind: 'kartu',
    accentColor: '#38BDF8',
  },
  '/simulasi-bagi-hasil': {
    key: 'simulasi-bagi-hasil',
    pose: 'celebrate-max',
    face: 'cheerful',
    propKind: 'deposito',
    accentColor: '#00F0A0',
  },
  '/bayar-beli': {
    key: 'bayar-beli',
    pose: 'roll-cylinder',
    face: 'cheerful',
    propKind: 'bayar-beli',
    accentColor: '#FBBF24',
  },
  '/impian': {
    key: 'impian',
    pose: 'ihrom-bow',
    face: 'chill',
    propKind: 'impian',
    accentColor: '#10B981',
  },
  '/impian/umrah/buat': {
    key: 'impian-umrah',
    pose: 'ihrom-bow',
    face: 'chill',
    propKind: 'impian',
    accentColor: '#10B981',
  },
  '/impian/haji/buat': {
    key: 'impian-haji',
    pose: 'ihrom-bow',
    face: 'chill',
    propKind: 'impian',
    accentColor: '#10B981',
  },
  '/ala-haramain': {
    key: 'ala-haramain',
    pose: 'barrel-roll',
    face: 'cheerful',
    propKind: 'haramain',
    accentColor: '#00F0A0',
  },
  '/onboarding/tujuan-finansial': {
    key: 'onboarding-tujuan-finansial',
    pose: 'curious-think',
    face: 'curious',
    propKind: 'onboarding',
    accentColor: '#F59E0B',
  },
  '/wrapped': {
    key: 'wrapped',
    pose: 'host-proud',
    face: 'proud',
    propKind: 'wrapped',
    accentColor: '#C084FC',
  },
  '/pocket': {
    key: 'pocket',
    pose: 'stand',
    face: 'cheerful',
    propKind: 'pocket',
    accentColor: '#38BDF8',
  },
  '/alfa-daily': {
    key: 'alfa-daily',
    pose: 'pointing',
    face: 'wink',
    propKind: 'alfa',
    accentColor: '#EF4444',
  },
  '/setor': {
    key: 'setor',
    pose: 'pointing',
    face: 'cheerful',
    propKind: 'alfa',
    accentColor: '#00F0A0',
  },
  '/tarik': {
    key: 'tarik',
    pose: 'pointing',
    face: 'cheerful',
    propKind: 'alfa',
    accentColor: '#38BDF8',
  },
}

/**
 * 3D Feature-Specific Props Component
 * Renders distinct 3D props (e.g. glowing candlestick chart, Ka'bah, gold dinars, Visa card, QR laser)
 * floating organically beside Alan!
 */
function ThematicFeatureProp({ propKind }: { propKind: PropKind }) {
  const groupRef = useRef<THREE.Group>(null)
  const barRefs = useRef<THREE.Mesh[]>([])
  const beamRef = useRef<THREE.Mesh>(null)
  const coinRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle breathing float
      groupRef.current.position.y = Math.sin(t * 2.2) * 0.05
    }

    if (propKind === 'investasi') {
      // Animate candlestick bars pulsating with bullish growth
      barRefs.current.forEach((bar, idx) => {
        if (bar) {
          const scaleY = 1 + Math.sin(t * 3.5 + idx * 0.7) * 0.18
          bar.scale.set(1, scaleY, 1)
        }
      })
      if (coinRef.current) {
        coinRef.current.rotation.y += delta * 2.5
      }
    } else if (propKind === 'qris') {
      // Animate laser scanner beam moving up and down across QR grid
      if (beamRef.current) {
        beamRef.current.position.y = Math.sin(t * 4.0) * 0.28
      }
    } else if (propKind === 'deposito' || propKind === 'haramain') {
      if (coinRef.current) {
        coinRef.current.rotation.y += delta * 1.8
      }
    }
  })

  // 1. INVESTASI: Glowing 3D Candlestick Chart + Spinning Gold Dinar Coin
  if (propKind === 'investasi') {
    return (
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Holographic Chart Base Platform */}
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.72, 0.04, 0.32]} />
          <meshStandardMaterial color="#0A2E5C" emissive="#1037A6" emissiveIntensity={0.6} transparent opacity={0.8} />
        </mesh>

        {/* 4 Glowing Green Rising Candlestick / Bar Columns */}
        {[
          { x: -0.22, h: 0.22, color: '#059669' },
          { x: -0.07, h: 0.34, color: '#10B981' },
          { x: 0.08, h: 0.46, color: '#00F0A0' },
          { x: 0.23, h: 0.62, color: '#00F0A0' },
        ].map((bar, i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) barRefs.current[i] = el
            }}
            position={[bar.x, -0.32 + bar.h / 2, 0]}
          >
            <boxGeometry args={[0.1, bar.h, 0.1]} />
            <meshStandardMaterial
              color={bar.color}
              emissive={bar.color}
              emissiveIntensity={0.9}
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
        ))}

        {/* Floating Shiny Gold Dinar Coin atop chart peak */}
        <mesh ref={coinRef} position={[0.23, 0.48, 0.05]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.03, 24]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#D97706"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      </group>
    )
  }

  // 2. QRIS: 3D Holographic QR Code Target + Animated Scanning Laser Beam
  if (propKind === 'qris') {
    return (
      <group ref={groupRef} position={[0, -0.15, 0]} rotation={[-0.45, 0, 0]}>
        {/* Holographic QR Pad Screen */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.75, 0.75, 0.04]} />
          <meshStandardMaterial color="#08142C" emissive="#1037A6" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>

        {/* QR Matrix Corner Squares */}
        {[
          [-0.24, 0.24],
          [0.24, 0.24],
          [-0.24, -0.24],
        ].map(([qx, qy], idx) => (
          <mesh key={idx} position={[qx, qy, 0.03]}>
            <boxGeometry args={[0.16, 0.16, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#00F0A0" emissiveIntensity={0.7} />
          </mesh>
        ))}

        {/* Center QR Matrix Pixels */}
        <mesh position={[0.06, -0.06, 0.03]}>
          <boxGeometry args={[0.28, 0.28, 0.02]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} />
        </mesh>

        {/* Moving Neon Turquoise Laser Beam */}
        <mesh ref={beamRef} position={[0, 0, 0.05]}>
          <boxGeometry args={[0.82, 0.03, 0.02]} />
          <meshStandardMaterial
            color="#00F0A0"
            emissive="#00F0A0"
            emissiveIntensity={2.5}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>
    )
  }

  // 3. KARTU: 3D Miniature Metallic Visa Virtual Card + Golden EMV Chip
  if (propKind === 'kartu') {
    return (
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0.1, -0.4, 0.15]}>
        {/* Visa Card Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.78, 0.5, 0.025]} />
          <meshStandardMaterial
            color="#1037A6"
            emissive="#0A2268"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* Card Border Trim */}
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[0.74, 0.46]} />
          <meshBasicMaterial color="#00F0A0" wireframe transparent opacity={0.65} />
        </mesh>

        {/* Golden EMV Chip */}
        <mesh position={[-0.22, 0.06, 0.02]}>
          <boxGeometry args={[0.12, 0.09, 0.01]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} emissive="#D97706" emissiveIntensity={0.5} />
        </mesh>

        {/* Contactless Waves */}
        <mesh position={[0.24, 0.14, 0.02]}>
          <torusGeometry args={[0.04, 0.008, 8, 16, Math.PI]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    )
  }

  // 4. DEPOSITO: Stacks of 3D Golden Dinar Coins + Floating Glowing %
  if (propKind === 'deposito') {
    return (
      <group ref={groupRef} position={[0, -0.12, 0]}>
        {/* Coin Stack 1 */}
        {[0, 0.06, 0.12, 0.18].map((cy, i) => (
          <mesh key={`c1-${i}`} position={[-0.14, cy, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.05, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} emissive="#B45309" emissiveIntensity={0.4} />
          </mesh>
        ))}

        {/* Coin Stack 2 (Taller) */}
        {[0, 0.06, 0.12, 0.18, 0.24, 0.30].map((cy, i) => (
          <mesh key={`c2-${i}`} position={[0.12, cy, 0.06]}>
            <cylinderGeometry args={[0.13, 0.13, 0.05, 24]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.92} roughness={0.15} emissive="#D97706" emissiveIntensity={0.5} />
          </mesh>
        ))}

        {/* Glowing Turquoise % Badge Floating above stacks */}
        <mesh ref={coinRef} position={[0.02, 0.46, 0.12]} rotation={[0, 0, 0.15]}>
          <torusGeometry args={[0.11, 0.035, 12, 24]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={1.4} roughness={0.2} />
        </mesh>
      </group>
    )
  }

  // 5. BAYAR-BELI: 3D Lightning Bolt + Smartphone Topup Screen
  if (propKind === 'bayar-beli') {
    return (
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0.05, -0.25, -0.1]}>
        {/* Smartphone Shell */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.65, 0.03]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.34, 0.58]} />
          <meshStandardMaterial color="#1037A6" emissive="#00F0A0" emissiveIntensity={0.4} />
        </mesh>

        {/* Glowing 3D Lightning Bolt popping out */}
        <group position={[0.08, 0.08, 0.08]} rotation={[0, 0, -0.2]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.04]} />
            <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.8} />
          </mesh>
          <mesh position={[-0.04, -0.06, 0]}>
            <boxGeometry args={[0.06, 0.18, 0.04]} />
            <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={1.8} />
          </mesh>
        </group>
      </group>
    )
  }

  // 6. IMPIAN: Miniature 3D Holy Ka'bah + Glowing Golden Crescent Moon
  if (propKind === 'impian') {
    return (
      <group ref={groupRef} position={[0, -0.06, 0]} rotation={[0.2, 0.45, 0]}>
        {/* Ka'bah Black Velvet Cube */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.44, 0.42]} />
          <meshStandardMaterial color="#1A1C22" roughness={0.8} />
        </mesh>

        {/* Golden Kiswah Band */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.428, 0.05, 0.428]} />
          <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={0.9} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Golden Door (Bab al-Ka'bah) */}
        <mesh position={[0.215, -0.04, 0.05]}>
          <boxGeometry args={[0.01, 0.18, 0.11]} />
          <meshStandardMaterial color="#FBBF24" emissive="#B45309" emissiveIntensity={0.8} metalness={0.95} />
        </mesh>

        {/* Floating Glowing Golden Crescent Moon */}
        <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 2, 0.25]}>
          <torusGeometry args={[0.13, 0.028, 12, 24, Math.PI * 1.3]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.5} metalness={0.9} />
        </mesh>
      </group>
    )
  }

  // 7. HARAMAIN: 3D Saudi Riyal Dinar Coin with Crossed Swords + Qibla Compass
  if (propKind === 'haramain') {
    return (
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0.15, -0.2, 0.1]}>
        {/* Large Saudi Riyal Coin */}
        <mesh ref={coinRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.045, 32]} />
          <meshStandardMaterial color="#F59E0B" emissive="#B45309" emissiveIntensity={0.6} metalness={0.92} roughness={0.15} />
        </mesh>

        {/* Green Outer Ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.285, 0.015, 12, 32]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={1.2} />
        </mesh>
      </group>
    )
  }

  // 8. WRAPPED: 3D Golden Champion Trophy Cup with Star Particles
  if (propKind === 'wrapped') {
    return (
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0.1, -0.2, 0]}>
        {/* Trophy Base */}
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Trophy Stem */}
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.14, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.1} emissive="#D97706" emissiveIntensity={0.5} />
        </mesh>
        {/* Trophy Cup */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.18, 0.08, 0.26, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} emissive="#D97706" emissiveIntensity={0.7} />
        </mesh>
        {/* Trophy Handles */}
        <mesh position={[-0.18, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.09, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} />
        </mesh>
        <mesh position={[0.18, 0.06, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.09, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} />
        </mesh>
      </group>
    )
  }

  // 9. POCKET: 3 Floating Colorful Piggy/Sub-Wallets with Coins
  if (propKind === 'pocket') {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]}>
        {/* Pocket 1: Mint Blue */}
        <mesh position={[-0.12, -0.1, 0]}>
          <boxGeometry args={[0.24, 0.2, 0.12]} />
          <meshStandardMaterial color="#1037A6" emissive="#0A2268" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
        {/* Pocket 2: Turquoise */}
        <mesh position={[0.12, 0.02, 0.05]}>
          <boxGeometry args={[0.22, 0.22, 0.12]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
        {/* Coin popping out */}
        <mesh position={[0.12, 0.20, 0.08]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} emissive="#D97706" emissiveIntensity={0.5} />
        </mesh>
      </group>
    )
  }

  // 10. ALFA / SETOR / TARIK: Miniature 3D Alfamart Bag & Banknotes
  if (propKind === 'alfa') {
    return (
      <group ref={groupRef} position={[0, -0.04, 0]} rotation={[0.1, -0.3, 0.1]}>
        {/* Shopping Bag Red & White */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.32, 0.36, 0.2]} />
          <meshStandardMaterial color="#DC2626" emissive="#991B1B" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
        {/* White Accent Stripe */}
        <mesh position={[0, -0.08, 0.105]}>
          <planeGeometry args={[0.32, 0.1]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Bag Handles */}
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Banknote Stack */}
        <mesh position={[-0.15, 0.12, 0.08]} rotation={[0.2, 0.3, 0.4]}>
          <boxGeometry args={[0.22, 0.11, 0.03]} />
          <meshStandardMaterial color="#059669" emissive="#059669" emissiveIntensity={0.5} />
        </mesh>
      </group>
    )
  }

  // Fallback: Onboarding / Default Glowing Compass & Star
  return (
    <group ref={groupRef} position={[0.58, 0.05, 0.35]}>
      {/* Glowing Star Target */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.4} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.24, 0.018, 12, 24]} />
        <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

/**
 * Welcoming Spotlight Animation Overlay (Pure Mascot & 3D Thematic Props)
 * - NO text, NO buttons per user request.
 * - Dark blurred screen backdrop.
 * - Alan performs feature-specific animated gestures alongside authentic 3D props.
 * - Dismisses on tap anywhere, or automatically after ~2.8 seconds.
 */
export default function FeatureWelcomeOverlay() {
  const pathname = usePathname()
  const [activeConfig, setActiveConfig] = useState<FeatureWelcomeConfig | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Determine matching feature config
    const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/'
    const config = FEATURE_CONFIGS[cleanPath]

    if (!config) {
      setIsVisible(false)
      setActiveConfig(null)
      return
    }

    // Check if user has already been welcomed for this feature in this session
    const storageKey = `aladin_welcomed_${config.key}`
    const alreadyWelcomed = typeof window !== 'undefined' ? sessionStorage.getItem(storageKey) : null

    if (!alreadyWelcomed) {
      setActiveConfig(config)
      setIsVisible(true)
      setIsFading(false)

      // Auto dismiss smoothly after 2.8s
      const autoTimer = setTimeout(() => {
        handleDismiss(config.key)
      }, 2800)

      return () => clearTimeout(autoTimer)
    }
  }, [pathname])

  const handleDismiss = (key?: string) => {
    setIsFading(true)
    const targetKey = key || activeConfig?.key
    if (targetKey && typeof window !== 'undefined') {
      sessionStorage.setItem(`aladin_welcomed_${targetKey}`, 'true')
    }

    setTimeout(() => {
      setIsVisible(false)
      setIsFading(false)
      setActiveConfig(null)
    }, 350)
  }

  if (!isVisible || !activeConfig) return null

  return (
    <div
      onClick={() => handleDismiss()}
      className={`absolute inset-0 z-[140] bg-black/85 backdrop-blur-md flex items-center justify-center select-none cursor-pointer transition-opacity duration-350 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Glowing Ambient Radial Aura behind Alan */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{
          background: `radial-gradient(circle, ${activeConfig.accentColor}60 0%, rgba(16, 55, 166, 0.45) 55%, transparent 100%)`,
        }}
      />

      {/* 3D WebGL Canvas: Full-Screen Alan Mascot + Feature Thematic Props */}
      <div className="w-full h-full relative pointer-events-none flex items-center justify-center">
        <Canvas
          camera={{ position: [0, 0.05, 6.2], fov: 27 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={2.6} />
          <directionalLight position={[2, 4, 3]} intensity={3.2} />
          <pointLight position={[0, 0.6, 3.5]} intensity={4.0} color="#FFFFFF" />
          <pointLight position={[-1.8, -0.2, 2.5]} intensity={2.6} color={activeConfig.accentColor} />
          <pointLight position={[1.8, -0.2, 2.5]} intensity={2.2} color="#60A5FA" />

          {/* Alan Mascot performing specific feature pose */}
          <group position={[-0.20, 0.0, 0]}>
            <CarpetModel
              pose={activeConfig.pose}
              face={activeConfig.face}
              interactive={false}
              followCursor={false}
              scale={0.40}
            />
          </group>

          {/* Thematic Feature Prop floating in 3D right next to Alan */}
          <group position={[0.34, 0.0, 0]}>
            <ThematicFeatureProp propKind={activeConfig.propKind} />
          </group>
        </Canvas>
      </div>
    </div>
  )
}
