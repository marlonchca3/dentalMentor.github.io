import type { ClinicRole } from './auth'

export type ClinicStatus = 'active' | 'inactive'
export type SubscriptionPlan = 'trial' | 'basic' | 'professional' | 'clinic'

export interface Clinic {
  id: string
  name: string
  slug: string
  logoUrl: string
  phone: string
  email: string
  address: string
  district: string
  city: string
  country: string
  status: ClinicStatus
  subscriptionPlan: SubscriptionPlan
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}

export interface ClinicUser {
  id: string
  clinicId: string
  userId: string
  role: ClinicRole
  status: 'active' | 'invited' | 'inactive'
  invitedBy: string
  createdAt: unknown
  updatedAt: unknown
}

export interface CreateClinicPayload {
  name: string
  slug: string
  phone: string
  email: string
  address: string
  district: string
  city: string
  country: string
}
