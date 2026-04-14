import { create } from 'zustand';

interface CartState {
  items: any[];
  setItems: (items: any[]) => void;
  addItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) })),
  clearCart: () => set({ items: [] }),
}));
