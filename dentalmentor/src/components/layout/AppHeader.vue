<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore, useClinicStore } from '@/stores'

const authStore = useAuthStore()
const clinicStore = useClinicStore()

const userName = computed(() => authStore.userProfile?.fullName || authStore.currentUser?.email || 'Usuario')

const emit = defineEmits<{ toggleMenu: [] }>()
</script>

<template>
  <header class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
    <div class="flex items-center gap-3">
      <button class="rounded-lg border border-slate-300 p-2 lg:hidden" @click="emit('toggleMenu')">
        Menu
      </button>
      <div>
        <p class="text-sm text-slate-500">Clinica activa</p>
        <p class="text-base font-semibold text-slate-900">{{ clinicStore.activeClinic?.name ?? 'Sin seleccionar' }}</p>
      </div>
    </div>
    <div class="text-right">
      <p class="text-sm font-medium text-slate-900">{{ userName }}</p>
      <p class="text-xs uppercase text-slate-500">{{ clinicStore.activeRole ?? 'sin rol' }}</p>
    </div>
  </header>
</template>
