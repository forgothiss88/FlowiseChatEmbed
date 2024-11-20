export type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at: string;
  created_at: string;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price: number | null;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;
  variants: Variant[];
  images: string[];
  featured_image: string;
  options: Option[];
  url: string;
};

type Variant = {
  id: number;
  title: string;
  options: string[];
  option1: string | null;
  option2: string | null;
  option3: string | null;
  price: number;
  weight: number;
  compare_at_price: number | null;
  inventory_management: string;
  available: boolean;
  sku: string | null;
  requires_shipping: boolean;
  taxable: boolean;
  barcode: string;
};

type Option = {
  name: string;
  position: number;
};
