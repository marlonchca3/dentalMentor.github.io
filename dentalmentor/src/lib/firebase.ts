import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore, Timestamp, serverTimestamp } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'

const fallbackFirebaseConfig = {
  apiKey: 'AIzaSyAIXmbt-i9xpVI_afHF_7xA3M-GxOiRZqo',
  authDomain: 'dentalmentor-3ff9b.firebaseapp.com',
  projectId: 'dentalmentor-3ff9b',
  storageBucket: 'dentalmentor-3ff9b.firebasestorage.app',
  messagingSenderId: '1015871013974',
  appId: '1:1015871013974:web:cb5102ced7e87d6c6867f7',
  measurementId: 'G-HT4YFCZJ9W',
} as const

type FirebaseEnvKey =
  | 'VITE_FIREBASE_API_KEY'
  | 'VITE_FIREBASE_AUTH_DOMAIN'
  | 'VITE_FIREBASE_PROJECT_ID'
  | 'VITE_FIREBASE_STORAGE_BUCKET'
  | 'VITE_FIREBASE_MESSAGING_SENDER_ID'
  | 'VITE_FIREBASE_APP_ID'

const missingEnv: FirebaseEnvKey[] = []

const getEnvOrFallback = (envName: FirebaseEnvKey, fallbackValue: string) => {
  const envValue = import.meta.env[envName]
  if (!envValue) {
    missingEnv.push(envName)
    return fallbackValue
  }

  return envValue
}

const firebaseConfig = {
  apiKey: getEnvOrFallback('VITE_FIREBASE_API_KEY', fallbackFirebaseConfig.apiKey),
  authDomain: getEnvOrFallback('VITE_FIREBASE_AUTH_DOMAIN', fallbackFirebaseConfig.authDomain),
  projectId: getEnvOrFallback('VITE_FIREBASE_PROJECT_ID', fallbackFirebaseConfig.projectId),
  storageBucket: getEnvOrFallback('VITE_FIREBASE_STORAGE_BUCKET', fallbackFirebaseConfig.storageBucket),
  messagingSenderId: getEnvOrFallback('VITE_FIREBASE_MESSAGING_SENDER_ID', fallbackFirebaseConfig.messagingSenderId),
  appId: getEnvOrFallback('VITE_FIREBASE_APP_ID', fallbackFirebaseConfig.appId),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackFirebaseConfig.measurementId,
}

if (missingEnv.length) {
  console.warn(`Variables VITE faltantes: ${missingEnv.join(', ')}. Se usara configuracion fallback de Firebase.`)
}

const app = initializeApp(firebaseConfig)
export let analytics: Analytics | null = null

if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app)
      }
    })
    .catch(() => {
      analytics = null
    })
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

export { Timestamp, serverTimestamp }
