<template>
  <header class="nav">
    <RouterLink to="/" class="logo">ParcelHub</RouterLink>
    <nav class="menu">
      <RouterLink to="/parcels">我的包裹</RouterLink>
      <RouterLink to="/guard/parcels/new" v-if="role === 'guard' || role === 'admin'"
        >櫃台</RouterLink
      >
      <RouterLink to="/admin/users" v-if="role === 'admin'">管理</RouterLink>
    </nav>
    <div class="nav-right">
      <button v-if="!isAuthenticated" @click="$router.push('/login')">Log in</button>
      <details v-else>
        <summary>{{ userName }}</summary>
        <div class="dropdown"><button @click="logout">登出</button></div>
      </details>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const { role, isAuthenticated, userName } = storeToRefs(auth);
function logout() {
  auth.logout();
}
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e5e5;
}
.logo {
  font-weight: 700;
  text-decoration: none;
}
.menu {
  display: flex;
  gap: 12px;
  margin-left: 6px;
}
.nav-right {
  margin-left: auto;
}
.dropdown {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  margin-top: 4px;
}
.router-link-active {
  font-weight: 600;
  text-decoration: underline;
}
</style>
