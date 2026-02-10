import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilter } from '../models/product.model';
import { environment } from '../../../environments/environment';

/**
 * ProductService - Handles product-related API operations
 */
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/products`;

    /**
     * Get all active products (for USER)
     */
    getProducts(filter?: ProductFilter): Observable<Product[]> {
        let params = new HttpParams();

        if (filter?.category && filter.category !== 'ALL') {
            params = params.set('category', filter.category);
        }
        if (filter?.search) {
            params = params.set('search', filter.search);
        }
        if (filter?.isActive !== undefined) {
            params = params.set('isActive', filter.isActive.toString());
        }

        return this.http.get<Product[]>(this.API_URL, { params });
    }

    /**
     * Get a single product by ID
     */
    getProductById(id: string | number): Observable<Product> {
        return this.http.get<Product>(`${this.API_URL}/${id}`);
    }

    /**
     * Create a new product (ADMIN only)
     */
    createProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(this.API_URL, product);
    }

    /**
     * Update a product (ADMIN only)
     */
    updateProduct(id: string | number, product: Partial<Product>): Observable<Product> {
        return this.http.put<Product>(`${this.API_URL}/${id}`, product);
    }

    /**
     * Deactivate a product (ADMIN only - soft delete)
     */
    deleteProduct(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
