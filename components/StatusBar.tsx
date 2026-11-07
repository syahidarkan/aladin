'use client'

interface StatusBarProps {
  time?: string
  dark?: boolean
  className?: string
  batteryLevel?: number
}

/**
 * Top Safe-Area Spacer
 * Fake status bar icons (clock, battery, wifi, cellular) removed as requested.
 * Provides subtle top spacing (14px) so content doesn't press against the phone frame.
 */
export default function StatusBar({ className = '' }: StatusBarProps) {
  return (
    <div
      className={`w-full h-3.5 shrink-0 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
