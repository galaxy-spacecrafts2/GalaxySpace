import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// =============================================================================
// SPACECRAFT STORE - State for spacecraft/vehicle management
// =============================================================================

export interface Spacecraft {
  id: string
  name: string
  type: 'fighter' | 'cargo' | 'explorer' | 'battleship' | 'transport'
  class: string
  manufacturer?: string
  description?: string
  image?: string
  specs: {
    speed: number
    armor: number
    firepower: number
    cargo: number
    range: number
  }
  status: 'active' | 'maintenance' | 'decommissioned'
  acquired: string
  missions: number
  favorite: boolean
}

interface SpacecraftState {
  // Data
  spacecraft: Spacecraft[]
  selectedSpacecraftId: string | null
  
  // Filters
  typeFilter: string | null
  statusFilter: string | null
  searchQuery: string
  sortBy: 'name' | 'type' | 'missions' | 'acquired'
  sortOrder: 'asc' | 'desc'
  
  // View
  viewMode: 'grid' | 'list'
  
  // Computed
  getSelectedSpacecraft: () => Spacecraft | null
  getFilteredSpacecraft: () => Spacecraft[]
  getFavorites: () => Spacecraft[]
  
  // Actions
  setSpacecraft: (spacecraft: Spacecraft[]) => void
  addSpacecraft: (spacecraft: Spacecraft) => void
  updateSpacecraft: (id: string, updates: Partial<Spacecraft>) => void
  removeSpacecraft: (id: string) => void
  selectSpacecraft: (id: string | null) => void
  toggleFavorite: (id: string) => void
  setTypeFilter: (type: string | null) => void
  setStatusFilter: (status: string | null) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: SpacecraftState['sortBy']) => void
  setSortOrder: (order: SpacecraftState['sortOrder']) => void
  setViewMode: (mode: 'grid' | 'list') => void
  clearFilters: () => void
}

export const useSpacecraftStore = create<SpacecraftState>()(
  persist(
    (set, get) => ({
      // Initial state
      spacecraft: [],
      selectedSpacecraftId: null,
      typeFilter: null,
      statusFilter: null,
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
      viewMode: 'grid',
      
      // Computed getters
      getSelectedSpacecraft: () => {
        const state = get()
        return state.spacecraft.find(s => s.id === state.selectedSpacecraftId) || null
      },
      
      getFilteredSpacecraft: () => {
        const state = get()
        let filtered = [...state.spacecraft]
        
        // Apply type filter
        if (state.typeFilter) {
          filtered = filtered.filter(s => s.type === state.typeFilter)
        }
        
        // Apply status filter
        if (state.statusFilter) {
          filtered = filtered.filter(s => s.status === state.statusFilter)
        }
        
        // Apply search
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase()
          filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(query) ||
            s.type.toLowerCase().includes(query) ||
            s.class.toLowerCase().includes(query) ||
            s.manufacturer?.toLowerCase().includes(query)
          )
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0
          switch (state.sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name)
              break
            case 'type':
              comparison = a.type.localeCompare(b.type)
              break
            case 'missions':
              comparison = a.missions - b.missions
              break
            case 'acquired':
              comparison = new Date(a.acquired).getTime() - new Date(b.acquired).getTime()
              break
          }
          return state.sortOrder === 'asc' ? comparison : -comparison
        })
        
        return filtered
      },
      
      getFavorites: () => {
        return get().spacecraft.filter(s => s.favorite)
      },
      
      // Actions
      setSpacecraft: (spacecraft) => set({ spacecraft }),
      
      addSpacecraft: (spacecraft) => set((state) => ({
        spacecraft: [...state.spacecraft, spacecraft]
      })),
      
      updateSpacecraft: (id, updates) => set((state) => ({
        spacecraft: state.spacecraft.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      
      removeSpacecraft: (id) => set((state) => ({
        spacecraft: state.spacecraft.filter(s => s.id !== id),
        selectedSpacecraftId: state.selectedSpacecraftId === id ? null : state.selectedSpacecraftId
      })),
      
      selectSpacecraft: (id) => set({ selectedSpacecraftId: id }),
      
      toggleFavorite: (id) => set((state) => ({
        spacecraft: state.spacecraft.map(s => 
          s.id === id ? { ...s, favorite: !s.favorite } : s
        )
      })),
      
      setTypeFilter: (type) => set({ typeFilter: type }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),
      setViewMode: (mode) => set({ viewMode: mode }),
      
      clearFilters: () => set({
        typeFilter: null,
        statusFilter: null,
        searchQuery: '',
      }),
    }),
    {
      name: 'galaxy-spacecraft-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        spacecraft: state.spacecraft,
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
)
