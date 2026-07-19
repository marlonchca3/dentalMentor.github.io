import { defineStore } from 'pinia'

export const useClinicalHistoryStore = defineStore('clinicalHistoryStore', {
  state: () => ({
    histories: [] as Array<Record<string, unknown>>,
    loading: false,
  }),
})
