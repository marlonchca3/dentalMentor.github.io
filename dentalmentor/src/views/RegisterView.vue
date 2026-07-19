<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores'
import { normalizeError } from '@/utils/errorHandler'

const authStore = useAuthStore()
const router = useRouter()
const { open, message, type, showToast } = useToast()

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  password: '',
})

async function onSubmit() {
  try {
    await authStore.register({ ...form })
    await router.push('/verify-email')
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <ToastNotification :open="open" :message="message" :type="type" />
    <div class="w-full max-w-lg rounded-2xl bg-white p-7 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Crear cuenta</h1>
      <p class="mt-1 text-sm text-slate-600">Registra tu usuario para crear tu primera clinica.</p>
      <form class="mt-6 grid gap-4" @submit.prevent="onSubmit">
        <BaseInput v-model="form.fullName" label="Nombre completo" required />
        <BaseInput v-model="form.phone" label="Telefono" />
        <BaseInput v-model="form.email" label="Correo" type="email" required />
        <BaseInput v-model="form.password" label="Contrasena" type="password" required />
        <BaseButton type="submit" :disabled="authStore.loading">Registrarme</BaseButton>
      </form>
      <p class="mt-4 text-sm text-slate-600">
        Ya tienes cuenta.
        <RouterLink class="text-sky-700 hover:underline" to="/login">Inicia sesion</RouterLink>
      </p>
    </div>
  </div>
</template>
