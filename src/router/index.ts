import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { requireAuth, requireGuest } from "./guards";

declare module "vue-router" {
  interface RouteMeta {
    layout?: "default" | "guard" | "admin";
    hideNavActions?: boolean; // 可隱藏Header右上menu（AuthButton + 漢堡）
    hideFooter?: boolean; // 可隱藏 footer
  }
}

const routes: RouteRecordRaw[] = [
  // 首頁
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/public/HomePage.vue"),
    meta: { layout: "default" },
  },
  // 登入
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/public/LoginPage.vue"),
    beforeEnter: requireGuest,
    meta: { layout: "default", hideFooter: true },
  },
  // Resident：包裹清單
  {
    path: "/parcels",
    name: "ResidentParcels",
    component: () => import("@/pages/resident/ResidentParcels.vue"),
    beforeEnter: requireAuth(["resident", "guard", "admin"]),
    meta: { layout: "default" },
  },

  // Guard：登記 / 取件（admin 也可進）
  {
    path: "/guard",
    meta: { layout: "guard" },
    beforeEnter: requireAuth(["guard", "admin"]),
    children: [
      {
        path: "parcels",
        component: () => import("@/pages/guard/GuardDeskLayout.vue"), // 父層：放「分頁」與 <RouterView />
        children: [
          { path: "", redirect: { name: "GuardParcelNew" } }, // 進 /guard/parcels 預設導向「登記」
          {
            path: "new",
            name: "GuardParcelNew",
            component: () => import("@/pages/guard/ParcelNew.vue"),
          },
          {
            path: "pickup",
            name: "GuardParcelPickup",
            component: () => import("@/pages/guard/ParcelPickup.vue"),
          },
        ],
      },
    ],
  },

  // Admin：使用者管理
  // {
  //   path: "/admin/users",
  //   name: "AdminUsers",
  //   component: () => import("@/pages/admin/Users.vue"),
  //   beforeEnter: requireAuth(["admin"]),
  //   meta: { layout: "admin" },
  // },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export default createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
