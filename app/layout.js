import './globals.css'
import ClientLayoutWrapper from './client-layout'

export const metadata = {
  title: 'Davet Evi Bul',
  description: 'Düğün ve davet mekanları platformu',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: 'no'
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  )
}
