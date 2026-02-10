/**
 * Product category enumeration
 */
export enum ProductCategory {
    ALL = 'ALL',
    BURGERS = 'BURGERS',
    SIDES = 'SIDES',
    DRINKS = 'DRINKS',
    DESSERTS = 'DESSERTS',
    PIZZA = 'PIZZA',
}

/**
 * Product model interface
 */
export interface Product {
    id: string | number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    isActive: boolean;
    category?: ProductCategory;
    imageUrl?: string;
    createdAt?: Date;
}

/**
 * Product filter parameters
 */
export interface ProductFilter {
    category?: ProductCategory;
    search?: string;
    isActive?: boolean;
}
