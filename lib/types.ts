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