import type { Role } from "./auth";
export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  building: string | null;
  unit: string | null;
  isDisabled?: boolean;
  createdAt: string;
}

export type CreateUserInput = Omit<User, "id" | "createdAt">;

export type UserUpdatable = Partial<Omit<User, "id">>;
