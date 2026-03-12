import { BlogList } from '@/components/blog/blog-list'
import { Navigation } from '@/components/navigation'
import { SpaceBackground, BorderSnakeBeam } from '@/components/ui/space-background'
import { LoadingProviderWrapper } from '@/components/loading-provider-wrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Galaxy.SpaceCrafts',
  description: 'Latest updates, build logs, and insights from the Galaxy.SpaceCrafts team on rocket development and space technology.',
}

export default function BlogPage() {
  return (
    <LoadingProviderWrapper>
      <SpaceBackground showMeteors showBeams>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          {/* Header */}
          <BorderSnakeBeam className="mb-12 p-6 rounded-lg bg-card/30 backdrop-blur-sm">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Build logs, technical deep-dives, and updates from our rocket development journey.
            </p>
          </BorderSnakeBeam>
          
          <BlogList />
        </div>
      </SpaceBackground>
    </LoadingProviderWrapper>
  )
}
