"use client";

import "./globals.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";
import HeaderProvider, { useHeader } from "./components/HeaderProvider";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { header, footer, page, loading } = useHeader();
  const pathname = usePathname();

  const shouldShowCarousel = pathname === '/';

  return (
    <>
          {!loading && <Header header={header} />}
          {!loading && <Navigation page={page} />}
          {!loading && shouldShowCarousel && <Carousel page={page} />}
          {children}
          {!loading && <Footer footer={footer} currentPath={pathname} />}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <HeaderProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </HeaderProvider>
      </body>
    </html>
  );
}
