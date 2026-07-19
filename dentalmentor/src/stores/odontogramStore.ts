import { defineStore } from 'pinia'

export const useOdontogramStore = defineStore('odontogramStore', {
  state: () => ({
    odontograms: [] as Array<Record<string, unknown>>,
    loading: false,
  }),
})
