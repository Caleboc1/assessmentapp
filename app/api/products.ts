import type {
  Product,
  ProductsResponse,
  SortField,
  SortOrder,
  UpdateProductPayload,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export async function getProducts({
  limit = 10,
  skip = 0,
  search,
  category,
  sortBy,
  order,
}: GetProductsParams = {}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (sortBy) queryParams.set("sortBy", sortBy);
  if (order) queryParams.set("order", order);

  let endpoint = `${API_BASE_URL}/products`;

  if (search) {
    endpoint = `${API_BASE_URL}/products/search`;
    queryParams.set("q", search);
  } else if (category) {
    endpoint = `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`;
  }

  const url = `${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

export async function getProductCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch product categories");
  }

  const data = await response.json();
  return data.map((item: { slug: string }) => item.slug);
}

export async function updateProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}
