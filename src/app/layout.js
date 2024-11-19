// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { NextAuthProvider } from '@/components/auth/Provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}