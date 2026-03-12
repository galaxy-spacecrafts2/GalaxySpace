"use client"

import { motion } from 'framer-motion'
import { Rocket, Flame, Wind, Circle, Umbrella, Flag } from 'lucide-react'

type FlightPhase = 'PRE_LAUNCH' | 'POWERED_ASCENT' | 'COASTING' | 'APOGEE' | 'DESCENT' | 'RECOVERY'

interface FlightPhaseIndicatorProps {
  currentPhase: FlightPhase
}

const phases: { id: FlightPhase; label: string; icon: typeof Rocket }[] = [
  { id: 'PRE_LAUNCH', label: 'PRE-LAUNCH', icon: Rocket },
  { id: 'POWERED_ASCENT', label: 'POWERED ASCENT', icon: Flame },
  { id: 'COASTING', label: 'COASTING', icon: Wind },
  { id: 'APOGEE', label: 'APOGEE', icon: Circle },
  { id: 'DESCENT', label: 'DESCENT', icon: Umbrella },
  { id: 'RECOVERY', label: 'RECOVERY', icon: Flag },
]

export function FlightPhaseIndicator({ currentPhase }: FlightPhaseIndicatorProps) {
  const currentIndex = phases.findIndex(p => p.id === currentPhase)

  return (
    <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            Flight Phase
          </h3>
          <motion.span
            className="text-xs font-mono bg-foreground text-background px-2 py-1 rounded"
            key={currentPhase}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {currentPhase.replace('_', ' ')}
          </motion.span>
        </div>
        
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => {
            const Icon = phase.icon
            const isActive = phase.id === currentPhase
            const isPast = index < currentIndex
            
            return (
              <div key={phase.id} className="flex flex-col items-center gap-2">
                <motion.div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center border transition-colors
                    ${isActive 
                      ? 'bg-foreground text-background border-foreground shadow-lg shadow-foreground/30' 
                      : isPast 
                        ? 'bg-secondary text-foreground border-border' 
                        : 'bg-background text-muted-foreground border-border/50'
                    }
                  `}
                  animate={isActive ? { 
                    boxShadow: ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-[10px] font-mono tracking-wider ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {phase.label.split(' ')[0]}
                </span>
                
                {/* Connector line */}
                {index < phases.length - 1 && (
                  <div className="absolute hidden" />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Progress line */}
        <div className="mt-4 h-0.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            animate={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}
