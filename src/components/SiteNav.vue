<template>
  <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
    <!-- 1) 父層直接左右分布 -->
    <div class="relative flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Left: Logo -->
      <RouterLink to="/" class="font-bold">ParcelHub</RouterLink>

      <!-- Right: 漢堡（僅手機顯示） -->
      <button
        ref="btnRef"
        class="focus-visible:ring-olive-600 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 md:hidden"
        @click="open = !open"
        :aria-expanded="String(open)"
        aria-haspopup="menu"
        aria-label="Open menu"
      >
        <img :src="menuIcon" alt="menu" class="h-5 w-5" />
      </button>

      <!-- 2) 一份清單：md+ 顯示為水平列；手機是右上角下拉 -->
      <ul
        ref="menuRef"
        :class="[
          // 手機下拉（絕對定位，貼右）
          open ? 'block' : 'hidden',
          'absolute top-full right-0 mt-2 w-56 rounded-md border bg-white p-2 shadow',
          // md+ 改成水平列（恢復到文流、顯示 flex）
          'md:static md:mt-0 md:flex md:w-auto md:items-center md:gap-4 md:border-0 md:bg-transparent md:p-0 md:shadow-none',
        ]"
      >
        <li v-for="item in menuItems" :key="item.to">
          <RouterLink
            @click="close"
            :to="item.to"
            class="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 md:px-0 md:py-0 md:hover:bg-transparent md:hover:text-slate-900"
          >
            {{ item.label }}
          </RouterLink>
        </li>

        <li>
          <button
            v-if="!authed"
            @click="goLoginAndClose"
            class="bg-olive-700 hover:bg-olive-800 active:bg-olive-900 focus-visible:ring-olive-600 inline-flex w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-auto"
          >
            Log in
          </button>
          <button
            v-else
            @click="logoutAndClose"
            class="bg-olive-700 hover:bg-olive-800 active:bg-olive-900 focus-visible:ring-olive-600 inline-flex w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-auto"
          >
            Log out
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import menuIcon from "@/assets/icons/menu.png";

type Role = "resident" | "guard" | "admin";
type Link = { label: string; to: string; roles: readonly Role[] };

const LINKS = [
  { label: "我的包裹", to: "/parcels", roles: ["resident"] },
  { label: "櫃台", to: "/guard/parcels/new", roles: ["guard", "admin"] },
  { label: "管理", to: "/admin/users", roles: ["admin"] },
] as const satisfies ReadonlyArray<Link>;

const router = useRouter();
const auth = useAuthStore();
const { isAuthenticated, role } = storeToRefs(auth);

const authed = computed(() => isAuthenticated.value);
const menuItems = computed<ReadonlyArray<Link>>(() =>
  authed.value ? LINKS.filter((l) => l.roles.includes(role.value as Role)) : [],
);

function goLogin() {
  router.push("/login");
}
function logout() {
  auth.logout();
}

const open = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const btnRef = ref<HTMLElement | null>(null);
function close() {
  open.value = false;
}
function goLoginAndClose() {
  goLogin();
  close();
}
function logoutAndClose() {
  logout();
  close();
}

function onDocClick(e: MouseEvent) {
  if (!open.value) return;
  const t = e.target as Node;
  if (menuRef.value?.contains(t) || btnRef.value?.contains(t)) return;
  open.value = false;
}
onMounted(() => window.addEventListener("click", onDocClick));
onBeforeUnmount(() => window.removeEventListener("click", onDocClick));
</script>
