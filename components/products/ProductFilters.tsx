"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
      />
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="title-asc">Title A–Z</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
