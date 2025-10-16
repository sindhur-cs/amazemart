// Importing Contentstack SDK and specific types for region and query operations
import contentstack from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// helper functions from private package to retrieve Contentstack endpoints in a convenient way
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

// Helper function to fetch data via proxy
async function fetchViaProxy(contentType: string) {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? '' // Relative URL for development
    : process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'; // Absolute URL for production
  
  const response = await fetch(`${baseUrl}/api/contentstack/content_types/${contentType}/entries?environment=` + encodeURIComponent(process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev'));
  
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

export async function getPageData() {
  // Use proxy for all environments to ensure consistent behavior
  try {
    const result = await fetchViaProxy('page');
    
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

export async function getBlogHeader() {
  // Use proxy for all environments to ensure consistent behavior
  try {
    const result = await fetchViaProxy('header');
    
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

export async function getBlogFooter() {
  // Use proxy for all environments to ensure consistent behavior
  try {
    const result = await fetchViaProxy('footer');
    
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