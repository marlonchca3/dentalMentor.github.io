<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-sky-700 text-white hover:bg-sky-800': variant === 'primary',
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50': variant === 'secondary',
      'bg-rose-600 text-white hover:bg-rose-700': variant === 'danger',
    }"
  >
    <slot />
  </button>
</template>
