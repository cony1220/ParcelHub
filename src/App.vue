<template>
  <component :is="layoutComp"><RouterView /></component>
</template>
<script setup lang="ts">
import { computed } from "vue";
// import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
// import GuardLayout from "@/layouts/GuardLayout.vue";
// import AdminLayout from "@/layouts/AdminLayout.vue";
// const route = useRoute();
// const layoutComp = computed(() =>
//   route.meta.layout === "guard"
//     ? GuardLayout
//     : route.meta.layout === "admin"
//       ? AdminLayout
//       : DefaultLayout,
// );
const layoutComp = computed(() => DefaultLayout);
</script>
