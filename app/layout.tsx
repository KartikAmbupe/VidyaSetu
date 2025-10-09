import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VidyaSetu',
  description: 'Created with Love 💕',
}

const openDyslexic = localFont({
  src: [
    {
      path: '../public/fonts/OpenDyslexic-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/OpenDyslexic-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-dyslexic',
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${openDyslexic.variable}`}
    >
      <body className="font-sans transition-all duration-300">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
