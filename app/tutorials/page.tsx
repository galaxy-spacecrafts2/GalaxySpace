import { TutorialGrid } from '@/components/tutorials/tutorial-grid'
import { Navigation } from '@/components/navigation'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tutorials | Galaxy.SpaceCrafts',
  description: 'Step-by-step text tutorials on rocket building, electronics, telemetry systems, and aerospace engineering.',
}

export default function TutorialsPage() {
  return (
    <SpaceBackground showMeteors showBeams>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Header */}
        <BorderSnakeBeam className="mb-12 p-6 rounded-lg bg-card/30 backdrop-blur-sm">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Tutorials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn rocket science through our comprehensive step-by-step guides. From beginner basics to advanced aerospace engineering.
          </p>
        </BorderSnakeBeam>
        
        <TutorialGrid />
      </div>
    </SpaceBackground>
  )
}
