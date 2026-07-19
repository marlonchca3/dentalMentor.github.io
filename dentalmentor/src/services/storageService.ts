import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export async function uploadPatientDocument(
  clinicId: string,
  patientId: string,
  file: File,
  fileName: string,
): Promise<{ storagePath: string; downloadUrl: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato de archivo no permitido.')
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('El archivo supera el limite de 5 MB.')
  }

  const storagePath = `clinics/${clinicId}/patients/${patientId}/documents/${fileName}`
  const storageRef = ref(storage, storagePath)

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  })

  const downloadUrl = await getDownloadURL(storageRef)
  return { storagePath, downloadUrl }
}
