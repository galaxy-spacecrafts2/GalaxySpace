"use client"

import { Navigation } from '@/components/navigation'
import { TelemetryProvider } from '@/contexts/telemetry-context'
import { ControlPanelDashboard } from '@/components/control-panel/control-panel-dashboard'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { SpaceBackground } from '@/components/ui/space-background'

export default function Home() {
  return (
    <TelemetryProvider>
      <SpaceBackground showMeteors showBeams>
        <Navigation />
        <main>
          <ControlPanelDashboard />
        </main>
        <PWAInstallPrompt />
      </SpaceBackground>
    </TelemetryProvider>
  )
}
