'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { useMascot } from '@/context/MascotContext'
import CarpetModel from './CarpetModel'

/**
 * 3D Mascot Acrobatic Loader Component (Three.js WebGL)
 * Executes continuous 3D Figure-8 flight, dynamic banking roll,
 * and high-speed fabric ripple oscillation via Three.js bone rigging.
 * ZERO CSS scale or DOM zoom transforms!
 */
export default function CarpetLoader() {
  const { isLoading, loadingText, hideLoader } = useMascot()

  if (!isLoading) return null

  return (
    <div
      className="absolute inset-0 z-[9990] flex items-center justify-center bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={hideLoader}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[320px] rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #07153D 0%, #0F2D84 55%, #081B4E 100%)',
          border: '1.5px solid rgba(0, 240, 160, 0.45)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 160, 0.25)',
        }}
      >
        {/* Floating Background Stars */}
        <div className="absolute top-4 left-6 text-[#00F0A0] text-xs animate-star-twinkle">✦</div>
        <div className="absolute bottom-6 right-6 text-[#00F0A0] text-sm animate-star-twinkle" style={{ animationDelay: '300ms' }}>✦</div>
        <div className="absolute top-10 right-8 text-emerald-300 text-xs animate-star-twinkle" style={{ animationDelay: '600ms' }}>★</div>
        <div className="absolute bottom-12 left-8 text-[#00F0A0] text-xs animate-star-twinkle" style={{ animationDelay: '900ms' }}>★</div>

        {/* 3D WebGL Canvas for Mascot Acrobatic Flight */}
        <div className="relative w-48 h-36 my-1">
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <ambientLight intensity={1.4} />
            <directionalLight position={[3, 5, 4]} intensity={2.2} />
            <pointLight position={[-3, -2, 2]} intensity={1.5} color="#00F0A0" />
            <pointLight position={[0, 2, 3]} intensity={1.2} color="#3B82F6" />

            <CarpetModel pose="loading" interactive={false} scale={0.82} />
          </Canvas>
        </div>

        {/* Dynamic Status Title */}
        <h4 className="text-[16px] font-black text-white mt-1 leading-snug">
          {loadingText}
        </h4>

        {/* Subtext info */}
        <p className="text-[12px] text-gray-300 mt-1 mb-4 leading-relaxed">
          Mohon tunggu sejenak, Maskot Aladin sedang menyiapkan berkah untukmu...
        </p>

        {/* Animated Progress Dots Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
          <div className="w-2 h-2 rounded-full bg-[#00F0A0] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#00F0A0] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-[11px] font-bold text-white/90 ml-1">
            Memproses
          </span>
        </div>
      </div>
    </div>
  )
}
