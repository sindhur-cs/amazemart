"use client";

import { Header as HeaderType, Footer as FooterType, PageData as PageType } from "@/lib/types";
import { getBlogHeader, getBlogFooter, getPageData } from "@/lib/contentstack";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface LocaleOption {
  code: string;
  label: string;
}

export const localeOptions: LocaleOption[] = [
  { code: "en-us", label: "English (US)" },
  { code: "fr-fr", label: "Français (FR)" },
  { code: "es-es", label: "Español (ES)" },
];

interface HeaderContextType {
  header: HeaderType | null;
  footer: FooterType | null;
  page: PageType | null;
  loading: boolean;
  locale: string;
  setLocale: (locale: string) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  header: null,
  footer: null,
  page: null,
  loading: true,
  locale: "en-us",
  setLocale: () => {},
});

export const useHeader = () => useContext(HeaderContext);

interface HeaderProviderProps {
  children: ReactNode;
}

export default function HeaderProvider({ children }: HeaderProviderProps) {
  const [header, setHeader] = useState<HeaderType | null>(null);
  const [footer, setFooter] = useState<FooterType | null>(null);
  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState("en-us");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [headerData, footerData, pageData] = await Promise.all([
          getBlogHeader(locale),
          getBlogFooter(locale),
          getPageData(locale),
        ]);

        setHeader(headerData as HeaderType);
        setFooter(footerData as FooterType);
        setPage(pageData as PageType);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [locale]);

  const value: HeaderContextType = {
    header,
    footer,
    page,
    loading,
    locale,
    setLocale,
  };

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
}
