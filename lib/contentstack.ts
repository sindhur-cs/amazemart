// Importing Contentstack SDK and specific types for region and query operations
import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// Importing the Page, BlogEntry, Header, and Footer type definitions 
import { Page } from "./types";

// helper functions from private package to retrieve Contentstack endpoints in a convienient way
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

// Set the region by string value from environment variables
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as string)
// object with all endpoints for region.
const endpoints = getContentstackEndpoints(region, true)

// Main stack for courses and pages
export const stack = contentstack.stack({
  // Setting the API key from environment variables
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,

  // Setting the delivery token from environment variables
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,

  // Setting the environment based on environment variables
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Setting the region
  // if the region doesnt exist, fall back to a custom region given by the env vars
  // for internal testing purposes at Contentstack we look for a custom region in the env vars, you do not have to do this.
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,

  // Setting the host for content delivery based on the region or environment variables
  // This is done for internal testing purposes at Contentstack, you can omit this if you have set a region above.
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,

  live_preview: {
    // Enabling live preview if specified in environment variables
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',

    // Setting the preview token from environment variables
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,

    // Setting the host for live preview based on the region
    // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

// Second stack for blog entries
export const blogStack = contentstack.stack({
  // Setting the API key for blog stack from environment variables
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY_STACK2 as string,

  // Setting the delivery token for blog stack from environment variables
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN_STACK2 as string,

  // Setting the environment for blog stack based on environment variables
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT_STACK2 as string,

  // Setting the region for blog stack
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION_STACK2 as any,

  // Setting the host for content delivery for blog stack
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY_STACK2 || endpoints && endpoints.contentDelivery,

  live_preview: {
    // Enabling live preview for blog stack if specified in environment variables
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_STACK2 === 'true',

    // Setting the preview token for blog stack from environment variables
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN_STACK2,

    // Setting the host for live preview for blog stack
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

// Initialize live preview functionality
export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false, // Disabling server-side rendering for live preview
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true', // Enabling live preview if specified in environment variables
    mode: "builder", // Setting the mode to "builder" for visual builder
    stackSdk: stack.config as IStackSdk, // Passing the stack configuration
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string, // Setting the API key from environment variables
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string, // Setting the environment from environment variables
    },
    clientUrlParams: {
      // Setting the client URL parameters for live preview
      // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints && endpoints.application
    },
    editButton: {
      enable: true, // Enabling the edit button for live preview
      exclude: ["outsideLivePreviewPortal"] // Excluding the edit button from the live preview portal
    },
  });
}
export async function getPage(url: string) {
  const result = await stack
    .contentType("page") // Specifying the content type as "page"
    .entry() // Accessing the entry
    .query() // Creating a query
    .where("url", QueryOperation.EQUALS, url) // Filtering entries by URL
    .find<Page>(); // Executing the query and expecting a result of type Page

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true); // Adding editable tags for live preview if enabled
    }

    return entry; // Returning the fetched entry
  }
}

export async function getCourses() {
  const result = await stack
    .contentType("course")
    .entry()
    .query()
    .find();

    return result.entries;
}

export async function getCourse(courseId: string) {
  const result = await stack
    .contentType("course")
    .entry(courseId)
    .fetch();

  return result;
}

// Blog entry functions using the second stack
export async function getBlogEntries() {
  const result = await blogStack
    .contentType("blog_entry")
    .entry()
    .query()
    .find();

  return result.entries;
}

export async function getBlogEntry(entryId: string) {
  const result = await blogStack
    .contentType("blog_entry")
    .entry(entryId)
    .fetch();

  if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true' && result) {
    contentstack.Utils.addEditableTags(result as any, 'blog_entry', true);
  }
  
  return result;
}

// Header functions for both stacks
export async function getBlogHeader() {
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

export async function getAcademyHeader() {
  const result = await stack
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

// Footer functions for both stacks
export async function getBlogFooter() {
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

export async function getPageData() {
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

export async function getAcademyFooter() {
  const result = await stack
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