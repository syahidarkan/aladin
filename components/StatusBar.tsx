'use client'

interface StatusBarProps {
  time?: string
  dark?: boolean
  className?: string
  batteryLevel?: number
}

/**
 * Authentic Top Safe-Area Status Bar (iOS / Android 1:1)
 * Matches official Aladin App header screenshot:
 * - Time: 22.25
 * - Cellular network signal bars
 * - Wi-Fi icon
 * - Battery indicator with percentage
 */
export default function StatusBar({
  time = '22.25',
  dark = true,
  className = '',
  batteryLevel = 33,
}: StatusBarProps) {
  const textColor = dark ? 'text-white' : 'text-[#1A1D26]'

  return (
    <div
      className={`w-full h-11 px-6 pt-3 shrink-0 flex items-center justify-between select-none pointer-events-none z-30 ${textColor} ${className}`}
      aria-hidden="true"
    >
      {/* Time Display (Exact 22.25) */}
      <span className="text-[14px] font-bold tracking-tight">
        {time}
      </span>

      {/* Network, Wi-Fi & Battery Cluster */}
      <div className="flex items-center gap-1.5">
        {/* Cellular Signal (4 bars) */}
        <div className="flex items-end gap-0.5 h-3">
          <div className="w-[3px] h-1 bg-current rounded-xs" />
          <div className="w-[3px] h-1.5 bg-current rounded-xs" />
          <div className="w-[3px] h-2 bg-current rounded-xs" />
          <div className="w-[3px] h-2.5 bg-current rounded-xs" />
        </div>

        {/* Wi-Fi Icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
        </svg>

        {/* Battery with percentage */}
        <div className="flex items-center gap-1 ml-1">
          <span className="text-[11.5px] font-bold">
            {batteryLevel}
          </span>
          <div className="w-5 h-2.5 rounded-[4px] border border-current p-0.5 flex items-center relative">
            <div
              className="h-full bg-current rounded-xs"
              style={{ width: `${Math.min(100, Math.max(10, batteryLevel))}%` }}
            />
            {/* Battery nipple */}
            <div className="w-[2px] h-1 bg-current rounded-r-xs absolute -right-[3px] top-[2px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
