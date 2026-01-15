import type { Metadata } from 'next'
import { Pinyon_Script, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

// Import react-notion-x styles
import 'react-notion-x/src/styles.css'
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
  title: 'Portfolio',
  description: 'Portfolio Site',
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
