'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sparkles } from 'lucide-react'
import CarpetModel, { CarpetPose, MascotFace } from './CarpetModel'
import { useBankState } from '@/lib/bankState'

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
  | 'hijrah'

interface FeatureWelcomeConfig {
  key: string
  pose: CarpetPose
  face: MascotFace
  hasProp: boolean
  propKind: PropKind
  accentColor: string
  greeting: (name: string) => string
}

const FEATURE_CONFIGS: Record<string, FeatureWelcomeConfig> = {
  '/investasi': {
    key: 'investasi',
    pose: 'pointing',
    face: 'cheerful',
    hasProp: true,
    propKind: 'investasi',
    accentColor: '#00F0A0',
    greeting: (name) =>
      `Haiii ${name}! Mau mulai investasi syariah? Kerenn banget, yuk kembangkan aset halalmu bebas riba bareng Alan!`,
  },
  '/qris': {
    key: 'qris',
    pose: 'peeking',
    face: 'curious',
    hasProp: true,
    propKind: 'qris',
    accentColor: '#00F0A0',
    greeting: (name) =>
      `Haiii ${name}! Siap belanja berkah hari ini? Yuk scan QRIS kilat tanpa repot dan nikmati kemudahannya!`,
  },
  '/kartu': {
    key: 'kartu',
    pose: 'peek-a-boo-hide',
    face: 'curious',
    hasProp: true,
    propKind: 'kartu',
    accentColor: '#38BDF8',
    greeting: (name) =>
      `Haiii ${name}! Mau cek detail kartu Aladin Visa? Tenang, Alan jagain data kartumu biar transaksi selalu aman!`,
  },
  '/simulasi-bagi-hasil': {
    key: 'simulasi-bagi-hasil',
    pose: 'celebrate-max',
    face: 'cheerful',
    hasProp: true,
    propKind: 'deposito',
    accentColor: '#00F0A0',
    greeting: (name) =>
      `Haiii ${name}! Mau intip bagi hasil deposito syariah? Nisbahnya kompetitif hingga 85:15 tanpa riba lho!`,
  },
  '/bayar-beli': {
    key: 'bayar-beli',
    pose: 'roll-cylinder',
    face: 'cheerful',
    hasProp: true,
    propKind: 'bayar-beli',
    accentColor: '#FBBF24',
    greeting: (name) =>
      `Haiii ${name}! Mau bayar tagihan atau isi pulsa? Bebas biaya admin dong bareng Bank Aladin!`,
  },
  '/impian': {
    key: 'impian',
    pose: 'ihrom-bow',
    face: 'chill',
    hasProp: true,
    propKind: 'impian',
    accentColor: '#10B981',
    greeting: (name) =>
      `Haiii ${name}! Mau buka tabungan impian? Kerenn banget, semoga tabunganmu makin banyak dan segera ke Baitullah yaa!`,
  },
  '/impian/umrah/buat': {
    key: 'impian-umrah',
    pose: 'ihrom-bow',
    face: 'chill',
    hasProp: true,
    propKind: 'impian',
    accentColor: '#10B981',
    greeting: (name) =>
      `Haiii ${name}! Niat suci ke Baitullah dimulai hari ini! Semoga Allah mudahkan ikhtiar tabungan umrahmu yaa!`,
  },
  '/impian/haji/buat': {
    key: 'impian-haji',
    pose: 'ihrom-bow',
    face: 'chill',
    hasProp: true,
    propKind: 'impian',
    accentColor: '#10B981',
    greeting: (name) =>
      `Haiii ${name}! Mau daftar porsi haji resmi Kemenag? Alan temani langkah suci kamu sampai ke Tanah Suci!`,
  },
  '/ala-haramain': {
    key: 'ala-haramain',
    pose: 'barrel-roll',
    face: 'cheerful',
    hasProp: true,
    propKind: 'haramain',
    accentColor: '#00F0A0',
    greeting: (name) =>
      `Haiii ${name}! Mau ibadah ke Tanah Suci? Dompet SAR & kartu nirsentuh siap nemenin tanpa biaya kurs tersembunyi!`,
  },
  '/onboarding/tujuan-finansial': {
    key: 'onboarding-tujuan-finansial',
    pose: 'curious-think',
    face: 'curious',
    hasProp: true,
    propKind: 'onboarding',
    accentColor: '#F59E0B',
    greeting: (name) =>
      `Haiii ${name}! Selamat datang! Yuk pilih fokus finansialmu agar Alan bisa siapin rekomendasi terbaik buat kamu!`,
  },
  '/wrapped': {
    key: 'wrapped',
    pose: 'host-proud',
    face: 'proud',
    hasProp: true,
    propKind: 'wrapped',
    accentColor: '#C084FC',
    greeting: (name) =>
      `Haiii ${name}! Yuk intip jejak transaksi penuh berkahmu selama setahun terakhir bersama Bank Aladin!`,
  },
  '/pocket': {
    key: 'pocket',
    pose: 'stand',
    face: 'cheerful',
    hasProp: true,
    propKind: 'pocket',
    accentColor: '#38BDF8',
    greeting: (name) =>
      `Haiii ${name}! Mau pisahin pos tabungan dan harian? Rapi banget rencanamu, yuk atur kantongmu makin tertata!`,
  },
  '/alfa-daily': {
    key: 'alfa-daily',
    pose: 'pointing',
    face: 'wink',
    hasProp: true,
    propKind: 'alfa',
    accentColor: '#EF4444',
    greeting: (name) =>
      `Haiii ${name}! Belanja di Alfamart makin hemat dengan kuota gratis admin dan cashback berkah tiap hari!`,
  },
  '/setor': {
    key: 'setor',
    pose: 'pointing',
    face: 'cheerful',
    hasProp: true,
    propKind: 'alfa',
    accentColor: '#00F0A0',
    greeting: (name) =>
      `Haiii ${name}! Mau setor tunai tanpa kartu? Gratis biaya admin di 18.000+ kasir Alfamart seluruh Indonesia!`,
  },
  '/tarik': {
    key: 'tarik',
    pose: 'pointing',
    face: 'cheerful',
    hasProp: true,
    propKind: 'alfa',
    accentColor: '#38BDF8',
    greeting: (name) =>
      `Haiii ${name}! Butuh uang tunai cepat? Tarik tunai praktis lewat kasir Alfamart tanpa perlu kartu ATM!`,
  },
  '/hijrah': {
    key: 'hijrah',
    pose: 'stand',
    face: 'cheerful',
    hasProp: true,
    propKind: 'hijrah',
    accentColor: '#1C20C4',
    greeting: (name) =>
      `Haiii ${name}! Selamat datang di ekosistem syariah! Eksplor kajian terpercaya, fashion halal, hingga ZISWAF di sini!`,
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
  const needleRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle breathing float
      groupRef.current.position.y = Math.sin(t * 2.2) * 0.05
    }

    if (propKind === 'investasi') {
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
      if (beamRef.current) {
        beamRef.current.position.y = Math.sin(t * 4.0) * 0.28
      }
    } else if (propKind === 'deposito' || propKind === 'haramain') {
      if (coinRef.current) {
        coinRef.current.rotation.y += delta * 1.8
      }
    } else if (propKind === 'onboarding') {
      if (needleRef.current) {
        needleRef.current.rotation.z = Math.sin(t * 2.0) * 0.45
      }
      if (coinRef.current) {
        coinRef.current.rotation.y += delta * 1.5
      }
    }
  })

  // 1. INVESTASI: Glowing 3D Candlestick Chart + Spinning Gold Dinar Coin
  if (propKind === 'investasi') {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]}>
        {/* Candlestick Bar 1 */}
        <mesh
          ref={(el) => {
            if (el) barRefs.current[0] = el
          }}
          position={[-0.22, -0.08, 0]}
        >
          <boxGeometry args={[0.07, 0.26, 0.06]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.22, 0.09, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
          <meshBasicMaterial color="#00F0A0" />
        </mesh>

        {/* Candlestick Bar 2 */}
        <mesh
          ref={(el) => {
            if (el) barRefs.current[1] = el
          }}
          position={[-0.07, 0.04, 0.02]}
        >
          <boxGeometry args={[0.07, 0.38, 0.06]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.07, 0.27, 0.02]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          <meshBasicMaterial color="#00F0A0" />
        </mesh>

        {/* Candlestick Bar 3 */}
        <mesh
          ref={(el) => {
            if (el) barRefs.current[2] = el
          }}
          position={[0.08, 0.18, 0.04]}
        >
          <boxGeometry args={[0.07, 0.52, 0.06]} />
          <meshStandardMaterial color="#34D399" emissive="#10B981" emissiveIntensity={1.0} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0.48, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>

        {/* Floating Gold Dinar Coin */}
        <mesh ref={coinRef} position={[0.22, 0.28, 0.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.025, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} emissive="#D97706" emissiveIntensity={0.6} />
        </mesh>
      </group>
    )
  }

  // 2. QRIS: Floating QR Terminal Frame + Animated Laser Scan Line
  if (propKind === 'qris') {
    return (
      <group ref={groupRef} position={[0, -0.02, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.54, 0.54, 0.04]} />
          <meshStandardMaterial color="#0A2268" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.46, 0.46]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.14, 0.14, 0.03]}>
          <boxGeometry args={[0.11, 0.11, 0.01]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <mesh position={[0.14, 0.14, 0.03]}>
          <boxGeometry args={[0.11, 0.11, 0.01]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <mesh position={[-0.14, -0.14, 0.03]}>
          <boxGeometry args={[0.11, 0.11, 0.01]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <mesh ref={beamRef} position={[0, 0, 0.04]}>
          <boxGeometry args={[0.48, 0.02, 0.01]} />
          <meshBasicMaterial color="#00F0A0" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.29, 0.31, 32]} />
          <meshBasicMaterial color="#00F0A0" />
        </mesh>
      </group>
    )
  }

  // 3. KARTU: 3D Holographic Visa Platinum Card with Chip
  if (propKind === 'kartu') {
    return (
      <group ref={groupRef} position={[0, 0, 0]} rotation={[0.15, -0.35, 0.1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.76, 0.48, 0.025]} />
          <meshStandardMaterial color="#0C2577" metalness={0.7} roughness={0.25} emissive="#081850" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.22, 0.06, 0.016]}>
          <boxGeometry args={[0.12, 0.09, 0.005]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} emissive="#B45309" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[-0.04, 0.06, 0.016]}>
          <ringGeometry args={[0.04, 0.055, 16, 1, 0, Math.PI / 1.5]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        <mesh position={[0.22, -0.14, 0.016]}>
          <planeGeometry args={[0.16, 0.06]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    )
  }

  // 4. DEPOSITO: Safe Vault Box & Golden Nisbah Coin
  if (propKind === 'deposito') {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]}>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.42, 0.42, 0.36]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} emissive="#0F172A" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, -0.04, 0.19]}>
          <torusGeometry args={[0.09, 0.02, 12, 24]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.9} roughness={0.2} />
        </mesh>
        <mesh ref={coinRef} position={[0.18, 0.22, 0.12]} rotation={[0.5, 0.2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} emissive="#D97706" emissiveIntensity={0.7} />
        </mesh>
      </group>
    )
  }

  // 5. BAYAR-BELI: Miniature Shopping Gift Box & Ribbon
  if (propKind === 'bayar-beli') {
    return (
      <group ref={groupRef} position={[0, -0.02, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshStandardMaterial color="#1037A6" emissive="#0A2268" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.37, 0.08, 0.37]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.08, 0.37, 0.37]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[0.4, 0.4, 0]}>
          <torusGeometry args={[0.08, 0.03, 8, 16]} />
          <meshStandardMaterial color="#FBBF24" emissive="#D97706" emissiveIntensity={0.9} />
        </mesh>
      </group>
    )
  }

  // 6. IMPIAN: Miniature Ka'bah Cube & Golden Crescent
  if (propKind === 'impian') {
    return (
      <group ref={groupRef} position={[0, -0.04, 0]} rotation={[0.1, -0.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.42, 0.38]} />
          <meshStandardMaterial color="#0A0B10" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.385, 0.05, 0.385]} />
          <meshStandardMaterial color="#FBBF24" emissive="#D97706" emissiveIntensity={1.2} metalness={0.9} />
        </mesh>
        <mesh position={[0.08, -0.04, 0.193]}>
          <planeGeometry args={[0.08, 0.18]} />
          <meshStandardMaterial color="#FBBF24" emissive="#B45309" emissiveIntensity={0.8} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.32, 0]} rotation={[0, 0, 0.3]}>
          <torusGeometry args={[0.08, 0.02, 12, 24, Math.PI * 1.3]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.4} metalness={0.9} />
        </mesh>
      </group>
    )
  }

  // 7. HARAMAIN: Ka'bah & Spinning SAR Coin
  if (propKind === 'haramain') {
    return (
      <group ref={groupRef} position={[0, -0.02, 0]}>
        <mesh position={[-0.1, -0.05, 0]} rotation={[0.05, -0.3, 0]}>
          <boxGeometry args={[0.34, 0.38, 0.34]} />
          <meshStandardMaterial color="#0F1117" roughness={0.4} />
        </mesh>
        <mesh position={[-0.1, 0.05, 0]} rotation={[0.05, -0.3, 0]}>
          <boxGeometry args={[0.345, 0.04, 0.345]} />
          <meshStandardMaterial color="#FBBF24" emissive="#D97706" emissiveIntensity={1.2} metalness={0.9} />
        </mesh>
        <mesh ref={coinRef} position={[0.18, 0.15, 0.12]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.025, 24]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.8} metalness={0.8} />
        </mesh>
      </group>
    )
  }

  // 8. WRAPPED: 3D Golden Trophy Cup
  if (propKind === 'wrapped') {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.18, 0.09, 0.24, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} emissive="#D97706" emissiveIntensity={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.1, 24]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color="#C084FC" emissive="#A855F7" emissiveIntensity={1.5} />
        </mesh>
      </group>
    )
  }

  // 9. POCKET: 3 Floating Colorful Piggy/Sub-Wallets with Coins
  if (propKind === 'pocket') {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]}>
        <mesh position={[-0.12, -0.1, 0]}>
          <boxGeometry args={[0.24, 0.2, 0.12]} />
          <meshStandardMaterial color="#1037A6" emissive="#0A2268" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, 0.02, 0.05]}>
          <boxGeometry args={[0.22, 0.22, 0.12]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
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
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.32, 0.36, 0.2]} />
          <meshStandardMaterial color="#DC2626" emissive="#991B1B" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.08, 0.105]}>
          <planeGeometry args={[0.32, 0.1]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.15, 0.12, 0.08]} rotation={[0.2, 0.3, 0.4]}>
          <boxGeometry args={[0.22, 0.11, 0.03]} />
          <meshStandardMaterial color="#059669" emissive="#059669" emissiveIntensity={0.5} />
        </mesh>
      </group>
    )
  }

  // 11. ONBOARDING (SOBAT ALADIN): 3D Golden Compass & Glowing Target Star (Centered at 0, 0, 0)
  if (propKind === 'onboarding') {
    return (
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Outer Compass Golden Ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.26, 0.025, 16, 32]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.15} emissive="#D97706" emissiveIntensity={0.8} />
        </mesh>
        {/* Inner Compass Glass Face */}
        <mesh position={[0, 0, -0.01]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
          <meshStandardMaterial color="#0A2268" roughness={0.3} emissive="#061642" emissiveIntensity={0.6} />
        </mesh>
        {/* 4 Cardinal Direction Markers */}
        <mesh position={[0, 0.20, 0.02]}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial color="#00F0A0" />
        </mesh>
        <mesh position={[0, -0.20, 0.02]}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.20, 0, 0.02]}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.20, 0, 0.02]}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Animated Compass Needle (Rotates gently toward goal) */}
        <group ref={needleRef} position={[0, 0, 0.03]}>
          <mesh position={[0, 0.09, 0]}>
            <coneGeometry args={[0.035, 0.18, 4]} />
            <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0, -0.09, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.035, 0.18, 4]} />
            <meshStandardMaterial color="#F43F5E" emissive="#E11D48" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} />
          </mesh>
        </group>
        {/* Glowing Target Star above Compass */}
        <mesh ref={coinRef} position={[0.18, 0.25, 0.12]} rotation={[0.4, 0, 0]}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.5} roughness={0.1} />
        </mesh>
      </group>
    )
  }

  // 12. HIJRAH: 3D Mosque Minaret & Crescent Moon
  if (propKind === 'hijrah') {
    return (
      <group ref={groupRef} position={[0, -0.04, 0]}>
        {/* Minaret Base Column */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.34, 16]} />
          <meshStandardMaterial color="#1037A6" emissive="#0A2268" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
        {/* Balcony Ring */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
          <meshStandardMaterial color="#FBBF24" emissive="#D97706" emissiveIntensity={0.8} metalness={0.9} />
        </mesh>
        {/* Dome */}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00F0A0" emissive="#00F0A0" emissiveIntensity={0.9} />
        </mesh>
        {/* Crescent on Top */}
        <mesh position={[0, 0.32, 0]} rotation={[0, 0, 0.3]}>
          <torusGeometry args={[0.06, 0.015, 12, 24, Math.PI * 1.3]} />
          <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={1.4} metalness={0.9} />
        </mesh>
      </group>
    )
  }

  return null
}

/**
 * Welcoming Mascot Animation Overlay
 * - Dark blurred screen backdrop.
 * - ZERO BUTTONS: no back, no badge, no close button (user requested "gausah ada button back, simulasi, dan x pokoknya jangan ada button").
 * - Comic speech bubble placed HIGH at the top, clear of the mascot & prop.
 * - Alan performs feature-specific animated gestures alongside authentic 3D props.
 * - Automatically centers Alan when a feature has no side prop.
 * - Dismisses on tap anywhere or automatically after 4.5 seconds.
 */
export default function FeatureWelcomeOverlay() {
  const pathname = usePathname()
  const bankState = useBankState()
  const userNickname = bankState?.shortName || 'Dewan Juri'

  const [activeConfig, setActiveConfig] = useState<FeatureWelcomeConfig | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const currentKeyRef = useRef<string | null>(null)

  useEffect(() => {
    const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/'
    const config = FEATURE_CONFIGS[cleanPath]

    if (!config) {
      setIsVisible(false)
      setActiveConfig(null)
      currentKeyRef.current = null
      return
    }

    if (currentKeyRef.current === config.key) {
      return
    }

    // Cooldown logic: Show once every 4 hours or on a new day per feature
    const storageKey = `aladin_welcome_time_${config.key}`
    const lastWelcomed = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
    const COOLDOWN_MS = 4 * 60 * 60 * 1000 // 4 hours
    const now = Date.now()

    let shouldShow = false
    if (!lastWelcomed) {
      shouldShow = true
    } else {
      const lastTime = parseInt(lastWelcomed, 10)
      if (isNaN(lastTime)) {
        shouldShow = true
      } else {
        const isDifferentDay = new Date(lastTime).toDateString() !== new Date(now).toDateString()
        const isPastCooldown = now - lastTime > COOLDOWN_MS
        if (isDifferentDay || isPastCooldown) {
          shouldShow = true
        }
      }
    }

    if (shouldShow) {
      currentKeyRef.current = config.key
      setActiveConfig(config)
      setIsVisible(true)
      setIsFading(false)

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, now.toString())
      }

      // Auto dismiss smoothly after 4.5 seconds
      const autoTimer = setTimeout(() => {
        handleDismiss()
      }, 4500)

      return () => clearTimeout(autoTimer)
    } else {
      setIsVisible(false)
      setActiveConfig(null)
      currentKeyRef.current = null
    }
  }, [pathname])

  const handleDismiss = () => {
    setIsFading(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsFading(false)
      setActiveConfig(null)
      currentKeyRef.current = null
    }, 350)
  }

  if (!isVisible || !activeConfig) return null

  // If feature has prop: Alan on left [-0.20], Prop on right [0.34].
  // If feature has NO prop: Alan in the exact center [0, -0.38, 0]!
  const alanX = activeConfig.hasProp ? -0.20 : 0.0

  return (
    <div
      data-welcome-overlay="true"
      onClick={() => handleDismiss()}
      className={`absolute inset-0 z-[140] bg-black/85 backdrop-blur-md flex flex-col justify-between p-5 select-none cursor-pointer transition-opacity duration-350 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. CHAT BUBBLE (SPEECH BUBBLE): Positioned high at the top (top-7), NEVER obscuring Alan or props! */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-30 max-w-[320px] w-[88%] pointer-events-none">
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#1037A6] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0A0]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1A1D26] leading-relaxed">
                {activeConfig.greeting(userNickname)}
              </p>
            </div>
          </div>
          {/* Comic Chat Bubble Pointer Arrow pointing down toward Alan */}
          <div
            className="absolute -bottom-2 left-10 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-white/80"
          />
        </div>

        <span className="text-[11px] text-white/60 mt-2.5 font-medium tracking-wide block text-center">
          Ketuk layar di mana saja untuk mulai
        </span>
      </div>

      {/* Glowing Ambient Radial Aura behind Alan */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[360px] h-[360px] rounded-full blur-3xl pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle, ${activeConfig.accentColor}60 0%, rgba(16, 55, 166, 0.45) 55%, transparent 100%)`,
          }}
        />
      </div>

      {/* 3D WebGL Canvas: Alan Mascot + Feature Thematic Props (Positioned lower, completely clear of bubble) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <Canvas
          camera={{ position: [0, -0.20, 6.2], fov: 27 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={2.6} />
          <directionalLight position={[2, 4, 3]} intensity={3.2} />
          <pointLight position={[0, 0.6, 3.5]} intensity={4.0} color="#FFFFFF" />
          <pointLight position={[-1.8, -0.2, 2.5]} intensity={2.6} color={activeConfig.accentColor} />
          <pointLight position={[1.8, -0.2, 2.5]} intensity={2.2} color="#60A5FA" />

          {/* Alan Mascot: centered if no prop, or offset left if prop is present */}
          <group position={[alanX, -0.38, 0]}>
            <CarpetModel
              pose={activeConfig.pose}
              face={activeConfig.face}
              interactive={false}
              followCursor={false}
              scale={0.38}
            />
          </group>

          {/* Thematic Feature Prop: only rendered when hasProp is true */}
          {activeConfig.hasProp && (
            <group position={[0.34, -0.38, 0]}>
              <ThematicFeatureProp propKind={activeConfig.propKind} />
            </group>
          )}
        </Canvas>
      </div>

      {/* Bottom spacer for balance */}
      <div className="h-6" />
    </div>
  )
}
