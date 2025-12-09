import { defineStore } from "pinia";
import { AuthAPI, type Me } from "@/api/auth";
import type { Role } from "@/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "" as string,
    user: null as Me | null,
    _ensurePromise: null as Promise<void> | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role ?? (null as Role | null),
    userName: (s) => s.user?.username ?? "",
  },
  actions: {
    async login({ username, password }: { username: string; password: string }) {
      const { token, user } = await AuthAPI.login(username, password);
      this.token = token;
      this.user = user;
    },
    logout() {
      this.token = "";
      this.user = null;
      this._ensurePromise = null;
    },
    async ensure() {
      if (!this.isAuthenticated || this.user) return;
      if (this._ensurePromise) return this._ensurePromise;
      this._ensurePromise = (async () => {
        const { user } = await AuthAPI.me(this.token);
        this.user = user;
      })().finally(() => {
        this._ensurePromise = null;
      });
      return this._ensurePromise;
    },
  },
});
