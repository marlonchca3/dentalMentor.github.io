<script setup lang="ts">
const modelValue = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    type?: string
    required?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    type: 'text',
    required: false,
  },
)
</script>

<template>
  <label class="flex w-full flex-col gap-2 text-sm text-slate-700">
    <span v-if="label">{{ label }}</span>
    <input
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-200 transition focus:ring"
    />
  </label>
</template>
