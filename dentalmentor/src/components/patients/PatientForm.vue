<script setup lang="ts">
import { reactive } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { CreatePatientPayload } from '@/types'

const emit = defineEmits<{ submit: [payload: CreatePatientPayload] }>()

const form = reactive<CreatePatientPayload>({
  firstName: '',
  lastName: '',
  documentType: 'dni',
  documentNumber: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  allergies: '',
  medicalConditions: '',
  medications: '',
  notes: '',
})

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="grid gap-4 md:grid-cols-2" @submit.prevent="onSubmit">
    <BaseInput v-model="form.firstName" label="Nombres" required />
    <BaseInput v-model="form.lastName" label="Apellidos" required />
    <BaseSelect
      v-model="form.documentType"
      label="Tipo de documento"
      :options="[
        { label: 'DNI', value: 'dni' },
        { label: 'Pasaporte', value: 'passport' },
        { label: 'CE', value: 'ce' },
      ]"
    />
    <BaseInput v-model="form.documentNumber" label="Numero de documento" required />
    <BaseInput v-model="form.birthDate" label="Fecha de nacimiento" type="date" />
    <BaseSelect
      v-model="form.gender"
      label="Genero"
      :options="[
        { label: 'Femenino', value: 'female' },
        { label: 'Masculino', value: 'male' },
        { label: 'Otro', value: 'other' },
      ]"
    />
    <BaseInput v-model="form.phone" label="Telefono" />
    <BaseInput v-model="form.email" label="Correo" type="email" />
    <BaseInput v-model="form.address" label="Direccion" />
    <BaseInput v-model="form.emergencyContactName" label="Contacto de emergencia" />
    <BaseInput v-model="form.emergencyContactPhone" label="Telefono de emergencia" />
    <BaseInput v-model="form.allergies" label="Alergias" />
    <BaseInput v-model="form.medicalConditions" label="Condiciones medicas" />
    <BaseInput v-model="form.medications" label="Medicaciones" />
    <div class="md:col-span-2">
      <label class="mb-2 block text-sm text-slate-700">Notas</label>
      <textarea
        v-model="form.notes"
        rows="4"
        class="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-200 focus:ring"
      />
    </div>
    <div class="md:col-span-2 flex justify-end">
      <BaseButton type="submit">Guardar paciente</BaseButton>
    </div>
  </form>
</template>
