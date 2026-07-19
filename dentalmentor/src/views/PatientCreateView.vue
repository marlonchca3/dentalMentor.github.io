<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseCard from '@/components/base/BaseCard.vue'
import PatientForm from '@/components/patients/PatientForm.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore, useClinicStore, usePatientStore } from '@/stores'
import type { CreatePatientPayload } from '@/types'
import { normalizeError } from '@/utils/errorHandler'

const patientStore = usePatientStore()
const clinicStore = useClinicStore()
const authStore = useAuthStore()
const router = useRouter()
const { open, message, type, showToast } = useToast()

async function handleCreatePatient(payload: CreatePatientPayload) {
  if (!clinicStore.activeClinicId || !authStore.currentUser) {
    showToast('No hay clinica seleccionada o usuario activo.', 'error')
    return
  }

  try {
    await patientStore.createPatient(clinicStore.activeClinicId, authStore.currentUser.uid, payload)
    showToast('Paciente registrado correctamente.', 'success')
    await router.push('/patients')
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}
</script>

<template>
  <div class="space-y-5">
    <ToastNotification :open="open" :message="message" :type="type" />
    <header>
      <h1 class="text-2xl font-bold text-slate-900">Nuevo paciente</h1>
      <p class="text-sm text-slate-600">Completa los datos para registrar un paciente en la clinica activa.</p>
    </header>
    <BaseCard>
      <PatientForm @submit="handleCreatePatient" />
    </BaseCard>
  </div>
</template>
