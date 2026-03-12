"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronRight, 
  BookOpen, 
  Cpu, 
  Radio, 
  Rocket, 
  Settings, 
  Code, 
  FileText,
  Search,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BorderSnakeBeam } from '@/components/ui/space-background'

const docsSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      { id: 'introduction', title: 'Introduction', content: 'intro' },
      { id: 'quick-start', title: 'Quick Start Guide', content: 'quickstart' },
      { id: 'system-requirements', title: 'System Requirements', content: 'requirements' },
    ],
  },
  {
    id: 'flight-computer',
    title: 'Flight Computer',
    icon: Cpu,
    items: [
      { id: 'fc-overview', title: 'Architecture Overview', content: 'fc-overview' },
      { id: 'fc-sensors', title: 'Sensor Configuration', content: 'sensors' },
      { id: 'fc-states', title: 'Flight State Machine', content: 'states' },
      { id: 'fc-logging', title: 'Data Logging', content: 'logging' },
    ],
  },
  {
    id: 'telemetry',
    title: 'Telemetry System',
    icon: Radio,
    items: [
      { id: 'lora-setup', title: 'LoRa Setup', content: 'lora' },
      { id: 'packet-format', title: 'Packet Format', content: 'packets' },
      { id: 'ground-station', title: 'Ground Station', content: 'ground' },
      { id: 'range-testing', title: 'Range Testing', content: 'range' },
    ],
  },
  {
    id: 'recovery',
    title: 'Recovery System',
    icon: Rocket,
    items: [
      { id: 'dual-deploy', title: 'Dual Deployment', content: 'dual' },
      { id: 'ejection-charges', title: 'Ejection Charges', content: 'charges' },
      { id: 'parachute-sizing', title: 'Parachute Sizing', content: 'chutes' },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code,
    items: [
      { id: 'websocket-api', title: 'WebSocket API', content: 'websocket' },
      { id: 'rest-api', title: 'REST Endpoints', content: 'rest' },
      { id: 'data-types', title: 'Data Types', content: 'types' },
    ],
  },
  {
    id: 'configuration',
    title: 'Configuration',
    icon: Settings,
    items: [
      { id: 'config-file', title: 'Config File Format', content: 'config' },
      { id: 'calibration', title: 'Sensor Calibration', content: 'calibration' },
      { id: 'radio-params', title: 'Radio Parameters', content: 'radio' },
    ],
  },
]

const docContent: Record<string, { title: string; content: string }> = {
  intro: {
    title: 'Introduction',
    content: `
# Introduction to Galaxy.SpaceCrafts Systems

Welcome to the official documentation for Galaxy.SpaceCrafts rocket systems. This documentation covers all aspects of our open-source rocket telemetry and control systems.

## Overview

Galaxy.SpaceCrafts provides a complete solution for high-power rocket telemetry, including:

- **Flight Computer**: Dual-redundant flight computer with sensor fusion
- **Telemetry System**: Long-range LoRa-based data transmission
- **Ground Station**: Real-time mission control interface
- **Recovery System**: Dual-deployment recovery management

## Quick Links

- [Quick Start Guide](/docs/quick-start) - Get up and running in minutes
- [Hardware Requirements](/docs/system-requirements) - What you need to build
- [API Reference](/docs/api) - Integrate with your systems

## Community

Join our community to get help and share your projects:

- YouTube: [@Galaxy.SpaceCrafts](https://youtube.com/@galaxy.spacecrafts)
- Discord: Coming soon
- GitHub: Coming soon
    `,
  },
  quickstart: {
    title: 'Quick Start Guide',
    content: `
# Quick Start Guide

Get your telemetry system operational in under an hour.

## Prerequisites

Before starting, ensure you have:

- Arduino IDE or PlatformIO installed
- LoRa modules (SX1276 or compatible)
- Flight computer hardware (see Hardware Requirements)

## Step 1: Flash the Flight Computer

\`\`\`bash
# Clone the repository
git clone https://github.com/galaxy-spacecrafts/flight-computer

# Install dependencies
cd flight-computer
pio lib install

# Build and upload
pio run -t upload
\`\`\`

## Step 2: Configure LoRa Parameters

Edit \`config.h\` to set your radio parameters:

\`\`\`cpp
#define LORA_FREQUENCY    915E6    // 915 MHz (US)
#define LORA_BANDWIDTH    125E3    // 125 kHz
#define LORA_SPREADING    7        // SF7
#define LORA_CODING_RATE  5        // 4/5
\`\`\`

## Step 3: Ground Station Setup

Launch the ground station software:

\`\`\`bash
cd ground-station
npm install
npm run dev
\`\`\`

Navigate to \`http://localhost:3000\` to access Mission Control.
    `,
  },
  'fc-overview': {
    title: 'Flight Computer Architecture',
    content: `
# Flight Computer Architecture

The Galaxy.SpaceCrafts flight computer uses a modular architecture designed for reliability and extensibility.

## Block Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    FLIGHT COMPUTER                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ IMU      │  │ BARO     │  │ GPS      │  │ BATTERY  │   │
│  │ MPU6050  │  │ BMP388   │  │ NEO-M8N  │  │ ADC      │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴──────┬──────┴─────────────┘          │
│                            │                               │
│                    ┌───────┴───────┐                       │
│                    │ SENSOR FUSION │                       │
│                    │ Kalman Filter │                       │
│                    └───────┬───────┘                       │
│                            │                               │
│                    ┌───────┴───────┐                       │
│                    │ STATE MACHINE │                       │
│                    │ Flight Logic  │                       │
│                    └───────┬───────┘                       │
│              ┌─────────────┼─────────────┐                 │
│              │             │             │                 │
│       ┌──────┴──────┐ ┌────┴────┐ ┌─────┴─────┐          │
│       │ DATA LOGGER │ │  RADIO  │ │ PYRO CTRL │          │
│       │   SD Card   │ │  LoRa   │ │  Channels │          │
│       └─────────────┘ └─────────┘ └───────────┘          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Core Components

### Sensor Fusion

We use an Extended Kalman Filter (EKF) to combine accelerometer and barometer data for accurate altitude estimation.

### State Machine

The flight state machine manages transitions between flight phases:

1. **PRE_LAUNCH** - On pad, awaiting launch
2. **POWERED_ASCENT** - Motor burning
3. **COASTING** - Unpowered ascent
4. **APOGEE** - Peak altitude reached
5. **DESCENT** - Falling under parachute
6. **RECOVERY** - On ground after landing
    `,
  },
  lora: {
    title: 'LoRa Telemetry Setup',
    content: `
# LoRa Telemetry Setup

Configure your long-range telemetry link for reliable data transmission.

## Hardware Requirements

- **Flight Module**: SX1276 or RFM95W
- **Ground Module**: SX1276 or RFM95W
- **Antennas**: 915 MHz quarter-wave or Yagi

## Wiring Diagram

### Flight Computer Connection

| LoRa Pin | MCU Pin | Function |
|----------|---------|----------|
| VCC      | 3.3V    | Power    |
| GND      | GND     | Ground   |
| SCK      | GPIO18  | SPI Clock|
| MISO     | GPIO19  | SPI MISO |
| MOSI     | GPIO23  | SPI MOSI |
| NSS      | GPIO5   | Chip Select |
| RST      | GPIO14  | Reset    |
| DIO0     | GPIO26  | Interrupt |

## Configuration Parameters

\`\`\`cpp
// Frequency (region-dependent)
#define LORA_FREQ_US    915E6    // 915 MHz - USA
#define LORA_FREQ_EU    868E6    // 868 MHz - Europe
#define LORA_FREQ_AS    433E6    // 433 MHz - Asia

// Bandwidth options
// Higher = faster but shorter range
#define BW_7K8    7.8E3
#define BW_125K   125E3
#define BW_250K   250E3
#define BW_500K   500E3

// Spreading Factor (6-12)
// Higher = longer range but slower
#define SF_7   7    // Fastest
#define SF_12  12   // Longest range
\`\`\`

## Range Optimization

For maximum range (10+ km line of sight):

- Use SF10-SF12
- Use 125 kHz bandwidth
- Use high-gain antennas (Yagi recommended for ground)
- Ensure clear line of sight
    `,
  },
  packets: {
    title: 'Packet Format',
    content: `
# Telemetry Packet Format

All telemetry data is transmitted in a compact binary format for efficiency.

## Packet Structure

\`\`\`
┌────────┬────────┬─────────┬──────────┬──────────┬─────────┐
│ Header │ Seq ID │ Payload │ Checksum │  RSSI    │  SNR    │
│ 2 byte │ 2 byte │ N bytes │  2 byte  │  1 byte  │ 1 byte  │
└────────┴────────┴─────────┴──────────┴──────────┴─────────┘
\`\`\`

## Header Format

\`\`\`cpp
typedef struct {
  uint8_t magic;        // 0x47 ('G')
  uint8_t version;      // Protocol version
} PacketHeader;
\`\`\`

## Telemetry Payload

\`\`\`cpp
typedef struct __attribute__((packed)) {
  uint32_t timestamp;      // Mission time (ms)
  int32_t  altitude;       // Altitude (cm)
  int16_t  velocity;       // Velocity (cm/s)
  int16_t  acceleration;   // Acceleration (mg)
  int16_t  temperature;    // Temperature (0.01°C)
  uint16_t pressure;       // Pressure (Pa/10)
  uint16_t battery;        // Battery (mV)
  int32_t  gps_lat;        // Latitude (microdegrees)
  int32_t  gps_lng;        // Longitude (microdegrees)
  int16_t  gyro_x;         // Gyro X (0.1°/s)
  int16_t  gyro_y;         // Gyro Y (0.1°/s)
  int16_t  gyro_z;         // Gyro Z (0.1°/s)
  uint8_t  flight_phase;   // Current flight phase
  uint8_t  pyro_status;    // Pyro channel status
} TelemetryPacket;         // Total: 34 bytes
\`\`\`

## Checksum

CRC-16-CCITT is used for error detection:

\`\`\`cpp
uint16_t crc16_ccitt(uint8_t *data, size_t len) {
  uint16_t crc = 0xFFFF;
  for (size_t i = 0; i < len; i++) {
    crc ^= data[i] << 8;
    for (int j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
  }
  return crc;
}
\`\`\`
    `,
  },
}

export function DocsLayout() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [activeItem, setActiveItem] = useState('introduction')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentContent = docContent[activeItem] || docContent.intro

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 lg:hidden bg-foreground text-background rounded-full shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 lg:top-0 left-0 z-40 w-72 h-[calc(100vh-4rem)] lg:h-screen
            bg-black/90 backdrop-blur-xl border-r border-white/20 overflow-y-auto
            transform lg:transform-none transition-transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {docsSections.map(section => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(isActive ? '' : section.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium flex-1">{section.title}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </button>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="ml-4 mt-1 space-y-1 border-l border-border pl-4"
                      >
                        {section.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveItem(item.content)
                              setSidebarOpen(false)
                            }}
                            className={`
                              w-full text-left px-3 py-1.5 rounded text-sm font-mono transition-colors
                              ${activeItem === item.content
                                ? 'text-foreground bg-foreground/10'
                                : 'text-muted-foreground hover:text-foreground'
                              }
                            `}
                          >
                            {item.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-8">
              <FileText className="w-4 h-4" />
              <span>Documentation</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{currentContent.title}</span>
            </div>

            {/* Content */}
            <article className="prose prose-invert prose-sm max-w-none">
              <div className="space-y-6">
                {currentContent.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={i} className="text-3xl font-bold text-foreground tracking-tight mt-0">
                        {line.slice(2)}
                      </h1>
                    )
                  }
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">
                        {line.slice(3)}
                      </h2>
                    )
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-3">
                        {line.slice(4)}
                      </h3>
                    )
                  }
                  if (line.startsWith('```')) {
                    return null // Code blocks handled separately
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={i} className="text-muted-foreground ml-4">
                        {line.slice(2)}
                      </li>
                    )
                  }
                  if (line.startsWith('| ')) {
                    return (
                      <div key={i} className="font-mono text-sm text-muted-foreground bg-secondary/50 px-4 py-1 overflow-x-auto">
                        {line}
                      </div>
                    )
                  }
                  if (line.trim() === '') return <div key={i} className="h-4" />
                  return (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  )
                })}
              </div>
            </article>

            {/* Footer navigation */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <Button variant="ghost" className="font-mono text-sm">
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Previous
              </Button>
              <Button variant="ghost" className="font-mono text-sm">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
