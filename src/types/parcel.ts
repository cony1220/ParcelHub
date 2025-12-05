export interface Parcel {
  id: string;
  /** 托運單號 (例: HCT-778899) */
  trackingNo: string;
  /** 承運/快遞公司 (例: HCT/黑貓/郵局) */
  courier?: string | null;
  /** 寄件人（可不填） */
  sender?: string | null;
  /** 棟別與房號（住戶定位） */
  building?: string | null;
  unit?: string | null;
  /** 到櫃台(登記)時間；建議用 ISO 字串 */
  receivedAt: string;
  /** 取件時間；有值表示已取件 */
  pickedUpAt?: string | null;
  /** 經手/取件者（員工或住戶帳號/名稱） */
  pickupBy?: string | null;
  /** 住戶用的取件碼（可選） */
  pickupCode?: string | null;
  /** 備註 */
  notes?: string | null;
}

export type CreateParcelInput = Pick<
  Parcel,
  "trackingNo" | "courier" | "sender" | "building" | "unit" | "notes" | "pickupCode"
>;
