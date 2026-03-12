"use client"

import { motion } from 'framer-motion'
import { BookOpen, Clock, Eye, Filter, ChevronDown, ChevronRight, CheckCircle2, CircleDot } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/ui/border-beam'
import Link from 'next/link'

const categories = ['All', 'Electronics', 'Software', 'Propulsion', 'Recovery', 'Structures', 'Testing']

const tutorials = [
  {
    id: 1,
    slug: 'lora-telemetry-system',
    title: 'LoRa Telemetry System Build - Complete Guide',
    description: 'Build a long-range telemetry system from scratch using Arduino and LoRa modules. This comprehensive guide covers hardware selection, circuit design, firmware development, and ground station setup.',
    readTime: '25 min read',
    views: '12.4K',
    category: 'Electronics',
    difficulty: 'Intermediate',
    chapters: [
      { title: 'Introduction to LoRa Technology', completed: false },
      { title: 'Hardware Components & Selection', completed: false },
      { title: 'Circuit Design & Assembly', completed: false },
      { title: 'Firmware Development', completed: false },
      { title: 'Ground Station Setup', completed: false },
      { title: 'Testing & Troubleshooting', completed: false },
    ],
    series: 'Telemetry Series',
    episode: 1,
  },
  {
    id: 2,
    slug: 'flight-computer-sensor-fusion',
    title: 'Flight Computer Programming - Sensor Fusion',
    description: 'Implement a Kalman filter for altitude estimation using barometer and accelerometer data. Learn the mathematics behind sensor fusion and apply it to real-world rocket flight computers.',
    readTime: '35 min read',
    views: '8.7K',
    category: 'Software',
    difficulty: 'Advanced',
    chapters: [
      { title: 'Understanding Sensor Noise', completed: false },
      { title: 'Kalman Filter Theory', completed: false },
      { title: 'Implementation in C++', completed: false },
      { title: 'Tuning Filter Parameters', completed: false },
      { title: 'Real-world Testing', completed: false },
    ],
    series: 'Flight Computer Series',
    episode: 3,
  },
  {
    id: 3,
    slug: 'recovery-system-design',
    title: 'Recovery System Design & Testing',
    description: 'Design a dual-deployment recovery system with proper ejection charge sizing. Covers drogue and main parachute selection, deployment altitudes, and safety considerations.',
    readTime: '30 min read',
    views: '15.2K',
    category: 'Recovery',
    difficulty: 'Intermediate',
    chapters: [
      { title: 'Recovery System Overview', completed: false },
      { title: 'Parachute Selection Guide', completed: false },
      { title: 'Ejection Charge Calculations', completed: false },
      { title: 'Deployment Mechanism Design', completed: false },
      { title: 'Ground Testing Procedures', completed: false },
    ],
    series: null,
    episode: null,
  },
  {
    id: 4,
    slug: 'carbon-fiber-airframe',
    title: 'Carbon Fiber Airframe Layup Tutorial',
    description: 'Step-by-step guide to manufacturing carbon fiber composite airframe sections. Learn about materials, layup techniques, vacuum bagging, and post-cure processing.',
    readTime: '45 min read',
    views: '22.1K',
    category: 'Structures',
    difficulty: 'Advanced',
    chapters: [
      { title: 'Carbon Fiber Basics', completed: false },
      { title: 'Materials & Tools Required', completed: false },
      { title: 'Mold Preparation', completed: false },
      { title: 'Layup Techniques', completed: false },
      { title: 'Vacuum Bagging Process', completed: false },
      { title: 'Curing & Post-Processing', completed: false },
      { title: 'Quality Control', completed: false },
    ],
    series: 'Composites Masterclass',
    episode: 1,
  },
  {
    id: 5,
    slug: 'getting-started-hpr',
    title: 'Getting Started with High Power Rocketry',
    description: 'Everything you need to know to start building and flying high power rockets. From certification requirements to your first L1 flight, this guide covers it all.',
    readTime: '20 min read',
    views: '45.8K',
    category: 'Basics',
    difficulty: 'Beginner',
    chapters: [
      { title: 'What is High Power Rocketry?', completed: false },
      { title: 'Safety First: NAR/TRA Guidelines', completed: false },
      { title: 'Certification Levels Explained', completed: false },
      { title: 'Your First L1 Rocket Build', completed: false },
      { title: 'Launch Day Checklist', completed: false },
    ],
    series: 'Beginner Series',
    episode: 1,
  },
  {
    id: 6,
    slug: 'ground-control-software',
    title: 'Ground Control Software Development',
    description: 'Build a real-time mission control interface using React and WebSocket. Learn to display telemetry data, create charts, and implement command & control features.',
    readTime: '40 min read',
    views: '6.3K',
    category: 'Software',
    difficulty: 'Advanced',
    chapters: [
      { title: 'Architecture Overview', completed: false },
      { title: 'Setting Up the Backend', completed: false },
      { title: 'WebSocket Communication', completed: false },
      { title: 'Building the Dashboard UI', completed: false },
      { title: 'Real-time Data Visualization', completed: false },
      { title: 'Command & Control Features', completed: false },
    ],
    series: 'Ground Systems',
    episode: 2,
  },
  {
    id: 7,
    slug: 'static-fire-testing',
    title: 'Static Fire Test Setup & Safety',
    description: 'Proper procedures for conducting safe static fire tests of solid rocket motors. Includes test stand design, instrumentation, and safety protocols.',
    readTime: '22 min read',
    views: '18.9K',
    category: 'Testing',
    difficulty: 'Intermediate',
    chapters: [
      { title: 'Safety Requirements', completed: false },
      { title: 'Test Stand Design', completed: false },
      { title: 'Instrumentation Setup', completed: false },
      { title: 'Pre-Test Checklist', completed: false },
      { title: 'Conducting the Test', completed: false },
      { title: 'Data Analysis', completed: false },
    ],
    series: null,
    episode: null,
  },
  {
    id: 8,
    slug: 'motor-selection-thrust-curves',
    title: 'Solid Motor Selection & Thrust Curves',
    description: 'How to analyze thrust curves and select the right motor for your rocket. Covers total impulse, average thrust, burn time, and simulation integration.',
    readTime: '18 min read',
    views: '11.5K',
    category: 'Propulsion',
    difficulty: 'Beginner',
    chapters: [
      { title: 'Understanding Thrust Curves', completed: false },
      { title: 'Motor Classification System', completed: false },
      { title: 'Matching Motor to Rocket', completed: false },
      { title: 'Using OpenRocket for Simulation', completed: false },
      { title: 'Practical Examples', completed: false },
    ],
    series: 'Propulsion Basics',
    episode: 2,
  },
]

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function TutorialGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTutorial, setExpandedTutorial] = useState<number | null>(null)

  const filteredTutorials = selectedCategory === 'All' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3 h-3 mr-1" />
            Filter
            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          <span className="text-sm text-muted-foreground font-mono">
            {filteredTutorials.length} tutorials
          </span>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 pb-4 border-b border-border"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-mono transition-colors
                ${selectedCategory === category
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {category}
            </button>
          ))}
        </motion.div>
      )}

      {/* Tutorial List */}
      <div className="space-y-4">
        {filteredTutorials.map((tutorial, index) => (
          <motion.article
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-foreground/30 transition-colors relative">
              {/* Border Beam - only show on first 3 tutorials */}
              {index < 3 && <BorderBeam size={200} duration={12} delay={index * 3} />}
              
              {/* Main content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="hidden sm:flex w-12 h-12 rounded-lg bg-secondary items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-foreground/70" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${difficultyColors[tutorial.difficulty as keyof typeof difficultyColors]}`}>
                        {tutorial.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {tutorial.category}
                      </span>
                      {tutorial.series && (
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {tutorial.series} - Ep. {tutorial.episode}
                        </span>
                      )}
                    </div>
                    
                    <Link href={`/tutorials/${tutorial.slug}`}>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {tutorial.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {tutorial.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {tutorial.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tutorial.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {tutorial.chapters.length} chapters
                      </span>
                    </div>
                  </div>
                  
                  {/* Expand button */}
                  <button
                    onClick={() => setExpandedTutorial(expandedTutorial === tutorial.id ? null : tutorial.id)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ChevronRight 
                      className={`w-5 h-5 text-muted-foreground transition-transform ${expandedTutorial === tutorial.id ? 'rotate-90' : ''}`} 
                    />
                  </button>
                </div>
              </div>
              
              {/* Expanded chapters */}
              {expandedTutorial === tutorial.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border bg-secondary/30"
                >
                  <div className="p-6">
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-4">
                      Chapters
                    </h4>
                    <div className="space-y-2">
                      {tutorial.chapters.map((chapter, chapterIndex) => (
                        <Link
                          key={chapterIndex}
                          href={`/tutorials/${tutorial.slug}#chapter-${chapterIndex + 1}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group/chapter"
                        >
                          <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-mono text-muted-foreground group-hover/chapter:bg-primary group-hover/chapter:text-primary-foreground transition-colors">
                            {chapter.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <CircleDot className="w-4 h-4" />
                            )}
                          </span>
                          <span className="text-sm text-foreground group-hover/chapter:text-primary transition-colors">
                            {chapterIndex + 1}. {chapter.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <Link
                        href={`/tutorials/${tutorial.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Start Reading
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
