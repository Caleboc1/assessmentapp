"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
] as const;

interface ProductFiltersProps {
  search: string;
  category: string;
  sort: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onSortChange: (value: string | null) => void;
}

export function ProductFilters({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  // Base UI's <Select.Value> renders the raw value unless the Root receives an
  // `items` map of value -> label, so the trigger shows "Price: Low to High"
  // instead of "price-asc".
  const categoryItems = [
    { value: "all", label: "All categories" },
    ...categories.map((slug) => ({ value: slug, label: slug })),
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
      />
      <Select
        items={categoryItems}
        value={category}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger aria-label="Filter by category">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          {categoryItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select items={[...SORT_OPTIONS]} value={sort} onValueChange={onSortChange}>
        <SelectTrigger aria-label="Sort products">
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
