import { httpsCallable } from 'firebase/functions'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db, functions } from '@/lib/firebase'
import type { Clinic, ClinicRole, ClinicUser, CreateClinicPayload } from '@/types'

const ROOT_EMAIL = 'dental@mentor.com'

function isRootEmail(email?: string | null) {
  return email === ROOT_EMAIL
}

interface CreateClinicSecureResponse {
  clinicId: string
}

const callCreateClinicSecure = httpsCallable<CreateClinicPayload, CreateClinicSecureResponse>(
  functions,
  'createClinicAndAssignAdmin',
)

export async function createClinic(payload: CreateClinicPayload, userId: string): Promise<string> {
  const shouldUseFunction = import.meta.env.VITE_USE_CLINIC_CREATION_FUNCTION !== 'false'

  if (shouldUseFunction) {
    const result = await callCreateClinicSecure(payload)
    return result.data.clinicId
  }

  const clinicsRef = collection(db, 'clinics')

  const existingSlug = await getDocs(query(clinicsRef, where('slug', '==', payload.slug)))
  if (!existingSlug.empty) {
    throw new Error('El slug de la clinica ya esta en uso.')
  }

  const clinicRef = doc(clinicsRef)
  const membershipRef = doc(db, 'clinicUsers', `${clinicRef.id}_${userId}`)

  await setDoc(clinicRef, {
    ...payload,
    logoUrl: '',
    status: 'active',
    subscriptionPlan: 'trial',
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  try {
    await setDoc(membershipRef, {
      clinicId: clinicRef.id,
      userId,
      role: 'clinicAdmin',
      status: 'active',
      invitedBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    await deleteDoc(clinicRef)
    throw error
  }

  return clinicRef.id
}

export async function getUserClinics(
  userId: string,
  userEmail?: string | null,
): Promise<Array<{ clinic: Clinic; role: ClinicRole }>> {
  if (isRootEmail(userEmail)) {
    const clinicsSnapshot = await getDocs(collection(db, 'clinics'))
    return clinicsSnapshot.docs.map((clinicDoc) => ({
      clinic: {
        id: clinicDoc.id,
        ...(clinicDoc.data() as Omit<Clinic, 'id'>),
      },
      role: 'clinicAdmin' as ClinicRole,
    }))
  }

  const memberships = await getDocs(
    query(collection(db, 'clinicUsers'), where('userId', '==', userId), where('status', '==', 'active')),
  )

  const results = await Promise.all(
    memberships.docs.map(async (membershipDoc) => {
      const membership = membershipDoc.data() as ClinicUser
      const clinicSnapshot = await getDoc(doc(db, 'clinics', membership.clinicId))
      if (!clinicSnapshot.exists()) {
        return null
      }

      const clinic = {
        id: clinicSnapshot.id,
        ...(clinicSnapshot.data() as Omit<Clinic, 'id'>),
      }

      return {
        clinic,
        role: membership.role,
      }
    }),
  )

  return results.filter((item): item is { clinic: Clinic; role: ClinicRole } => item !== null)
}

export async function validateClinicMembership(
  clinicId: string,
  userId: string,
  userEmail?: string | null,
): Promise<ClinicRole | null> {
  if (isRootEmail(userEmail)) {
    const clinicSnapshot = await getDoc(doc(db, 'clinics', clinicId))
    return clinicSnapshot.exists() ? 'clinicAdmin' : null
  }

  const membership = await getDoc(doc(db, 'clinicUsers', `${clinicId}_${userId}`))
  if (!membership.exists()) {
    return null
  }

  const data = membership.data() as ClinicUser
  if (data.status !== 'active') {
    return null
  }

  return data.role
}

export async function inviteUserToClinic(
  clinicId: string,
  invitedBy: string,
  userId: string,
  role: ClinicRole,
) {
  await setDoc(doc(db, 'clinicUsers', `${clinicId}_${userId}`), {
    clinicId,
    userId,
    role,
    status: 'invited',
    invitedBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
