import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      view: 'grid',                         // 'grid' | 'list'
      search: '',
      setView: (view) => set({ view }),
      setSearch: (search) => set({ search }),
    }),
    { name: 'ui-store', partialize: (s) => ({ view: s.view }) },  // persist only the view
  ),
);