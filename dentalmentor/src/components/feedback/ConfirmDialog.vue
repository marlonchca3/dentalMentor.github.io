<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'

const props = defineProps<{
  open: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <BaseModal :open="props.open" :title="props.title" @close="emit('close')">
    <p class="mb-6 text-sm text-slate-700">{{ props.message }}</p>
    <div class="flex justify-end gap-3">
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="danger" @click="emit('confirm')">Confirmar</BaseButton>
    </div>
  </BaseModal>
</template>
