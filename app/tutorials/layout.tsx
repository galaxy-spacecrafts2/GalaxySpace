import { Navigation } from '@/components/navigation'

export default function TutorialsLayout({
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
