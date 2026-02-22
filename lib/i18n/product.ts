import enUs from "@/messages/product/en-us.json";
import frFr from "@/messages/product/fr-fr.json";
import esEs from "@/messages/product/es-es.json";

export interface ProductMessages {
  loadingProduct: string;
  productNotFound: string;
  productNotFoundDescription: string;
  backToHome: string;
  home: string;
  products: string;
  onlineExclusive: string;
  viewSimilar: string;
  idPrefix: string;
  mrp: string;
  payLater: string;
  autoPayLater: string;
  colourOptions: string;
  selectSize: string;
  sizeChart: string;
  ukSize: string;
  brandSize: string;
  addToCart: string;
  addToWishlist: string;
  warranty: string;
  madeInIndia: string;
  deliveryAndServices: string;
  soldBy: string;
  productDetails: string;
  benefits: string;
}

const messages: Record<string, ProductMessages> = {
  "en-us": enUs as ProductMessages,
  "fr-fr": frFr as ProductMessages,
  "es-es": esEs as ProductMessages,
};

const defaultLocale = "en-us";

export function getProductMessages(locale: string): ProductMessages {
  return messages[locale] ?? messages[defaultLocale];
}

/** Replace {amount} placeholder in payLater string */
export function formatPayLater(message: string, amount: string | number): string {
  return message.replace("{amount}", String(amount));
}
