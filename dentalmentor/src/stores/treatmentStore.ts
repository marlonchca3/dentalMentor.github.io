import { defineStore } from 'pinia'

export const useTreatmentStore = defineStore('treatmentStore', {
  state: () => ({
    treatmentPlans: [] as Array<Record<string, unknown>>,
    loading: false,
  }),
})
