"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, Signal, Wifi, WifiOff, Usb, Play, Square, Rocket, Loader2 } from 'lucide-react'
import { LoRaConnectionState } from '@/hooks/use-lora-telemetry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpinnerModern } from '@/components/ui/loaders'

interface ConnectionStatusProps {
  connection: LoRaConnectionState
  isSimulated: boolean
  onConnect: () => void
  onConnectLoRa: () => Promise<void>
  onDisconnect: () => void
  missionId: string | null
  onStartMission: (name: string, description?: string) => Promise<string | null>
  onEndMission: () => Promise<void>
}

export function ConnectionStatus({ 
  connection, 
  isSimulated, 
  onConnect,
  onConnectLoRa,
  onDisconnect,
  missionId,
  onStartMission,
  onEndMission,
}: ConnectionStatusProps) {
  const [missionName, setMissionName] = useState('')
  const [isStartingMission, setIsStartingMission] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleStartMission = async () => {
    if (!missionName.trim()) return
    setIsStartingMission(true)
    await onStartMission(missionName.trim())
    setMissionName('')
    setIsStartingMission(false)
  }

  const handleConnectLoRa = async () => {
    setIsConnecting(true)
    try {
      await onConnectLoRa()
    } catch (error) {
      console.error('Failed to connect to LoRa:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSimulationConnect = () => {
    setIsConnecting(true)
    onConnect()
    // Simular um pequeno delay para mostrar o loading
    setTimeout(() => setIsConnecting(false), 500)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
      {/* Animated background pulse when connected */}
      {connection.isConnected && (
        <motion.div
          className="absolute inset-0 bg-foreground/5"
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${connection.isConnected ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'}
              `}
              animate={connection.isConnected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Radio className="w-4 h-4" />
            </motion.div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                LoRa Link
              </h3>
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-2 h-2 rounded-full ${connection.isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-mono text-foreground">
                  {connection.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection buttons */}
        <div className="flex flex-col gap-2 mb-4">
          {connection.isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="font-mono text-xs w-full"
            >
              <WifiOff className="w-3 h-3 mr-1" />
              DISCONNECT
            </Button>
          ) : (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleConnectLoRa}
                disabled={isConnecting}
                className="font-mono text-xs w-full"
              >
                {isConnecting ? (
                  <>
                    <SpinnerModern size={12} className="mr-1" />
                    CONECTANDO...
                  </>
                ) : (
                  <>
                    <Usb className="w-3 h-3 mr-1" />
                    CONNECT LoRa (USB)
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulationConnect}
                disabled={isConnecting}
                className="font-mono text-xs w-full"
              >
                {isConnecting ? (
                  <>
                    <SpinnerModern size={12} className="mr-1" />
                    INICIANDO...
                  </>
                ) : (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    SIMULATION MODE
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Mission control */}
        <div className="border-t border-border pt-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Mission
            </span>
          </div>
          
          {missionId ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs font-mono text-foreground">RECORDING</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={onEndMission}
                className="font-mono text-xs w-full"
              >
                <Square className="w-3 h-3 mr-1" />
                END MISSION
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Mission name..."
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="font-mono text-xs h-8"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleStartMission}
                disabled={!missionName.trim() || isStartingMission}
                className="font-mono text-xs w-full"
              >
                <Play className="w-3 h-3 mr-1" />
                START MISSION
              </Button>
            </div>
          )}
        </div>
        
        {connection.isConnected && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Signal className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">RSSI</span>
              </div>
              <span className="text-lg font-mono text-foreground tabular-nums">
                {connection.rssi.toFixed(0)} dBm
              </span>
            </div>
            
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">SNR</span>
              </div>
              <span className="text-lg font-mono text-foreground tabular-nums">
                {connection.snr.toFixed(1)} dB
              </span>
            </div>
            
            <div className="bg-secondary/30 rounded-lg p-3">
              <span className="text-[10px] text-muted-foreground font-mono block mb-1">PACKETS</span>
              <span className="text-lg font-mono text-foreground tabular-nums">
                {connection.packetsReceived}
              </span>
            </div>
            
            <div className="bg-secondary/30 rounded-lg p-3">
              <span className="text-[10px] text-muted-foreground font-mono block mb-1">LOSS</span>
              <span className="text-lg font-mono text-foreground tabular-nums">
                {connection.packetLoss.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
        
        {isSimulated && connection.isConnected && (
          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-yellow-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            SIMULATION MODE
          </div>
        )}
      </div>
    </div>
  )
}
