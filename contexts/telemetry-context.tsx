"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useLoRaTelemetry, TelemetryData, LoRaConnectionState, ChartDataPoint } from '@/hooks/use-lora-telemetry'

interface TelemetryContextType {
  telemetry: TelemetryData | null
  telemetryHistory: TelemetryData[]
  chartData: ChartDataPoint[]
  connection: LoRaConnectionState
  connect: () => void
  connectLoRa: () => Promise<void>
  disconnect: () => void
  isSimulated: boolean
  missionId: string | null
  startMission: (name: string, description?: string) => Promise<string | null>
  endMission: () => Promise<void>
}

const TelemetryContext = createContext<TelemetryContextType | null>(null)

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const loraData = useLoRaTelemetry()

  return (
    <TelemetryContext.Provider value={loraData}>
      {children}
    </TelemetryContext.Provider>
  )
}

export function useTelemetry() {
  const context = useContext(TelemetryContext)
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider')
  }
  return context
}
