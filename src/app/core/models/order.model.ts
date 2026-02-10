import { Product } from './product.model';

/**
 * Order status enumeration
 */
export enum OrderStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

/**
 * Order item (detail) interface
 */
export interface OrderItem {
    id: string | number;
    orderId: string | number;
    productId: string | number;
    quantity: number;
    price: number;
    product?: Product;
}

/**
 * Order model interface
 */
export interface Order {
    id: string | number;
    userId: string | number;
    status: OrderStatus;
    total: number;
    createdAt: Date;
    items?: OrderItem[];
    itemCount?: number;
}

/**
 * Cart item interface (for frontend cart management)
 */
export interface CartItem {
    product: Product;
    quantity: number;
    notes?: string;
}

/**
 * Create order request DTO
 */
export interface CreateOrderRequest {
    items: {
        productId: string | number;
        quantity: number;
    }[];
}

/**
 * Update order status request DTO (ADMIN only)
 */
export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}
