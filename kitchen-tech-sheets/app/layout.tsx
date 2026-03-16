import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kitchen Tech Sheets',
  description: 'Gestion des fiches techniques de cuisine',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
