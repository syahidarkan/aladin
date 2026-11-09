'use client'

import React from 'react'
import { Lock, Wifi } from 'lucide-react'

interface DigitalVerticalCardProps {
  cardType: 'aladin-idr' | 'd360-sar' | 'aladin-gold' | 'aladin-purple'
  cardNickname?: string
  isLocked?: boolean
  cardNumberMasked?: string
  cardHolderName?: string
  expiryDate?: string
  notchBg?: string
  onClick?: () => void
  className?: string
}

/**
 * High-Fidelity Vertical Digital Visa Card
 * Modeled 1:1 after modern digital cards (Bank Jago / Apple Card):
 * - Vertical orientation with smooth rounded corners
 * - Semicircular bottom accessibility thumb notch
 * - Gold metallic EMV chip with circuit micro-pattern
 * - Contactless NFC indicator
 * - Bold vertical branding
 * - Official metallic VISA Debit logo
 * - Frosted glass locked/freeze state overlay
 */
export default function DigitalVerticalCard({
  cardType = 'aladin-idr',
  cardNickname = 'Travelling',
  isLocked = false,
  cardNumberMasked = '•••• 7890',
  cardHolderName = 'SYAHID ARKAN',
  expiryDate = '02/28',
  notchBg = '#FFFFFF',
  onClick,
  className = '',
}: DigitalVerticalCardProps) {
  // Color themes per card type
  const theme = {
    'aladin-idr': {
      // Signature Aladin Syariah Royal Blue with subtle mint aurora glow
      bg: 'linear-gradient(155deg, #07173D 0%, #102B7B 40%, #183FC4 75%, #1C20C4 100%)',
      borderColor: 'rgba(0, 240, 160, 0.4)',
      accentColor: '#00F0A0',
      brandText: 'Aladin',
      brandSub: 'SYARIAH',
      network: 'VISA',
      networkSub: 'Debit',
      glow: 'rgba(28, 32, 196, 0.45)',
    },
    'd360-sar': {
      // Rich Saudi Emerald Green with Islamic gold trim
      bg: 'linear-gradient(155deg, #03281D 0%, #064E3B 40%, #047857 75%, #059669 100%)',
      borderColor: 'rgba(245, 158, 11, 0.5)',
      accentColor: '#FBBF24',
      brandText: 'D360',
      brandSub: 'HARAMAIN WALLET',
      network: 'VISA',
      networkSub: 'Debit • mada',
      glow: 'rgba(5, 150, 105, 0.45)',
    },
    'aladin-gold': {
      // Warm Amber / Gold identical to Bank Jago reference File 1
      bg: 'linear-gradient(155deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      accentColor: '#FFFFFF',
      brandText: 'Aladin',
      brandSub: 'PRIORITY',
      network: 'VISA',
      networkSub: 'Debit',
      glow: 'rgba(217, 119, 6, 0.45)',
    },
    'aladin-purple': {
      // Regal Purple identical to Bank Jago Syariah reference File 2
      bg: 'linear-gradient(155deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)',
      borderColor: 'rgba(216, 180, 254, 0.4)',
      accentColor: '#F0ABFC',
      brandText: 'Aladin',
      brandSub: 'SYARIAH',
      network: 'VISA',
      networkSub: 'Debit',
      glow: 'rgba(124, 58, 237, 0.45)',
    },
  }[cardType]

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* The Physical / Digital Vertical Card Body */}
      <div
        onClick={onClick}
        className="relative w-[215px] h-[340px] rounded-[24px] p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-2xl group cursor-pointer active:scale-[0.98]"
        style={{
          background: isLocked
            ? 'linear-gradient(155deg, #1E293B 0%, #0F172A 100%)'
            : theme.bg,
          boxShadow: isLocked
            ? '0 16px 36px rgba(0, 0, 0, 0.4)'
            : `0 18px 42px ${theme.glow}, 0 2px 8px rgba(0,0,0,0.2)`,
          border: `1.5px solid ${isLocked ? 'rgba(255,255,255,0.15)' : theme.borderColor}`,
        }}
      >
        {/* Subtle Background Pattern & Light Sheen */}
        <div
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* 1. TOP BAR: Chip & Contactless Indicator */}
        <div className="flex items-start justify-between w-full relative z-10">
          {/* Aladin / D360 Top Emblem */}
          <div className="flex flex-col">
            <span
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: theme.accentColor }}
            >
              {theme.brandSub}
            </span>
          </div>

          {/* Gold EMV Chip & Contactless */}
          <div className="flex items-center gap-2">
            {/* Gold EMV Chip */}
            <div className="w-[34px] h-[26px] rounded-[5px] bg-gradient-to-br from-[#FFE58F] via-[#FADB14] to-[#D48806] border border-[#AD6800]/50 shadow-xs relative overflow-hidden flex items-center justify-center">
              {/* Internal Circuit Lines */}
              <div className="w-full h-[1px] bg-[#915900]/60 absolute top-1/2 -translate-y-1/2" />
              <div className="h-full w-[1px] bg-[#915900]/60 absolute left-1/3" />
              <div className="h-full w-[1px] bg-[#915900]/60 absolute right-1/3" />
              <div className="w-2.5 h-2.5 rounded-full border border-[#915900]/60 bg-[#FFE58F]/50" />
            </div>

            {/* Contactless Wifi Waves */}
            <Wifi className="w-3.5 h-3.5 text-white/90 rotate-90" />
          </div>
        </div>

        {/* 2. CENTER: Bold Vertical Brand Name */}
        <div className="flex-1 flex items-center justify-center my-2 relative z-10">
          <div
            className="transform -rotate-90 text-[36px] font-black tracking-tight select-none flex items-center gap-1.5"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.35)',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <span>{theme.brandText}</span>
            <div
              className="w-2 h-2 rounded-full inline-block mb-1"
              style={{ backgroundColor: theme.accentColor }}
            />
          </div>
        </div>

        {/* 3. BOTTOM BAR: Network (VISA Debit) & Accessibility Notch */}
        <div className="relative z-10 flex items-end justify-between w-full pt-2">
          {/* Bottom Left: Masked Card Number */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white/80 tracking-wider">
              {cardNumberMasked}
            </span>
            <span className="text-[8.5px] uppercase font-bold text-white/60 tracking-wider mt-0.5">
              {cardHolderName}
            </span>
          </div>

          {/* Bottom Right: Official VISA Debit Logo */}
          <div className="flex flex-col items-end">
            <span
              className="text-[20px] font-black italic tracking-tighter leading-none"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {theme.network}
            </span>
            <span className="text-[8px] font-bold text-white/80 tracking-wider uppercase mt-0.5">
              {theme.networkSub}
            </span>
          </div>
        </div>

        {/* 4. Semicircular Accessible Thumb Notch at Bottom Center */}
        <div
          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-9 h-5 rounded-t-full pointer-events-none z-10"
          style={{
            backgroundColor: notchBg,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)',
          }}
        />

        {/* FROZEN / LOCKED STATE OVERLAY */}
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            <div className="w-11 h-11 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-2.5 shadow-lg">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-[12px] font-extrabold text-white tracking-wide uppercase">
              Kartu Dikunci
            </span>
            <p className="text-[10.5px] text-slate-300 mt-1 leading-snug">
              Transaksi dibekukan demi keamanan. Klik tombol di bawah untuk membuka.
            </p>
          </div>
        )}
      </div>

      {/* Card Nickname / Usage Label (Centered below card, just like Bank Jago's "Travelling") */}
      <div className="mt-3 text-center">
        <span className="text-[13px] font-semibold text-[#64748B] tracking-wide">
          {cardNickname}
        </span>
      </div>
    </div>
  )
}
