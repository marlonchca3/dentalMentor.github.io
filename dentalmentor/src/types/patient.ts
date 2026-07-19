export interface Patient {
  id: string
  clinicId: string
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  birthDate: string
  gender: string
  phone: string
  email: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  allergies: string
  medicalConditions: string
  medications: string
  notes: string
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}

export interface CreatePatientPayload {
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  birthDate: string
  gender: string
  phone: string
  email: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  allergies: string
  medicalConditions: string
  medications: string
  notes: string
}
