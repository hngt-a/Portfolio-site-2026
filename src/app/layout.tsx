import type { Metadata } from 'next'
import { Pinyon_Script, Noto_Sans_JP } from 'next/font/google'
// Import react-notion-x styles
import 'react-notion-x/src/styles.css'
import './globals.css'
import 'prismjs/themes/prism-tomorrow.css' // Optional for code blocks
import 'katex/dist/katex.min.css' // Optional for math

const pinyon = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pinyon'
})

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto'
})

export const metadata: Metadata = {
  title: 'Shin Hanagata',
  description: 'Dear All Techno-Plastic Fleshes.',
  openGraph: {
    title: 'Shin Hanagata',
    description: 'Dear All Techno-Plastic Fleshes.',
    url: 'https://shinhanagata.com', // Placeholder, user can update
    siteName: 'Shin Hanagata Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 800,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shin Hanagata',
    description: 'Dear All Techno-Plastic Fleshes.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${pinyon.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
