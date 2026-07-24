import { useEffect } from "react";

export type ShortcutHandler = (e: KeyboardEvent) => void;
export type ShortcutMap = Record<string, ShortcutHandler>;

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/** Keys use "mod+key" for Ctrl/Cmd, e.g. "mod+p", "mod+shift+p", "?". */
export function useShortcuts(map: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function handler(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();
      const combo = [mod && "mod", shift && "shift", key].filter(Boolean).join("+");
      const raw = e.key === "?" ? "?" : combo;
      const fn = map[raw] ?? map[combo];
      if (!fn) return;
      // Allow "?" without prevention if user is typing; otherwise skip when in inputs
      if (isEditableTarget(e.target) && !mod) return;
      e.preventDefault();
      fn(e);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [map, enabled]);
}