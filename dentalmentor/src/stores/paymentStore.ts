import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('paymentStore', {
  state: () => ({
    payments: [] as Array<Record<string, unknown>>,
    loading: false,
  }),
})
