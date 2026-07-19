<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
    <h3 class="text-base font-semibold text-slate-900">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
  </div>
</template>
