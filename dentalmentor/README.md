# DentalMentor - Fase 1

SaaS multiempresa para clinicas odontologicas construido con Vue 3, Vite, TypeScript, Pinia, Vue Router y Firebase.

## Stack

- Vue 3 + Composition API + script setup
- TypeScript estricto
- Pinia
- Vue Router
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting
- Firebase Cloud Functions (callable para creacion segura de clinica)

## Modulos implementados en esta fase

- Autenticacion (registro, login, logout, recuperar password, verificacion de correo)
- Perfil de usuario (`users`)
- Registro de clinica (`clinics`)
- Relacion `clinicUsers`
- Seleccion de clinica activa
- Layout principal responsive
- Dashboard con datos simulados
- Modulo de pacientes (`patients`) con listado y registro
- Reglas iniciales de Firestore y Storage
- Indices iniciales para consultas por `clinicId`

## Estructura principal

```txt
src/
	components/
	composables/
	layouts/
	lib/
	modules/
	router/
	services/
	stores/
	types/
	utils/
	views/
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_CLINIC_CREATION_FUNCTION=true
```

## Configuracion Firebase

Archivos incluidos:

- `src/lib/firebase.ts`
- `firestore.rules`
- `storage.rules`
- `firestore.indexes.json`
- `firebase.json`
- `.firebaserc.example`
- `functions/src/index.ts`

## Correr el proyecto

```bash
npm install
npm run dev
```

## Despliegue de reglas e indices

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Despliegue de Cloud Function segura

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

La callable `createClinicAndAssignAdmin` crea la clinica y el `clinicUsers/{clinicId_userId}` con rol `clinicAdmin` de forma atomica.

## Flujo recomendado de prueba

1. Registrar usuario en `/register`.
2. Verificar correo en `/verify-email`.
3. Crear clinica en `/create-clinic`.
4. Seleccionar clinica en `/select-clinic`.
5. Ir a `/dashboard`.
6. Registrar paciente en `/patients/new`.

## Notas de seguridad

- Toda lectura/escritura clinica valida membresia en `clinicUsers`.
- Las reglas bloquean separacion entre tenants por `clinicId`.
- `clinicUsers` de alta criticidad se protege para creacion via backend.
- Los documentos clinicos en Storage son privados por rol.

## Pendiente para fases siguientes

- Odontograma funcional completo.
- Pagos reales y reportes financieros completos.
- Suscripciones automaticas.
- Inventario.
- Integraciones externas.
