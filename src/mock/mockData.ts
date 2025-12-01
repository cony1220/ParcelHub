// 集中假資料 + 假 fetch
export type Role = "resident" | "guard" | "admin";

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  building?: string;
  unit?: string;
  isDisabled?: boolean;
  createdAt: string;
}

export interface Parcel {
  id: string;
  trackingNo: string;
  carrier?: string;
  building?: string;
  unit?: string;
  recipientName?: string;
  note?: string;
  status: "pending" | "picked";
  createdAt: string;
  pickedAt?: string;
  pickupBy?: string;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const nowISO = () => new Date().toISOString();

// ---- 假資料（可改成 localStorage 持久化，這裡先放記憶體） ----
const db = {
  users: [] as User[],
  parcels: [] as Parcel[],
};

// 首播資料
function seed() {
  if (db.users.length) return;
  db.users.push(
    { id: uid(), username: "admin", password: "pass", role: "admin", createdAt: nowISO() },
    { id: uid(), username: "g-alan", password: "pass", role: "guard", createdAt: nowISO() },
    {
      id: uid(),
      username: "amy",
      password: "pass",
      role: "resident",
      building: "A",
      unit: "10F-3",
      createdAt: nowISO(),
    },
  );
  db.parcels.push(
    {
      id: uid(),
      trackingNo: "TAO-0012345",
      carrier: "黑貓",
      building: "A",
      unit: "10F-3",
      recipientName: "amy",
      note: "",
      status: "pending",
      createdAt: nowISO(),
    },
    {
      id: uid(),
      trackingNo: "HCT-778899",
      carrier: "新竹",
      building: "B",
      unit: "5F-1",
      recipientName: "bob",
      note: "冷藏",
      status: "pending",
      createdAt: nowISO(),
    },
    {
      id: uid(),
      trackingNo: "POST-556677",
      carrier: "郵局",
      building: "A",
      unit: "12F-2",
      recipientName: "amy",
      note: "",
      status: "picked",
      createdAt: nowISO(),
      pickedAt: nowISO(),
      pickupBy: "g-alan",
    },
  );
}
seed();

// 模擬 fetch 延遲
const delay = <T>(data: T, ms = 250) => new Promise<T>((res) => setTimeout(() => res(data), ms));

// ---- 假 API：auth/users/parcels ----
export const mockAuthAPI = {
  async login(username: string, password: string) {
    const u = db.users.find((x) => x.username === username && x.password === password);
    if (!u || u.isDisabled) throw new Error("帳號或密碼錯誤/已停用");
    // 回 token + 最小 user
    return delay({
      token: "demo-token",
      user: { id: u.id, username: u.username, role: u.role, building: u.building, unit: u.unit },
    });
  },
  async me(token: string) {
    if (token !== "demo-token") throw new Error("未授權");
    // demo：回傳 admin 當前登入者不一定可靠，實務你應由 token 找使用者
    const u = db.users.find((x) => x.username === "admin")!;
    return delay({
      user: { id: u.id, username: u.username, role: u.role, building: u.building, unit: u.unit },
    });
  },
};

export const mockUsersAPI = {
  async list() {
    return delay({ items: [...db.users].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  },
  async create(payload: Omit<User, "id" | "createdAt">) {
    if (db.users.some((x) => x.username === payload.username)) throw new Error("使用者已存在");
    const item: User = { ...payload, id: uid(), createdAt: nowISO() };
    db.users.push(item);
    return delay({ item });
  },
  async update(id: string, patch: Partial<Omit<User, "id">>) {
    const i = db.users.findIndex((x) => x.id === id);
    if (i < 0) throw new Error("找不到使用者");
    db.users[i] = { ...db.users[i], ...patch };
    return delay({ item: db.users[i] });
  },
  async remove(id: string) {
    const i = db.users.findIndex((x) => x.id === id);
    if (i >= 0) db.users.splice(i, 1);
    return delay({ ok: true });
  },
};

export const mockParcelsAPI = {
  async listMine(q?: string, me?: string) {
    let items = [...db.parcels];
    if (me)
      items = items.filter((p) => (p.recipientName || "").toLowerCase().includes(me.toLowerCase()));
    if (q) {
      const s = q.toLowerCase();
      items = items.filter(
        (p) =>
          p.trackingNo.toLowerCase().includes(s) ||
          (p.carrier || "").toLowerCase().includes(s) ||
          (p.note || "").toLowerCase().includes(s),
      );
    }
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay({ items });
  },
  async getById(id: string) {
    const item = db.parcels.find((p) => p.id === id);
    if (!item) throw new Error("Not Found");
    return delay({ item });
  },
  async create(payload: Partial<Parcel>) {
    if (!payload.trackingNo) throw new Error("請輸入託運單號");
    const item: Parcel = {
      id: uid(),
      trackingNo: payload.trackingNo,
      carrier: payload.carrier,
      building: payload.building,
      unit: payload.unit,
      recipientName: payload.recipientName,
      note: payload.note,
      status: "pending",
      createdAt: nowISO(),
    };
    db.parcels.push(item);
    return delay({ item });
  },
  async pickup(trackingNo: string, by: string) {
    const i = db.parcels.findIndex((p) => p.trackingNo === trackingNo && p.status === "pending");
    if (i < 0) throw new Error("找不到待領件或已領取");
    db.parcels[i] = { ...db.parcels[i], status: "picked", pickedAt: nowISO(), pickupBy: by };
    return delay({ item: db.parcels[i] });
  },
};
