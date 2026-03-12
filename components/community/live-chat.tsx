'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useAppDispatch } from '@/lib/store/hooks'
import { addChatMessage } from '@/lib/store/slices/appSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Send, 
  User, 
  MessageCircle,
  AlertTriangle,
  Radio
} from 'lucide-react'
import { moderateContent } from '@/lib/moderation'

interface ChatMessage {
  id: string
  userId: string
  content: string
  createdAt: string
  username: string
  avatarUrl?: string
}

interface LiveChatProps {
  userId: string
  username: string
  initialMessages?: ChatMessage[]
}

export function LiveChat({ userId, username, initialMessages = [] }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('galaxy_chat_messages')
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages)
        setMessages(parsed)
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    setModerationError(null)

    // Run content moderation
    const moderation = moderateContent(newMessage)
    
    if (!moderation.isClean) {
      setModerationError(moderation.message || 'Your message contains inappropriate content.')
      setSending(false)
      return
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      username,
    }

    // Add to local state and Redux
    setMessages((prev) => [...prev, message])
    dispatch(addChatMessage(message))
    
    // Store in localStorage for persistence
    const storedMessages = JSON.parse(localStorage.getItem('galaxy_chat_messages') || '[]')
    localStorage.setItem('galaxy_chat_messages', JSON.stringify([...storedMessages, message]))

    setNewMessage('')
    setSending(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radio className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Mission Control Chat</h2>
              <p className="text-xs text-muted-foreground">Real-time communication channel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {messages.length} messages
            </span>
          </div>
        </div>

        {/* Messages container */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isOwn = message.userId === userId
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-medium text-foreground">
                          {message.username || 'Astronaut'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-secondary text-foreground rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Moderation error */}
        <AnimatePresence>
          {moderationError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4"
            >
              <div className="p-2 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{moderationError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message input */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
              maxLength={300}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {sending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            {newMessage.length}/300 characters | Messages are moderated automatically
          </p>
        </div>
      </div>
    </div>
  )
}
