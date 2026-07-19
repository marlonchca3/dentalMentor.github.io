import { defineStore } from 'pinia'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authService } from '@/services'
import type { RegisterPayload, UserProfile } from '@/types'

interface AuthState {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  authReady: boolean
  listenerInitialized: boolean
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    currentUser: null,
    userProfile: null,
    loading: false,
    authReady: false,
    listenerInitialized: false,
  }),

  actions: {
    initAuthListener() {
      if (this.listenerInitialized) {
        return
      }

      this.listenerInitialized = true
      onAuthStateChanged(auth, async (user) => {
        this.currentUser = user

        try {
          if (user) {
            await this.loadUserProfile(user.uid)
          } else {
            this.userProfile = null
          }
        } catch (error) {
          // Never block initial routing if profile loading fails.
          console.error('No se pudo cargar el perfil de usuario al iniciar.', error)
          this.userProfile = null
        } finally {
          this.authReady = true
        }
      })
    },

    async login(email: string, password: string) {
      this.loading = true
      try {
        const user = await authService.loginWithEmail(email, password)
        this.currentUser = user
        await this.loadUserProfile(user.uid)
      } finally {
        this.loading = false
      }
    },

    async register(payload: RegisterPayload) {
      this.loading = true
      try {
        const user = await authService.registerWithEmail(payload)
        this.currentUser = user
        await this.loadUserProfile(user.uid)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await authService.logoutSession()
        this.currentUser = null
        this.userProfile = null
      } finally {
        this.loading = false
      }
    },

    async resetPassword(email: string) {
      await authService.resetUserPassword(email)
    },

    async loadUserProfile(uid: string) {
      this.userProfile = await authService.getUserProfile(uid)
    },
  },
})
