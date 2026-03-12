'use client'

import { useState, useEffect } from 'react'
import { NewsSection } from '@/components/news/news-section'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SpaceBackground } from '@/components/ui/space-background'

interface NewsItem {
  id: string
  title: string
  content: string
  image_url?: string
  published: boolean
  created_at: string
}

// Demo news data
const demoNews: NewsItem[] = [
  {
    id: '1',
    title: 'Galaxy.SpaceCrafts Reaches New Milestone',
    content: 'We are thrilled to announce that our latest rocket launch was a complete success, reaching an altitude of 10,000 meters with perfect telemetry data throughout the flight.',
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'New LoRa Telemetry System Released',
    content: 'Our engineering team has developed a cutting-edge LoRa-based telemetry system that provides real-time data transmission with unprecedented reliability and range.',
    published: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Community Launch Event Announced',
    content: 'Join us for our upcoming community launch event where members can witness a live rocket launch and participate in hands-on workshops.',
    published: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    // Load news from localStorage or use demo data
    const storedNews = localStorage.getItem('galaxy_news')
    if (storedNews) {
      try {
        setNews(JSON.parse(storedNews))
      } catch {
        setNews(demoNews)
      }
    } else {
      setNews(demoNews)
    }
  }, [])

  return (
    <SpaceBackground showMeteors showBeams className="flex flex-col">
      <Navigation />
      <main className="flex-1">
        <NewsSection news={news} />
      </main>
      <Footer />
    </SpaceBackground>
  )
}
