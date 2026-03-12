"use client"

import { motion } from 'framer-motion'
import { useTelemetry } from '@/contexts/telemetry-context'
import { TelemetryGauge } from './telemetry-gauge'
import { FlightPhaseIndicator } from './flight-phase-indicator'
import { AltitudeChart } from './altitude-chart'
import { OrientationDisplay } from './orientation-display'
import { PyroStatus } from './pyro-status'
import { ConnectionStatus } from './connection-status'
import { GPSDisplay } from './gps-display'
import { AnimatedPanel, useAnimatedPanels } from '@/components/animated-page-loader'
import { BorderSnakeBeam } from '@/components/ui/space-background'
import { Clock, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ControlPanelDashboardProps {
  isReady?: boolean
}

export function ControlPanelDashboard({ isReady = true }: ControlPanelDashboardProps) {
  const { telemetry, telemetryHistory, chartData, connection, connect, connectLoRa, disconnect, isSimulated, missionId, startMission, endMission } = useTelemetry()
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const panelsVisible = useAnimatedPanels(12, isReady)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Mission Control
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Real-time rocket telemetry interface
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Mission timer */}
          <BorderSnakeBeam className="rounded-lg" beamColor="white" duration={6}>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 text-white/80" />
            <div className="font-mono text-sm">
              <span className="text-muted-foreground">UTC </span>
              <span className="text-foreground tabular-nums">
                {currentTime ? currentTime.toUTCString().slice(17, 25) : '--:--:--'}
              </span>
            </div>
          </div>
          </BorderSnakeBeam>
          
          {/* Update rate */}
          {connection.isConnected && (
            <motion.div
              className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Activity className="w-4 h-4 text-green-500" />
              </motion.div>
              <span className="font-mono text-sm text-foreground">10 Hz</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Flight Phase */}
      <AnimatedPanel index={0} isVisible={panelsVisible[0]}>
        <div className="mb-6">
          <FlightPhaseIndicator currentPhase={telemetry?.flightPhase ?? 'PRE_LAUNCH'} />
        </div>
      </AnimatedPanel>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column - Primary Telemetry */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatedPanel index={1} isVisible={panelsVisible[1]}>
            <ConnectionStatus
              connection={connection}
              isSimulated={isSimulated}
              onConnect={connect}
              onConnectLoRa={connectLoRa}
              onDisconnect={disconnect}
              missionId={missionId}
              onStartMission={startMission}
              onEndMission={endMission}
            />
          </AnimatedPanel>
          
          <AnimatedPanel index={2} isVisible={panelsVisible[2]}>
            <TelemetryGauge
              label="Velocity"
              value={telemetry?.velocity ?? 0}
              unit="m/s"
              min={-50}
              max={300}
              decimals={1}
            />
          </AnimatedPanel>
          
          <AnimatedPanel index={3} isVisible={panelsVisible[3]}>
            <TelemetryGauge
              label="Acceleration"
              value={telemetry?.acceleration ?? 0}
              unit="m/s²"
              min={-20}
              max={60}
              decimals={2}
            />
          </AnimatedPanel>
          
          <AnimatedPanel index={4} isVisible={panelsVisible[4]}>
            <TelemetryGauge
              label="Battery"
              value={telemetry?.batteryVoltage ?? 0}
              unit="V"
              min={0}
              max={14}
              decimals={2}
              warning={11.5}
              critical={10.5}
            />
          </AnimatedPanel>
        </div>

        {/* Center Column - Charts & Orientation */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatedPanel index={5} isVisible={panelsVisible[5]}>
            <div className="h-[280px]">
              <AltitudeChart chartData={chartData} />
            </div>
          </AnimatedPanel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedPanel index={6} isVisible={panelsVisible[6]}>
              <OrientationDisplay
                gyroX={telemetry?.gyroX ?? 0}
                gyroY={telemetry?.gyroY ?? 0}
                gyroZ={telemetry?.gyroZ ?? 0}
              />
            </AnimatedPanel>
            
            <AnimatedPanel index={7} isVisible={panelsVisible[7]}>
              <GPSDisplay
                lat={telemetry?.gpsLat ?? 0}
                lng={telemetry?.gpsLng ?? 0}
              />
            </AnimatedPanel>
          </div>
        </div>

        {/* Right Column - Status & Environment */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatedPanel index={8} isVisible={panelsVisible[8]}>
            <PyroStatus
              main={telemetry?.pyroStatus.main ?? false}
              drogue={telemetry?.pyroStatus.drogue ?? false}
              airbrakes={telemetry?.pyroStatus.airbrakes ?? false}
            />
          </AnimatedPanel>
          
          <AnimatedPanel index={9} isVisible={panelsVisible[9]}>
            <TelemetryGauge
              label="Temperature"
              value={telemetry?.temperature ?? 0}
              unit="°C"
              min={-20}
              max={60}
              decimals={1}
              warning={45}
              critical={55}
            />
          </AnimatedPanel>
          
          <AnimatedPanel index={10} isVisible={panelsVisible[10]}>
            <TelemetryGauge
              label="Pressure"
              value={(telemetry?.pressure ?? 101325) / 1000}
              unit="kPa"
              min={0}
              max={120}
              decimals={2}
            />
          </AnimatedPanel>
          
          <AnimatedPanel index={11} isVisible={panelsVisible[11]}>
            <TelemetryGauge
              label="Signal Strength"
              value={telemetry?.signalStrength ?? -100}
              unit="dBm"
              min={-120}
              max={-40}
              decimals={0}
              warning={-90}
              critical={-100}
            />
          </AnimatedPanel>
        </div>
      </div>

      {/* Footer Status Bar */}
      <BorderSnakeBeam className="mt-6 rounded-lg" beamColor="gray" duration={10}>
      <motion.div
        className="bg-card/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground">
          <span>SYSTEM: <span className="text-foreground">NOMINAL</span></span>
          <span>FREQ: <span className="text-foreground">915 MHz</span></span>
          <span>BW: <span className="text-foreground">125 kHz</span></span>
          <span>SF: <span className="text-foreground">7</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-mono text-muted-foreground">ALL SYSTEMS GO</span>
          </motion.div>
        </div>
      </motion.div>
      </BorderSnakeBeam>
    </div>
  )
}
