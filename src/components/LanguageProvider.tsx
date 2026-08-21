"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { COPY, type Lang } from "@/content/copy";

const STORAGE_KEY = "np-lang";

/* --------------------------------------------------------------------------
 * The chosen language is external state (it lives in localStorage), so it is
 * read through useSyncExternalStore: the server and the hydrating client both
 * start from "en", then React re-renders once with the stored value.
 * -------------------------------------------------------------------------- */

let cached: Lang | null = null;
const listeners = new Set<() => void>();

function readStored(): Lang {
  if (cached === null) {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // private mode / storage disabled — fall through to the default
    }
    cached = saved === "vi" || saved === "en" ? saved : "en";
  }
  return cached;
}

function serverSnapshot(): Lang {
  return "en";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function writeStored(next: Lang) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore — the choice simply will not persist
  }
  listeners.forEach((l) => l());
}

/* -------------------------------------------------------------------------- */

type Ctx = {
  lang: Lang;
  t: (typeof COPY)[Lang];
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readStored, serverSnapshot);

  // Keep <html lang> in sync — the Vietnamese script-font fallback in
  // globals.css keys off it, and screen readers need it correct.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => writeStored(l), []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: COPY[lang],
      setLang,
      toggle: () => setLang(lang === "en" ? "vi" : "en"),
    }),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
