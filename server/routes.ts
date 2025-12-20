import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertReviewSchema, customerInfoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      if (search && typeof search === "string") {
        const products = await storage.searchProducts(search);
        return res.json(products);
      }
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product Reviews
  app.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const reviews = await storage.getReviewsByProduct(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const data = insertReviewSchema.parse({
        ...req.body,
        productId: req.params.id,
      });
      const review = await storage.createReview(data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Search with autocomplete - also handle queryKey format
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const q = req.query.q as string | undefined;
      if (!q || q.length < 2) {
        return res.json([]);
      }
      const products = await storage.searchProducts(q);
      // Return structured results for autocomplete
      const suggestions = products.slice(0, 5).map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        image: p.images[0] || "",
      }));
      res.json(suggestions);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Orders
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const { email, orderId } = req.query;
      
      if (orderId && typeof orderId === "string") {
        const order = await storage.getOrder(orderId);
        if (order) {
          return res.json([order]);
        }
        // Try searching by email if order ID matches email pattern
        if (orderId.includes("@")) {
          const orders = await storage.getOrdersByEmail(orderId);
          return res.json(orders);
        }
        return res.json([]);
      }
      
      if (email && typeof email === "string") {
        const orders = await storage.getOrdersByEmail(email);
        return res.json(orders);
      }
      
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = req.body;
      
      // Validate customer info
      customerInfoSchema.parse(orderData.customerInfo);
      
      const order = await storage.createOrder({
        items: orderData.items,
        customerInfo: orderData.customerInfo,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        status: orderData.status || "pending",
        paymentStatus: orderData.paymentStatus || "pending",
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const isValid = await storage.validateAdmin(username, password);
      
      if (isValid) {
        // Simple token for demo purposes
        const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
    
  });

  return httpServer;
  
}
