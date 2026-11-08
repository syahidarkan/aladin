'use client'

interface StatusBarProps {
  time?: string
  dark?: boolean
  className?: string
  batteryLevel?: number
}

/**
 * Clean Top Safe-Area Spacer (Transparent, NO fake battery, wifi, or clock icons)
 */
export default function StatusBar({
  className = '',
}: StatusBarProps) {
  return (
    <div
      className={`w-full h-11 shrink-0 select-none pointer-events-none z-30 ${className}`}
      aria-hidden="true"
    />
  )
}
