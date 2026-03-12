import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  username?: string
  displayName?: string
  avatarUrl?: string
  role?: string
  bio?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks for auth operations
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulated login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check localStorage for registered users
      const users = JSON.parse(localStorage.getItem('galaxy_users') || '[]')
      const user = users.find((u: User & { password: string }) => u.email === email)
      
      if (!user || user.password !== password) {
        throw new Error('Email ou senha incorretos')
      }
      
      const userData: User = {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName || user.username,
        avatarUrl: user.avatarUrl,
        role: user.role || 'astronaut',
      }
      
      // Store session
      localStorage.setItem('galaxy_session', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  }
)

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, username }: { email: string; password: string; username: string }, { rejectWithValue }) => {
    try {
      // Simulated sign up - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('galaxy_users') || '[]')
      if (users.find((u: User) => u.email === email)) {
        throw new Error('Este email ja esta cadastrado')
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        username,
        displayName: username,
        role: 'astronaut',
        createdAt: new Date().toISOString(),
      }
      
      // Store user
      users.push(newUser)
      localStorage.setItem('galaxy_users', JSON.stringify(users))
      
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      }
      
      // Store session
      localStorage.setItem('galaxy_session', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Sign up failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('galaxy_session')
    return null
  }
)

export const checkAuthSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    const session = localStorage.getItem('galaxy_session')
    if (session) {
      return JSON.parse(session) as User
    }
    return null
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('galaxy_session', JSON.stringify(state.user))
      }
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token?: string }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      localStorage.setItem('galaxy_session', JSON.stringify(action.payload.user))
      if (action.payload.token) {
        localStorage.setItem('galaxy_token', action.payload.token)
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Sign Up
    builder.addCase(signUpUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
    })
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.isAuthenticated = false
    })

    // Check Session
    builder.addCase(checkAuthSession.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(checkAuthSession.fulfilled, (state, action) => {
      state.isLoading = false
      if (action.payload) {
        state.user = action.payload
        state.isAuthenticated = true
      }
    })
    builder.addCase(checkAuthSession.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const { clearError, updateUser, setCredentials } = authSlice.actions
export default authSlice.reducer
