import { Navigation } from '@/components/navigation'

export default function DocsLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>{children}</main>
    </div>
  )
}
