<script setup lang="ts">
import { sendEmailVerification } from 'firebase/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { auth } from '@/lib/firebase'

const router = useRouter()
const { open, message, type, showToast } = useToast()

const isVerified = computed(() => Boolean(auth.currentUser?.emailVerified))

async function resendVerification() {
  if (!auth.currentUser) {
    showToast('No hay usuario autenticado.', 'error')
    return
  }

  await sendEmailVerification(auth.currentUser)
  showToast('Correo de verificacion reenviado.', 'success')
}

async function continueFlow() {
  if (!auth.currentUser) {
    await router.push('/login')
    return
  }

  await auth.currentUser.reload()
  if (!auth.currentUser.emailVerified) {
    showToast('Aun no verificas tu correo.', 'error')
    return
  }

  await router.push('/create-clinic')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <ToastNotification :open="open" :message="message" :type="type" />
    <div class="w-full max-w-lg rounded-2xl bg-white p-7 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Verifica tu correo</h1>
      <p class="mt-2 text-sm text-slate-600">
        Revisa tu bandeja de entrada y confirma tu cuenta antes de continuar.
      </p>
      <p class="mt-3 text-sm" :class="isVerified ? 'text-emerald-700' : 'text-amber-700'">
        Estado actual: {{ isVerified ? 'Verificado' : 'Pendiente de verificacion' }}
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <BaseButton variant="secondary" @click="resendVerification">Reenviar correo</BaseButton>
        <BaseButton @click="continueFlow">Continuar</BaseButton>
      </div>
    </div>
  </div>
</template>
