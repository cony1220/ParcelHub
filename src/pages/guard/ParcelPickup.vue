<template>
  <section class="p-4">
    <h2>取件作業</h2>
    <p>輸入託運單號進行領取。</p>
    <form @submit.prevent="pickup" class="space-y-2">
      <input v-model="trackingNo" placeholder="例如 TAO-0012345" required />
      <button :disabled="loading">{{ loading ? "處理中…" : "確認領取" }}</button>
    </form>
    <p v-if="msg" :style="{ marginTop: '8px', color: ok ? 'green' : 'crimson' }">{{ msg }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ParcelsAPI } from "@/api/parcels";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const trackingNo = ref("");
const loading = ref(false);
const msg = ref("");
const ok = ref(false);
async function pickup() {
  loading.value = true;
  msg.value = "";
  ok.value = false;
  try {
    await ParcelsAPI.pickup(trackingNo.value.trim(), auth.userName || "guard");
    ok.value = true;
    msg.value = "領取完成";
    trackingNo.value = "";
  } catch (e: any) {
    msg.value = e?.message || "領取失敗";
  } finally {
    loading.value = false;
  }
}
</script>
