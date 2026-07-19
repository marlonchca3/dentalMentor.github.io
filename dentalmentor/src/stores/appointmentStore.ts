import { defineStore } from 'pinia'

export const useAppointmentStore = defineStore('appointmentStore', {
  state: () => ({
    appointments: [] as Array<Record<string, unknown>>,
    loading: false,
  }),
})
