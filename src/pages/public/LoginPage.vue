<template>
  <!-- 全版背景圖 -->
  <section
    class="relative min-h-screen bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgUrl})` }"
  >
    <!-- 置中容器（加些內距避免貼邊） -->
    <div class="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <!-- 登入卡片 -->
      <div class="w-full max-w-md rounded-2xl border bg-white/95 p-6 shadow-lg backdrop-blur">
        <header class="mb-4 text-center">
          <h1 class="font-serif text-2xl font-extrabold">Welcome back</h1>
          <p class="mt-1 text-black/70">請使用您的帳號登入以繼續</p>
        </header>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label for="username" class="mb-1 block text-sm font-medium">帳號</label>
            <input
              id="username"
              v-model.trim="form.username"
              type="text"
              autocomplete="username"
              required
              :disabled="loading"
              class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium">密碼</label>
            <input
              id="password"
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              autocomplete="current-password"
              required
              :disabled="loading"
              class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
            <button
              type="button"
              class="mt-1 text-xs text-black/60 hover:text-black"
              @click="showPwd = !showPwd"
            >
              {{ showPwd ? "隱藏密碼" : "顯示密碼" }}
            </button>
          </div>

          <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="bg-olive-700 hover:bg-olive-800 active:bg-olive-900 focus-visible:ring-olive-600 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2"
          >
            <span v-if="!loading">Log in</span>
            <span v-else class="opacity-80">Signing in…</span>
          </button>
        </form>

        <!-- Demo 帳號（需要就留） -->
        <details class="mt-5 text-sm">
          <summary class="cursor-pointer select-none">查看示範帳號</summary>
          <ul class="mt-2 space-y-1 text-black/70">
            <li>住戶：<code class="rounded bg-black/5 px-1">amy / pass</code></li>
            <li>警衛：<code class="rounded bg-black/5 px-1">guard / pass</code></li>
            <li>管理：<code class="rounded bg-black/5 px-1">admin / pass</code></li>
          </ul>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import bgUrl from "@/assets/backgrounds/auth-login-bg.jpg";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const { role } = storeToRefs(auth);

const form = reactive({ username: "", password: "" });
const loading = ref(false);
const errorMsg = ref("");
const showPwd = ref(false);

async function onSubmit() {
  if (loading.value) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    await auth.login({ username: form.username, password: form.password });
    const redirect = (route.query.redirect as string | undefined) ?? "";
    if (redirect) return router.replace(redirect);
    if (role.value === "admin") router.replace("/admin/users");
    else if (role.value === "guard") router.replace("/guard/parcels/new");
    else router.replace("/parcels");
  } catch (e: any) {
    errorMsg.value = e?.message ?? "登入失敗，請檢查帳密";
  } finally {
    loading.value = false;
  }
}
</script>
