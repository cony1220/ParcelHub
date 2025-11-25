<template>
  <section class="py-16 text-center">
    <!-- Hero -->
    <h1 class="mb-2 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
      Parcel management,<br class="hidden sm:block" />
      made effortless
    </h1>

    <p class="mb-4 text-base text-black/70 sm:text-lg">登記、查詢、取件，簡單又迅速。</p>

    <button
      @click="go"
      class="bg-olive-700 hover:bg-olive-800 active:bg-olive-900 focus-visible:ring-olive-600 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {{ ctaLabel }}
    </button>

    <!-- Visual / Hero Image with decorative shapes -->
    <div class="relative mx-auto mt-10 flex justify-center sm:mt-12">
      <!-- 背景綠色 -->
      <div
        class="bg-olive-300/80 absolute bottom-0 left-1/2 -z-10 h-70 w-[92%] -translate-x-1/2 rounded-3xl md:w-[85%]"
      ></div>

      <!-- 圖片外框（黑色邊、圓角） -->

      <div
        class="w-full max-w-none overflow-hidden rounded-xl border-[6px] border-black shadow-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
      >
        <div class="aspect-[16/9]">
          <img :src="heroUrl" alt="Parcel hero" class="block h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </section>

  <!-- 主要功能（兩欄） -->
  <section class="mx-auto max-w-5xl px-6 py-12">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <!-- 櫃台快速登記與取件 -->
      <article class="flex gap-4">
        <div class="h-24 w-28 rounded-lg bg-gray-200/80"></div>
        <div>
          <div class="mb-1 flex items-center gap-2">
            <span class="text-lg font-semibold">櫃台快速登記與取件</span>
          </div>
          <p class="text-sm text-gray-600">
            以託運單號即時登記包裹，一鍵確認取件並留下紀錄；支援搜尋與備註，流程順、追蹤清楚。
          </p>
        </div>
      </article>

      <!-- 住戶查詢與狀態追蹤 -->
      <article class="flex gap-4">
        <div class="h-24 w-28 rounded-lg bg-gray-200/80"></div>
        <div>
          <div class="mb-1 flex items-center gap-2">
            <span class="text-lg font-semibold">住戶查詢與狀態追蹤</span>
          </div>
          <p class="text-sm text-gray-600">
            住戶可即時查看自己的包裹清單與狀態，支援依單號／物流／備註搜尋，避免漏領與重複詢問。
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import heroUrl from "@/assets/homepage/hero.jpg";

const router = useRouter();
const auth = useAuthStore();
const { isAuthenticated, role } = storeToRefs(auth);

const ctaLabel = computed(() =>
  !isAuthenticated.value
    ? "Log in"
    : role.value === "admin"
      ? "Admin console"
      : role.value === "guard"
        ? "Front desk intake"
        : "View my parcels",
);

function go() {
  if (!isAuthenticated.value) return router.push("/login");
  if (role.value === "admin") return router.push("/admin/users");
  if (role.value === "guard") return router.push("/guard/parcels/new");
  return router.push("/parcels");
}
</script>
