import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Post {
  id: string
  userId: string
  content: string
  createdAt: string
  username: string
  avatarUrl?: string
  likes: number
  comments: number
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  createdAt: string
  username: string
  avatarUrl?: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  imageUrl?: string
  published: boolean
  createdAt: string
}

export interface AppState {
  posts: Post[]
  chatMessages: ChatMessage[]
  news: NewsItem[]
  isLoadingPosts: boolean
  isLoadingChat: boolean
  isLoadingNews: boolean
}

const initialState: AppState = {
  posts: [],
  chatMessages: [],
  news: [],
  isLoadingPosts: false,
  isLoadingChat: false,
  isLoadingNews: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Posts
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload)
    },
    setLoadingPosts: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPosts = action.payload
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload)
      if (post) {
        post.likes += 1
      }
    },

    // Chat Messages
    setChatMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.chatMessages = action.payload
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload)
    },
    setLoadingChat: (state, action: PayloadAction<boolean>) => {
      state.isLoadingChat = action.payload
    },

    // News
    setNews: (state, action: PayloadAction<NewsItem[]>) => {
      state.news = action.payload
    },
    setLoadingNews: (state, action: PayloadAction<boolean>) => {
      state.isLoadingNews = action.payload
    },
  },
})

export const {
  setPosts,
  addPost,
  setLoadingPosts,
  likePost,
  setChatMessages,
  addChatMessage,
  setLoadingChat,
  setNews,
  setLoadingNews,
} = appSlice.actions

export default appSlice.reducer
