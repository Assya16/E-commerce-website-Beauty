import { Link } from "wouter";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-0 bg-transparent shadow-none hover-elevate cursor-pointer" data-testid={`card-product-${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && (
              <Badge variant="default" className="text-xs">Best Seller</Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge variant="destructive" className="text-xs">Sale</Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm ${
              inWishlist ? "text-primary" : "text-foreground"
            }`}
            onClick={handleToggleWishlist}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
          </Button>

          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-background"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Bag
            </Button>
          </div>
        </div>

        <CardContent className="px-0 pt-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider" data-testid={`text-brand-${product.id}`}>
            {product.brand}
          </p>
          <h3 className="font-medium text-foreground line-clamp-1" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground" data-testid={`text-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
