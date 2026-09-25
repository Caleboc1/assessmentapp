import { MetricCard } from "./MetricCard";
import type { Product } from "@/types";

interface DashboardOverviewProps {
  products: Product[];
  totalProducts: number;
}

export function DashboardOverview({
  products,
  totalProducts,
}: DashboardOverviewProps) {
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const averageRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 0;

  const inventoryValue = products.reduce(
    (total, p) => total + p.price * p.stock,
    0,
  );

  return (
    <section
      aria-label="Dashboard overview"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <MetricCard
        title="Total Products"
        value={totalProducts}
        description="Products in catalogue"
      />
      <MetricCard
        title="Low Stock"
        value={lowStockCount}
        description="Below 10 units"
      />
      <MetricCard
        title="Average Rating"
        value={averageRating.toFixed(1)}
        description="Across loaded products"
      />
      <MetricCard
        title="Inventory Value"
        value={`$${inventoryValue.toLocaleString()}`}
        description="Price × stock"
      />
    </section>
  );
}
