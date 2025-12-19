import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";
import heroImage from "@assets/generated_images/hero_lifestyle_skincare_image.png";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.filter((p) => p.featured) || [];
  const bestSellers = products?.filter((p) => p.bestSeller) || [];

  return (
    <div className="min-h-screen">
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beauty lifestyle"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="mx-auto max-w-7xl px-4 w-full">
            <div className="max-w-xl space-y-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight" data-testid="text-hero-title">
                Discover Your Natural Glow
              </h1>
              <p className="text-lg text-white/90 leading-relaxed" data-testid="text-hero-subtitle">
                Curated beauty essentials that celebrate your natural beauty. 
                Premium skincare and makeup crafted with love.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="rounded-full px-8" data-testid="button-shop-now">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products?category=skincare">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                    data-testid="button-explore-skincare"
                  >
                    Explore Skincare
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Cruelty-Free</h3>
                <p className="text-sm text-muted-foreground">All products are 100% cruelty-free</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Natural Ingredients</h3>
                <p className="text-sm text-muted-foreground">Clean beauty with no harsh chemicals</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4" data-testid="text-bestsellers-title">
              Best Sellers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most-loved products that customers can't stop raving about
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(bestSellers.length > 0 ? bestSellers : products?.slice(0, 4) || []).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="rounded-full px-8" data-testid="button-view-all">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
            <Link href="/products?category=skincare">
            
 <div
    className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer bg-cover bg-center"
    style={{
      backgroundImage: `url("https://i.pinimg.com/736x/29/43/0f/29430fa414fd6ece889d53cf36425b84.jpg")`,
    }}
    data-testid="link-category-skincare"
  >                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-2xl text-white mb-2">Skincare</h3>
                  <span className="text-sm text-white/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/products?category=makeup">
 <div
    className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer bg-cover bg-center"
    style={{
      backgroundImage: `url("https://i.pinimg.com/736x/28/49/6a/28496aba7cb329187b8d4ad3895ea2b2.jpg")`,
    }}
    data-testid="link-category-skincare"
  >                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 bg-accent/40" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-2xl text-white mb-2">Makeup</h3>
                  <span className="text-sm text-white/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/products?category=lips">
<div
    className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer bg-cover bg-center"
    style={{
      backgroundImage: `url("https://i.pinimg.com/736x/36/c4/d6/36c4d6b76b4084b25906f84b4782ba43.jpg")`,
    }}
    data-testid="link-category-skincare"
  >                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 bg-secondary/40" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-2xl text-white mb-2">Lips</h3>
                  <span className="text-sm text-white/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked favorites from our collection
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-primary/5">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-6">
            Join the Bloom Community
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe for exclusive offers, beauty tips, and early access to new products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-newsletter-email"
            />
            <Button className="rounded-full px-8" data-testid="button-subscribe">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
