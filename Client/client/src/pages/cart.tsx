import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@shared/schema";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cartProducts = items
    .map((item) => {
      const product = products?.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as { productId: string; quantity: number; product: Product }[];

  const subtotal = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-foreground mb-4" data-testid="text-empty-cart">
            Your bag is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your bag yet.
          </p>
          <Link href="/products">
            <Button className="rounded-full px-8" data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8" data-testid="text-cart-title">
          Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-lg bg-card border"
                data-testid={`cart-item-${item.productId}`}
              >
                <Link href={`/products/${item.productId}`}>
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {item.product.brand}
                      </p>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors" data-testid={`text-cart-product-name-${item.productId}`}>
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <p className="font-semibold text-foreground" data-testid={`text-cart-product-price-${item.productId}`}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        data-testid={`button-decrease-${item.productId}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.productId}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId)}
                      data-testid={`button-remove-${item.productId}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link href="/products">
                <Button variant="ghost" data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-muted-foreground"
                data-testid="button-clear-cart"
              >
                Clear Bag
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl font-normal">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span data-testid="text-shipping">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-primary">
                    You've qualified for free shipping!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span data-testid="text-total">${total.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full rounded-full mt-4" size="lg" data-testid="button-checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="text-center text-xs text-muted-foreground pt-4">
                  <p>Secure checkout powered by industry-standard encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
