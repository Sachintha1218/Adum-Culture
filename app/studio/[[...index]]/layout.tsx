export const metadata = {
  title: 'Sanity Studio - Adum Culture',
  description: 'Manage Adum Culture inventory and catalogs',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      {children}
    </div>
  )
}
