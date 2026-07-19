import { defineStore } from 'pinia'
import type { DocumentSnapshot } from 'firebase/firestore'
import { patientService } from '@/services'
import type { CreatePatientPayload, Patient } from '@/types'

interface PatientState {
  patients: Patient[]
  loading: boolean
  cursor: DocumentSnapshot | null
  hasMore: boolean
}

export const usePatientStore = defineStore('patientStore', {
  state: (): PatientState => ({
    patients: [],
    loading: false,
    cursor: null,
    hasMore: true,
  }),

  actions: {
    async fetchPatients(clinicId: string, reset = true) {
      if (reset) {
        this.patients = []
        this.cursor = null
        this.hasMore = true
      }

      if (!this.hasMore) {
        return
      }

      this.loading = true
      try {
        const result = await patientService.listPatients(clinicId, this.cursor ?? undefined)
        this.patients = [...this.patients, ...result.data]
        this.cursor = result.cursor
        this.hasMore = Boolean(result.cursor)
      } finally {
        this.loading = false
      }
    },

    async createPatient(clinicId: string, userId: string, payload: CreatePatientPayload) {
      this.loading = true
      try {
        await patientService.createPatient(clinicId, userId, payload)
      } finally {
        this.loading = false
      }
    },
  },
})
