import { z } from "zod";

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  description: z.string(),
  ingredients: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  category: z.enum(["skincare", "makeup", "lips", "eyes", "face"]),
  subcategory: z.string().optional(),
  images: z.array(z.string()),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
});

export type Product = z.infer<typeof productSchema>;
export const insertProductSchema = productSchema.omit({ id: true, rating: true, reviewCount: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string(),
  })),
  customerInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  subtotal: z.number(),
  shipping: z.number(),
  tax: z.number(),
  total: z.number(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  paymentIntentId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;
export const insertOrderSchema = orderSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Review schema
export const reviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  rating: z.number().min(1).max(5),
  title: z.string(),
  content: z.string(),
  verified: z.boolean().default(false),
  createdAt: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;
export const insertReviewSchema = reviewSchema.omit({ id: true, createdAt: true, verified: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Wishlist schema
export const wishlistItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerEmail: z.string().email(),
  createdAt: z.string(),
});

export type WishlistItem = z.infer<typeof wishlistItemSchema>;

// Admin user schema  
export const adminUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export type AdminUser = z.infer<typeof adminUserSchema>;
export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Customer info for checkout
export const customerInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
