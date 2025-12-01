<template>
  <section class="p-4">
    <h2>使用者管理</h2>
    <details style="margin: 12px 0">
      <summary>新增使用者</summary>
      <form @submit.prevent="create" class="space-y-2">
        <div><label>帳號</label><input v-model="f.username" required /></div>
        <div><label>密碼</label><input v-model="f.password" required /></div>
        <div>
          <label>角色</label>
          <select v-model="f.role">
            <option value="resident">resident</option>
            <option value="guard">guard</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div><label>棟別</label><input v-model="f.building" /></div>
        <div><label>門牌/房號</label><input v-model="f.unit" /></div>
        <button>建立</button>
      </form>
    </details>

    <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; max-width: 920px">
      <thead>
        <tr>
          <th>帳號</th>
          <th>角色</th>
          <th>棟/房</th>
          <th>狀態</th>
          <th>建立時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.username }}</td>
          <td>{{ u.role }}</td>
          <td>{{ (u.building || "—") + " / " + (u.unit || "—") }}</td>
          <td>{{ u.isDisabled ? "停用" : "啟用" }}</td>
          <td>{{ new Date(u.createdAt).toLocaleString() }}</td>
          <td>
            <button @click="toggle(u)">{{ u.isDisabled ? "啟用" : "停用" }}</button>
            <button @click="reset(u)">重設密碼</button>
            <button @click="remove(u)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { UsersAPI } from "@/api/users";
type Item = any;
const users = ref<Item[]>([]);
const f = reactive({ username: "", password: "", role: "resident", building: "", unit: "" });
async function load() {
  const { items } = await UsersAPI.list();
  users.value = items;
}
async function create() {
  if (!f.username.trim() || !f.password) return;
  await UsersAPI.create(f as any);
  Object.assign(f, { username: "", password: "", role: "resident", building: "", unit: "" });
  load();
}
async function toggle(u: Item) {
  await UsersAPI.update(u.id, { isDisabled: !u.isDisabled });
  load();
}
async function reset(u: Item) {
  const np = prompt(`重設 ${u.username} 的新密碼：`, "pass");
  if (np) {
    await UsersAPI.update(u.id, { password: np });
    alert("已重設");
  }
}
async function remove(u: Item) {
  if (confirm("確定刪除？")) {
    await UsersAPI.remove(u.id);
    load();
  }
}
onMounted(load);
</script>
