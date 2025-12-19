import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronLeft, Heart, Minus, Plus, Star, ShoppingBag, Check, Truck, Shield, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/products/product-card";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Review } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    title: "",
    content: "",
  });

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/products", id, "reviews"],
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) =>
      products
        .filter((p) => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4),
    enabled: !!product,
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: typeof reviewForm) => {
      return apiRequest("POST", `/api/products/${id}/reviews`, {
        ...data,
        productId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", id, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
      setReviewForm({
        customerName: "",
        customerEmail: "",
        rating: 5,
        title: "",
        content: "",
      });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, quantity);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your bag.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    submitReviewMutation.mutate(reviewForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Product not found</h2>
          <Link href="/products">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/products">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2" data-testid="text-product-brand">
                {product.brand}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-normal text-foreground" data-testid="text-product-name">
                {product.name}
              </h1>
            </div>

            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold text-foreground" data-testid="text-product-price">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <Badge variant="destructive">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>

            <div className="flex items-center gap-4 py-4 border-y">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="flex-1 rounded-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-testid="button-add-to-bag"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Bag" : "Out of Stock"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={inWishlist ? "text-primary" : ""}
                onClick={() => toggleItem(product.id)}
                data-testid="button-add-wishlist"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Easy Returns</span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{product.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredients">
                <AccordionTrigger>Ingredients</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{product.ingredients}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="how-to-use">
                <AccordionTrigger>How to Use</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Apply to clean skin morning and evening. Gently massage in circular motions until fully absorbed.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {reviews && reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-normal mb-8" data-testid="text-reviews-title">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 rounded-lg bg-card border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{review.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.customerName} - {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 p-8 rounded-lg bg-card border">
          <h3 className="font-serif text-xl font-normal mb-6">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  value={reviewForm.customerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                  required
                  data-testid="input-review-name"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={reviewForm.customerEmail}
                  onChange={(e) => setReviewForm({ ...reviewForm, customerEmail: e.target.value })}
                  required
                  data-testid="input-review-email"
                />
              </div>
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="focus:outline-none"
                    data-testid={`button-rating-${star}`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= reviewForm.rating
                          ? "fill-primary text-primary"
                          : "text-muted hover:text-primary/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                placeholder="Summarize your experience"
                required
                data-testid="input-review-title"
              />
            </div>
            <div>
              <Label htmlFor="content">Your Review</Label>
              <Textarea
                id="content"
                value={reviewForm.content}
                onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                placeholder="Share your thoughts about this product"
                rows={4}
                required
                data-testid="input-review-content"
              />
            </div>
            <Button
              type="submit"
              disabled={submitReviewMutation.isPending}
              data-testid="button-submit-review"
            >
              {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </section>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-normal mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
