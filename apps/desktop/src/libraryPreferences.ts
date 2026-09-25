import { useState } from "react";
import type { Mode } from "./types";

type Preferences = { favorites: string[]; order: string[] };
const key = "nexum.library-preferences";
function read(): Preferences {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "{}");
    const ids = (v: unknown): string[] => Array.isArray(v) ? [...new Set(v.filter((id): id is string => typeof id === "string"))] : [];
    return { favorites: ids(value?.favorites), order: ids(value?.order) };
  } catch { return { favorites: [], order: [] }; }
}

export function useLibraryPreferences(modes: Mode[]) {
  const [preferences, setPreferences] = useState(read);
  const [error, setError] = useState<string | null>(null);
  const sorted = [...modes].sort((a, b) => {
    const favorite = Number(preferences.favorites.includes(b.id)) - Number(preferences.favorites.includes(a.id));
    const rank = (id: string) => { const i = preferences.order.indexOf(id); return i < 0 ? Infinity : i; };
    return favorite || (rank(a.id) - rank(b.id) || 0);
  });
  function save(next: Preferences) {
    setPreferences(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(null); }
    catch { setError("L’ordre et les favoris sont conservés pour cette session, mais leur enregistrement local a échoué."); }
  }
  function toggleFavorite(id: string) {
    save({ ...preferences, favorites: preferences.favorites.includes(id) ? preferences.favorites.filter(x => x !== id) : [...preferences.favorites, id] });
  }
  function move(id: string, targetId: string) {
    if (id === targetId || !modes.some(m => m.id === id) || !modes.some(m => m.id === targetId)) return;
    // Favorites remain pinned; reorder within the same group.
    if (preferences.favorites.includes(id) !== preferences.favorites.includes(targetId)) return;
    const order = sorted.map(m => m.id);
    const to = order.indexOf(targetId);
    order.splice(order.indexOf(id), 1);
    order.splice(to, 0, id);
    save({ ...preferences, order });
  }
  return { modes: sorted, favorites: preferences.favorites, toggleFavorite, move, error };
}
