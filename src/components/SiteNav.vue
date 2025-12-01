<template>
  <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
    <div class="relative flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="font-bold">ParcelHub</RouterLink>

      <template v-if="!hideNavActions">
        <!-- 桌面選單（用 MainMenu，一行搞定） -->
        <MainMenu :items="menuItems" variant="desktop">
          <template #tail><AuthButton /></template>
        </MainMenu>

        <!-- 漢堡（無外框） -->
        <button
          class="focus-visible:ring-olive-600 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-50 focus:outline-none focus-visible:ring-2 md:hidden"
          @click="open = true"
          aria-label="Open menu"
        >
          <img :src="menuIcon" class="pointer-events-none h-5 w-5" alt="" />
        </button>
      </template>
    </div>
  </header>

  <template v-if="!hideNavActions">
    <!-- 遮罩 -->
    <div v-show="open" class="fixed inset-0 z-50 bg-black/40" @click="close" />

    <!-- 右側抽屜 -->
    <aside
      role="dialog"
      aria-modal="true"
      class="fixed top-0 right-0 z-50 h-full w-72 max-w-[85%] border-l bg-white shadow-xl transition-transform duration-300 ease-out md:hidden"
      :class="open ? 'translate-x-0' : 'translate-x-full'"
      @keydown.esc="close"
    >
      <div class="flex h-14 items-center justify-between border-b px-4">
        <span class="font-semibold">Menu</span>
        <button
          class="focus-visible:ring-olive-600 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-50 focus-visible:ring-2"
          @click="close"
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current">
            <path
              d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3 10.6 10.6 16.9 4.3z"
            />
          </svg>
        </button>
      </div>

      <!-- 抽屜選單（同一個 MainMenu，樣式換 variant） -->
      <nav class="pt-2">
        <MainMenu :items="menuItems" variant="drawer">
          <template #tail
            ><div class="pt-2"><AuthButton block @clicked="close" /></div
          ></template>
        </MainMenu>
      </nav>
    </aside>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import MainMenu, { type Link as LinkType } from "@/components/MainMenu.vue";
import AuthButton from "@/components/AuthButton.vue";
import menuIcon from "@/assets/icons/menu.png";

type Role = "resident" | "guard" | "admin";
type Link = LinkType & { roles: readonly Role[] };

const LINKS: ReadonlyArray<Link> = [
  { label: "我的包裹", to: "/parcels", roles: ["resident"] },
  { label: "櫃台", to: "/guard/parcels/new", roles: ["guard", "admin"] },
  { label: "管理", to: "/admin/users", roles: ["admin"] },
];

/** 登入頁時隱藏選單所有操作（含抽屜、Login按鈕） */
const route = useRoute();
const hideNavActions = computed(() => route.meta.hideNavActions === true);

/** 只要切到登入頁就關抽屜，避免殘留 */
watch(
  () => route.name,
  (n) => {
    if (n === "Login") close();
  },
);

const auth = useAuthStore();
const { isAuthenticated, role } = storeToRefs(auth);
const authed = computed(() => isAuthenticated.value);
const menuItems = computed<ReadonlyArray<LinkType>>(() =>
  authed.value
    ? LINKS.filter((l) => l.roles.includes(role.value as Role)).map(({ label, to }) => ({
        label,
        to,
      }))
    : [],
);

const open = ref(false);
function close() {
  open.value = false;
}
watch(open, (v) => document.body.classList.toggle("overflow-hidden", v));

function onResize() {
  if (window.matchMedia("(min-width: 768px)").matches && open.value) close();
}
onMounted(() => window.addEventListener("resize", onResize));
onBeforeUnmount(() => window.removeEventListener("resize", onResize));
</script>
