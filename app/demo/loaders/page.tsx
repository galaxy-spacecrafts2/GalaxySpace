"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { SpaceBackground } from '@/components/ui/space-background'
import {
  SkeletonCard,
  SkeletonTelemetry,
  GeometricSpinner,
  PulsingDots,
  MorphingSquare,
  OrbitingRings,
  FuturisticProgress,
  SegmentedProgress,
  RocketLoader,
  LogoAssembler,
  GooeyLoader,
  BlobMorph,
  Cube3D,
  Sphere3D,
  AstronautLoader,
  LaunchSequence,
  DataTransmission,
  FullPageLoader,
  ButtonLoader,
  SpinnerModern,
  GlassLoader,
  NeumorphicSpinner,
  LiquidLoader,
  WaveLoader,
  TopProgressBar,
  LoadingMessage,
  AccessibleLoader,
  EnhancedFullPageLoader,
} from '@/components/ui/loaders'
import { Play, Pause } from 'lucide-react'

export default function LoadersShowcase() {
  const [showFullPage, setShowFullPage] = useState(false)
  const [fullPageVariant, setFullPageVariant] = useState<'rocket' | 'astronaut' | 'minimal' | 'brand'>('rocket')
  const [progress, setProgress] = useState(65)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const [enhancedVariant, setEnhancedVariant] = useState<'glass' | 'liquid' | 'neumorphic' | 'minimal'>('glass')
  const [showTopBar, setShowTopBar] = useState(false)

  return (
    <SpaceBackground showMeteors showBeams>
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Loading Animations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modern, creative, and engaging loading animations for Galaxy.SpaceCrafts. 
              From minimal spinners to thematic rocket launches.
            </p>
          </div>

          {/* Top Progress Bar Demo */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">Barra de Progresso Superior</h2>
            <p className="text-sm text-muted-foreground">Linha slim no topo da página - ideal para navegação</p>
            <Button
              variant="outline"
              onClick={() => {
                setShowTopBar(true)
                setTimeout(() => setShowTopBar(false), 3000)
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Demonstrar Barra Superior
            </Button>
          </section>

          {/* Full Page Loader Demo */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">Full Page Loaders - Clássicos</h2>
            <div className="flex flex-wrap gap-3">
              {(['rocket', 'astronaut', 'minimal', 'brand'] as const).map((variant) => (
                <Button
                  key={variant}
                  variant="outline"
                  onClick={() => {
                    setFullPageVariant(variant)
                    setShowFullPage(true)
                    setTimeout(() => setShowFullPage(false), 3000)
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </section>

          {/* Enhanced Full Page Loader Demo - Tendências 2026 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">Full Page Loaders - Tendências 2026</h2>
            <p className="text-sm text-muted-foreground">Glassmorphism, Neumorphism, Liquid Animation com microcopy criativo</p>
            <div className="flex flex-wrap gap-3">
              {(['glass', 'liquid', 'neumorphic', 'minimal'] as const).map((variant) => (
                <Button
                  key={variant}
                  variant="outline"
                  onClick={() => {
                    setEnhancedVariant(variant)
                    setShowEnhanced(true)
                    setTimeout(() => setShowEnhanced(false), 5000)
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </section>

          {/* Skeleton Screens */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">1. Skeleton Screens</h2>
            <p className="text-sm text-muted-foreground">Essential for modern apps - simulates content layout before loading</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground">Card with Image</span>
                <SkeletonCard />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground">Card with Avatar</span>
                <SkeletonCard showImage={false} showAvatar lines={4} />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground">Telemetry Panel</span>
                <SkeletonTelemetry />
              </div>
            </div>
          </section>

          {/* Geometric Spinners */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">2. Geometric Spinners</h2>
            <p className="text-sm text-muted-foreground">Minimal and modern - circles, squares, and shapes with fluid animations</p>
            <div className="flex flex-wrap items-center gap-12 p-8 bg-card rounded-xl border border-border">
              <div className="text-center space-y-3">
                <GeometricSpinner size={50} />
                <span className="text-xs font-mono text-muted-foreground block">Geometric</span>
              </div>
              <div className="text-center space-y-3">
                <PulsingDots />
                <span className="text-xs font-mono text-muted-foreground block">Pulsing Dots</span>
              </div>
              <div className="text-center space-y-3">
                <MorphingSquare size={40} />
                <span className="text-xs font-mono text-muted-foreground block">Morphing</span>
              </div>
              <div className="text-center space-y-3">
                <OrbitingRings size={50} />
                <span className="text-xs font-mono text-muted-foreground block">Orbiting</span>
              </div>
              <div className="text-center space-y-3">
                <SpinnerModern size={30} />
                <span className="text-xs font-mono text-muted-foreground block">Modern</span>
              </div>
              <div className="text-center space-y-3">
                <ButtonLoader />
                <span className="text-xs font-mono text-muted-foreground block">Button</span>
              </div>
            </div>
          </section>

          {/* Progress Bars */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">3. Progress Bars</h2>
            <p className="text-sm text-muted-foreground">Futuristic progress indicators with gradients and smooth animations</p>
            <div className="space-y-6 p-8 bg-card rounded-xl border border-border">
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground">Indeterminate</span>
                <FuturisticProgress indeterminate />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">Determinate ({progress}%)</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
                    <Button size="sm" variant="ghost" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
                  </div>
                </div>
                <FuturisticProgress progress={progress} showPercentage />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted-foreground">Segmented</span>
                <SegmentedProgress progress={progress} segments={12} />
              </div>
            </div>
          </section>

          {/* Brand Loaders */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">4. Brand Loaders</h2>
            <p className="text-sm text-muted-foreground">Identity-based animations using the Galaxy.SpaceCrafts brand</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <RocketLoader size={80} />
                <span className="text-xs font-mono text-muted-foreground block">Rocket Launch</span>
              </div>
              <div className="text-center space-y-4">
                <LogoAssembler />
                <span className="text-xs font-mono text-muted-foreground block">Logo Assembler</span>
              </div>
            </div>
          </section>

          {/* Gooey Effect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">5. Efeito Gooey</h2>
            <p className="text-sm text-muted-foreground">Blobs viscosos que se fundem e separam - hipnotizante e fluido</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <GooeyLoader size={80} />
                <span className="text-xs font-mono text-muted-foreground block">Gooey Merge</span>
              </div>
              <div className="text-center space-y-4">
                <BlobMorph size={80} />
                <span className="text-xs font-mono text-muted-foreground block">Blob Morph</span>
              </div>
            </div>
          </section>

          {/* Glassmorphism & Neumorphism - Tendências 2026 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">6. Glassmorphism e Neumorphism</h2>
            <p className="text-sm text-muted-foreground">Tendências 2026 - Texturas suaves e efeitos de vidro fosco</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <GlassLoader size={100} />
                <span className="text-xs font-mono text-muted-foreground block">Glass Loader</span>
              </div>
              <div className="text-center space-y-4">
                <NeumorphicSpinner size={80} />
                <span className="text-xs font-mono text-muted-foreground block">Neumorphic Spinner</span>
              </div>
            </div>
          </section>

          {/* Liquid Animation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">7. Animações Líquidas</h2>
            <p className="text-sm text-muted-foreground">Formas fluidas que geram sensação de calma e modernidade</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <LiquidLoader size={100} />
                <span className="text-xs font-mono text-muted-foreground block">Liquid Loader</span>
              </div>
              <div className="text-center space-y-4">
                <WaveLoader />
                <span className="text-xs font-mono text-muted-foreground block">Wave Loader</span>
              </div>
            </div>
          </section>

          {/* 3D Elements */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">6. 3D Elements</h2>
            <p className="text-sm text-muted-foreground">Three-dimensional shapes for a technological aesthetic</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <Cube3D size={60} />
                <span className="text-xs font-mono text-muted-foreground block">3D Cube</span>
              </div>
              <div className="text-center space-y-4">
                <Sphere3D size={70} />
                <span className="text-xs font-mono text-muted-foreground block">3D Sphere</span>
              </div>
            </div>
          </section>

          {/* Mascot Loader */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">7. Mascot Animations</h2>
            <p className="text-sm text-muted-foreground">Character animations that distract and engage users</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <AstronautLoader size={120} />
                <span className="text-xs font-mono text-muted-foreground block">Floating Astronaut</span>
              </div>
            </div>
          </section>

          {/* Thematic Loaders */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">8. Thematic Loaders</h2>
            <p className="text-sm text-muted-foreground">Conceptual animations that simulate actions - perfect for space/logistics themes</p>
            <div className="flex flex-wrap items-center justify-center gap-16 p-12 bg-card rounded-xl border border-border">
              <div className="text-center space-y-4">
                <LaunchSequence />
                <span className="text-xs font-mono text-muted-foreground block mt-8">Launch Sequence</span>
              </div>
              <div className="text-center space-y-4">
                <DataTransmission />
                <span className="text-xs font-mono text-muted-foreground block">Data Transmission</span>
              </div>
            </div>
          </section>

          {/* Microcopy & Acessibilidade */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">10. Microcopy e Acessibilidade</h2>
            <p className="text-sm text-muted-foreground">Frases temáticas criativas e suporte a prefers-reduced-motion</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                <h3 className="font-semibold">Mensagens Temáticas</h3>
                <p className="text-xs text-muted-foreground">Muda automaticamente a cada 3 segundos</p>
                <div className="h-12 flex items-center">
                  <LoadingMessage />
                </div>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                <h3 className="font-semibold">Loader Acessível</h3>
                <p className="text-xs text-muted-foreground">Respeita prefers-reduced-motion</p>
                <div className="flex items-center gap-4">
                  <AccessibleLoader size={32} label="Carregando conteúdo" />
                  <span className="text-sm text-muted-foreground">Com aria-label</span>
                </div>
              </div>
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-b border-border pb-2">Exemplos de Uso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                <h3 className="font-semibold">Button States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>
                    <SpinnerModern size={16} className="mr-2" />
                    Loading...
                  </Button>
                  <Button variant="outline" disabled>
                    <ButtonLoader className="mr-2" />
                    Processing
                  </Button>
                  <Button variant="secondary" disabled>
                    <PulsingDots className="mr-2" />
                    Syncing
                  </Button>
                </div>
              </div>
              <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                <h3 className="font-semibold">Inline Loading</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Fetching telemetry</span>
                  <PulsingDots />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Uploading data</span>
                  <FuturisticProgress progress={75} className="flex-1" />
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      {/* Top Progress Bar */}
      <TopProgressBar isLoading={showTopBar} />

      {/* Full Page Loader Overlay - Clássico */}
      <FullPageLoader 
        isLoading={showFullPage} 
        variant={fullPageVariant}
        message={`Carregando demo ${fullPageVariant}...`}
      />

      {/* Enhanced Full Page Loader - 2026 */}
      <EnhancedFullPageLoader
        isLoading={showEnhanced}
        variant={enhancedVariant}
        showMessage
        showProgress
        estimatedTime="~3 segundos"
      />
    </SpaceBackground>
  )
}
