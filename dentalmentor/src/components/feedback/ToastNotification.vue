<script setup lang="ts">
defineProps<{
  open: boolean
  message: string
  type?: 'success' | 'error'
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 text-sm text-white shadow-lg"
    :class="type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'"
  >
    {{ message }}
  </div>
</template>
