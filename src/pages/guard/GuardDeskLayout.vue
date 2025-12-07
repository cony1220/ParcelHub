<!-- src/pages/guard/GuardDeskLayout.vue -->
<template>
  <section class="py-6">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <header class="mb-4">
        <h1 class="font-serif text-2xl font-extrabold">櫃台</h1>
        <p class="mt-1 text-black/60">登記包裹與現場取件作業</p>

        <!-- 共用分頁 -->
        <nav class="mt-4 inline-flex overflow-hidden rounded-md border">
          <RouterLink
            to="/guard/parcels/new"
            class="px-3 py-1.5 text-sm"
            :class="isActive('/guard/parcels/new') ? act : idle"
          >
            櫃台登記
          </RouterLink>
          <RouterLink
            to="/guard/parcels/pickup"
            class="px-3 py-1.5 text-sm"
            :class="isActive('/guard/parcels/pickup') ? act : idle"
          >
            櫃台取件
          </RouterLink>
        </nav>
      </header>

      <!-- 子頁會被渲染在這裡 -->
      <RouterView />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();

// 作用中/未作用樣式（Tailwind）
const act = "bg-olive-700 text-white";
const idle = "bg-white hover:bg-slate-50";

// 高亮邏輯：以 startsWith 判斷巢狀路徑
function isActive(path: string) {
  return route.path.startsWith(path);
}
</script>
