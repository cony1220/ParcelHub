<script setup lang="ts">
export type Link = { label: string; to: string };

const props = defineProps<{
  items: ReadonlyArray<Link>;
  variant?: "desktop" | "drawer";
}>();

const isDesktop = props.variant === "desktop";
const ulClass = isDesktop
  ? "hidden md:flex items-center gap-4" // 桌面水平
  : "space-y-1 p-2"; // 抽屜垂直
const linkClass = isDesktop
  ? "text-sm text-slate-700 hover:text-slate-900"
  : "block rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-50";
</script>

<template>
  <ul :class="ulClass">
    <li v-for="item in items" :key="item.to">
      <RouterLink :to="item.to" :class="linkClass"
        ><slot name="label" :item="item">{{ item.label }}</slot></RouterLink
      >
    </li>
    <li><slot name="tail" /></li>
  </ul>
</template>
