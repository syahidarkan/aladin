'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PhoneModalProps {
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
  /** Custom overlay backdrop classes */
  backdropClassName?: string
  /** Whether clicking the backdrop closes the modal (default: true) */
  closeOnBackdropClick?: boolean
}

/**
 * Universal Mobile-Screen Contained Modal Portal
 * Guarantees that any action drawer / confirmation dialog:
 * 1. Covers the entire phone screen, including BottomNav (z-60) and Alan Mascot (z-120).
 * 2. Slides up cleanly from the bottom without getting occluded or blocked by navigation bars.
 * 3. Keeps CTA buttons completely visible with proper safe-area padding.
 */
export default function PhoneModal({
  isOpen,
  onClose,
  children,
  backdropClassName = '',
  closeOnBackdropClick = true,
}: PhoneModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const portalTarget =
    document.getElementById('phone-modal-root') ||
    document.querySelector('.phone-screen') ||
    document.body

  return createPortal(
    <div
      className={`absolute inset-0 z-[125] flex items-end justify-center bg-black/65 backdrop-blur-xs select-none pointer-events-auto animate-in fade-in duration-200 ${backdropClassName}`}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
          onClose()
        }
      }}
    >
      {children}
    </div>,
    portalTarget
  )
}

