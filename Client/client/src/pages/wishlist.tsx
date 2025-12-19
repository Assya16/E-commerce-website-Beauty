import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Wishlist() {
  const { items: wishlistIds, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const wishlistProducts = products?.filter((p) => wishlistIds.includes(p.id)) || [];

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product.id);
    });
    toast({
      title: "Added to bag",
      description: `${wishlistProducts.length} items have been added to your bag.`,
    });
  };

  if (wishlistIds.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-foreground mb-4" data-testid="text-empty-wishlist">
            Your wishlist is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Save your favorite products here for later.
          </p>
          <Link href="/products">
            <Button className="rounded-full px-8" data-testid="button-start-shopping">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-foreground" data-testid="text-wishlist-title">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAddAllToCart}
              disabled={wishlistProducts.length === 0}
              data-testid="button-add-all-to-cart"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add All to Bag
            </Button>
            <Button
              variant="ghost"
              onClick={clearWishlist}
              className="text-muted-foreground"
              data-testid="button-clear-wishlist"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
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
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
