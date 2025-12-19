import { useState } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Order } from "@shared/schema";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
};

export default function Orders() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialOrderId = searchParams.get("orderId") || "";

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    initialOrderId || null
  );

  const {
  data: orders,
  isLoading,
  refetch,
} = useQuery<Order[]>({
  queryKey: ["orders", searchQuery],
  queryFn: async () => {
    if (!searchQuery) return [];

    const isEmail = searchQuery.includes("@");

    const url = isEmail
      ? `/api/orders?email=${encodeURIComponent(searchQuery)}`
      : `/api/orders?orderId=${encodeURIComponent(searchQuery)}`;

    const res = await fetch(url);
    return res.json();
  },
  enabled: false, // important
});


const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!searchQuery.trim()) return;

  await refetch(); // 🔥 THIS triggers the request
};


  const StatusIcon = ({ status }: { status: keyof typeof statusConfig }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <div
        className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1
          className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-2"
          data-testid="text-orders-title"
        >
          Order Tracking
        </h1>
        <p className="text-muted-foreground mb-8">
          Track your orders and view order history
        </p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter order ID or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-order-search"
              />
            </div>
            <Button type="submit" data-testid="button-search-orders">
              Track Order
            </Button>
          </div>
        </form>

        {!searchQuery && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2
              className="font-serif text-2xl font-normal text-foreground mb-4"
              data-testid="text-no-search"
            >
              Enter your order details
            </h2>
            <p className="text-muted-foreground">
              Use your order ID or email to track your order status
            </p>
          </div>
        )}

        {isLoading && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Searching for orders...</p>
          </div>
        )}

        {orders && orders.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <p className="text-muted-foreground" data-testid="text-no-orders">
              No orders found for "{searchQuery}"
            </p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <Collapsible
                  open={expandedOrder === order.id}
                  onOpenChange={(open) =>
                    setExpandedOrder(open ? order.id : null)
                  }
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover-elevate">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <StatusIcon status={order.status} />
                          <div>
                            <CardTitle className="font-medium text-base">
                              Order #{order.id.slice(0, 8)}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {statusConfig[order.status].label}
                            </Badge>
                            <p className="text-sm font-semibold mt-1">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="border-t pt-4 mt-2">
                        <div className="flex mb-6">
                          {Object.entries(statusConfig)
                            .slice(0, 4)
                            .map(([key, config], index) => {
                              const statusOrder = [
                                "pending",
                                "processing",
                                "shipped",
                                "delivered",
                              ];
                              const currentIndex = statusOrder.indexOf(
                                order.status
                              );
                              const isComplete = index <= currentIndex;
                              const Icon = config.icon;

                              return (
                                <div key={key} className="flex-1 relative">
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isComplete ? config.color : "bg-muted"
                                      }`}
                                    >
                                      <Icon
                                        className={`h-5 w-5 ${
                                          isComplete
                                            ? "text-white"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    </div>
                                    <span
                                      className={`text-xs mt-2 ${
                                        isComplete
                                          ? "text-foreground"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {config.label}
                                    </span>
                                  </div>
                                  {index < 3 && (
                                    <div
                                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                        index < currentIndex
                                          ? config.color
                                          : "bg-muted"
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                        </div>

                        <h4 className="font-medium mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Shipping Address</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.customerInfo.firstName}{" "}
                            {order.customerInfo.lastName}
                            <br />
                            {order.customerInfo.address}
                            <br />
                            {order.customerInfo.city},{" "}
                            {order.customerInfo.state}{" "}
                            {order.customerInfo.zipCode}
                            <br />
                            {order.customerInfo.country}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
