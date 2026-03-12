'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  Newspaper, 
  Calendar, 
  Tag, 
  ChevronRight, 
  Sparkles, 
  Rocket,
  AlertTriangle,
  CheckCircle,
  Info,
  Flame
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NewsItem {
  id: string
  title: string
  content: string
  category?: string
  image_url?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  published: boolean
  created_at: string
}

interface NewsSectionProps {
  news: NewsItem[]
}

const categoryIcons: Record<string, React.ElementType> = {
  update: Sparkles,
  announcement: Newspaper,
  launch: Rocket,
  alert: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/20 text-primary',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-destructive/20 text-destructive',
}

export function NewsSection({ news }: NewsSectionProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...new Set(news.map(n => n.category || 'update').filter(Boolean))]
  const filteredNews = filter === 'all' ? news : news.filter(n => (n.category || 'update') === filter)

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                MISSION UPDATES
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest news, announcements, and updates from Galaxy.SpaceCrafts mission control.
            </p>
          </motion.div>

          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm font-mono text-muted-foreground">LIVE FEED</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat)}
              className={filter === cat 
                ? 'bg-primary text-primary-foreground' 
                : 'border-border text-foreground hover:bg-secondary'
              }
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </motion.div>

        {filteredNews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">No News Available</h3>
            <p className="text-muted-foreground">Check back later for updates from mission control.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((item, index) => {
                const Icon = categoryIcons[item.category || 'update'] || Info
                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedNews(item)}
                    className="group cursor-pointer"
                  >
                    <div className="h-full bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-secondary rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge className={priorityColors[item.priority || 'medium']}>
                          {item.priority || 'medium'}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Preview */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {item.content}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Read more</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* News Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={priorityColors[selectedNews.priority || 'medium']}>
                    {selectedNews.priority || 'medium'}
                  </Badge>
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">{selectedNews.title}</h2>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>{selectedNews.category || 'update'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(selectedNews.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{selectedNews.content}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
