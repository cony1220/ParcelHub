import { mockAuthAPI } from "@/mock/mockData";
import type { Role } from "@/types";
export type Me = { id: string; username: string; role: Role; building?: string; unit?: string };

export const AuthAPI = {
  login(username: string, password: string) {
    return mockAuthAPI.login(username, password) as Promise<{ token: string; user: Me }>;
  },
  me(token: string) {
    return mockAuthAPI.me(token) as Promise<{ user: Me }>;
  },
};
