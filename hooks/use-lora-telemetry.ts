"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TelemetryData {
  timestamp: number
  altitude: number
  velocity: number
  acceleration: number
  temperature: number
  pressure: number
  batteryVoltage: number
  signalStrength: number
  gpsLat: number
  gpsLng: number
  gyroX: number
  gyroY: number
  gyroZ: number
  accelX: number
  accelY: number
  accelZ: number
  flightPhase: 'PRE_LAUNCH' | 'POWERED_ASCENT' | 'COASTING' | 'APOGEE' | 'DESCENT' | 'RECOVERY'
  pyroStatus: {
    main: boolean
    drogue: boolean
    airbrakes: boolean
  }
}

export interface ChartDataPoint {
  time: number
  altitude: number
  velocity: number
  acceleration: number
  temperature: number
  pressure: number
}

export interface LoRaConnectionState {
  isConnected: boolean
  lastPacketTime: number | null
  packetsReceived: number
  packetLoss: number
  rssi: number
  snr: number
}

interface UseLoRaTelemetryReturn {
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

// Parse incoming LoRa data string: "alt,vel,acc,temp,pressure,battery,signal,lat,lng,gyroX,gyroY,gyroZ,accelX,accelY,accelZ,phase,pyroMain,pyroDrogue,pyroAirbrakes"
function parseLoRaData(data: string): Partial<TelemetryData> | null {
  try {
    const parts = data.trim().split(',')
    if (parts.length < 5) return null

    const [alt, vel, acc, temp, pressure, battery, signal, lat, lng, gX, gY, gZ, aX, aY, aZ, phase, pyroMain, pyroDrogue, pyroAirbrakes] = parts

    const phaseMap: Record<string, TelemetryData['flightPhase']> = {
      '0': 'PRE_LAUNCH',
      '1': 'POWERED_ASCENT',
      '2': 'COASTING',
      '3': 'APOGEE',
      '4': 'DESCENT',
      '5': 'RECOVERY',
      'PRE_LAUNCH': 'PRE_LAUNCH',
      'POWERED_ASCENT': 'POWERED_ASCENT',
      'COASTING': 'COASTING',
      'APOGEE': 'APOGEE',
      'DESCENT': 'DESCENT',
      'RECOVERY': 'RECOVERY',
    }

    return {
      timestamp: Date.now(),
      altitude: parseFloat(alt) || 0,
      velocity: parseFloat(vel) || 0,
      acceleration: parseFloat(acc) || 0,
      temperature: parseFloat(temp) || 22,
      pressure: parseFloat(pressure) || 101325,
      batteryVoltage: parseFloat(battery) || 12,
      signalStrength: parseFloat(signal) || -85,
      gpsLat: parseFloat(lat) || 0,
      gpsLng: parseFloat(lng) || 0,
      gyroX: parseFloat(gX) || 0,
      gyroY: parseFloat(gY) || 0,
      gyroZ: parseFloat(gZ) || 0,
      accelX: parseFloat(aX) || 0,
      accelY: parseFloat(aY) || 0,
      accelZ: parseFloat(aZ) || 0,
      flightPhase: phaseMap[phase] || 'PRE_LAUNCH',
      pyroStatus: {
        main: pyroMain === '1' || pyroMain === 'true',
        drogue: pyroDrogue === '1' || pyroDrogue === 'true',
        airbrakes: pyroAirbrakes === '1' || pyroAirbrakes === 'true',
      },
    }
  } catch {
    return null
  }
}

export function useLoRaTelemetry(): UseLoRaTelemetryReturn {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [connection, setConnection] = useState<LoRaConnectionState>({
    isConnected: false,
    lastPacketTime: null,
    packetsReceived: 0,
    packetLoss: 0,
    rssi: -85,
    snr: 8.5,
  })
  const [isSimulated, setIsSimulated] = useState(true)
  const [missionId, setMissionId] = useState<string | null>(null)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const flightTimeRef = useRef(0)
  const portRef = useRef<SerialPort | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Save telemetry to localStorage
  const saveTelemetry = useCallback((data: TelemetryData, currentMissionId: string | null) => {
    if (!currentMissionId) return

    try {
      const storedData = JSON.parse(localStorage.getItem(`mission_${currentMissionId}`) || '[]')
      storedData.push(data)
      // Keep last 1000 records
      if (storedData.length > 1000) {
        storedData.shift()
      }
      localStorage.setItem(`mission_${currentMissionId}`, JSON.stringify(storedData))
    } catch (error) {
      console.error('Error saving telemetry:', error)
    }
  }, [])

  // Start a new mission
  const startMission = useCallback(async (name: string, description?: string): Promise<string | null> => {
    try {
      const id = crypto.randomUUID()
      const mission = {
        id,
        name,
        description,
        status: 'active',
        created_at: new Date().toISOString(),
      }
      
      // Store mission in localStorage
      const missions = JSON.parse(localStorage.getItem('galaxy_missions') || '[]')
      missions.push(mission)
      localStorage.setItem('galaxy_missions', JSON.stringify(missions))
      
      setMissionId(id)
      setChartData([]) // Reset chart data for new mission
      setTelemetryHistory([])
      startTimeRef.current = Date.now()
      return id
    } catch (error) {
      console.error('Error starting mission:', error)
      return null
    }
  }, [])

  // End current mission
  const endMission = useCallback(async () => {
    if (!missionId) return

    try {
      const missions = JSON.parse(localStorage.getItem('galaxy_missions') || '[]')
      const updatedMissions = missions.map((m: { id: string; status: string; ended_at?: string }) => {
        if (m.id === missionId) {
          return { ...m, status: 'completed', ended_at: new Date().toISOString() }
        }
        return m
      })
      localStorage.setItem('galaxy_missions', JSON.stringify(updatedMissions))
      setMissionId(null)
    } catch (error) {
      console.error('Error ending mission:', error)
    }
  }, [missionId])

  // Process new telemetry data
  const processNewTelemetry = useCallback((newTelemetry: TelemetryData, currentMissionId: string | null) => {
    setTelemetry(newTelemetry)
    setTelemetryHistory(prev => [...prev.slice(-299), newTelemetry])
    
    // Update chart data with new point
    const newChartPoint: ChartDataPoint = {
      time: (newTelemetry.timestamp - startTimeRef.current) / 1000,
      altitude: newTelemetry.altitude,
      velocity: newTelemetry.velocity,
      acceleration: newTelemetry.acceleration,
      temperature: newTelemetry.temperature,
      pressure: newTelemetry.pressure,
    }
    setChartData(prev => [...prev.slice(-299), newChartPoint])

    // Save to localStorage (non-blocking)
    saveTelemetry(newTelemetry, currentMissionId)

    setConnection(prev => ({
      ...prev,
      lastPacketTime: Date.now(),
      packetsReceived: prev.packetsReceived + 1,
      packetLoss: Math.random() * 2,
      rssi: -85 + (Math.random() - 0.5) * 20,
      snr: 8.5 + (Math.random() - 0.5) * 4,
    }))
  }, [saveTelemetry])

  // Connect to real LoRa via Web Serial API
  const connectLoRa = useCallback(async () => {
    if (!('serial' in navigator)) {
      console.error('Web Serial API not supported in this browser')
      // Fall back to simulation mode
      connect()
      return
    }

    try {
      // Request port access
      const port = await navigator.serial.requestPort()
      await port.open({ baudRate: 115200 })
      portRef.current = port

      setIsSimulated(false)
      setConnection(prev => ({ ...prev, isConnected: true }))

      const decoder = new TextDecoderStream()
      const inputDone = port.readable?.pipeTo(decoder.writable)
      const reader = decoder.readable.getReader()
      readerRef.current = reader

      let buffer = ''

      // Read loop
      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break

            if (value) {
              buffer += value
              
              // Process complete lines (terminated by \n or \r\n)
              const lines = buffer.split(/\r?\n/)
              buffer = lines.pop() || '' // Keep incomplete line in buffer

              for (const line of lines) {
                if (line.trim()) {
                  const parsedData = parseLoRaData(line)
                  if (parsedData) {
                    const fullTelemetry: TelemetryData = {
                      timestamp: Date.now(),
                      altitude: parsedData.altitude ?? 0,
                      velocity: parsedData.velocity ?? 0,
                      acceleration: parsedData.acceleration ?? 0,
                      temperature: parsedData.temperature ?? 22,
                      pressure: parsedData.pressure ?? 101325,
                      batteryVoltage: parsedData.batteryVoltage ?? 12,
                      signalStrength: parsedData.signalStrength ?? -85,
                      gpsLat: parsedData.gpsLat ?? 0,
                      gpsLng: parsedData.gpsLng ?? 0,
                      gyroX: parsedData.gyroX ?? 0,
                      gyroY: parsedData.gyroY ?? 0,
                      gyroZ: parsedData.gyroZ ?? 0,
                      accelX: parsedData.accelX ?? 0,
                      accelY: parsedData.accelY ?? 0,
                      accelZ: parsedData.accelZ ?? 0,
                      flightPhase: parsedData.flightPhase ?? 'PRE_LAUNCH',
                      pyroStatus: parsedData.pyroStatus ?? {
                        main: false,
                        drogue: false,
                        airbrakes: false,
                      },
                    }
                    processNewTelemetry(fullTelemetry, missionId)
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error reading from LoRa:', error)
        }
      }

      readLoop()
      
      await inputDone
    } catch (error) {
      console.error('Error connecting to LoRa:', error)
      // Fall back to simulation mode on error
      setIsSimulated(true)
    }
  }, [missionId, processNewTelemetry])

  const generateTelemetry = useCallback((): TelemetryData => {
    const t = flightTimeRef.current
    flightTimeRef.current += 0.1

    // Simulate realistic flight phases
    let flightPhase: TelemetryData['flightPhase'] = 'PRE_LAUNCH'
    let altitude = 0
    let velocity = 0
    let acceleration = 0

    if (t < 0.5) {
      flightPhase = 'PRE_LAUNCH'
      altitude = 0
      velocity = 0
      acceleration = 0
    } else if (t < 5) {
      flightPhase = 'POWERED_ASCENT'
      const burnTime = t - 0.5
      acceleration = 45 + Math.random() * 5
      velocity = acceleration * burnTime
      altitude = 0.5 * acceleration * burnTime * burnTime
    } else if (t < 15) {
      flightPhase = 'COASTING'
      const coastTime = t - 5
      const v0 = 200
      acceleration = -9.81
      velocity = v0 + acceleration * coastTime
      altitude = 500 + v0 * coastTime + 0.5 * acceleration * coastTime * coastTime
    } else if (t < 17) {
      flightPhase = 'APOGEE'
      altitude = 1200 + Math.random() * 10
      velocity = Math.random() * 5 - 2.5
      acceleration = -9.81
    } else if (t < 45) {
      flightPhase = 'DESCENT'
      const descentTime = t - 17
      velocity = -15 - Math.random() * 2
      altitude = Math.max(0, 1200 - 15 * descentTime)
      acceleration = 0.5
    } else {
      flightPhase = 'RECOVERY'
      altitude = 0
      velocity = 0
      acceleration = 0
      flightTimeRef.current = 0 // Reset for demo loop
    }

    return {
      timestamp: Date.now(),
      altitude: Math.max(0, altitude + (Math.random() - 0.5) * 5),
      velocity: velocity + (Math.random() - 0.5) * 2,
      acceleration: acceleration + (Math.random() - 0.5) * 1,
      temperature: 22 + Math.sin(t * 0.1) * 8 + (Math.random() - 0.5) * 2,
      pressure: 101325 * Math.exp(-altitude / 8500) + (Math.random() - 0.5) * 100,
      batteryVoltage: 11.8 - t * 0.01 + (Math.random() - 0.5) * 0.2,
      signalStrength: -75 - altitude * 0.01 + (Math.random() - 0.5) * 10,
      gpsLat: 34.0522 + (Math.random() - 0.5) * 0.001,
      gpsLng: -118.2437 + (Math.random() - 0.5) * 0.001,
      gyroX: (Math.random() - 0.5) * 50,
      gyroY: (Math.random() - 0.5) * 50,
      gyroZ: (Math.random() - 0.5) * 20 + (flightPhase === 'POWERED_ASCENT' ? 100 : 0),
      accelX: (Math.random() - 0.5) * 2,
      accelY: (Math.random() - 0.5) * 2,
      accelZ: acceleration / 9.81,
      flightPhase,
      pyroStatus: {
        main: flightPhase === 'DESCENT' || flightPhase === 'RECOVERY',
        drogue: flightPhase === 'APOGEE' || flightPhase === 'DESCENT' || flightPhase === 'RECOVERY',
        airbrakes: flightPhase === 'COASTING',
      },
    }
  }, [])

  // Simulated connection (fallback)
  const connect = useCallback(() => {
    setIsSimulated(true)
    setConnection(prev => ({ ...prev, isConnected: true }))
    startTimeRef.current = Date.now()
    
    intervalRef.current = setInterval(() => {
      const newTelemetry = generateTelemetry()
      processNewTelemetry(newTelemetry, missionId)
    }, 100) // 10Hz update rate
  }, [generateTelemetry, missionId, processNewTelemetry])

  const disconnect = useCallback(async () => {
    // Stop simulation interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Close serial port
    if (readerRef.current) {
      try {
        await readerRef.current.cancel()
        readerRef.current = null
      } catch (error) {
        console.error('Error closing reader:', error)
      }
    }

    if (portRef.current) {
      try {
        await portRef.current.close()
        portRef.current = null
      } catch (error) {
        console.error('Error closing port:', error)
      }
    }

    setConnection(prev => ({ ...prev, isConnected: false }))
    setIsSimulated(true)
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    telemetry,
    telemetryHistory,
    chartData,
    connection,
    connect,
    connectLoRa,
    disconnect,
    isSimulated,
    missionId,
    startMission,
    endMission,
  }
}
