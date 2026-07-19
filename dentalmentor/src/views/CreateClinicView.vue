<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { useClinicStore } from '@/stores'
import { normalizeError } from '@/utils/errorHandler'

const clinicStore = useClinicStore()
const router = useRouter()
const { open, message, type, showToast } = useToast()

const form = reactive({
  name: '',
  slug: '',
  phone: '',
  email: '',
  address: '',
  district: '',
  city: '',
  country: 'Peru',
})

async function onSubmit() {
  try {
    await clinicStore.createClinic(form)
    await router.push('/dashboard')
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <ToastNotification :open="open" :message="message" :type="type" />
    <div class="w-full max-w-3xl rounded-2xl bg-white p-7 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Registrar clinica</h1>
      <p class="mt-1 text-sm text-slate-600">Crea tu tenant principal para empezar a trabajar.</p>
      <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="onSubmit">
        <BaseInput v-model="form.name" label="Nombre de la clinica" required />
        <BaseInput v-model="form.slug" label="Slug unico" required />
        <BaseInput v-model="form.phone" label="Telefono" required />
        <BaseInput v-model="form.email" label="Correo" type="email" required />
        <BaseInput v-model="form.address" label="Direccion" required />
        <BaseInput v-model="form.district" label="Distrito" required />
        <BaseInput v-model="form.city" label="Ciudad" required />
        <BaseInput v-model="form.country" label="Pais" required />
        <div class="md:col-span-2 flex justify-end">
          <BaseButton type="submit" :disabled="clinicStore.loading">Crear clinica</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
