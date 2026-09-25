"use client";

import { useState } from "react";
import type { Product } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { updateProduct } from "@/app/api/products";

interface EditProductFormProps {
  product: Product;
  onUpdated?: (product: Product) => void;
}

export function EditProductForm({
  product,
  onUpdated,
}: EditProductFormProps) {
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsSaving(true);

    try {
      const updatedProduct = await updateProduct(
        product.id,
        {
          price: Number(price),
          stock: Number(stock),
        },
      );

      toast.success(
        "Product updated",
        `Changes to "${updatedProduct.title}" were saved successfully.`,
      );
      onUpdated?.(updatedProduct);
    } catch {
      toast.error(
        "Update failed",
        "Something went wrong while saving. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit product</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium"
            >
              Price
            </label>

            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stock"
              className="text-sm font-medium"
            >
              Stock
            </label>

            <Input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(event) =>
                setStock(event.target.value)
              }
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
