<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores'
import { normalizeError } from '@/utils/errorHandler'

const authStore = useAuthStore()
const email = ref('')
const { open, message, type, showToast } = useToast()

async function onSubmit() {
  try {
    await authStore.resetPassword(email.value)
    showToast('Se envio un correo para recuperar la contrasena.', 'success')
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <ToastNotification :open="open" :message="message" :type="type" />
    <div class="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Recuperar contrasena</h1>
      <p class="mt-1 text-sm text-slate-600">Ingresa tu correo para recibir instrucciones.</p>
      <form class="mt-6 grid gap-4" @submit.prevent="onSubmit">
        <BaseInput v-model="email" label="Correo" type="email" required />
        <BaseButton type="submit">Enviar enlace</BaseButton>
      </form>
      <RouterLink class="mt-4 inline-block text-sm text-sky-700 hover:underline" to="/login">
        Volver al login
      </RouterLink>
    </div>
  </div>
</template>
