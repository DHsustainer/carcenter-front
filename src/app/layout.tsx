import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthContextProvider from '@/context/authContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car Center',
  description: 'Compañia de autos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='h-full bg-white' lang="es">
      <body className={`${inter.className} h-full`}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
