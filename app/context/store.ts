import { create } from 'zustand';
import { FileStoreProps, SelectedModel, SelectedRule } from '@/app/types/types';

export const useStore = create<FileStoreProps>()((set) => ({
  nameFile: '',
  setNameFile: (value) => {
    set(() => ({ nameFile: value }));
  },
}));

export const useSelectedModelStore = create<SelectedModel>()((set) => ({
  model: null,
  setSelectedModel: (value) => {
    set(() => ({ model: value }));
  },
}));

export const useSelectedRuleStore = create<SelectedRule>()((set) => ({
  id: '',
  setSelectedRule: (value) => {
    set(() => ({ id: value }));
  },
}));
