<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore, useClinicStore } from '@/stores'

const authStore = useAuthStore()
const clinicStore = useClinicStore()

const userName = computed(() => authStore.userProfile?.fullName || authStore.currentUser?.email || 'Usuario')

const emit = defineEmits<{ toggleMenu: [] }>()
</script>

<template>
  <header class="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
    <div class="flex min-w-0 items-center gap-3">
      <button class="rounded-lg border border-slate-300 p-2 lg:hidden" @click="emit('toggleMenu')">
        Menu
      </button>
      <div class="min-w-0">
        <p class="text-sm text-slate-500">Clinica activa</p>
        <p class="truncate text-base font-semibold text-slate-900">{{ clinicStore.activeClinic?.name ?? 'Sin seleccionar' }}</p>
      </div>
    </div>
    <div class="min-w-0 text-left sm:text-right">
      <p class="truncate text-sm font-medium text-slate-900">{{ userName }}</p>
      <p class="text-xs uppercase text-slate-500">{{ clinicStore.activeRole ?? 'sin rol' }}</p>
    </div>
  </header>
</template>
