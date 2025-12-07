<!-- src/pages/guard/ParcelNew.vue -->
<template>
  <section class="mx-auto max-w-3xl">
    <h2 class="mb-4 font-serif text-xl font-extrabold">包裹登記</h2>

    <div class="rounded-xl border bg-white p-6 shadow-sm">
      <form @submit.prevent="submit" class="space-y-4">
        <!-- 託運單號 -->
        <div>
          <label class="block text-sm font-medium">
            託運單號 <span class="text-rose-600">*</span>
          </label>
          <input
            v-model.trim="f.trackingNo"
            type="text"
            placeholder="例：HCT-778899"
            class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          />
          <p v-if="errors.trackingNo" class="mt-1 text-sm text-rose-600">{{ errors.trackingNo }}</p>
        </div>

        <!-- 承運商 / 寄件人 -->
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium">承運商</label>
            <input
              v-model.trim="f.courier"
              type="text"
              placeholder="黑貓 / 新竹 / 郵局…"
              class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">寄件人</label>
            <input
              v-model.trim="f.sender"
              type="text"
              class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
          </div>
        </div>

        <!-- 戶別（必填） -->
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium">
              棟別 <span class="text-rose-600">*</span>
            </label>
            <input
              v-model.trim="f.building"
              type="text"
              placeholder="例：A / B / C…"
              class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
            <p v-if="errors.building" class="mt-1 text-sm text-rose-600">{{ errors.building }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">
              門牌/房號 <span class="text-rose-600">*</span>
            </label>
            <input
              v-model.trim="f.unit"
              type="text"
              placeholder="例：10F-3 / 5F-1…"
              class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
            <p v-if="errors.unit" class="mt-1 text-sm text-rose-600">{{ errors.unit }}</p>
          </div>
        </div>

        <!-- 取件碼 / 備註 -->
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium">取件碼</label>
            <input
              v-model.trim="f.pickupCode"
              type="text"
              class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">備註</label>
            <input
              v-model.trim="f.notes"
              type="text"
              class="focus-visible:ring-olive-600 mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            />
          </div>
        </div>

        <!-- 自動匹配到的住戶（如果只有一位） -->
        <p v-if="matchedResident" class="text-sm text-emerald-700">
          將指派給：{{ matchedResident.username }}（{{ matchedResident.building }} /
          {{ matchedResident.unit }}）
        </p>

        <!-- 操作鈕 -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="!isValid || submitting"
            class="bg-olive-700 inline-flex items-center rounded-md px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ submitting ? "建立中…" : "建立" }}
          </button>
          <button
            type="button"
            @click="reset"
            class="ml-2 inline-flex items-center rounded-md border px-4 py-2"
          >
            清空
          </button>
          <p v-if="submitError" class="mt-2 text-sm text-rose-600">{{ submitError }}</p>
          <p v-if="submitOk" class="mt-2 text-sm text-emerald-700">已建立！</p>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ParcelsAPI } from "@/api/parcels";
import { UsersAPI } from "@/api/users"; // 取得住戶清單用
import type { User } from "@/types";

const f = reactive({
  trackingNo: "",
  courier: "",
  sender: "",
  building: "",
  unit: "",
  pickupCode: "",
  notes: "",
});

const errors = reactive<{ [k in keyof typeof f]?: string }>({});
const submitting = ref(false);
const submitError = ref("");
const submitOk = ref(false);

// 住戶列表（只抓 resident）
const residents = ref<User[]>([]);
(async () => {
  const { items } = await UsersAPI.list();
  residents.value = items.filter((u) => u.role === "resident");
})();

// 唯一匹配住戶（optional）
const matchedResident = computed(() => {
  if (!f.building || !f.unit) return null;
  const b = f.building.toLowerCase();
  const u = f.unit.toLowerCase();
  const arr = residents.value.filter(
    (x) => (x.building || "").toLowerCase() === b && (x.unit || "").toLowerCase() === u,
  );
  return arr.length === 1 ? arr[0] : null;
});

function validate() {
  errors.trackingNo = f.trackingNo ? "" : "請輸入託運單號";
  errors.building = f.building ? "" : "請輸入棟別";
  errors.unit = f.unit ? "" : "請輸入門牌/房號";
  return !errors.trackingNo && !errors.building && !errors.unit;
}

const isValid = computed(() => validate());

function reset() {
  Object.assign(f, {
    trackingNo: "",
    courier: "",
    sender: "",
    building: "",
    unit: "",
    pickupCode: "",
    notes: "",
  });
  submitError.value = "";
  submitOk.value = false;
}

async function submit() {
  submitError.value = "";
  submitOk.value = false;
  if (!validate()) return;

  submitting.value = true;
  try {
    await ParcelsAPI.create({
      trackingNo: f.trackingNo,
      courier: f.courier || null,
      sender: f.sender || null,
      building: f.building,
      unit: f.unit,
      pickupCode: f.pickupCode || null,
      notes: f.notes || null,
    });
    submitOk.value = true;
    reset();
  } catch (err: any) {
    submitError.value = err?.message || "建立失敗";
  } finally {
    submitting.value = false;
  }
}
</script>
