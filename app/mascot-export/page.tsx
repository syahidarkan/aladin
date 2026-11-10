'use client'

// Lightweight, chrome-free export surface for the 3D mascot, used to grab
// static PNG renders for the pitch deck. Not part of the product UI.
// Usage: /mascot-export?pose=idle&bg=transparent&zoom=1&particles=1

import { useEffect, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import CarpetModel, { CarpetPose } from '@/components/mascot/CarpetModel'
import StarParticles from '@/components/mascot/StarParticles'

export default function MascotExportPage() {
  const [ready, setReady] = useState(false)
  const [opts, setOpts] = useState({
    pose: 'idle' as CarpetPose,
    bg: 'transparent',
    particles: true,
    zoom: 1,
    camZ: 3.8,
  })

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const bg = sp.get('bg') || 'transparent'
    setOpts({
      pose: (sp.get('pose') || 'idle') as CarpetPose,
      bg,
      particles: sp.get('particles') !== '0',
      zoom: parseFloat(sp.get('zoom') || '1'),
      camZ: parseFloat(sp.get('camZ') || '3.8'),
    })
    setReady(true)

    // force a truly transparent/solid page background for clean export
    // captures -- globals.css otherwise paints a dark radial gradient here.
    const prevHtml = document.documentElement.style.background
    const prevBody = document.body.style.background
    document.documentElement.style.background = bg === 'transparent' ? 'transparent' : bg
    document.body.style.background = bg === 'transparent' ? 'transparent' : bg
    return () => {
      document.documentElement.style.background = prevHtml
      document.body.style.background = prevBody
    }
  }, [])

  if (!ready) return null

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: opts.bg === 'transparent' ? 'transparent' : opts.bg,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.12, opts.camZ], fov: 40 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-3, -1, -2]} intensity={0.9} color="#1037A6" />
        <pointLight position={[0, 1.2, 3.0]} intensity={0.6} color="#00F0A0" distance={6} />
        <pointLight position={[1, 2, 1.5]} intensity={1.0} color="#3B82F6" distance={5} />
        <Suspense fallback={null}>
          <CarpetModel pose={opts.pose} interactive={false} scale={opts.zoom} />
          {opts.particles && <StarParticles count={16} />}
        </Suspense>
      </Canvas>
    </div>
  )
}
