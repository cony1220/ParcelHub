export type Role = "resident" | "guard" | "admin";
export interface AuthToken {
  token: string;
  exp: number;
}
