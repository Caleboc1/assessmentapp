import type { Product, ProductsResponse, UpdateProductPayload } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL ;

export async function getProducts(
    limit = 10,
    skip = 0,
) : Promise<ProductsResponse> {
    const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
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

export async function searchProduct(
    query: string,
    limit = 10,
    skip = 0,
): Promise<ProductsResponse> {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${query}&limit=${limit}&skip=${skip}`);
    if (!response.ok) {
        throw new Error("Failed to search products");
    }
    return response.json();
}

export async function getProductCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
        throw new Error("Failed to fetch product categories");
    }
    return response.json();
}

export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
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
