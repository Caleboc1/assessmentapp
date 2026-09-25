import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct } from "@/app/api/products";

import { EditProductForm } from "@/components/products/EditProductForm";
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  // Carry the user's list state (search/filters/sort/page) into the back link
  // so returning to the list restores exactly what they were looking at.
  const { search, category, sort, page, ...rest } = await searchParams;
  const listParams = new URLSearchParams();
  if (typeof search === "string" && search) listParams.set("search", search);
  if (typeof category === "string" && category && category !== "all")
    listParams.set("category", category);
  if (typeof sort === "string" && sort && sort !== "default")
    listParams.set("sort", sort);
  if (typeof page === "string" && page && page !== "1")
    listParams.set("page", page);
  for (const [key, value] of Object.entries(rest)) {
    if (typeof value === "string" && value) listParams.set(key, value);
  }
  const queryString = listParams.toString();
  const backHref = `/products${queryString ? `?${queryString}` : ""}`;

  let product;

  try {
    product = await getProduct(productId);
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href={backHref}
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

          <EditProductForm product={product} />
        </div>
      </div>
    </main>
  );
}
