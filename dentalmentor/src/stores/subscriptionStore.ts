import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscriptionStore', {
  state: () => ({
    subscription: null as Record<string, unknown> | null,
    loading: false,
  }),
})
