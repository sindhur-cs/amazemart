// Importing Contentstack SDK and specific types for region and query operations
import contentstack from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// helper functions from private package to retrieve Contentstack endpoints in a convenient way
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

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
  // Use proxy in development to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    try {
      const response = await fetch('/api/contentstack/content_types/page/entries?environment=' + encodeURIComponent(process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev'));
      const result = await response.json();
      
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

  // Fallback to direct SDK call in production
  const result = await blogStack
    .contentType("page")
    .entry()
    .query()
    .find();

  if (result.entries && result.entries.length > 0) {
    const page = result.entries[0];
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(page as any, 'page', true);
    }
    
    return page;
  }
  
  return null;
}

export async function getBlogHeader() {
  // Use proxy in development to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    try {
      const response = await fetch('/api/contentstack/content_types/header/entries?environment=' + encodeURIComponent(process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev'));
      const result = await response.json();
      
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

  // Fallback to direct SDK call in production
  const result = await blogStack
    .contentType("header")
    .entry()
    .query()
    .find();

  if (result.entries && result.entries.length > 0) {
    const header = result.entries[0];
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(header as any, 'header', true);
    }
    
    return header;
  }
  
  return null;
}

export async function getBlogFooter() {
  // Use proxy in development to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    try {
      const response = await fetch('/api/contentstack/content_types/footer/entries?environment=' + encodeURIComponent(process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'dev'));
      const result = await response.json();
      
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

  // Fallback to direct SDK call in production
  const result = await blogStack
    .contentType("footer")
    .entry()
    .query()
    .find();

  if (result.entries && result.entries.length > 0) {
    const footer = result.entries[0];
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(footer as any, 'footer', true);
    }
    
    return footer;
  }
  
  return null;
}