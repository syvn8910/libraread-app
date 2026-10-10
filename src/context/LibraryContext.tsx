import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LibraryState = { savedIds: number[]; progress: Record<number, number> };
type Ctx = LibraryState & {
  isSaved: (id: number) => boolean;
  toggleSave: (id: number) => void;
  setProgress: (id: number, percent: number) => void;
};

const KEY = 'libraread:v1';
const LibraryContext = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>({ savedIds: [], progress: {} });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(raw => raw && setState(JSON.parse(raw)))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const value: Ctx = {
    ...state,
    isSaved: id => state.savedIds.includes(id),
    toggleSave: id =>
      setState(s => ({
        ...s,
        savedIds: s.savedIds.includes(id) ? s.savedIds.filter(x => x !== id) : [...s.savedIds, id],
      })),
    setProgress: (id, percent) =>
      setState(s => ({ ...s, progress: { ...s.progress, [id]: Math.round(percent) } })),
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
};