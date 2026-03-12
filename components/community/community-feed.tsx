'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { addPost, likePost } from '@/lib/store/slices/appSlice'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Heart, 
  MessageCircle, 
  Send, 
  User,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react'
import { moderateContent } from '@/lib/moderation'

interface CommunityPost {
  id: string
  userId: string
  content: string
  createdAt: string
  username: string
  avatarUrl?: string
  likes: number
  comments: number
}

interface CommunityFeedProps {
  userId: string
  username: string
  initialPosts?: CommunityPost[]
}

export function CommunityFeed({ userId, username, initialPosts = [] }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null)
  
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || posting) return

    setPosting(true)
    setModerationError(null)

    // Run content moderation
    const moderation = moderateContent(newPost)
    
    if (!moderation.isClean) {
      setModerationError(moderation.message || 'Your post contains inappropriate content.')
      setPosting(false)
      return
    }

    // Create new post
    const post: CommunityPost = {
      id: crypto.randomUUID(),
      userId,
      content: newPost.trim(),
      createdAt: new Date().toISOString(),
      username,
      likes: 0,
      comments: 0,
    }

    // Add to local state and Redux
    setPosts((prev) => [post, ...prev])
    dispatch(addPost(post))
    
    // Store in localStorage for persistence
    const storedPosts = JSON.parse(localStorage.getItem('galaxy_posts') || '[]')
    localStorage.setItem('galaxy_posts', JSON.stringify([post, ...storedPosts]))

    setNewPost('')
    setPosting(false)
  }

  const handleLike = (postId: string) => {
    setPosts((prev) => 
      prev.map((post) => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    )
    dispatch(likePost(postId))
    
    // Update localStorage
    const storedPosts = JSON.parse(localStorage.getItem('galaxy_posts') || '[]')
    const updatedPosts = storedPosts.map((post: CommunityPost) => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    )
    localStorage.setItem('galaxy_posts', JSON.stringify(updatedPosts))
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post composer */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-4 mb-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with the community..."
                className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[80px]"
                maxLength={500}
              />
              
              {moderationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{moderationError}</p>
                </motion.div>
              )}

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {newPost.length}/500
                </span>
                <Button
                  type="submit"
                  disabled={!newPost.trim() || posting}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {posting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Posts feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.02 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {post.username || 'Astronaut'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-foreground mt-2 whitespace-pre-wrap break-words">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="text-muted-foreground hover:text-primary -ml-2"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="text-xs">{post.likes || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">{post.comments || 0}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  )
}
