import { DocsLayout } from '@/components/docs/docs-layout'
import { Navigation } from '@/components/navigation'
import { SpaceBackground } from '@/components/ui/space-background'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation | Galaxy.SpaceCrafts',
  description: 'Technical documentation for Galaxy.SpaceCrafts rocket systems, telemetry interfaces, and flight computers.',
}

export default function DocsPage() {
  return (
    <SpaceBackground showMeteors showBeams>
      <Navigation />
      <DocsLayout />
    </SpaceBackground>
  )
}
