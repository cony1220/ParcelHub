<template>
  <section class="mx-auto max-w-3xl">
    <header class="mb-6">
      <h1 class="font-serif text-xl font-extrabold">包裹登記</h1>
      <p class="mt-1 text-black/60">輸入托運單號與住戶資訊，必要時可指派到特定帳號。</p>
    </header>

    <form @submit.prevent="onSubmit" class="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
      <!-- 基本欄位 -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm text-black/60">托運單號 *</label>
          <input
            v-model.trim="f.trackingNo"
            type="text"
            placeholder="例：HCT-778899"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-black/60">承運（快遞）</label>
          <input
            v-model.trim="f.courier"
            type="text"
            placeholder="黑貓 / 新竹 / 郵局"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-black/60">寄件人</label>
          <input
            v-model.trim="f.sender"
            type="text"
            placeholder="寄件人（可空）"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-black/60">棟別 *</label>
          <input
            v-model.trim="f.building"
            type="text"
            placeholder="例：A"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-black/60">房號 *</label>
          <input
            v-model.trim="f.unit"
            type="text"
            placeholder="例：10F-3"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            required
          />
        </div>
      </div>

      <!-- 收件人（帳號 / 名稱） -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div class="mb-1 flex items-center justify-between">
            <label class="block text-sm text-black/60">指派住戶帳號（選擇）</label>
            <span v-if="loadingUsers" class="text-xs text-black/50">載入中…</span>
          </div>
          <select
            v-model="f.recipientUserId"
            :disabled="!f.building || !f.unit || loadingUsers || users.length === 0"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-2.5 py-2 text-sm outline-none focus-visible:ring-2 disabled:bg-slate-50"
          >
            <option value="">（不指派帳號）</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.username }}
            </option>
          </select>
          <p class="mt-1 text-xs text-black/50">
            先填好「棟別/房號」才會載入同戶住戶帳號。可不選擇，改填下方收件人名稱。
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm text-black/60">收件人名稱（可覆寫）</label>
          <input
            v-model.trim="f.recipientName"
            type="text"
            placeholder="快遞單上寫的名字（可空）"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          />
        </div>
      </div>

      <!-- 其它 -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm text-black/60">取件碼（選）</label>
          <input
            v-model.trim="f.pickupCode"
            type="text"
            placeholder="若有發取件碼可填"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-black/60">備註</label>
          <input
            v-model.trim="f.notes"
            type="text"
            placeholder="冷藏 / 大件 / 破損…"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          />
        </div>
      </div>

      <!-- 動作 -->
      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="!canSubmit || submitting"
          class="bg-olive-700 rounded-md px-4 py-2 text-white disabled:opacity-50"
        >
          {{ submitting ? "送出中…" : "確認登記" }}
        </button>

        <button
          type="button"
          @click="resetForm"
          class="rounded-md border px-4 py-2 hover:bg-slate-50"
        >
          清空
        </button>

        <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
        <p v-if="okMsg" class="text-sm text-emerald-700">{{ okMsg }}</p>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { ParcelsAPI } from "@/api/parcels";
import { mockUsersAPI } from "@/mock/mockData";
import type { CreateParcelInput, User } from "@/types";

type Form = {
  trackingNo: string;
  courier: string;
  sender: string;
  building: string;
  unit: string;
  recipientUserId: string; // 空字串代表不指派
  recipientName: string;
  pickupCode: string;
  notes: string;
};

const f = ref<Form>({
  trackingNo: "",
  courier: "",
  sender: "",
  building: "",
  unit: "",
  recipientUserId: "",
  recipientName: "",
  pickupCode: "",
  notes: "",
});

const users = ref<User[]>([]);
const loadingUsers = ref(false);
const submitting = ref(false);
const errorMsg = ref("");
const okMsg = ref("");

// 只要 building / unit 改變就載入同戶住戶帳號
watch(
  () => [f.value.building, f.value.unit] as const,
  async ([b, u]) => {
    users.value = [];
    f.value.recipientUserId = "";
    // 沒填完整就不查
    if (!b || !u) return;
    loadingUsers.value = true;
    try {
      const { items } = await mockUsersAPI.list({ building: b, unit: u });
      users.value = items;
    } catch (e) {
      console.error(e);
    } finally {
      loadingUsers.value = false;
    }
  },
  { immediate: false },
);

// 若選擇了住戶帳號 → 自動把名稱帶入（可再改）
watch(
  () => f.value.recipientUserId,
  (id) => {
    if (!id) return; // 清空帳號不自動覆寫
    const u = users.value.find((x) => x.id === id);
    if (u) f.value.recipientName = u.username;
  },
);

// 表單驗證：最小必填
const canSubmit = computed(() => !!f.value.trackingNo && !!f.value.building && !!f.value.unit);

function emptyToNull(v: string | undefined) {
  return v && v.trim() !== "" ? v.trim() : null;
}

async function onSubmit() {
  errorMsg.value = "";
  okMsg.value = "";
  if (!canSubmit.value) return;

  submitting.value = true;
  try {
    const payload: CreateParcelInput = {
      trackingNo: f.value.trackingNo.trim(),
      courier: emptyToNull(f.value.courier),
      sender: emptyToNull(f.value.sender),
      building: f.value.building.trim(),
      unit: f.value.unit.trim(),
      // 可選：若未指派帳號就傳 null
      recipientUserId: f.value.recipientUserId || null,
      recipientName: emptyToNull(f.value.recipientName),
      pickupCode: emptyToNull(f.value.pickupCode),
      notes: emptyToNull(f.value.notes),
    };
    await ParcelsAPI.create(payload);
    okMsg.value = "已完成登記";
    resetForm(true);
  } catch (err: any) {
    errorMsg.value = err?.message ?? "登記失敗";
  } finally {
    submitting.value = false;
  }
}

function resetForm(keepAddr = false) {
  const { building, unit } = f.value;
  f.value = {
    trackingNo: "",
    courier: "",
    sender: "",
    building: keepAddr ? building : "",
    unit: keepAddr ? unit : "",
    recipientUserId: "",
    recipientName: "",
    pickupCode: "",
    notes: "",
  };
  if (!keepAddr) users.value = [];
}
</script>
