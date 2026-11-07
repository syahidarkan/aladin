import type { Metadata } from 'next'
import './globals.css'
import PhoneFrame from '@/components/PhoneFrame'

export const metadata: Metadata = {
  title: 'Bank Aladin Syariah — #PakaiAladin',
  description: 'Prototipe fungsional Bank Aladin Syariah untuk kompetisi #PakaiAladin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <PhoneFrame>
          {children}
        </PhoneFrame>
      </body>
    </html>
  )
}
