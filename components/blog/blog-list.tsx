"use client"

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, Tag, User, MessageSquare, Heart } from 'lucide-react'
import { useState } from 'react'
import { BorderBeam } from '@/components/ui/border-beam'

const blogPosts = [
  {
    id: 1,
    slug: 'lora-telemetry-system-v2',
    title: 'Building the LoRa Telemetry System v2.0',
    excerpt: 'A deep dive into our upgraded long-range communication system, featuring improved packet reliability and 10Hz data rates.',
    content: `After months of development, we're excited to share the details of our new LoRa Telemetry System v2.0. This upgrade brings significant improvements to our rocket's communication capabilities.

## Key Improvements

The new system features a completely redesigned packet structure that improves reliability from 85% to 98% in our ground tests. We've also increased the data rate from 5Hz to 10Hz, giving us twice the telemetry resolution during critical flight phases.

## Hardware Changes

We switched from the RFM95W to the SX1276 chip, which offers better sensitivity (-148 dBm vs -137 dBm) and lower power consumption. The new ground station uses a high-gain Yagi antenna with 12 dBi gain.

## What's Next

We're planning a full integration test next month, followed by a test flight in April. Stay tuned for more updates!`,
    date: '2026-03-01',
    readTime: '12 min read',
    category: 'Electronics',
    featured: true,
    author: {
      name: 'Alex Chen',
      role: 'Lead Engineer',
      avatar: '/avatars/alex.jpg'
    },
    comments: 24,
    likes: 156,
  },
  {
    id: 2,
    slug: 'flight-computer-architecture',
    title: 'Flight Computer Architecture Overview',
    excerpt: 'Breaking down the dual-redundant flight computer design, sensor fusion algorithms, and recovery deployment logic.',
    content: `Our flight computer is the brain of the rocket, responsible for all critical decisions during flight. Here's an in-depth look at how it works.

## Dual Redundancy

We use two independent microcontrollers (STM32H7) running identical firmware. They continuously cross-check each other's sensor readings and decisions. If one fails, the other takes over seamlessly.

## Sensor Suite

Each flight computer reads from:
- BMP388 barometric pressure sensor
- ICM-20948 9-axis IMU
- u-blox MAX-M10S GPS module
- Custom piezoelectric accelerometer for launch detection

## Deployment Logic

The recovery system uses a state machine with multiple safety checks before deployment. We require barometric apogee detection AND accelerometer confirmation before deploying the drogue chute.`,
    date: '2026-02-15',
    readTime: '18 min read',
    category: 'Software',
    featured: true,
    author: {
      name: 'Sarah Kim',
      role: 'Software Lead',
      avatar: '/avatars/sarah.jpg'
    },
    comments: 31,
    likes: 203,
  },
  {
    id: 3,
    slug: 'composite-airframe-manufacturing',
    title: 'Carbon Fiber Airframe Manufacturing Process',
    excerpt: 'Our journey from fiberglass to carbon fiber composites, including layup techniques and vacuum bagging procedures.',
    content: `Switching to carbon fiber was one of the biggest decisions we made this year. Here's what we learned.

## Why Carbon Fiber?

The weight savings are substantial - our new airframe sections are 40% lighter than the fiberglass equivalents, while being 60% stiffer. This translates to better performance and higher altitude potential.

## The Process

We use a wet layup process with aerospace-grade epoxy resin. Each tube section requires 4 layers of carbon fiber fabric, carefully oriented at 0/45/-45/90 degrees for optimal strength.

## Lessons Learned

Vacuum bagging is essential for consistent results. We built a custom vacuum chamber that maintains -25 inHg throughout the cure cycle. Temperature control is equally important - we cure at 60°C for 8 hours.`,
    date: '2026-02-01',
    readTime: '15 min read',
    category: 'Manufacturing',
    featured: false,
    author: {
      name: 'Marcus Johnson',
      role: 'Structures Lead',
      avatar: '/avatars/marcus.jpg'
    },
    comments: 18,
    likes: 127,
  },
  {
    id: 4,
    slug: 'recovery-system-testing',
    title: 'Recovery System Ground Testing Results',
    excerpt: 'Static deployment tests of our dual-parachute recovery system, including ejection charge sizing and shock cord analysis.',
    content: `Before we trust our recovery system in flight, we need to verify it works on the ground. Here are our test results.

## Test Setup

We built a custom test rig that simulates the airframe's internal pressure characteristics. The rig includes pressure sensors and high-speed cameras to capture deployment dynamics.

## Results

After 15 test deployments, we found our optimal charge size: 1.2g of FFFF black powder for the drogue bay and 2.0g for the main bay. Deployment was successful in all tests with pressures between 12-15 PSI.

## Shock Cord Analysis

We conducted tensile tests on our tubular nylon shock cord. It handles up to 2,500 lbf before failure - well above our calculated opening shock of 800 lbf.`,
    date: '2026-01-20',
    readTime: '10 min read',
    category: 'Testing',
    featured: false,
    author: {
      name: 'Emily Torres',
      role: 'Recovery Systems',
      avatar: '/avatars/emily.jpg'
    },
    comments: 12,
    likes: 89,
  },
  {
    id: 5,
    slug: 'gps-tracking-challenges',
    title: 'Solving High-Altitude GPS Tracking Challenges',
    excerpt: 'How we overcame COCOM limits and signal acquisition issues for reliable tracking above 18,000 meters.',
    content: `GPS tracking at high altitudes presents unique challenges. Here's how we solved them.

## COCOM Limits

Standard GPS modules stop working above 18,000m or 515 m/s due to COCOM restrictions. We use a u-blox module with airborne dynamic mode that raises these limits.

## Signal Acquisition

Cold start acquisition at altitude is unreliable. We implemented a hot-start strategy that maintains ephemeris data from ground testing, enabling sub-5-second fixes after deployment.

## Antenna Design

Our GPS antenna is a custom patch design with hemispherical coverage. It's mounted on the rocket's nose cone with a ground plane to minimize multipath interference.`,
    date: '2026-01-10',
    readTime: '8 min read',
    category: 'Electronics',
    featured: false,
    author: {
      name: 'Alex Chen',
      role: 'Lead Engineer',
      avatar: '/avatars/alex.jpg'
    },
    comments: 27,
    likes: 145,
  },
  {
    id: 6,
    slug: 'motor-selection-guide',
    title: 'Solid Motor Selection: M to O Class',
    excerpt: 'A comprehensive guide to selecting high-power rocket motors, including thrust curve analysis and safety considerations.',
    content: `Choosing the right motor is crucial for mission success. Here's our selection process.

## Total Impulse

For our target altitude of 30,000 feet, we need approximately 10,000 Ns of total impulse. This puts us in the N-class motor range.

## Thrust Profile

We prefer motors with a regressive thrust curve - high initial thrust for a quick off-the-rail velocity, then lower sustained thrust for efficient altitude gain.

## Our Choice

After extensive simulation in OpenRocket, we selected the Cesaroni N5800. It provides 12,500 Ns of total impulse with an average thrust of 1,200N over a 10-second burn.`,
    date: '2025-12-28',
    readTime: '14 min read',
    category: 'Propulsion',
    featured: false,
    author: {
      name: 'David Park',
      role: 'Propulsion Lead',
      avatar: '/avatars/david.jpg'
    },
    comments: 35,
    likes: 178,
  },
]

export function BlogList() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  return (
    <div className="space-y-12">
      {/* Featured Posts */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-6">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-foreground/30 transition-colors relative">
                {/* Border Beam for featured posts */}
                <BorderBeam size={250} duration={10} delay={index * 2} />
                
                {/* Image placeholder */}
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-foreground text-background text-[10px] font-mono px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">{post.author.role}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Expanded content */}
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 prose prose-sm prose-invert max-w-none">
                      {post.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('## ')) {
                          return <h2 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{paragraph.replace('## ', '')}</h2>
                        }
                        if (paragraph.startsWith('- ')) {
                          return (
                            <ul key={i} className="list-disc list-inside text-muted-foreground mb-4">
                              {paragraph.split('\n').map((item, j) => (
                                <li key={j}>{item.replace('- ', '')}</li>
                              ))}
                            </ul>
                          )
                        }
                        return <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* All Posts */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-6">
          All Articles
        </h2>
        <div className="space-y-4">
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-foreground/30 transition-colors">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        by {post.author.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono sm:text-right">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${expandedPost === post.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </div>
                </div>
                
                {/* Expanded content */}
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 prose prose-sm prose-invert max-w-none">
                      {post.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('## ')) {
                          return <h2 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{paragraph.replace('## ', '')}</h2>
                        }
                        if (paragraph.startsWith('- ')) {
                          return (
                            <ul key={i} className="list-disc list-inside text-muted-foreground mb-4">
                              {paragraph.split('\n').map((item, j) => (
                                <li key={j}>{item.replace('- ', '')}</li>
                              ))}
                            </ul>
                          )
                        }
                        return <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}
