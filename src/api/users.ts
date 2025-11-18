import { mockUsersAPI } from "@/mock/mockData";
import type { Role } from "./auth";

export type UserInput = {
  username: string;
  password: string;
  role: Role;
  building?: string;
  unit?: string;
};
export const UsersAPI = {
  list() {
    return mockUsersAPI.list();
  },
  create(data: UserInput) {
    return mockUsersAPI.create({ ...data, isDisabled: false, createdAt: "" } as any);
  },
  update(id: string, patch: Partial<UserInput & { isDisabled: boolean }>) {
    return mockUsersAPI.update(id, patch as any);
  },
  remove(id: string) {
    return mockUsersAPI.remove(id);
  },
};
