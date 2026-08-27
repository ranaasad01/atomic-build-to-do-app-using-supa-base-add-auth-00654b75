"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

function toAbstractIntlMessages(raw: unknown): AbstractIntlMessages {
  if (raw === null || raw === undefined) return {};
  if (typeof raw === "string") return {};
  if (Array.isArray(raw)) {
    const result: AbstractIntlMessages = {};
    raw.forEach((item, index) => {
      result[String(index)] = toAbstractIntlMessages(item);
    });
    return result;
  }
  if (typeof raw === "object") {
    const result: AbstractIntlMessages = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof value === "string") {
        result[key] = value;
      } else {
        result[key] = toAbstractIntlMessages(value);
      }
    }
    return result;
  }
  return {};
}

const MESSAGES: Record<string, AbstractIntlMessages> = {
  en: toAbstractIntlMessages(en),
  es: toAbstractIntlMessages(es),
};

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";
const LOCALES = (process.env.NEXT_PUBLIC_LOCALES || "en,es")
  .split(",").map((s) => s.trim()).filter(Boolean);

type Ctx = { locale: string; setLocale: (l: string) => void; locales: string[] };
const LocaleCtx = createContext<Ctx>({ locale: DEFAULT_LOCALE, setLocale: () => {}, locales: LOCALES });
export const useSiteLocale = () => useContext(LocaleCtx);

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  useEffect(() => {
    try {
      const s = localStorage.getItem("site_locale");
      if (s && LOCALES.includes(s)) setLocaleState(s);
    } catch {}
  }, []);
  const setLocale = (l: string) => {
    setLocaleState(l);
    try { localStorage.setItem("site_locale", l); } catch {}
  };
  const messages = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE] || {};
  return (
    <LocaleCtx.Provider value={{ locale, setLocale, locales: LOCALES }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="UTC"
        onError={() => {}}
        getMessageFallback={({ key }) => key.split(".").pop() || key}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleCtx.Provider>
  );
}
