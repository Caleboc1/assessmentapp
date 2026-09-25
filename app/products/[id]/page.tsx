import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct } from "@/api/products";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  let product;

  try {
    product = await getProduct(productId);
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        ← Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[0] ?? product.thumbnail}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <Badge>{product.category}</Badge>

            <h1 className="mt-3 text-3xl font-bold">
              {product.title}
            </h1>

            <p className="mt-3 text-muted-foreground">
              {product.description}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Price
                </p>
                <p className="font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Stock
                </p>
                <p className="font-semibold">
                  {product.stock}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Rating
                </p>
                <p className="font-semibold">
                  {product.rating.toFixed(1)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Brand
                </p>
                <p className="font-semibold">
                  {product.brand ?? "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}