<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import LoadingSpinner from '@/components/feedback/LoadingSpinner.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { useClinicStore } from '@/stores'
import { normalizeError } from '@/utils/errorHandler'

const clinicStore = useClinicStore()
const router = useRouter()
const { open, message, type, showToast } = useToast()

onMounted(async () => {
  try {
    await clinicStore.loadUserClinics()
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
})

async function chooseClinic(clinicId: string) {
  try {
    await clinicStore.selectClinic(clinicId)
    await router.push('/dashboard')
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-4 lg:p-8">
    <ToastNotification :open="open" :message="message" :type="type" />
    <div class="mx-auto w-full max-w-4xl">
      <h1 class="text-2xl font-bold text-slate-900">Seleccionar clinica</h1>
      <p class="mt-1 text-sm text-slate-600">Elige la clinica con la que deseas trabajar.</p>

      <div v-if="clinicStore.loading" class="mt-6">
        <LoadingSpinner />
      </div>

      <div v-else-if="!clinicStore.availableClinics.length" class="mt-6">
        <EmptyState
          title="No tienes clinicas activas"
          message="Crea tu primera clinica para comenzar a usar DentalMentor."
        />
        <RouterLink to="/create-clinic" class="mt-4 inline-block text-sm text-sky-700 hover:underline">
          Crear clinica
        </RouterLink>
      </div>

      <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
        <BaseCard v-for="item in clinicStore.availableClinics" :key="item.clinic.id">
          <h2 class="text-lg font-semibold text-slate-900">{{ item.clinic.name }}</h2>
          <p class="text-sm text-slate-600">Rol: {{ item.role }}</p>
          <p class="mt-1 text-sm text-slate-600">Plan: {{ item.clinic.subscriptionPlan }}</p>
          <BaseButton class="mt-4" @click="chooseClinic(item.clinic.id)">Entrar</BaseButton>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
