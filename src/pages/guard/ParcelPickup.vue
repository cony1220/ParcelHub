<template>
  <section class="mx-auto max-w-3xl">
    <header class="mb-6">
      <h1 class="font-serif text-xl font-extrabold">包裹取件</h1>
      <p class="mt-1 text-black/60">輸入托運單號，立即完成取件登記。</p>
    </header>

    <form @submit.prevent="onPickup" class="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
      <div>
        <label class="mb-1 block text-sm text-black/60">托運單號 *</label>
        <input
          v-model.trim="trackingNo"
          class="focus-visible:ring-olive-700 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          placeholder="例：HCT-778899"
        />
      </div>

      <div class="text-sm text-black/60">
        經手人：<span class="font-medium text-black">{{ handlerLabel }}</span>
      </div>

      <div class="flex items-center gap-3 pt-1">
        <button
          type="submit"
          :disabled="submitting || !trackingNo"
          class="bg-olive-700 hover:bg-olive-800 inline-flex items-center rounded-md px-4 py-2 text-white disabled:opacity-50"
        >
          {{ submitting ? "處理中…" : "確認取件" }}
        </button>
        <button
          type="button"
          class="text-sm text-black/60 hover:underline"
          @click="trackingNo = ''"
        >
          清空
        </button>
      </div>

      <p v-if="msg" class="text-emerald-700">{{ msg }}</p>
      <p v-if="err" class="text-red-600">{{ err }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ParcelsAPI } from "@/api/parcels";
import { useAuthStore } from "@/stores/auth";

defineOptions({ name: "GuardParcelPickup" });

const auth = useAuthStore();
const trackingNo = ref("");
const submitting = ref(false);
const msg = ref("");
const err = ref("");

const handlerLabel = computed(() =>
  auth?.username ? `${auth.username} (${auth.role})` : (auth?.role ?? "guard"),
);

async function onPickup() {
  msg.value = "";
  err.value = "";
  if (!trackingNo.value) return;

  submitting.value = true;
  try {
    await ParcelsAPI.pickup(trackingNo.value, auth?.username || auth?.role || "guard");
    msg.value = "已完成取件";
    trackingNo.value = "";
  } catch (e: any) {
    err.value = e?.message ?? "取件失敗";
  } finally {
    submitting.value = false;
  }
}
</script>
