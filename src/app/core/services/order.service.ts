import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, UpdateOrderStatusRequest } from '../models/order.model';
import { environment } from '../../../environments/environment';

/**
 * OrderService - Handles order-related API operations
 */
@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/orders`;

    /**
     * Get orders - USER gets their own orders, ADMIN gets all orders
     */
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.API_URL);
    }

    /**
     * Get a single order by ID
     */
    getOrderById(id: string | number): Observable<Order> {
        return this.http.get<Order>(`${this.API_URL}/${id}`);
    }

    /**
     * Create a new order (USER only)
     */
    createOrder(orderData: CreateOrderRequest): Observable<Order> {
        return this.http.post<Order>(this.API_URL, orderData);
    }

    /**
     * Update order status (ADMIN only)
     */
    updateOrderStatus(id: string | number, statusData: UpdateOrderStatusRequest): Observable<Order> {
        return this.http.put<Order>(`${this.API_URL}/${id}/status`, statusData);
    }

    /**
     * Cancel an order (USER only - only if status is PENDING)
     */
    cancelOrder(id: string | number): Observable<Order> {
        return this.http.put<Order>(`${this.API_URL}/${id}/cancel`, {});
    }
}
