'use client'

interface StatusBarProps {
  time?: string
  dark?: boolean
  className?: string
  batteryLevel?: number
}

/**
 * Clean Top Safe-Area Spacer & Notch Adapter
 * Guarantees that the top safe area seamlessly matches the navbar color:
 * - Pure solid white (`#FFFFFF`) on light headers to eliminate any gap / off-color band.
 * - Transparent / Seamless on dark headers so parent container color/gradient flows without seam.
 */
export default function StatusBar({
  className = '',
  dark = false,
}: StatusBarProps) {
  const hasCustomBg = /bg-/.test(className)
  const defaultBg = dark ? 'bg-transparent' : 'bg-white'

  return (
    <div
      className={`w-full h-9 shrink-0 select-none pointer-events-none z-30 transition-colors ${
        hasCustomBg ? '' : defaultBg
      } ${className}`}
      aria-hidden="true"
    />
  )
}
