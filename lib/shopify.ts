import fallbackProducts from "@/lib/shopify-products.json";

export type ShopifyProduct = {
  id: number | string;
  title: string;
  handle: string;
  description?: string;
  price: string;
  image: string;
  url: string;
  vendor?: string;
  product_type?: string;
  tags?: string[] | string;
};

const SHOP_PRODUCTS_URL =
  "https://astralae.myshopify.com/products.json?limit=50";
export const SHOP_ALL_URL = "https://astralae.myshopify.com/collections/all";
export const SHOP_HOME = "https://astralae.myshopify.com/";

function mapShopifyPayload(data: {
  products?: Array<{
    id: number;
    title: string;
    handle: string;
    body_html?: string;
    vendor?: string;
    product_type?: string;
    tags?: string[] | string;
    images?: Array<{ src: string }>;
    variants?: Array<{ price: string }>;
  }>;
}): ShopifyProduct[] {
  return (data.products ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: (p.body_html || "").replace(/<[^>]+>/g, " ").slice(0, 280),
    price: p.variants?.[0]?.price ?? "",
    image: p.images?.[0]?.src ?? "",
    url: `https://astralae.myshopify.com/products/${p.handle}`,
    vendor: p.vendor,
    product_type: p.product_type,
    tags: p.tags,
  }));
}

/** Live fetch from Shopify public products.json; falls back to cached snapshot. */
export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  try {
    const res = await fetch(SHOP_PRODUCTS_URL, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
    const data = await res.json();
    const products = mapShopifyPayload(data);
    if (!products.length) throw new Error("Empty product list");
    return products;
  } catch {
    return fallbackProducts as ShopifyProduct[];
  }
}

export function formatPrice(price: string, currency = "USD") {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(n);
}
