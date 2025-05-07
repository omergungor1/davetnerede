import './globals.css'

export const metadata = {
  title: 'Davet Nerede',
  description: 'Düğün ve davet mekanları platformu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  )
}
