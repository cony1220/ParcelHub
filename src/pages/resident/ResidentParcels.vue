<template>
  <section class="px-4 py-8 sm:px-6 lg:px-8">
    <!-- 標題 + 統計 -->
    <header class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="font-serif text-2xl font-extrabold sm:text-3xl">我的包裹</h1>
        <p class="mt-1 text-black/60">
          共 {{ filtered.length }} 件，未取 {{ counts.unpicked }}、已取 {{ counts.picked }}
        </p>
      </div>

      <!-- 控制列：搜尋 + 狀態 + 排序 -->
      <div class="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end">
        <!-- 搜尋：小螢幕佔滿寬；md 以上固定寬 -->
        <div class="relative grow basis-full md:grow-0 md:basis-auto">
          <input
            v-model.trim="q"
            type="search"
            placeholder="搜尋：托運單號 / 寄件人 / 備註"
            class="focus-visible:ring-olive-600 w-full rounded-md border px-3 py-2 pl-9 outline-none focus-visible:ring-2 md:w-[320px]"
          />
          <svg
            class="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 opacity-60"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"
            />
          </svg>
        </div>

        <!-- 狀態切換：避免被壓縮 -->
        <div class="inline-flex shrink-0 overflow-hidden rounded-md border">
          <button
            v-for="opt in tabs"
            :key="opt.value"
            @click="tab = opt.value"
            :class="[
              'px-3 py-1.5 text-sm',
              tab === opt.value ? 'bg-olive-700 text-white' : 'bg-white hover:bg-slate-50',
            ]"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- 排序：小螢幕佔滿寬；md 以上自動寬 -->
        <select
          v-model="sortKey"
          class="focus-visible:ring-olive-600 w-full shrink-0 basis-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 md:w-auto md:basis-auto"
        >
          <option value="receivedAt_desc">到件時間（新→舊）</option>
          <option value="receivedAt_asc">到件時間（舊→新）</option>
        </select>
      </div>
    </header>

    <!-- 空狀態 -->
    <div v-if="loading" class="py-16 text-center text-black/60">載入中…</div>
    <div v-else-if="filtered.length === 0" class="py-16 text-center">
      <p class="text-lg font-medium">目前沒有符合條件的包裹</p>
      <p class="mt-1 text-black/60">試試清空搜尋或切換狀態</p>
    </div>

    <!-- 桌面表格 -->
    <div v-else class="hidden md:block">
      <div class="overflow-x-auto rounded-xl border bg-white">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-left">托運單號</th>
              <th class="px-4 py-3 text-left">承運</th>
              <th class="px-4 py-3 text-left">寄件人</th>
              <th class="px-4 py-3 text-left">地址</th>
              <th class="px-4 py-3 text-left">到件時間</th>
              <th class="px-4 py-3 text-left">狀態</th>
              <th class="px-4 py-3 text-left">備註</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id" class="border-t">
              <td class="px-4 py-3 font-medium">{{ p.trackingNo }}</td>
              <td class="px-4 py-3">{{ p.courier || "—" }}</td>
              <td class="px-4 py-3">{{ p.sender || "—" }}</td>
              <td class="px-4 py-3">{{ addr(p) }}</td>
              <td class="px-4 py-3">{{ fmt(p.receivedAt) }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    p.pickedUpAt
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800',
                  ]"
                >
                  {{ p.pickedUpAt ? "已取件" : "待取件" }}
                </span>
                <div v-if="p.pickedUpAt" class="mt-0.5 text-xs text-black/60">
                  於 {{ fmt(p.pickedUpAt) }}
                </div>
                <div v-else-if="p.pickupCode" class="mt-0.5 text-xs text-black/60">
                  取件碼：{{ p.pickupCode }}
                </div>
              </td>
              <td class="px-4 py-3">{{ p.notes || "—" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 手機卡片 -->
    <div class="space-y-3 md:hidden">
      <article v-for="p in filtered" :key="p.id" class="rounded-xl border bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-sm text-black/60">托運單號</div>
            <div class="text-base font-semibold">{{ p.trackingNo }}</div>
          </div>
          <span
            :class="[
              'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium',
              p.pickedUpAt ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
            ]"
          >
            {{ p.pickedUpAt ? "已取件" : "待取件" }}
          </span>
        </div>

        <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt class="text-black/60">承運</dt>
            <dd class="font-medium">{{ p.courier || "—" }}</dd>
          </div>
          <div>
            <dt class="text-black/60">寄件人</dt>
            <dd class="font-medium">{{ p.sender || "—" }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="text-black/60">地址</dt>
            <dd class="font-medium">{{ addr(p) }}</dd>
          </div>
          <div>
            <dt class="text-black/60">到件</dt>
            <dd class="font-medium">{{ fmt(p.receivedAt) }}</dd>
          </div>
          <div>
            <dt class="text-black/60">備註</dt>
            <dd class="font-medium">{{ p.notes || "—" }}</dd>
          </div>
        </dl>

        <div class="mt-3 text-xs text-black/60" v-if="p.pickedUpAt">
          已於 {{ fmt(p.pickedUpAt) }} 取件
        </div>
        <div class="mt-3 text-xs text-black/80" v-else-if="p.pickupCode">
          取件碼：<span class="font-mono tracking-wide">{{ p.pickupCode }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ParcelsAPI } from "@/api/parcels";
import type { Parcel } from "@/types";

const loading = ref(true);
const items = ref<Parcel[]>([]);

const tabs = [
  { label: "全部", value: "all" },
  { label: "未取", value: "unpicked" },
  { label: "已取", value: "picked" },
] as const;
type Tab = (typeof tabs)[number]["value"];
const tab = ref<Tab>("all");

const q = ref("");
const sortKey = ref<"receivedAt_desc" | "receivedAt_asc">("receivedAt_desc");

const counts = computed(() => {
  const picked = items.value.filter((p) => !!p.pickedUpAt).length;
  const unpicked = items.value.length - picked;
  return { picked, unpicked };
});

const filtered = computed<Parcel[]>(() => {
  let arr = items.value.slice();

  // 狀態過濾
  if (tab.value === "picked") arr = arr.filter((p) => !!p.pickedUpAt);
  else if (tab.value === "unpicked") arr = arr.filter((p) => !p.pickedUpAt);

  // 搜尋（trackingNo/sender/notes）
  const keyword = q.value.toLowerCase();
  if (keyword) {
    arr = arr.filter(
      (p) =>
        (p.trackingNo && p.trackingNo.toLowerCase().includes(keyword)) ||
        (p.sender && p.sender.toLowerCase().includes(keyword)) ||
        (p.notes && p.notes.toLowerCase().includes(keyword)),
    );
  }

  // 排序
  arr.sort((a, b) => {
    const av = +new Date(a.receivedAt);
    const bv = +new Date(b.receivedAt);
    return sortKey.value === "receivedAt_desc" ? bv - av : av - bv;
  });

  return arr;
});

function fmt(v: any) {
  const d = new Date(v);
  if (Number.isNaN(+d)) return "—";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function addr(p: Parcel) {
  const a = [p.building, p.unit].filter(Boolean).join(" / ");
  return a || "—";
}

async function load() {
  loading.value = true;
  try {
    const { items: rows } = await ParcelsAPI.listMine();
    items.value = rows as Parcel[];
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
