import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// =============================================================================
// UI STORE - Lightweight state for UI interactions
// =============================================================================

interface UIState {
  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Mobile menu
  mobileMenuOpen: boolean
  
  // Theme
  theme: 'dark' | 'light' | 'system'
  
  // Notifications panel
  notificationsPanelOpen: boolean
  unreadNotificationsCount: number
  
  // Search
  searchOpen: boolean
  searchQuery: string
  
  // Modals
  activeModal: string | null
  modalData: Record<string, unknown>
  
  // Toast queue
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  toggleNotificationsPanel: () => void
  setUnreadNotificationsCount: (count: number) => void
  incrementUnreadNotifications: () => void
  clearUnreadNotifications: () => void
  toggleSearch: () => void
  setSearchQuery: (query: string) => void
  openModal: (modalId: string, data?: Record<string, unknown>) => void
  closeModal: () => void
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      theme: 'dark',
      notificationsPanelOpen: false,
      unreadNotificationsCount: 0,
      searchOpen: false,
      searchQuery: '',
      activeModal: null,
      modalData: {},
      toasts: [],
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setTheme: (theme) => set({ theme }),
      toggleNotificationsPanel: () => set((state) => ({ notificationsPanelOpen: !state.notificationsPanelOpen })),
      setUnreadNotificationsCount: (count) => set({ unreadNotificationsCount: count }),
      incrementUnreadNotifications: () => set((state) => ({ unreadNotificationsCount: state.unreadNotificationsCount + 1 })),
      clearUnreadNotifications: () => set({ unreadNotificationsCount: 0 }),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      openModal: (modalId, data = {}) => set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: {} }),
      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }]
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),
      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: 'galaxy-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
