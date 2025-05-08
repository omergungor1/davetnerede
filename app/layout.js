import './globals.css'

export const metadata = {
  title: 'Davet Nerede',
  description: 'Düğün ve davet mekanları platformu',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
