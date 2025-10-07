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
    <div className="bg-gray-50 py-10 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-center divide-x divide-gray-100">
            {navigationItems.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex-1 flex items-center justify-center p-6 transition-colors duration-200 relative ${
                    isActive 
                      ? 'bg-purple-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 relative object-contain rounded-lg flex items-center justify-center">
                      {item.image?.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`font-medium text-base ${
                        isActive ? 'text-purple-700' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </span>
                      <span className={`text-sm ${
                        isActive ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        Explore {item.title.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
