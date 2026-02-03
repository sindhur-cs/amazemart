export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}
export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  publish_details: PublishDetails;
  $: any;
}
export interface Link {
  title: string;
  href: string;
}
export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}
export interface Block {
  _version?: number;
  _metadata: any;
  $: any;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: ("image_left" | "image_right") | null;
}

export interface Blocks {
  block: Block;
}

export interface Header {
  uid: string;
  title: string;
  contentstack_logo?: File | null;
  header_links?: HeaderLinks;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  locale: string;
  tags: string[];
  publish_details: PublishDetails;
  ACL: any;
  _version: number;
  _in_progress?: boolean;
}
export interface HeaderLinks {
  [key: string]: HeaderSection | undefined;
}
export interface HeaderSection {
  [key: string]: HeaderLink | File | null | undefined;
}
export interface HeaderLink {
  title: string;
  href: string;
  target?: '_blank' | '_self';
}
export interface Footer {
  uid: string;
  title: string;
  links: FooterLinks;
  copyright: string;
  description?: string;
  contentstack_logo?: File | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  locale: string;
  tags: string[];
  publish_details: PublishDetails;
  ACL: any;
  _version: number;
  _in_progress?: boolean;
}
export interface FooterLinks {
  [key: string]: FooterLink | undefined;
}
export interface FooterLink {
  title: string;
  href: string;
}

export interface PageData {
  uid: string;
  title: string;
  url: string;
  description: string;
  image?: File | null;
  navigation: NavigationItem[];
  components: PageComponent[];
  promotion?: PromotionCard[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  locale: string;
  tags: string[];
  publish_details: PublishDetails;
  ACL: any;
  _version: number;
  _in_progress?: boolean;
}

export interface NavigationItem {
  navigation: {
    title: string;
    _metadata: {
      uid: string;
    };
    image: File;
    url: string;
    order: number;
  };
}

export interface PageComponent {
  hero_carousel?: HeroCarousel;
}

export interface HeroCarousel {
  title: string;
  _metadata: {
    uid: string;
  };
  background_image: File;
  cta: {
    title: string;
    href: string;
  };
}

export interface PromotionCard {
  promotion_card: {
    title: string;
    title_tag: string;
    description: string;
    image: File;
    link: {
      title: string;
      href: string;
    };
    _metadata: {
      uid: string;
    };
  };
}

export interface PromotionList {
  promotion_list: {
    title: string;
    title_tag: string;
    description: string;
    load_first_image_eager: boolean;
    reference: any[];
    cards: PromotionCard[];
    _metadata: {
      uid: string;
    };
  };
}

// Gallery/Launch types
export interface VisualMarkupCoordinates {
  x: number;      // X position in pixels
  y: number;      // Y position in pixels
  height?: number; // Height for BoundingBox type
  width?: number;  // Width for BoundingBox type
}

export interface VisualMarkup {
  id: string;
  type: "Hotspot" | "BoundingBox";
  title: string;
  description: string;
  url?: string;   // Optional video URL
  coordinates: VisualMarkupCoordinates;
  asset_uid?: string;  // Reference to the image this markup belongs to
}

export interface GalleryImage {
  uid: string;
  _version: number;
  title: string;
  description: string;
  parent_uid: string;
  filename: string;
  url: string;
  is_dir: boolean;
  created_at: string;
  created_by: string;
  file_size: string;
  content_type: string;
  tags: string[];
  locale: string;
  ACL: any;
  publish_details: PublishDetails;
  visual_markups?: VisualMarkup[] | Record<string, VisualMarkup[]>;
  dimension?: {
    width: number;
    height: number;
  };
}

// Visual markups can be stored as object keyed by asset UID
export type VisualMarkupsMap = Record<string, VisualMarkup[]>;

export interface GalleryEntry {
  uid: string;
  locale: string;
  _version: number;
  title: string;
  description: string;
  launch_id: string;
  url: string;
  gallery: {
    gallery_images: GalleryImage[];
  };
  spinset?: {
    spinsetimages: any[];
  };
  tags: string[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  publish_details: PublishDetails;
  visual_markups?: VisualMarkup[];  // Visual markups at entry level with asset_uid references
}

export interface GalleryListResponse {
  entries: GalleryEntry[];
  count: number;
}