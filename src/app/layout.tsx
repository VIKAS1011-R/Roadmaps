import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'All in One Roadmaps',
  description: 'Master Java Development with a comprehensive, structured learning path designed by experts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
