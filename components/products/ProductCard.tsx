import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-xl">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            <Badge variant="secondary">{product.rating.toFixed(1)}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">
              {product.stock} in stock
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
