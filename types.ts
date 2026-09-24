export interface ProductReview{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}
export interface ProductDimensions{
    width: number;
    height: number;
    depth: number;
}
export interface ProductMeta{
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}
export interface Product{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand?: string;
    sku: string;
    weight: number;
    dimensions: ProductDimensions;
    meta: ProductMeta;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: ProductReview[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    images: string[];
    thumbnail: string;
}
export interface ProductsResponse{
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}
export interface UpdateProductPayload{
    price?: number;
    stock?: number;
}
export type SortField = "title" | "price" | "rating";
export type SortOrder = "asc" | "desc";