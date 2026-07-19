<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients', label: 'Pacientes' },
  { to: '/appointments', label: 'Citas' },
  { to: '/team', label: 'Equipo' },
  { to: '/settings', label: 'Configuracion' },
]
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" @click="emit('close')" />
  <aside
    class="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs overflow-y-auto bg-slate-950 px-4 py-5 text-slate-100 transition lg:hidden"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="mb-4 flex items-center justify-between">
      <p class="font-semibold">DentalMentor</p>
      <button class="text-sm text-slate-300" @click="emit('close')">Cerrar</button>
    </div>
    <nav class="space-y-1">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        @click="emit('close')"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
