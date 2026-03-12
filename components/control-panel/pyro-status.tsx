"use client"

import { motion } from 'framer-motion'
import { Zap, Shield, Wind } from 'lucide-react'

interface PyroStatusProps {
  main: boolean
  drogue: boolean
  airbrakes: boolean
}

export function PyroStatus({ main, drogue, airbrakes }: PyroStatusProps) {
  const channels = [
    { id: 'drogue', label: 'DROGUE CHUTE', active: drogue, icon: Shield },
    { id: 'main', label: 'MAIN CHUTE', active: main, icon: Zap },
    { id: 'airbrakes', label: 'AIRBRAKES', active: airbrakes, icon: Wind },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
        Pyro Channels
      </h3>
      
      <div className="space-y-3">
        {channels.map(channel => {
          const Icon = channel.icon
          return (
            <div
              key={channel.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-all
                ${channel.active 
                  ? 'bg-foreground/10 border-foreground/30' 
                  : 'bg-secondary/30 border-border/50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${channel.active ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono tracking-wider text-foreground">
                  {channel.label}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.div
                  className={`
                    w-3 h-3 rounded-full
                    ${channel.active ? 'bg-green-500' : 'bg-muted-foreground/30'}
                  `}
                  animate={channel.active ? { 
                    boxShadow: ['0 0 0 0 rgba(34,197,94,0.5)', '0 0 0 8px rgba(34,197,94,0)', '0 0 0 0 rgba(34,197,94,0.5)']
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className={`
                  text-[10px] font-mono uppercase
                  ${channel.active ? 'text-green-500' : 'text-muted-foreground'}
                `}>
                  {channel.active ? 'FIRED' : 'ARMED'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
