import { Link } from "wouter";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">Dose of Beauty</h3>
            <p className="text-sm text-muted-foreground">
              Discover your natural glow with our curated collection of premium beauty essentials.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider">Shop</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/products?category=skincare">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-skincare">
                  Skincare
                </span>
              </Link>
              <Link href="/products?category=makeup">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-makeup">
                  Makeup
                </span>
              </Link>
              <Link href="/products?category=lips">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-lips">
                  Lips
                </span>
              </Link>
              <Link href="/products">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-all">
                  All Products
                </span>
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider">Help</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/orders">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-orders">
                  Order Tracking
                </span>
              </Link>
              <span className="text-sm text-muted-foreground">Shipping Info</span>
              <span className="text-sm text-muted-foreground">Returns</span>
              <span className="text-sm text-muted-foreground">Contact Us</span>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider">About</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Our Story</span>
              <span className="text-sm text-muted-foreground">Sustainability</span>
              <span className="text-sm text-muted-foreground">Cruelty-Free</span>
              <span className="text-sm text-muted-foreground">Careers</span>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Dose of Beauty. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-primary text-primary" /> for beauty lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
