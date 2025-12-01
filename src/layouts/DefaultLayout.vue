<template>
  <div class="flex min-h-dvh flex-col">
    <SiteNav />

    <!-- 主要內容 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      v-if="!hideFooter"
      class="border-t border-gray-200 px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8"
    >
      © {{ year }} ParcelHub — All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import SiteNav from "@/components/SiteNav.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const year = new Date().getFullYear();
const route = useRoute();

// 允許在特定頁面關掉 footer（例如 Login）
const hideFooter = computed(() => route.meta.hideFooter === true);
</script>
