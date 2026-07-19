import { createRouter, createWebHashHistory, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore, useClinicStore } from '@/stores'
import type { ClinicRole } from '@/types'

const DEMO_EMAIL = 'dental@mentor.com'
const allowDemoLogin = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true'

function isDemoUserEmail(email: string | null | undefined) {
  return allowDemoLogin && email === DEMO_EMAIL
}

function isRootEmail(email: string | null | undefined) {
  return email === DEMO_EMAIL
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresClinic?: boolean
    allowedRoles?: ClinicRole[]
  }
}

const router = createRouter({
  history:
    typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')
      ? createWebHashHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/register', component: () => import('@/views/RegisterView.vue') },
    { path: '/forgot-password', component: () => import('@/views/ForgotPasswordView.vue') },
    {
      path: '/verify-email',
      component: () => import('@/views/VerifyEmailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-clinic',
      component: () => import('@/views/CreateClinicView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/select-clinic',
      component: () => import('@/views/SelectClinicView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { requiresAuth: true, requiresClinic: true },
        },
        {
          path: 'patients',
          component: () => import('@/views/PatientsView.vue'),
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist', 'receptionist', 'assistant'],
          },
        },
        {
          path: 'patients/new',
          component: () => import('@/views/PatientCreateView.vue'),
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist', 'receptionist'],
          },
        },
        {
          path: 'patients/:id',
          component: () => import('@/views/PatientDetailView.vue'),
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist', 'receptionist', 'assistant'],
          },
        },
        {
          path: 'appointments',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Citas' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist', 'receptionist', 'assistant'],
          },
        },
        {
          path: 'clinical-history/:patientId',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Historia Clinica' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist'],
          },
        },
        {
          path: 'odontogram/:patientId',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Odontograma' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist'],
          },
        },
        {
          path: 'treatment-plans',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Planes de Tratamiento' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'dentist'],
          },
        },
        {
          path: 'payments',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Pagos' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin', 'receptionist'],
          },
        },
        {
          path: 'team',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Usuarios y Permisos' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin'],
          },
        },
        {
          path: 'settings',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Configuracion de Clinica' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin'],
          },
        },
        {
          path: 'subscription',
          component: () => import('@/views/ModulePendingView.vue'),
          props: { title: 'Suscripciones' },
          meta: {
            requiresAuth: true,
            requiresClinic: true,
            allowedRoles: ['clinicAdmin'],
          },
        },
      ],
    },
  ],
})

function waitForAuthReady(): Promise<void> {
  const authStore = useAuthStore()
  if (authStore.authReady) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (authStore.authReady) {
        clearInterval(timer)
        resolve()
      }
    }, 50)
  })
}

function routeNeedsClinic(route: RouteLocationNormalized) {
  return route.meta.requiresClinic === true
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const clinicStore = useClinicStore()

  await waitForAuthReady()

  if (!to.meta.requiresAuth) {
    if (authStore.currentUser && (to.path === '/login' || to.path === '/register')) {
      return '/dashboard'
    }
    return true
  }

  if (!authStore.currentUser) {
    return '/login'
  }

  if (!authStore.currentUser.emailVerified && !isDemoUserEmail(authStore.currentUser.email) && to.path !== '/verify-email') {
    return '/verify-email'
  }

  if (!authStore.userProfile) {
    await authStore.loadUserProfile(authStore.currentUser.uid)
  }

  if (routeNeedsClinic(to)) {
    if (isRootEmail(authStore.currentUser.email)) {
      if (!clinicStore.availableClinics.length) {
        await clinicStore.loadUserClinics()
      }

      if (!clinicStore.activeClinicId) {
        return '/select-clinic'
      }

      return true
    }

    if (!clinicStore.availableClinics.length) {
      await clinicStore.loadUserClinics()
    }

    if (!clinicStore.activeClinicId) {
      return '/select-clinic'
    }

    const role = clinicStore.activeRole
    if (!role) {
      return '/select-clinic'
    }

    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(role)) {
      return '/dashboard'
    }
  }

  return true
})

export default router
