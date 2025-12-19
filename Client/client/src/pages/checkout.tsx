import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, ChevronLeft, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { customerInfoSchema, type CustomerInfo, type Product } from "@shared/schema";

const countries = [
  { value: "US", label: "Morocco" },
 // { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "France" },
];

const states = [
  { value: "CA", label: "Casablanca" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "WA", label: "Washington" },
  { value: "IL", label: "Illinois" },
];

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
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

  const createOrderMutation = useMutation({
    mutationFn: async (customerInfo: CustomerInfo) => {
      const orderData = {
        items: cartProducts.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
        customerInfo,
        subtotal,
        shipping,
        tax,
        total,
        status: "pending" as const,
        paymentStatus: "pending" as const,
      };
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: async (response) => {
      const order = await response.json();
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been confirmed.`,
      });
      navigate(`/orders?orderId=${order.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CustomerInfo) => {
    setIsProcessing(true);
    try {
      await createOrderMutation.mutateAsync(data);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-serif text-3xl font-normal text-foreground mb-4">
            Your bag is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some products to proceed with checkout.
          </p>
          <Button onClick={() => navigate("/products")} className="rounded-full px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="mb-6"
          data-testid="button-back-to-cart"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Bag
        </Button>

        <h1 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8" data-testid="text-checkout-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl font-normal">
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-state">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-zipcode" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-country">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl font-normal flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <p className="text-sm text-muted-foreground">
                        Payment will be collected upon delivery (Cash on Delivery)
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Stripe integration available for card payments
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full rounded-full"
                  size="lg"
                  disabled={isProcessing}
                  data-testid="button-place-order"
                >
                  {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif text-xl font-normal">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartProducts.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span data-testid="text-checkout-total">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
