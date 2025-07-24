import { create } from 'zustand';

interface DrawerStoreType {
  detailDrawer: boolean;
  detailLoading: boolean;
  setDetailDrawer: () => void;
}

export const useDrawerStore = create<DrawerStoreType>((set) => ({
  detailDrawer: false,
  detailLoading: false,
  setDetailDrawer: () => set((state) => ({ ...state, detailDrawer: !state.detailDrawer })),
}));
