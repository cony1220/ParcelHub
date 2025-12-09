import { mockUsersAPI } from "@/mock/mockData";
import type { CreateUserInput, UserUpdatable } from "@/types";

export const UsersAPI = {
  list() {
    return mockUsersAPI.list();
  },
  create(data: CreateUserInput) {
    return mockUsersAPI.create(data);
  },
  update(id: string, patch: UserUpdatable) {
    return mockUsersAPI.update(id, patch);
  },
  remove(id: string) {
    return mockUsersAPI.remove(id);
  },
};
