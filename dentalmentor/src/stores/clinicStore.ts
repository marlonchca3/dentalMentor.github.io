import { defineStore } from 'pinia'
import { clinicService } from '@/services'
import type { Clinic, ClinicRole, CreateClinicPayload } from '@/types'
import { useAuthStore } from './authStore'

interface ClinicAccessItem {
  clinic: Clinic
  role: ClinicRole
}

interface ClinicState {
  availableClinics: ClinicAccessItem[]
  activeClinic: Clinic | null
  activeClinicId: string | null
  activeRole: ClinicRole | null
  loading: boolean
}

const ACTIVE_CLINIC_KEY = 'dentalmentor.activeClinicId'

export const useClinicStore = defineStore('clinicStore', {
  state: (): ClinicState => ({
    availableClinics: [],
    activeClinic: null,
    activeClinicId: null,
    activeRole: null,
    loading: false,
  }),

  actions: {
    async loadUserClinics() {
      const authStore = useAuthStore()
      if (!authStore.currentUser) {
        this.clearClinic()
        return
      }

      this.loading = true
      try {
        this.availableClinics = await clinicService.getUserClinics(
          authStore.currentUser.uid,
          authStore.currentUser.email,
        )

        const savedClinicId = localStorage.getItem(ACTIVE_CLINIC_KEY)
        if (savedClinicId) {
          await this.selectClinic(savedClinicId)
        }
      } finally {
        this.loading = false
      }
    },

    async selectClinic(clinicId: string) {
      const authStore = useAuthStore()
      if (!authStore.currentUser) {
        this.clearClinic()
        return
      }

      const role = await clinicService.validateClinicMembership(
        clinicId,
        authStore.currentUser.uid,
        authStore.currentUser.email,
      )
      if (!role) {
        this.clearClinic()
        throw new Error('No tienes acceso a esta clinica.')
      }

      const clinicItem = this.availableClinics.find((item) => item.clinic.id === clinicId)
      if (!clinicItem) {
        this.clearClinic()
        throw new Error('La clinica seleccionada no esta disponible.')
      }

      this.activeClinic = clinicItem.clinic
      this.activeClinicId = clinicId
      this.activeRole = role
      localStorage.setItem(ACTIVE_CLINIC_KEY, clinicId)
    },

    async createClinic(payload: CreateClinicPayload) {
      const authStore = useAuthStore()
      if (!authStore.currentUser) {
        throw new Error('Debes iniciar sesion para crear una clinica.')
      }

      this.loading = true
      try {
        const clinicId = await clinicService.createClinic(payload, authStore.currentUser.uid)
        await this.loadUserClinics()
        await this.selectClinic(clinicId)
      } finally {
        this.loading = false
      }
    },

    clearClinic() {
      this.activeClinic = null
      this.activeClinicId = null
      this.activeRole = null
      localStorage.removeItem(ACTIVE_CLINIC_KEY)
    },
  },
})
