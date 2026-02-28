// Importing Contentstack SDK and specific types for region and query operations
import contentstack from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// helper functions from private package to retrieve Contentstack endpoints in a convenient way
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

// Helper function to fetch data via proxy
async function fetchViaProxy(contentType: string, locale: string = 'en-us') {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? '' // Relative URL for development
    : process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'; // Absolute URL for production
  
  const environment = encodeURIComponent(process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev');
  const response = await fetch(`${baseUrl}/api/contentstack/content_types/${contentType}/entries?environment=${environment}&locale=${locale}&include_fallback=true`, {
    headers: { api_version: '3.1' },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${contentType} data: ${response.status}`);
  }
  
  return response.json();
}

// Set the region by string value from environment variables
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as string)
// object with all endpoints for region.
const endpoints = getContentstackEndpoints(region, true)

// BlogStack for page data, navigation, carousel, and promotions
export const blogStack = contentstack.stack({
  // Setting the API key from environment variables
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,

  // Setting the delivery token from environment variables
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,

  // Setting the environment based on environment variables
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Setting the region
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,

  // Setting the host for content delivery based on the region or environment variables
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,

  //branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH as string,

  live_preview: {
    // Enabling live preview if specified in environment variables
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',

    // Setting the preview token from environment variables
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,

    // Setting the host for live preview based on the region
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true' && typeof window !== 'undefined') {
  ContentstackLivePreview.init({
    stackSdk: blogStack.config as IStackSdk,
    clientUrlParams: {
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST,
    },
    ssr: false, 
    enable: true,
    debug: false,
    runScriptsOnUpdate: true,
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_BLOG_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    },
  });
}

export async function getPageData(locale: string = 'en-us') {
  // Use proxy for all environments to ensure consistent behavior
  try {
    const result = await fetchViaProxy('page', locale);
    
    if (result.entries && result.entries.length > 0) {
      const page = result.entries[0];
      
      if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
        contentstack.Utils.addEditableTags(page as any, 'page', true);
      }
      
      return page;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching page data via proxy:', error);
    return null;
  }
}

export async function getBlogHeader(locale: string = 'en-us') {
  // Use proxy for all environments to ensure consistent behavior
  try {
    const result = await fetchViaProxy('header', locale);
    
    if (result.entries && result.entries.length > 0) {
      const header = result.entries[0];
      
      if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
        contentstack.Utils.addEditableTags(header as any, 'header', true);
      }
      
      return header;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching header data via proxy:', error);
    return null;
  }
}

export async function getBlogFooter(locale: string = 'en-us') {
  // Use proxy for all environments to ensure consistent behavior
  try {
    const result = await fetchViaProxy('footer', locale);
    
    if (result.entries && result.entries.length > 0) {
      const footer = result.entries[0];
      
      if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
        contentstack.Utils.addEditableTags(footer as any, 'footer', true);
      }
      
      return footer;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching footer data via proxy:', error);
    return null;
  }
}

// Fetch all gallery/launch entries
export async function getGalleryEntries(locale: string = 'en-us') {
  try {
    const result = await fetchViaProxy('gallery_page', locale);
    
    if (result.entries && result.entries.length > 0) {
      return result.entries;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching gallery entries via proxy:', error);
    return [];
  }
}

// Fetch a single gallery/launch entry by UID
export async function getGalleryEntryByUid(uid: string, locale: string = 'en-us') {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? '' 
      : process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';
    
    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';
    const response = await fetch(
      `${baseUrl}/api/contentstack/content_types/gallery_page/entries/${uid}?environment=${encodeURIComponent(environment)}&locale=${locale}&include_fallback=true&asset_fields[]=visual_markups`,
      { headers: { api_version: '3.1' } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery entry: ${response.status}`);
    }
    
    const result = await response.json();
    return result.entry || null;
  } catch (error) {
    console.error('Error fetching gallery entry by UID:', error);
    return null;
  }
}

// Fetch a single product entry by UID
export async function getProductByUid(uid: string, locale: string = 'en-us') {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? '' 
      : process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';
    
    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';
    const response = await fetch(
      `${baseUrl}/api/contentstack/content_types/product/entries/${uid}?environment=${encodeURIComponent(environment)}&locale=${locale}&include_fallback=true&asset_fields[]=user_defined_fields&asset_fields[]=visual_markups`,
      { headers: { api_version: '3.1' } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product entry: ${response.status}`);
    }
    
    const result = await response.json();
    return result.entry || null;
  } catch (error) {
    console.error('Error fetching product by UID:', error);
    return null;
  }
}

// Fetch all products
export async function getProducts(locale: string = 'en-us') {
  try {
    const result = await fetchViaProxy('product', locale);
    
    if (result.entries && result.entries.length > 0) {
      return result.entries;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products via proxy:', error);
    return [];
  }
}

// Fetch products by category
export async function getProductsByCategory(category: string, locale: string = 'en-us') {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? '' 
      : process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';
    
    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev';
    const query = JSON.stringify({ product_category: category });
    
    const response = await fetch(
      `${baseUrl}/api/contentstack/content_types/product/entries?environment=${encodeURIComponent(environment)}&locale=${locale}&include_fallback=true&query=${encodeURIComponent(query)}`,
      { headers: { api_version: '3.1' } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products by category: ${response.status}`);
    }
    
    const result = await response.json();
    return result.entries || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}