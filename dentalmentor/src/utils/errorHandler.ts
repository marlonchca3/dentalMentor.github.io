import type { FirebaseError } from 'firebase/app'

const firebaseErrorMap: Record<string, string> = {
  'auth/email-already-in-use': 'Este correo ya esta en uso.',
  'auth/invalid-email': 'El correo electronico no es valido.',
  'auth/weak-password': 'La contrasena es muy debil.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'La contrasena no es correcta.',
  'auth/invalid-credential': 'Las credenciales no son validas.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta mas tarde.',
  'permission-denied': 'No tienes permisos para realizar esta accion.',
  'functions/not-found': 'La funcion segura no esta desplegada en Firebase.',
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return typeof error === 'object' && error !== null && 'code' in error
}

export function normalizeError(error: unknown): string {
  if (isFirebaseError(error)) {
    return firebaseErrorMap[error.code] ?? 'Ha ocurrido un error inesperado en Firebase.'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Ha ocurrido un error inesperado.'
}
