import { create } from 'zustand'

// =============================================================================
// TELEMETRY STORE - Real-time telemetry data state
// =============================================================================

export interface TelemetryData {
  timestamp: number
  signalStrength: number
  temperature: number
  batteryLevel: number
  altitude: number
  speed: number
  heading: number
  latitude: number
  longitude: number
  fuelLevel: number
  cpuUsage: number
  memoryUsage: number
}

export interface TelemetryAlert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  timestamp: number
  acknowledged: boolean
}

interface TelemetryState {
  // Connection
  isConnected: boolean
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error'
  lastPingTime: number | null
  
  // Data
  currentTelemetry: TelemetryData | null
  telemetryHistory: TelemetryData[]
  maxHistoryLength: number
  
  // Alerts
  alerts: TelemetryAlert[]
  
  // Streaming
  isStreaming: boolean
  streamInterval: number
  
  // Actions
  setConnectionStatus: (status: TelemetryState['connectionStatus']) => void
  setConnected: (connected: boolean) => void
  updateTelemetry: (data: TelemetryData) => void
  clearHistory: () => void
  addAlert: (alert: Omit<TelemetryAlert, 'id' | 'timestamp' | 'acknowledged'>) => void
  acknowledgeAlert: (id: string) => void
  dismissAlert: (id: string) => void
  clearAlerts: () => void
  startStreaming: () => void
  stopStreaming: () => void
  setStreamInterval: (interval: number) => void
  ping: () => void
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  // Initial state
  isConnected: false,
  connectionStatus: 'disconnected',
  lastPingTime: null,
  currentTelemetry: null,
  telemetryHistory: [],
  maxHistoryLength: 100,
  alerts: [],
  isStreaming: false,
  streamInterval: 1000,
  
  // Actions
  setConnectionStatus: (status) => set({ 
    connectionStatus: status,
    isConnected: status === 'connected'
  }),
  
  setConnected: (connected) => set({ 
    isConnected: connected,
    connectionStatus: connected ? 'connected' : 'disconnected'
  }),
  
  updateTelemetry: (data) => set((state) => {
    const history = [...state.telemetryHistory, data]
    // Keep history within max length
    if (history.length > state.maxHistoryLength) {
      history.shift()
    }
    
    // Check for alerts
    const newAlerts: TelemetryAlert[] = []
    
    if (data.batteryLevel < 20) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: data.batteryLevel < 10 ? 'critical' : 'warning',
        message: `Bateria em nivel baixo: ${data.batteryLevel}%`,
        timestamp: Date.now(),
        acknowledged: false,
      })
    }
    
    if (data.temperature > 80) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: data.temperature > 90 ? 'critical' : 'warning',
        message: `Temperatura elevada: ${data.temperature}°C`,
        timestamp: Date.now(),
        acknowledged: false,
      })
    }
    
    if (data.signalStrength < 30) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: 'warning',
        message: `Sinal fraco: ${data.signalStrength}%`,
        timestamp: Date.now(),
        acknowledged: false,
      })
    }
    
    return {
      currentTelemetry: data,
      telemetryHistory: history,
      alerts: [...state.alerts, ...newAlerts].slice(-50), // Keep last 50 alerts
    }
  }),
  
  clearHistory: () => set({ telemetryHistory: [], currentTelemetry: null }),
  
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      acknowledged: false,
    }]
  })),
  
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => 
      a.id === id ? { ...a, acknowledged: true } : a
    )
  })),
  
  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),
  
  clearAlerts: () => set({ alerts: [] }),
  
  startStreaming: () => set({ isStreaming: true }),
  
  stopStreaming: () => set({ isStreaming: false }),
  
  setStreamInterval: (interval) => set({ streamInterval: interval }),
  
  ping: () => set({ lastPingTime: Date.now() }),
}))
