import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import PhoneFrame from '@/components/PhoneFrame'
import { MascotProvider } from '@/context/MascotContext'
import CarpetFloatingBuddy from '@/components/mascot/CarpetFloatingBuddy'
import CarpetPageTransition from '@/components/mascot/CarpetPageTransition'
import CarpetLoader from '@/components/mascot/CarpetLoader'
import CarpetReactionToast from '@/components/mascot/CarpetReactionToast'

const poppins = localFont({
  src: [
    {
      path: './fonts/poppins_regular_400.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/poppins_semi_bold_600.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/poppins_bold_700.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = localFont({
  src: [
    {
      path: './fonts/inter_regular_400.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/inter_bold_700.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bank Aladin Syariah — #PakaiAladin',
  description: 'Prototipe fungsional Bank Aladin Syariah untuk kompetisi #PakaiAladin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased">
        <MascotProvider>
          <PhoneFrame>
            {children}
            <CarpetPageTransition />
            <CarpetLoader />
            <CarpetReactionToast />
          </PhoneFrame>
        </MascotProvider>
      </body>
    </html>
  )
}
