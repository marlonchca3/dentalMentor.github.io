<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'

const summary = {
  todayAppointments: 12,
  totalPatients: 248,
  monthlyIncome: 18450,
  pendingPayments: 6230,
}

const upcomingAppointments = [
  { id: '1', hour: '09:00', patientName: 'Ana Lopez', dentistName: 'Dr. Perez', status: 'confirmed' },
  { id: '2', hour: '10:30', patientName: 'Carlos Ruiz', dentistName: 'Dra. Silva', status: 'scheduled' },
  { id: '3', hour: '11:45', patientName: 'Maria Torres', dentistName: 'Dr. Perez', status: 'scheduled' },
]

const latestPayments = [
  { id: '1', patientName: 'Pedro Gomez', amount: 250, method: 'card' },
  { id: '2', patientName: 'Juana Vega', amount: 180, method: 'cash' },
  { id: '3', patientName: 'Luis Herrera', amount: 320, method: 'transfer' },
]
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-sm text-slate-600">Resumen general de la clinica.</p>
    </header>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <BaseCard>
        <p class="text-sm text-slate-500">Citas de hoy</p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.todayAppointments }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-slate-500">Pacientes registrados</p>
        <p class="mt-2 text-2xl font-bold text-slate-900">{{ summary.totalPatients }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-slate-500">Ingresos del mes</p>
        <p class="mt-2 text-2xl font-bold text-slate-900">S/ {{ summary.monthlyIncome.toLocaleString('es-PE') }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-slate-500">Pagos pendientes</p>
        <p class="mt-2 text-2xl font-bold text-amber-700">S/ {{ summary.pendingPayments.toLocaleString('es-PE') }}</p>
      </BaseCard>
    </section>

    <section class="grid gap-4 xl:grid-cols-2">
      <BaseCard>
        <h2 class="text-lg font-semibold text-slate-900">Proximas citas</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in upcomingAppointments"
            :key="item.id"
            class="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="font-medium text-slate-900">{{ item.patientName }}</p>
              <p class="text-xs text-slate-600">{{ item.hour }} - {{ item.dentistName }}</p>
            </div>
            <span class="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800">{{ item.status }}</span>
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <h2 class="text-lg font-semibold text-slate-900">Ultimos pagos</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="payment in latestPayments"
            :key="payment.id"
            class="flex flex-col gap-1 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="font-medium text-slate-900">{{ payment.patientName }}</p>
              <p class="text-xs text-slate-600">Metodo: {{ payment.method }}</p>
            </div>
            <p class="font-semibold text-emerald-700">S/ {{ payment.amount.toFixed(2) }}</p>
          </li>
        </ul>
      </BaseCard>
    </section>
  </div>
</template>
