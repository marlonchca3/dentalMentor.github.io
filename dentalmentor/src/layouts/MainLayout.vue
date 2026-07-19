<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'

const menuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <MobileMenu :open="menuOpen" @close="menuOpen = false" />
    <div class="flex min-h-screen">
      <AppSidebar />
      <main class="flex-1">
        <AppHeader @toggle-menu="menuOpen = true" />
        <section class="p-4 lg:p-6">
          <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>
