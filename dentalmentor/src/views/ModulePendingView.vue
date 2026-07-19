<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6">
    <h1 class="text-2xl font-bold text-slate-900">{{ title }}</h1>
    <p class="mt-2 text-sm text-slate-600">
      Este modulo se encuentra planificado para la siguiente fase de implementacion.
    </p>
  </div>
</template>
