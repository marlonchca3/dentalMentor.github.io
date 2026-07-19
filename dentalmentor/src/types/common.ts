export interface PaginatedResult<T> {
  data: T[]
  lastVisibleId: string | null
}

export interface DashboardSummary {
  todayAppointments: number
  totalPatients: number
  monthlyIncome: number
  pendingPayments: number
}

export interface UpcomingAppointmentItem {
  id: string
  patientName: string
  hour: string
  dentistName: string
  status: 'scheduled' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' | 'noShow'
}
