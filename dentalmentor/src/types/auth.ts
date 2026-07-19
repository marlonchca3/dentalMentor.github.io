export type PlatformRole = 'superAdmin' | 'user'

export type ClinicRole =
  | 'clinicAdmin'
  | 'dentist'
  | 'receptionist'
  | 'assistant'

export interface UserProfile {
  uid: string
  fullName: string
  email: string
  phone: string
  avatarUrl: string
  platformRole: PlatformRole
  active: boolean
  createdAt: unknown
  updatedAt: unknown
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterPayload extends AuthCredentials {
  fullName: string
  phone?: string
}
