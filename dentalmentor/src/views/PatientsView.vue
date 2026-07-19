<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import EmptyState from '@/components/feedback/EmptyState.vue'
import LoadingSpinner from '@/components/feedback/LoadingSpinner.vue'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore, useClinicStore, usePatientStore } from '@/stores'
import { normalizeError } from '@/utils/errorHandler'

const clinicStore = useClinicStore()
const authStore = useAuthStore()
const patientStore = usePatientStore()
const queryText = ref('')
const { open, message, type, showToast } = useToast()

const filteredPatients = computed(() => {
  const text = queryText.value.toLowerCase().trim()
  if (!text) {
    return patientStore.patients
  }

  return patientStore.patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    return fullName.includes(text) || patient.documentNumber.toLowerCase().includes(text)
  })
})

async function loadPatients() {
  if (!clinicStore.activeClinicId) {
    return
  }

  try {
    await patientStore.fetchPatients(clinicStore.activeClinicId)
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}

async function loadMore() {
  if (!clinicStore.activeClinicId) {
    return
  }

  try {
    await patientStore.fetchPatients(clinicStore.activeClinicId, false)
  } catch (error) {
    showToast(normalizeError(error), 'error')
  }
}

onMounted(async () => {
  if (authStore.currentUser) {
    await loadPatients()
  }
})
</script>

<template>
  <div class="space-y-5">
    <ToastNotification :open="open" :message="message" :type="type" />

    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Pacientes</h1>
        <p class="text-sm text-slate-600">Gestion de pacientes por clinica activa.</p>
      </div>
      <RouterLink to="/patients/new">
        <BaseButton>Nuevo paciente</BaseButton>
      </RouterLink>
    </header>

    <div class="rounded-2xl border border-slate-200 bg-white p-4">
      <input
        v-model="queryText"
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 focus:ring"
        placeholder="Buscar por nombre o documento"
      />
    </div>

    <div v-if="patientStore.loading && !patientStore.patients.length">
      <LoadingSpinner />
    </div>

    <EmptyState
      v-else-if="!filteredPatients.length"
      title="Sin pacientes"
      message="Todavia no hay pacientes registrados para esta clinica."
    />

    <div v-else class="space-y-3 md:hidden">
      <article v-for="patient in filteredPatients" :key="patient.id" class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="font-semibold text-slate-900">{{ patient.firstName }} {{ patient.lastName }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ patient.documentType }} - {{ patient.documentNumber }}</p>
        <p class="mt-1 text-sm text-slate-600">Telefono: {{ patient.phone || '-' }}</p>
        <RouterLink :to="`/patients/${patient.id}`" class="mt-3 inline-block text-sm font-medium text-sky-700 hover:underline">
          Ver detalle
        </RouterLink>
      </article>
    </div>

    <BaseTable v-if="filteredPatients.length" class="hidden md:block">
      <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
        <tr>
          <th class="px-4 py-3">Paciente</th>
          <th class="px-4 py-3">Documento</th>
          <th class="px-4 py-3">Telefono</th>
          <th class="px-4 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="patient in filteredPatients"
          :key="patient.id"
          class="border-t border-slate-100 text-sm text-slate-700"
        >
          <td class="px-4 py-3">{{ patient.firstName }} {{ patient.lastName }}</td>
          <td class="px-4 py-3">{{ patient.documentType }} - {{ patient.documentNumber }}</td>
          <td class="px-4 py-3">{{ patient.phone || '-' }}</td>
          <td class="px-4 py-3">
            <RouterLink :to="`/patients/${patient.id}`" class="text-sky-700 hover:underline">Ver detalle</RouterLink>
          </td>
        </tr>
      </tbody>
    </BaseTable>

    <div class="flex justify-center" v-if="patientStore.hasMore">
      <BaseButton variant="secondary" :disabled="patientStore.loading" @click="loadMore">
        Cargar mas
      </BaseButton>
    </div>
  </div>
</template>
