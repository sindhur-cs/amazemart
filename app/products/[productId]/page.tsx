"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductByUid } from "@/lib/contentstack";
import { fixImageUrl } from "@/lib/utils";
import { useHeader } from "../../components/HeaderProvider";

interface VisualMarkup {
  id: string;
  type: string;
  title: string;
  description: string;
  url?: string;
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
}

interface ProductImage {
  uid: string;
  title: string;
  description: string;
  url: string;
  filename: string;
  visual_markups?: VisualMarkup[];
}

interface ColorOption {
  title: string;
  image: ProductImage;
  order: number;
  _metadata?: {
    uid: string;
  };
}

interface SizeOption {
  size: string[];
  _metadata?: {
    uid: string;
  };
}

interface Configuration {
  colour_options?: ColorOption;
  size?: SizeOption;
}

interface ProductEntry {
  uid: string;
  title: string;
  short_description: string;
  description: string;
  price: number;
  product_category: string;
  online_exclusive: boolean;
  product_images: ProductImage[];
  configurations: Configuration[];
  rating_and_review: {
    ratings: string;
    reviews: number;
  };
  seller_details: {
    returnable: boolean;
    seller_name: string;
  };
  url: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { locale } = useHeader();

  const [product, setProduct] = useState<ProductEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeType, setSizeType] = useState<"UK" | "BRAND">("UK");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const entry = await getProductByUid(productId, locale);
        setProduct(entry);
        
        if (entry) {
          const colorOptions = entry.configurations
            ?.filter((c: Configuration) => c.colour_options)
            .map((c: Configuration) => c.colour_options!)
            .sort((a: ColorOption, b: ColorOption) => a.order - b.order);
          
          if (colorOptions && colorOptions.length > 0) {
            setSelectedColor(colorOptions[0].title);
          }
          
          const sizes = entry.configurations?.find((c: Configuration) => c.size)?.size?.size;
          if (sizes && sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId, locale]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const colorOptions = product.configurations
    ?.filter(c => c.colour_options)
    .map(c => c.colour_options!)
    .sort((a, b) => a.order - b.order) || [];

  const sizeOptions = product.configurations
    ?.find(c => c.size)?.size?.size || [];

  const mainImage = product.product_images?.[selectedImageIndex];

  const mrpPrice = Math.round(product.price * 1.47);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-blue-600">{product.product_category || 'Products'}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Image */}
          <div className="lg:col-span-4">
            <div className="sticky top-20">
              {/* Online Exclusive Badge */}
              {product.online_exclusive && (
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                    Online exclusive
                  </span>
                </div>
              )}
              
              {/* Main Image */}
              <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={fixImageUrl(mainImage?.url)}
                  alt={mainImage?.title || product.title}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* View Similar Button */}
              <button className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>View similar</span>
              </button>
            </div>
          </div>

          {/* Middle Column - Feature Images Grid (2x2) */}
          <div className="lg:col-span-4">
            {product.product_images && product.product_images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {product.product_images.slice(0, 4).map((img, index) => (
                  <div 
                    key={img.uid}
                    className={`relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer hover:shadow-lg transition-shadow ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={fixImageUrl(img.url)}
                      alt={img.title || product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-4">
            {/* Brand & ID */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">ROCKRIDER</span>
              <span className="text-gray-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                ID: {product.uid.slice(-7)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {product.title}
            </h1>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Rating */}
            {product.rating_and_review && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                  <span className="font-medium">{product.rating_and_review.ratings}</span>
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">{product.rating_and_review.reviews}</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">₹ {product.price?.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">MRP</span>
                <span className="text-gray-400 line-through text-sm">₹ {mrpPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                or pay only ₹ {Math.round(product.price / 3).toLocaleString()} now, rest later via <span className="text-blue-600 font-medium">Auto Pay Later</span>
                <button className="ml-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </p>
            </div>

            {/* Color Options */}
            {colorOptions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">COLOUR OPTIONS</h3>
                <div className="flex space-x-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.title}
                      onClick={() => setSelectedColor(color.title)}
                      className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${
                        selectedColor === color.title
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={fixImageUrl(color.image?.url)}
                        alt={color.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizeOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">SELECT SIZE</h3>
                  <button className="text-blue-600 text-sm hover:underline">Size chart</button>
                </div>
                
                {/* Size Type Tabs */}
                <div className="flex mb-3">
                  <button
                    onClick={() => setSizeType("UK")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-l border ${
                      sizeType === "UK"
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    UK SIZE
                  </button>
                  <button
                    onClick={() => setSizeType("BRAND")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-r border-t border-r border-b ${
                      sizeType === "BRAND"
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    BRAND SIZE
                  </button>
                </div>

                {/* Size Options */}
                <div className="flex space-x-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                ADD TO CART
              </button>
              <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                ADD TO WISHLIST
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-8 py-4 border-t border-b border-gray-200 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">2 Year Warranty</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Made in India</span>
              </div>
            </div>

            {/* Delivery & Services */}
            {product.seller_details && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">DELIVERY & SERVICES</h3>
                <p className="text-sm text-gray-600">Sold by: {product.seller_details.seller_name}</p>
              </div>
            )}
          </div>
        </div>


        {/* Product Description - Benefits */}
        {product.description && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h2>
            <ProductBenefits description={product.description} />
          </div>
        )}
      </div>
    </main>
  );
}

// Component to parse and display product benefits in a styled grid
function ProductBenefits({ description }: { description: string }) {
  // Parse the HTML description to extract benefits
  const parseBenefits = (html: string) => {
    const benefits: { icon: string; title: string; text: string }[] = [];
    
    // Create a temporary div to parse HTML
    if (typeof window === 'undefined') return benefits;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Find all images and their following text
    const images = tempDiv.querySelectorAll('img');
    images.forEach((img) => {
      const iconSrc = img.getAttribute('src') || '';
      let textContent = '';
      
      // Get text after the image until the next image or end
      let nextNode = img.nextSibling;
      while (nextNode && nextNode.nodeName !== 'IMG') {
        if (nextNode.textContent) {
          textContent += nextNode.textContent;
        }
        nextNode = nextNode.nextSibling;
      }
      
      // Split the text into title and description
      const colonIndex = textContent.indexOf(':');
      if (colonIndex !== -1) {
        const title = textContent.substring(0, colonIndex).trim();
        const text = textContent.substring(colonIndex + 1).trim();
        if (title && text) {
          benefits.push({ icon: iconSrc, title, text });
        }
      }
    });
    
    return benefits;
  };

  const [benefits, setBenefits] = useState<{ icon: string; title: string; text: string }[]>([]);

  useEffect(() => {
    setBenefits(parseBenefits(description));
  }, [description]);

  if (benefits.length === 0) {
    // Fallback to raw HTML if parsing fails
    return (
      <div 
        className="prose prose-sm max-w-none text-gray-600"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Benefits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <img 
                src={fixImageUrl(benefit.icon)} 
                alt={benefit.title}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{benefit.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
