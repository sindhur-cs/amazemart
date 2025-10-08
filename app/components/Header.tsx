"use client";

import { Header as HeaderType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  header: HeaderType | null;
}

export default function Header({ header }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              {header?.contentstack_logo?.url ? (
                <Image
                  src={header?.contentstack_logo.url || "/logo_gif.webp"}
                  alt={header?.title}
                  width={40}
                  height={40}
                  className="w-auto h-8"
                />
              ) : (
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              )}
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                {header?.title}
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form onSubmit={() => {}} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2.5 pl-12 pr-4 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

            <nav className="hidden md:flex items-center space-x-4 flex-shrink-0">
              <button className="cursor-pointer flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13 1.75C6.7868 1.75 1.75 6.7868 1.75 13C1.75 19.2132 6.7868 24.25 13 24.25C19.2132 24.25 24.25 19.2132 24.25 13C24.25 6.7868 19.2132 1.75 13 1.75ZM0.25 13C0.25 5.95837 5.95837 0.25 13 0.25C20.0416 0.25 25.75 5.95837 25.75 13C25.75 20.0416 20.0416 25.75 13 25.75C5.95837 25.75 0.25 20.0416 0.25 13Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M13 7.75C10.6528 7.75 8.75 9.65279 8.75 12C8.75 14.3472 10.6528 16.25 13 16.25C15.3472 16.25 17.25 14.3472 17.25 12C17.25 9.65279 15.3472 7.75 13 7.75ZM7.25 12C7.25 8.82436 9.82436 6.25 13 6.25C16.1756 6.25 18.75 8.82436 18.75 12C18.75 15.1756 16.1756 17.75 13 17.75C9.82436 17.75 7.25 15.1756 7.25 12Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M13 17.75C11.4765 17.75 9.98271 18.1711 8.68427 18.9681C7.38583 19.7651 6.33344 20.906 5.64375 22.2645C5.45624 22.6339 5.00482 22.7813 4.63548 22.5938C4.26614 22.4062 4.11874 21.9548 4.30625 21.5855C5.12134 19.98 6.36507 18.6316 7.89959 17.6897C9.43411 16.7478 11.1995 16.25 13 16.25C14.8005 16.25 16.5659 16.7478 18.1004 17.6897C19.6349 18.6316 20.8787 19.98 21.6937 21.5855C21.8813 21.9548 21.7339 22.4062 21.3645 22.5938C20.9952 22.7813 20.5438 22.6339 20.3563 22.2645C19.6666 20.906 18.6142 19.7651 17.3157 18.9681C16.0173 18.1711 14.5235 17.75 13 17.75Z" fill="currentColor"/>
                </svg>
                <span>Login</span>
              </button>
              <button className="cursor-pointer flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M5.00014 14H18.1359C19.1487 14 19.6551 14 20.0582 13.8112C20.4134 13.6448 20.7118 13.3777 20.9163 13.0432C21.1485 12.6633 21.2044 12.16 21.3163 11.1534L21.9013 5.88835C21.9355 5.58088 21.9525 5.42715 21.9031 5.30816C21.8597 5.20366 21.7821 5.11697 21.683 5.06228C21.5702 5 21.4155 5 21.1062 5H4.50014M2 2H3.24844C3.51306 2 3.64537 2 3.74889 2.05032C3.84002 2.09463 3.91554 2.16557 3.96544 2.25376C4.02212 2.35394 4.03037 2.48599 4.04688 2.7501L4.95312 17.2499C4.96963 17.514 4.97788 17.6461 5.03456 17.7462C5.08446 17.8344 5.15998 17.9054 5.25111 17.9497C5.35463 18 5.48694 18 5.75156 18H19M7.5 21.5H7.51M16.5 21.5H16.51M8 21.5C8 21.7761 7.77614 22 7.5 22C7.22386 22 7 21.7761 7 21.5C7 21.2239 7.22386 21 7.5 21C7.77614 21 8 21.2239 8 21.5ZM17 21.5C17 21.7761 16.7761 22 16.5 22C16.2239 22 16 21.7761 16 21.5C16 21.2239 16.2239 21 16.5 21C16.7761 21 17 21.2239 17 21.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Cart</span>
              </button>
            </nav>
        </div>
      </div>
    </header>
  );
}
