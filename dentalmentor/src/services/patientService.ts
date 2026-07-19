import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CreatePatientPayload, PaginatedResult, Patient } from '@/types'

const PAGE_SIZE = 10

export async function createPatient(clinicId: string, userId: string, payload: CreatePatientPayload) {
  await addDoc(collection(db, 'patients'), {
    clinicId,
    ...payload,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function getPatientById(patientId: string): Promise<Patient | null> {
  const snapshot = await getDoc(doc(db, 'patients', patientId))
  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Patient, 'id'>),
  }
}

export async function listPatients(
  clinicId: string,
  lastVisible?: DocumentSnapshot,
): Promise<PaginatedResult<Patient> & { cursor: DocumentSnapshot | null }> {
  const baseQuery = query(
    collection(db, 'patients'),
    where('clinicId', '==', clinicId),
    orderBy('createdAt', 'desc'),
    limit(PAGE_SIZE),
  )

  const queryWithCursor = lastVisible
    ? query(
        collection(db, 'patients'),
        where('clinicId', '==', clinicId),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE),
      )
    : baseQuery

  const snapshot = await getDocs(queryWithCursor)

  const data = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<Patient, 'id'>),
  }))

  const nextCursor = snapshot.docs.at(-1) ?? null

  return {
    data,
    lastVisibleId: nextCursor?.id ?? null,
    cursor: nextCursor,
  }
}
