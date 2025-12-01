<template>
  <section class="p-4">
    <h2>包裹登記</h2>
    <form @submit.prevent="submit" class="space-y-2">
      <div><label>託運單號</label><input v-model="form.trackingNo" required /></div>
      <div><label>物流</label><input v-model="form.carrier" placeholder="黑貓/郵局/新竹…" /></div>
      <div><label>棟別</label><input v-model="form.building" /></div>
      <div><label>門牌/房號</label><input v-model="form.unit" /></div>
      <div><label>收件人</label><input v-model="form.recipientName" /></div>
      <div><label>備註</label><textarea v-model="form.note" /></div>
      <button :disabled="loading">{{ loading ? "送出中…" : "建立" }}</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ParcelsAPI, type NewParcel } from "@/api/parcels";
const form = reactive<NewParcel>({
  trackingNo: "",
  carrier: "",
  building: "",
  unit: "",
  recipientName: "",
  note: "",
});
const loading = ref(false);
async function submit() {
  loading.value = true;
  try {
    await ParcelsAPI.create(form);
    alert("已登記");
    Object.assign(form, {
      trackingNo: "",
      carrier: "",
      building: "",
      unit: "",
      recipientName: "",
      note: "",
    });
  } finally {
    loading.value = false;
  }
}
</script>
