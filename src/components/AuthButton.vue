<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

defineProps<{ block?: boolean }>();
const emit = defineEmits<{ (e: "clicked"): void }>();
const router = useRouter();
const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);
function onClick() {
  if (!isAuthenticated.value) router.push("/login");
  else auth.logout();
  emit("clicked");
}
</script>

<template>
  <button
    @click="onClick"
    :class="[
      'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium',
      'bg-olive-700 hover:bg-olive-800 focus-visible:ring-olive-600 text-white focus-visible:ring-2',
      block ? 'w-full' : 'w-auto',
    ]"
  >
    {{ isAuthenticated ? "Log out" : "Log in" }}
  </button>
</template>
