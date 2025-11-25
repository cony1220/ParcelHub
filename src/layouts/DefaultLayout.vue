<template>
  <div class="min-h-screen">
    <SiteNav />
    <!-- 同樣移除 container-app，改用固定 padding -->
    <main class="px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
    <!-- Footer -->
    <footer
      class="border-t border-gray-200 px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8"
    >
      © {{ year }} ParcelHub — All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import SiteNav from "@/components/SiteNav.vue";
const year = new Date().getFullYear();
</script>
