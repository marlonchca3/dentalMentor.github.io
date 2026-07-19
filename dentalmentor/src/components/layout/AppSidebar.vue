<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients', label: 'Pacientes' },
  { to: '/appointments', label: 'Citas' },
  { to: '/team', label: 'Equipo' },
  { to: '/settings', label: 'Configuracion' },
]

const isActive = computed(() => (path: string) => route.path.startsWith(path))
</script>

<template>
  <aside class="hidden w-64 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex">
    <div class="border-b border-slate-800 px-5 py-4">
      <p class="text-lg font-semibold">DentalMentor</p>
      <p class="text-xs text-slate-400">SaaS Multiempresa</p>
    </div>
    <nav class="flex-1 space-y-1 p-3">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="block rounded-lg px-3 py-2 text-sm transition"
        :class="isActive(item.to) ? 'bg-sky-700 text-white' : 'text-slate-300 hover:bg-slate-800'"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
