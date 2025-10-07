"use client";

import { Header as HeaderType, Footer as FooterType, PageData as PageType } from "@/lib/types";
import { getBlogHeader, getBlogFooter, getPageData } from "@/lib/contentstack";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface HeaderContextType {
  header: HeaderType | null;
  footer: FooterType | null;
  page: PageType | null;
  loading: boolean;
}

const HeaderContext = createContext<HeaderContextType>({
  header: null,
  footer: null,
  page: null,
  loading: true,
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [headerData, footerData, pageData] = await Promise.all([
          getBlogHeader(),
          getBlogFooter(),
          getPageData(),
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
  }, []);

  const value: HeaderContextType = {
    header,
    footer,
    page,
    loading,
  };

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
}
