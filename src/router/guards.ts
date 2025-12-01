import type { NavigationGuard } from "vue-router";
import { useAuthStore } from "@/stores/auth";
type Role = "resident" | "guard" | "admin";
export const defaultRouteName = (role: Role | null) =>
  role === "admin" ? "AdminUsers" : role === "guard" ? "GuardParcelNew" : "ResidentParcels";

export function requireAuth(roles?: Role[]): NavigationGuard {
  return async () => {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) return { name: "Login" };
    await auth.ensure();
    if (roles && auth.role && !roles.includes(auth.role as Role)) {
      return { name: defaultRouteName(auth.role as Role) };
    }
    return true;
  };
}

export const requireGuest: NavigationGuard = () => {
  const auth = useAuthStore();
  return auth.isAuthenticated ? { name: defaultRouteName(auth.role as Role | null) } : true;
};

// export const redirectByRole: NavigationGuard = () => {
//   const auth = useAuthStore();
//   return { name: defaultRouteName(auth.role as Role | null) };
// };
