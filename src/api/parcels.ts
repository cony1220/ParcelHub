import { mockParcelsAPI } from "@/mock/mockData";
export type NewParcel = {
  trackingNo: string;
  carrier?: string;
  building?: string;
  unit?: string;
  recipientName?: string;
  note?: string;
};

export const ParcelsAPI = {
  listMine(q?: string) {
    return mockParcelsAPI.listMine(q);
  },
  getById(id: string) {
    return mockParcelsAPI.getById(id);
  },
  create(data: NewParcel) {
    return mockParcelsAPI.create(data);
  },
  pickup(trackingNo: string, by: string) {
    return mockParcelsAPI.pickup(trackingNo, by);
  },
};
