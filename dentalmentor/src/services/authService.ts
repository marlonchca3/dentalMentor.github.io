import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, serverTimestamp } from '@/lib/firebase'
import type { RegisterPayload, UserProfile } from '@/types'

const ALLOWED_EMAIL = 'dental@mentor.com'

function validateAllowedEmail(email: string) {
  if (email !== ALLOWED_EMAIL) {
    throw new Error(`Solo se permite acceso con ${ALLOWED_EMAIL}`)
  }
}

export async function registerWithEmail(payload: RegisterPayload): Promise<User> {
  validateAllowedEmail(payload.email)
  
  const credentials = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
  await updateProfile(credentials.user, { displayName: payload.fullName })
  await sendEmailVerification(credentials.user)

  await setDoc(doc(db, 'users', credentials.user.uid), {
    uid: credentials.user.uid,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone ?? '',
    avatarUrl: '',
    platformRole: 'user',
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return credentials.user
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  validateAllowedEmail(email)
  
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  return credentials.user
}

export async function logoutSession() {
  await signOut(auth)
}

export async function resetUserPassword(email: string) {
  await sendPasswordResetEmail(auth, email)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', uid))

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data() as UserProfile
}
