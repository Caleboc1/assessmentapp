"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getProductCategories, getProducts } from "@/app/api/products";
import type { Product, SortField, SortOrder } from "@/types";

import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductList } from "@/components/products/ProductList";
import { ProductPagination } from "@/components/products/ProductPagination";
import { Skeleton } from "@/components/ui/skeleton";

import { useDebounce } from "@/hooks/useDebounce";

const PRODUCTS_PER_PAGE = 12;

/** Maps a UI sort option to the API's sortBy/order parameters. */
function parseSort(
  sort: string,
): { sortBy?: SortField; order?: SortOrder } {
  switch (sort) {
    case "title-asc":
      return { sortBy: "title", order: "asc" };
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "rating-desc":
      return { sortBy: "rating", order: "desc" };
    default:
      return {};
  }
}

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page") ?? "1");
  const initialSearch = searchParams.get("search") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";
  const initialSort = searchParams.get("sort") ?? "default";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(
    Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage,
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (sort !== "default") params.set("sort", sort);
    params.set("page", String(page));
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [search, category, sort, page, router]);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * PRODUCTS_PER_PAGE;
        const [productData, categoryData] = await Promise.all([
          getProducts({
            limit: PRODUCTS_PER_PAGE,
            skip,
            search: debouncedSearch,
            category: category === "all" ? undefined : category,
            ...parseSort(sort),
          }),
          getProductCategories(),
        ]);
        if (!cancelled) {
          setProducts(productData.products);
          setTotal(productData.total);
          setCategories(categoryData);
        }
      } catch {
        if (!cancelled) setError("Failed to load products.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, sort, page]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string | null) => {
    setCategory(value ?? "all");
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: string | null) => {
    setSort(value ?? "default");
    setPage(1);
  }, []);

  return (
    <main className="container mx-auto space-y-8 px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and monitor your product catalogue.
        </p>
      </header>

      <DashboardOverview products={products} totalProducts={total} />

      <section className="space-y-6">
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 p-8 text-center">
            <h2 className="font-semibold">Something went wrong</h2>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <ProductList products={products} />
            <ProductPagination
              page={page}
              total={total}
              limit={PRODUCTS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
