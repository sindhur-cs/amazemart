"use client";

import { PageData as PageType, NavigationItem } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CompactNavigationProps {
  page: PageType | null;
}

export default function CompactNavigation({ page }: CompactNavigationProps) {
  const pathname = usePathname();
  
  if (!page?.navigation || !Array.isArray(page.navigation)) {
    return null;
  }

  const navigationItems = page.navigation
    .slice()
    .sort((a, b) => {
      const orderA = a.navigation.order || 0;
      const orderB = b.navigation.order || 0;
      return orderA - orderB;
    })
    .map((item: NavigationItem) => ({
      title: item.navigation.title,
      href: item.navigation.url,
      key: item.navigation._metadata.uid,
    }));

  if (navigationItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{item.title}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
