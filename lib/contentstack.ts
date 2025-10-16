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

// Debug logging for environment variables
console.log('Contentstack Config:', {
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? 'Set' : 'Missing',
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? 'Set' : 'Missing',
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
  contentDelivery: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY,
  branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH
});

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
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || (endpoints && endpoints.contentDelivery),

  branch: process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH as string,
  
  // Add retry configuration for better reliability
  retryDelay: 1000,
  retryLimit: 3,
  
  live_preview: {
    // Enabling live preview if specified in environment variables
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',

    // Setting the preview token from environment variables
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,

    // Setting the host for live preview based on the region
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || (endpoints && endpoints.preview)
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
  try {
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
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

export async function getBlogHeader() {
  try {
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
  } catch (error) {
    console.error('Error fetching header data:', error);
    return null;
  }
}

export async function getBlogFooter() {
  try {
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
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return null;
  }
}