<template>
  <section class="p-10 text-center">
    <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px">
      Parcel management, made effortless
    </h1>
    <p style="opacity: 0.8; margin-bottom: 16px">登記、查詢、取件，簡單又迅速。</p>
    <button @click="go" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 8px">
      {{ ctaLabel }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

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
