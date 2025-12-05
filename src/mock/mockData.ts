// 集中假資料 + 假 fetch
import type { Parcel, CreateParcelInput, User, CreateUserInput, UserUpdatable } from "@/types";

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
      courier: "黑貓",
      sender: null, // 需要時再填
      building: "A",
      unit: "10F-3",
      receivedAt: nowISO(),
      pickedUpAt: null, // 沒取件= null
      pickupBy: null,
      pickupCode: null,
      notes: "",
    },
    {
      id: uid(),
      trackingNo: "HCT-778899",
      courier: "新竹",
      sender: null,
      building: "B",
      unit: "5F-1",
      receivedAt: nowISO(),
      pickedUpAt: null,
      pickupBy: null,
      pickupCode: null,
      notes: "冷藏",
    },
    {
      id: uid(),
      trackingNo: "POST-556677",
      courier: "郵局",
      sender: null,
      building: "A",
      unit: "12F-2",
      receivedAt: nowISO(),
      pickedUpAt: nowISO(), // ← 有值代表已取件
      pickupBy: "g-alan",
      pickupCode: "SFAf465465",
      notes: "",
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
  async create(payload: CreateUserInput) {
    if (db.users.some((x) => x.username === payload.username)) throw new Error("使用者已存在");
    const item: User = { ...payload, id: uid(), createdAt: nowISO() };
    db.users.push(item);
    return delay({ item });
  },
  async update(id: string, patch: UserUpdatable) {
    const i = db.users.findIndex((x) => x.id === id);
    if (i < 0) throw new Error("找不到使用者");

    const current = db.users[i]!;
    db.users[i] = { ...current, ...patch };
    return delay({ item: db.users[i] });
  },
  async remove(id: string) {
    const i = db.users.findIndex((x) => x.id === id);
    if (i >= 0) db.users.splice(i, 1);
    return delay({ ok: true });
  },
};

export const mockParcelsAPI = {
  /** 關鍵字搜尋（trackingNo/courier/notes），並以到件時間新→舊排序 */
  async listMine(q?: string) {
    let items: Parcel[] = [...db.parcels];

    // 搜尋：trackingNo / courier / notes
    if (q) {
      const s = q.toLowerCase();
      items = items.filter(
        (p) =>
          p.trackingNo.toLowerCase().includes(s) ||
          (p.courier ?? "").toLowerCase().includes(s) ||
          (p.notes ?? "").toLowerCase().includes(s),
      );
    }

    // 以到件時間（receivedAt）新→舊排序
    items.sort((a, b) => +new Date(b.receivedAt) - +new Date(a.receivedAt));

    return delay({ items });
  },

  async getById(id: string) {
    const item = db.parcels.find((p) => p.id === id);
    if (!item) throw new Error("Not Found");
    return delay({ item });
  },

  /** 建立包裹（待取件） */
  async create(payload: CreateParcelInput) {
    if (!payload.trackingNo) throw new Error("請輸入託運單號");

    const item: Parcel = {
      id: uid(),
      trackingNo: payload.trackingNo!,
      courier: payload.courier ?? null,
      sender: payload.sender ?? null,
      building: payload.building ?? null,
      unit: payload.unit ?? null,

      receivedAt: nowISO(), // ← 新欄位
      pickedUpAt: null, // 待取件
      pickupBy: null,
      pickupCode: payload.pickupCode ?? null,

      notes: payload.notes ?? null,
    };

    db.parcels.push(item);
    return delay({ item });
  },

  /** 取件 */
  async pickup(trackingNo: string, by: string) {
    const i = db.parcels.findIndex(
      (p) => p.trackingNo === trackingNo && !p.pickedUpAt, // 待取件條件
    );
    if (i < 0) throw new Error("找不到待領件或已領取");

    const current = db.parcels[i]!;
    db.parcels[i] = {
      ...current,
      pickedUpAt: nowISO(),
      pickupBy: by,
    };
    return delay({ item: db.parcels[i] });
  },
};
