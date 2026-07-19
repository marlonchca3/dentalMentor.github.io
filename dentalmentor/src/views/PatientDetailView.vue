<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseCard from '@/components/base/BaseCard.vue'
import LoadingSpinner from '@/components/feedback/LoadingSpinner.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { patientService } from '@/services'
import { useClinicStore } from '@/stores'
import type { Patient } from '@/types'
import { normalizeError } from '@/utils/errorHandler'

const route = useRoute()
const clinicStore = useClinicStore()
const patient = ref<Patient | null>(null)
const loading = ref(false)
const { open, message, type, showToast } = useToast()

const fullName = computed(() => {
  if (!patient.value) {
    return ''
  }
  return `${patient.value.firstName} ${patient.value.lastName}`
})

onMounted(async () => {
  const patientId = route.params.id as string
  loading.value = true
  try {
    const result = await patientService.getPatientById(patientId)

    if (!result) {
      showToast('Paciente no encontrado.', 'error')
      return
    }

    if (result.clinicId !== clinicStore.activeClinicId) {
      showToast('No tienes acceso al paciente solicitado.', 'error')
      return
    }

    patient.value = result
  } catch (error) {
    showToast(normalizeError(error), 'error')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-5">
    <ToastNotification :open="open" :message="message" :type="type" />
    <header>
      <h1 class="text-2xl font-bold text-slate-900">Detalle de paciente</h1>
    </header>

    <LoadingSpinner v-if="loading" />

    <BaseCard v-else-if="patient">
      <h2 class="text-xl font-semibold text-slate-900">{{ fullName }}</h2>
      <dl class="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <div>
          <dt class="text-slate-500">Documento</dt>
          <dd>{{ patient.documentType }} - {{ patient.documentNumber }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Telefono</dt>
          <dd>{{ patient.phone || '-' }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Correo</dt>
          <dd>{{ patient.email || '-' }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Direccion</dt>
          <dd>{{ patient.address || '-' }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Alergias</dt>
          <dd>{{ patient.allergies || '-' }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Condiciones medicas</dt>
          <dd>{{ patient.medicalConditions || '-' }}</dd>
        </div>
      </dl>
    </BaseCard>
  </div>
</template>
