"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory, getProducts } from "@/lib/contentstack";
import { fixImageUrl } from "@/lib/utils";
import { useHeader } from "../components/HeaderProvider";
import { getProductMessages } from "@/lib/i18n/product";

interface ProductImage {
  uid: string;
  url: string;
  title: string;
}

interface Product {
  uid: string;
  title: string;
  short_description?: string;
  price: number;
  product_category: string;
  product_images?: ProductImage[];
  rating_and_review?: {
    ratings: string;
    reviews: number;
  };
  brand?: string;
}

function ProductsLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const { locale } = useHeader();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let result;
        if (category) {
          result = await getProductsByCategory(category, locale);
        } else {
          result = await getProducts(locale);
        }
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, locale]);

  const getMrpPrice = (price: number) => Math.round(price * 1.3);
  const getDiscount = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-blue-600">{category || "All Products"}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {category || "All Products"}
          </h1>
          <span className="text-gray-500 text-sm">{products.length} products</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">Try a different category or browse all products.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => {
              const thumbnailImage = product.product_images?.[0];
              const mrp = getMrpPrice(product.price);
              const discount = getDiscount(product.price, mrp);

              return (
                <Link
                  key={product.uid}
                  href={`/products/${product.uid}`}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 p-4">
                    {discount > 20 && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                        Price drop
                      </span>
                    )}
                    {thumbnailImage?.url ? (
                      <img
                        src={fixImageUrl(`${thumbnailImage.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}&locale=${locale}`)}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Rating */}
                  {product.rating_and_review && (
                    <div className="px-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">
                          <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">{product.rating_and_review.ratings}</span>
                        </div>
                        <span className="text-gray-400 text-xs">| {product.rating_and_review.reviews}</span>
                      </div>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Brand */}
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-1">
                      {product.brand || "BRAND"}
                    </p>
                    
                    {/* Title */}
                    <h3 className="text-sm text-gray-600 line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-xs font-semibold text-orange-600">{discount}% Off</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className="w-full py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Added ${product.title} to cart!`);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
