<template>
  <section class="p-4">
    <h2>我的包裹</h2>
    <div class="mb-2 flex gap-2">
      <input v-model="q" placeholder="搜尋託運單號/物流/備註" />
      <button @click="load">搜尋</button>
    </div>
    <ul v-if="items.length">
      <li v-for="p in items" :key="p.id" class="py-1">
        <RouterLink :to="`/parcels/${p.id}`">
          <strong>{{ p.trackingNo }}</strong>
          <span> · {{ p.carrier || "—" }}</span>
          <span> · {{ p.status === "pending" ? "待領" : "已領" }}</span>
        </RouterLink>
      </li>
    </ul>
    <p v-else>目前沒有包裹。</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ParcelsAPI } from "@/api/parcels";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const q = ref("");
const items = ref<any[]>([]);
async function load() {
  const { items: list } = await ParcelsAPI.listMine(q.value, auth.userName);
  items.value = list;
}
onMounted(load);
</script>
