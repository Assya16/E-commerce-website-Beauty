import { type Product, type InsertProduct, type Order, type Review, type InsertReview } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order>;
  updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined>;

  // Reviews
  getReviewsByProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Admin
  validateAdmin(username: string, password: string): Promise<boolean>;
}

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Velvet Rose Lipstick",
    brand: "Bloom Beauty",
    description: "A luxurious matte lipstick with a velvet finish. This long-lasting formula glides on smoothly and stays comfortable all day. Enriched with vitamin E and shea butter for nourished, beautiful lips.",
    ingredients: "Ricinus Communis Seed Oil, Caprylic/Capric Triglyceride, Cera Alba, Silica, Tocopheryl Acetate, Butyrospermum Parkii Butter, Rosa Damascena Flower Extract",
    price: 28.00,
    originalPrice: 35.00,
    category: "lips",
    images: ["/assets/generated_images/luxury_lipstick_product.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: "prod-2",
    name: "Radiance Glow Serum",
    brand: "Bloom Beauty",
    description: "A powerful brightening serum formulated with vitamin C and hyaluronic acid. This lightweight formula absorbs quickly to reveal radiant, youthful-looking skin. Perfect for all skin types.",
    ingredients: "Aqua, Ascorbic Acid, Sodium Hyaluronate, Niacinamide, Glycerin, Aloe Barbadensis Leaf Juice, Tocopherol, Ferulic Acid",
    price: 52.00,
    category: "skincare",
    images: ["/assets/generated_images/luxury_serum_product.png"],
    inStock: true,
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "prod-3",
    name: "Hydra Bloom Moisturizer",
    brand: "Bloom Beauty",
    description: "A rich, nourishing moisturizer that provides 24-hour hydration. Formulated with botanical extracts and hyaluronic acid to plump and protect your skin barrier.",
    ingredients: "Aqua, Glycerin, Squalane, Cetyl Alcohol, Sodium Hyaluronate, Rosa Centifolia Flower Extract, Jojoba Oil, Vitamin E",
    price: 45.00,
    category: "skincare",
    images: ["/assets/generated_images/luxury_cream_product.png"],
    inStock: true,
    featured: false,
    bestSeller: true,
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: "prod-4",
    name: "Rose Petal Eyeshadow Palette",
    brand: "Bloom Beauty",
    description: "A stunning collection of 12 universally flattering shades from soft nudes to rose golds. Highly pigmented, blendable formula that lasts all day without creasing.",
    ingredients: "Talc, Mica, Magnesium Stearate, Silica, Dimethicone, Phenoxyethanol, Tocopheryl Acetate",
    price: 48.00,
    originalPrice: 58.00,
    category: "eyes",
    images: ["/assets/generated_images/eyeshadow_palette_product.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    rating: 4.6,
    reviewCount: 156,
  },
  {
    id: "prod-5",
    name: "Lash Luxe Mascara",
    brand: "Bloom Beauty",
    description: "A volumizing and lengthening mascara that delivers dramatic lashes without clumping. The curved brush reaches every lash for a full, fanned-out look.",
    ingredients: "Aqua, Cera Alba, Paraffin, Stearic Acid, Acacia Senegal Gum, Glyceryl Stearate, Panthenol",
    price: 26.00,
    category: "eyes",
    images: ["/assets/generated_images/mascara_product_shot.png"],
    inStock: true,
    featured: false,
    bestSeller: true,
    rating: 4.5,
    reviewCount: 312,
  },
  {
    id: "prod-6",
    name: "Gentle Bloom Cleanser",
    brand: "Bloom Beauty",
    description: "A gentle, hydrating cleanser that removes makeup and impurities without stripping your skin. Perfect for sensitive skin, leaving it soft and balanced.",
    ingredients: "Aqua, Glycerin, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Chamomilla Recutita Extract, Aloe Vera, Panthenol",
    price: 32.00,
    category: "skincare",
    images: ["/assets/generated_images/facial_cleanser_product.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    rating: 4.4,
    reviewCount: 78,
  },
  {
    id: "prod-7",
    name: "Rosy Glow Blush",
    brand: "Bloom Beauty",
    description: "A silky powder blush that gives you a natural, healthy flush. Buildable coverage from a subtle glow to a vibrant pop of color. Infused with rose extract.",
    ingredients: "Talc, Mica, Zinc Stearate, Silica, Dimethicone, Rosa Damascena Flower Extract, Tocopheryl Acetate",
    price: 24.00,
    category: "face",
    images: ["/assets/generated_images/blush_compact_product.png"],
    inStock: true,
    featured: true,
    bestSeller: false,
    rating: 4.7,
    reviewCount: 94,
  },
  {
    id: "prod-8",
    name: "Dewy Lip Gloss",
    brand: "Bloom Beauty",
    description: "A non-sticky lip gloss that delivers mirror-like shine with a hint of color. Enriched with vitamin E and jojoba oil for soft, moisturized lips all day.",
    ingredients: "Polybutene, Octyldodecanol, Silica, Tocopheryl Acetate, Simmondsia Chinensis Oil, Flavor",
    price: 18.00,
    category: "lips",
    images: ["/assets/generated_images/luxury_lipstick_product.png"],
    inStock: true,
    featured: false,
    bestSeller: false,
    rating: 4.3,
    reviewCount: 45,
  },
];

const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    customerName: "Sarah M.",
    customerEmail: "sarah@example.com",
    rating: 5,
    title: "Absolutely gorgeous!",
    content: "This lipstick is amazing! The color is beautiful and it lasts all day without drying out my lips. Will definitely repurchase!",
    verified: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-2",
    productId: "prod-2",
    customerName: "Emily R.",
    customerEmail: "emily@example.com",
    rating: 5,
    title: "Holy grail serum!",
    content: "I've been using this serum for a month and my skin has never looked better. It's lightweight and absorbs quickly. My dark spots are fading!",
    verified: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rev-3",
    productId: "prod-3",
    customerName: "Jessica L.",
    customerEmail: "jessica@example.com",
    rating: 4,
    title: "Great moisturizer",
    content: "Love how hydrating this is! It's perfect for my dry skin, especially in winter. The only reason I'm giving 4 stars is the jar packaging - would prefer a pump.",
    verified: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.reviews = new Map();

    // Initialize with sample products
    initialProducts.forEach((product) => {
      this.products.set(product.id, product);
    });

    // Initialize with sample reviews
    initialReviews.forEach((review) => {
      this.reviews.set(review.id, review);
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = `prod-${randomUUID().slice(0, 8)}`;
    const product: Product = {
      ...insertProduct,
      id,
      rating: 0,
      reviewCount: 0,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.customerInfo.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const id = `ord-${randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();
    const order: Order = {
      ...orderData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Reviews
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((review) => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = `rev-${randomUUID().slice(0, 8)}`;
    const review: Review = {
      ...insertReview,
      id,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    this.reviews.set(id, review);

    // Update product rating
    const productReviews = await this.getReviewsByProduct(insertReview.productId);
    const product = await this.getProduct(insertReview.productId);
    if (product) {
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / productReviews.length;
      this.products.set(insertReview.productId, {
        ...product,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: productReviews.length,
      });
    }

    return review;
  }

  // Admin
  async validateAdmin(username: string, password: string): Promise<boolean> {
    // Simple hardcoded admin for demo
    return username === "admin" && password === "admin123";
  }
}

export const storage = new MemStorage();
