(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,19642,e=>{"use strict";var t=e.i(43476),r=e.i(46932),s=e.i(71645);function o({count:e=20}){let[r,o]=(0,s.useState)([]);return(0,s.useEffect)(()=>{o(Array.from({length:e},(e,t)=>({id:t,style:{top:`${100*Math.random()}%`,left:`${100*Math.random()}%`,animationDelay:`${5*Math.random()}s`,animationDuration:`${2+3*Math.random()}s`}})))},[e]),(0,t.jsx)("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:r.map(e=>(0,t.jsx)("span",{className:"absolute w-0.5 h-0.5 rotate-[215deg] animate-meteor rounded-full bg-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",style:e.style,children:(0,t.jsx)("span",{className:"absolute top-1/2 -translate-y-1/2 w-[80px] h-[1px] bg-gradient-to-r from-white/30 to-transparent"})},e.id))})}function i({className:e}){let s=["M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875","M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867","M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859","M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851","M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843","M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835","M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827"];return(0,t.jsx)("div",{className:`absolute inset-0 overflow-hidden pointer-events-none ${e}`,children:(0,t.jsxs)("svg",{className:"absolute w-full h-full",viewBox:"0 0 696 316",fill:"none",preserveAspectRatio:"xMidYMid slice",children:[(0,t.jsxs)("defs",{children:[(0,t.jsxs)("linearGradient",{id:"beam-gradient-cyan",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"transparent"}),(0,t.jsx)("stop",{offset:"50%",stopColor:"rgb(255, 255, 255)",stopOpacity:"0.6"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"transparent"})]}),(0,t.jsxs)("linearGradient",{id:"beam-gradient-purple",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"transparent"}),(0,t.jsx)("stop",{offset:"50%",stopColor:"rgb(200, 200, 200)",stopOpacity:"0.6"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"transparent"})]}),(0,t.jsxs)("filter",{id:"glow-cyan",children:[(0,t.jsx)("feGaussianBlur",{stdDeviation:"4",result:"coloredBlur"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"coloredBlur"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]}),(0,t.jsxs)("filter",{id:"glow-purple",children:[(0,t.jsx)("feGaussianBlur",{stdDeviation:"4",result:"coloredBlur"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"coloredBlur"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]})]}),s.map((e,r)=>(0,t.jsx)("path",{d:e,stroke:"rgba(255,255,255,0.03)",strokeWidth:"0.5",fill:"none"},`base-${r}`)),s.map((e,s)=>(0,t.jsx)(r.motion.path,{d:e,stroke:s%2==0?"url(#beam-gradient-cyan)":"url(#beam-gradient-purple)",strokeWidth:"2",fill:"none",filter:s%2==0?"url(#glow-cyan)":"url(#glow-purple)",strokeDasharray:"50 200",initial:{strokeDashoffset:0},animate:{strokeDashoffset:-250},transition:{duration:3+.5*s,repeat:1/0,ease:"linear",delay:.3*s}},`beam-${s}`))]})})}function a({children:e,className:o,beamColor:i="mixed",duration:a=8}){let n=(0,s.useRef)(null),[l,c]=(0,s.useState)({width:0,height:0});(0,s.useEffect)(()=>{if(n.current){let{width:e,height:t}=n.current.getBoundingClientRect();c({width:e,height:t})}},[]);let d=2*(l.width+l.height);return(0,t.jsxs)("div",{ref:n,className:`relative ${o}`,children:[l.width>0&&(0,t.jsxs)("svg",{className:"absolute inset-0 w-full h-full pointer-events-none",style:{overflow:"visible"},children:[(0,t.jsxs)("defs",{children:[(0,t.jsxs)("linearGradient",{id:"snake-cyan",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"transparent"}),(0,t.jsx)("stop",{offset:"30%",stopColor:"rgb(255, 255, 255)"}),(0,t.jsx)("stop",{offset:"70%",stopColor:"rgb(255, 255, 255)"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"transparent"})]}),(0,t.jsxs)("linearGradient",{id:"snake-purple",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"transparent"}),(0,t.jsx)("stop",{offset:"30%",stopColor:"rgb(200, 200, 200)"}),(0,t.jsx)("stop",{offset:"70%",stopColor:"rgb(200, 200, 200)"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"transparent"})]}),(0,t.jsxs)("linearGradient",{id:"snake-mixed",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"rgb(255, 255, 255)"}),(0,t.jsx)("stop",{offset:"50%",stopColor:"rgb(200, 200, 200)"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"rgb(255, 255, 255)"})]}),(0,t.jsxs)("filter",{id:"snake-glow",children:[(0,t.jsx)("feGaussianBlur",{stdDeviation:"3",result:"coloredBlur"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"coloredBlur"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]})]}),(0,t.jsx)("rect",{x:"0.5",y:"0.5",width:l.width-1,height:l.height-1,rx:"8",fill:"none",stroke:"rgba(255,255,255,0.1)",strokeWidth:"1"}),(0,t.jsx)(r.motion.rect,{x:"0.5",y:"0.5",width:l.width-1,height:l.height-1,rx:"8",fill:"none",stroke:(()=>{switch(i){case"cyan":return"url(#snake-cyan)";case"purple":return"url(#snake-purple)";default:return"url(#snake-mixed)"}})(),strokeWidth:"2",filter:"url(#snake-glow)",strokeDasharray:`${.15*d} ${.85*d}`,initial:{strokeDashoffset:0},animate:{strokeDashoffset:-d},transition:{duration:a,repeat:1/0,ease:"linear"}})]}),e]})}function n({children:e,showMeteors:r=!0,showBeams:s=!0,className:a}){return(0,t.jsxs)("div",{className:`relative min-h-screen overflow-hidden bg-black ${a}`,children:[(0,t.jsx)("div",{className:"absolute inset-0",style:{background:"radial-gradient(ellipse at center, rgba(40, 40, 40, 0.2) 0%, rgba(0, 0, 0, 1) 70%)"}}),(0,t.jsx)("div",{className:"absolute inset-0",children:[...Array(100)].map((e,r)=>(0,t.jsx)("div",{className:"absolute rounded-full bg-white",style:{width:2*Math.random()+1,height:2*Math.random()+1,left:`${100*Math.random()}%`,top:`${100*Math.random()}%`,opacity:.5*Math.random()+.2}},r))}),r&&(0,t.jsx)(o,{count:15}),s&&(0,t.jsx)(i,{}),(0,t.jsx)("div",{className:"relative z-10",children:e})]})}e.s(["BackgroundBeams",()=>i,"BorderSnakeBeam",()=>a,"Meteors",()=>o,"SpaceBackground",()=>n])},63059,e=>{"use strict";let t=(0,e.i(75254).default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",()=>t],63059)},55436,e=>{"use strict";let t=(0,e.i(75254).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",()=>t],55436)},60879,e=>{"use strict";var t=e.i(43476),r=e.i(71645),s=e.i(46932),o=e.i(63059),i=e.i(10980),a=e.i(75254);let n=(0,a.default)("cpu",[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]]);var l=e.i(63639),c=e.i(9912),d=e.i(39616);let u=(0,a.default)("code",[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]);var h=e.i(78583),m=e.i(55436),p=e.i(92161),g=e.i(37727),f=e.i(67881);let x=[{id:"getting-started",title:"Getting Started",icon:i.BookOpen,items:[{id:"introduction",title:"Introduction",content:"intro"},{id:"quick-start",title:"Quick Start Guide",content:"quickstart"},{id:"system-requirements",title:"System Requirements",content:"requirements"}]},{id:"flight-computer",title:"Flight Computer",icon:n,items:[{id:"fc-overview",title:"Architecture Overview",content:"fc-overview"},{id:"fc-sensors",title:"Sensor Configuration",content:"sensors"},{id:"fc-states",title:"Flight State Machine",content:"states"},{id:"fc-logging",title:"Data Logging",content:"logging"}]},{id:"telemetry",title:"Telemetry System",icon:l.Radio,items:[{id:"lora-setup",title:"LoRa Setup",content:"lora"},{id:"packet-format",title:"Packet Format",content:"packets"},{id:"ground-station",title:"Ground Station",content:"ground"},{id:"range-testing",title:"Range Testing",content:"range"}]},{id:"recovery",title:"Recovery System",icon:c.Rocket,items:[{id:"dual-deploy",title:"Dual Deployment",content:"dual"},{id:"ejection-charges",title:"Ejection Charges",content:"charges"},{id:"parachute-sizing",title:"Parachute Sizing",content:"chutes"}]},{id:"api",title:"API Reference",icon:u,items:[{id:"websocket-api",title:"WebSocket API",content:"websocket"},{id:"rest-api",title:"REST Endpoints",content:"rest"},{id:"data-types",title:"Data Types",content:"types"}]},{id:"configuration",title:"Configuration",icon:d.Settings,items:[{id:"config-file",title:"Config File Format",content:"config"},{id:"calibration",title:"Sensor Calibration",content:"calibration"},{id:"radio-params",title:"Radio Parameters",content:"radio"}]}],y={intro:{title:"Introduction",content:`
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
    `},quickstart:{title:"Quick Start Guide",content:`
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
    `},"fc-overview":{title:"Flight Computer Architecture",content:`
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
    `},lora:{title:"LoRa Telemetry Setup",content:`
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
    `},packets:{title:"Packet Format",content:`
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
  int16_t  temperature;    // Temperature (0.01\xb0C)
  uint16_t pressure;       // Pressure (Pa/10)
  uint16_t battery;        // Battery (mV)
  int32_t  gps_lat;        // Latitude (microdegrees)
  int32_t  gps_lng;        // Longitude (microdegrees)
  int16_t  gyro_x;         // Gyro X (0.1\xb0/s)
  int16_t  gyro_y;         // Gyro Y (0.1\xb0/s)
  int16_t  gyro_z;         // Gyro Z (0.1\xb0/s)
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
    `}};function b(){let[e,i]=(0,r.useState)("getting-started"),[a,n]=(0,r.useState)("introduction"),[l,c]=(0,r.useState)(!1),[d,u]=(0,r.useState)(""),b=y[a]||y.intro;return(0,t.jsx)("div",{className:"min-h-screen",children:(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsx)(f.Button,{variant:"ghost",size:"icon",className:"fixed bottom-4 right-4 z-50 lg:hidden bg-foreground text-background rounded-full shadow-lg",onClick:()=>c(!l),children:l?(0,t.jsx)(g.X,{className:"w-5 h-5"}):(0,t.jsx)(p.Menu,{className:"w-5 h-5"})}),(0,t.jsx)("aside",{className:`
            fixed lg:sticky top-16 lg:top-0 left-0 z-40 w-72 h-[calc(100vh-4rem)] lg:h-screen
            bg-black/90 backdrop-blur-xl border-r border-white/20 overflow-y-auto
            transform lg:transform-none transition-transform
            ${l?"translate-x-0":"-translate-x-full lg:translate-x-0"}
          `,children:(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsxs)("div",{className:"relative mb-6",children:[(0,t.jsx)(m.Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),(0,t.jsx)("input",{type:"text",placeholder:"Search docs...",value:d,onChange:e=>u(e.target.value),className:"w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"})]}),(0,t.jsx)("nav",{className:"space-y-2",children:x.map(r=>{let l=r.icon,d=e===r.id;return(0,t.jsxs)("div",{children:[(0,t.jsxs)("button",{onClick:()=>i(d?"":r.id),className:`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${d?"bg-secondary text-foreground":"text-muted-foreground hover:text-foreground hover:bg-secondary/50"}
                      `,children:[(0,t.jsx)(l,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"text-sm font-medium flex-1",children:r.title}),(0,t.jsx)(o.ChevronRight,{className:`w-4 h-4 transition-transform ${d?"rotate-90":""}`})]}),d&&(0,t.jsx)(s.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},className:"ml-4 mt-1 space-y-1 border-l border-border pl-4",children:r.items.map(e=>(0,t.jsx)("button",{onClick:()=>{n(e.content),c(!1)},className:`
                              w-full text-left px-3 py-1.5 rounded text-sm font-mono transition-colors
                              ${a===e.content?"text-foreground bg-foreground/10":"text-muted-foreground hover:text-foreground"}
                            `,children:e.title},e.id))})]},r.id)})})]})}),(0,t.jsx)("main",{className:"flex-1 min-w-0",children:(0,t.jsxs)("div",{className:"max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-12",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm text-muted-foreground font-mono mb-8",children:[(0,t.jsx)(h.FileText,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Documentation"}),(0,t.jsx)(o.ChevronRight,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"text-foreground",children:b.title})]}),(0,t.jsx)("article",{className:"prose prose-invert prose-sm max-w-none",children:(0,t.jsx)("div",{className:"space-y-6",children:b.content.split("\n").map((e,r)=>e.startsWith("# ")?(0,t.jsx)("h1",{className:"text-3xl font-bold text-foreground tracking-tight mt-0",children:e.slice(2)},r):e.startsWith("## ")?(0,t.jsx)("h2",{className:"text-xl font-bold text-foreground mt-8 mb-4",children:e.slice(3)},r):e.startsWith("### ")?(0,t.jsx)("h3",{className:"text-lg font-bold text-foreground mt-6 mb-3",children:e.slice(4)},r):e.startsWith("```")?null:e.startsWith("- ")?(0,t.jsx)("li",{className:"text-muted-foreground ml-4",children:e.slice(2)},r):e.startsWith("| ")?(0,t.jsx)("div",{className:"font-mono text-sm text-muted-foreground bg-secondary/50 px-4 py-1 overflow-x-auto",children:e},r):""===e.trim()?(0,t.jsx)("div",{className:"h-4"},r):(0,t.jsx)("p",{className:"text-muted-foreground leading-relaxed",children:e},r))})}),(0,t.jsxs)("div",{className:"mt-12 pt-8 border-t border-border flex items-center justify-between",children:[(0,t.jsxs)(f.Button,{variant:"ghost",className:"font-mono text-sm",children:[(0,t.jsx)(o.ChevronRight,{className:"w-4 h-4 mr-2 rotate-180"}),"Previous"]}),(0,t.jsxs)(f.Button,{variant:"ghost",className:"font-mono text-sm",children:["Next",(0,t.jsx)(o.ChevronRight,{className:"w-4 h-4 ml-2"})]})]})]})})]})})}e.s(["DocsLayout",()=>b],60879)}]);