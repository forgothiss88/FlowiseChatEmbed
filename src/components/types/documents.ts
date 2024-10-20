export type ContentMetadata = {
  kind: 'ig-video' | 'youtube-video' | 'tiktok-video' | 'article';
  pk: number;
  resource_url: string;
  media_url: string;
  subtitles: string;
  title?: string;
  caption?: string;
};

export type ProductMetadata = {
  kind: 'product';
  name: string;
  slug: string;
  price: string;
  item_url: string;
  thumbnail_url: string;
};
// bind K to be of type ProductMetadata or InstagramMetadata

export type SourceDocument<K extends ProductMetadata | ContentMetadata> = {
  page_content: string;
  metadata: K;
  type: 'Document';
};

export type SourceProduct = SourceDocument<ProductMetadata>;
export type SourceContent = SourceDocument<ContentMetadata>;
