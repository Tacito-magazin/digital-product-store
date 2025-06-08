// app/layout.tsx
export const metadata = {
  title: 'Digital Product Store',
  description: 'Vendi i tuoi prodotti digitali facilmente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
