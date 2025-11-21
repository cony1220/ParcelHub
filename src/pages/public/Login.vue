<template>
  <section class="max-w-md p-4">
    <h2>登入</h2>
    <form @submit.prevent="submit">
      <div><label>帳號</label><input v-model="username" required /></div>
      <div><label>密碼</label><input type="password" v-model="password" required /></div>
      <button :disabled="loading">{{ loading ? "登入中…" : "登入" }}</button>
      <p class="hint">
        測試：Admin <code>admin/pass</code> · 住戶 <code>amy/pass</code> · 警衛
        <code>g-alan/pass</code>
      </p>
      <p v-if="err" style="color: crimson; margin-top: 8px">{{ err }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { defaultRouteName } from "@/router/guards";
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const username = ref("");
const password = ref("");
const loading = ref(false);
const err = ref("");
async function submit() {
  err.value = "";
  loading.value = true;
  try {
    await auth.login({ username: username.value.trim(), password: password.value });
    const redirect =
      (route.query.redirect as string) ??
      router.resolve({ name: defaultRouteName(auth.role as any) }).href;
    router.replace(redirect);
  } catch (e: any) {
    err.value = e?.message || "登入失敗";
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
.hint {
  margin-top: 8px;
  opacity: 0.7;
}
</style>
