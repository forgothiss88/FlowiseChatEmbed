export type ShopifyCart = {
  token: string;
  note: string;
  attributes: {
    _elevar__fbp: string;
    _elevar_visitor_info: string;
    _elevar__ga: string;
    _elevar__ttp: string;
    _elevar__ga_6LY1C5W021: string;
    _elevar__ga_QMYJZ9FHGX: string;
  };
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: {
    id: number;
    properties: Record<string, unknown>;
    quantity: number;
    variant_id: number;
    key: string;
    title: string;
    price: number;
    original_price: number;
    presentment_price: number;
    discounted_price: number;
    line_price: number;
    original_line_price: number;
    total_discount: number;
    discounts: {
      amount: number;
      title: string;
    }[];
    sku: string;
    grams: number;
    vendor: string;
    taxable: boolean;
    product_id: number;
    product_has_only_default_variant: boolean;
    gift_card: boolean;
    final_price: number;
    final_line_price: number;
    url: string;
    featured_image: {
      aspect_ratio: number;
      alt: string;
      height: number;
      url: string;
      width: number;
    };
    image: string;
    handle: string;
    requires_shipping: boolean;
    product_type: string;
    product_title: string;
    product_description: string;
    variant_title: string;
    variant_options: string[];
    options_with_values: {
      name: string;
      value: string;
    }[];
    line_level_discount_allocations: {
      amount: number;
      discount_application: {
        type: string;
        key: string;
        title: string;
        description: string | null;
        value: string;
        created_at: string;
        value_type: string;
        allocation_method: string;
        target_selection: string;
        target_type: string;
        total_allocated_amount: number;
      };
    }[];
    line_level_total_discount: number;
    has_components: boolean;
  }[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: unknown[];
};
