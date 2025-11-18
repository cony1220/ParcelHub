<template>
  <div class="flex min-h-screen flex-col">
    <SiteNav />
    <main class="p-4"><slot /></main>
  </div>
</template>
<script setup lang="ts">
import SiteNav from "@/components/SiteNav.vue";
</script>
