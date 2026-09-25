import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading products...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
