<script setup lang="ts">
const modelValue = defineModel<string>({ required: true })

defineProps<{
  label?: string
  options: Array<{ label: string; value: string }>
}>()
</script>

<template>
  <label class="flex w-full flex-col gap-2 text-sm text-slate-700">
    <span v-if="label">{{ label }}</span>
    <select
      v-model="modelValue"
      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-200 transition focus:ring"
    >
      <option value="">Seleccione una opcion</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
