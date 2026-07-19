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

const DEMO_EMAIL = 'dental@mentor.com'
const DEMO_PASSWORD = 'dental'
const allowDemoLogin = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true'

const form = reactive({
  email: 'dental@mentor.com',
  password: 'dental',
})

async function onSubmit() {
  try {
    await authStore.login(form.email, form.password)
    await router.push('/dashboard')
  } catch (error) {
    const isDemoCredentials = form.email === DEMO_EMAIL && form.password === DEMO_PASSWORD

    if (allowDemoLogin && isDemoCredentials) {
      try {
        await authStore.register({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          fullName: 'Demo DentalMentor',
          phone: '',
        })
      } catch {
        // Si ya existe, ignoramos este error y reintentamos login.
      }

      try {
        await authStore.login(DEMO_EMAIL, DEMO_PASSWORD)
        showToast('Acceso demo habilitado.', 'success')
        await router.push('/dashboard')
        return
      } catch (finalError) {
        showToast(normalizeError(finalError), 'error')
        return
      }
    }

    showToast(normalizeError(error), 'error')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <ToastNotification :open="open" :message="message" :type="type" />
    <div class="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Iniciar sesion</h1>
      <p class="mt-1 text-sm text-slate-600">Accede a DentalMentor para administrar tu clinica.</p>
      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <BaseInput v-model="form.email" label="Correo" type="email" required />
        <BaseInput v-model="form.password" label="Contrasena" type="password" required />
        <BaseButton class="w-full" type="submit" :disabled="authStore.loading">Entrar</BaseButton>
      </form>
      <div class="mt-4 flex justify-between text-sm">
        <RouterLink class="text-sky-700 hover:underline" to="/forgot-password">Olvide mi contrasena</RouterLink>
        <RouterLink class="text-sky-700 hover:underline" to="/register">Crear cuenta</RouterLink>
      </div>
    </div>
  </div>
</template>
