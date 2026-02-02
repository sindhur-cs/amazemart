"use client";

import { PageData as PageType, NavigationItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  page: PageType | null;
}

export default function Navigation({ page }: NavigationProps) {
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
      image: item.navigation.image,
      key: item.navigation._metadata.uid,
      order: item.navigation.order
    }));

  if (navigationItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-col items-center group transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-2xl p-2 flex items-center justify-center mb-2 group-hover:shadow-md transition-shadow duration-200">
                  {item.image?.url ? (
                    <Image
                      src={`${item.image.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}`}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <span className={`font-medium text-xs text-center max-w-[80px] leading-tight ${
                  isActive ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
