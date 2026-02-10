import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem } from '../models/order.model';
import { Product } from '../models/product.model';

/**
 * CartService - Manages shopping cart state
 *
 * Features:
 * - Add/remove/update cart items
 * - Persist cart to localStorage
 * - Calculate subtotal, tax, and total
 * - Reactive state with Angular signals
 */
@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly CART_KEY = 'riwi_orders_cart';
    private readonly TAX_RATE = 0.08; // 8% tax

    // Reactive state with signals
    private readonly cartItemsSignal = signal<CartItem[]>([]);

    // Public readonly computed signals
    readonly items = this.cartItemsSignal.asReadonly();
    readonly itemCount = computed(() =>
        this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
    );
    readonly subtotal = computed(() =>
        this.cartItemsSignal().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    );
    readonly tax = computed(() => this.subtotal() * this.TAX_RATE);
    readonly total = computed(() => this.subtotal() + this.tax());
    readonly isEmpty = computed(() => this.cartItemsSignal().length === 0);

    constructor() {
        this.loadCartFromStorage();

        // Auto-save cart to localStorage when it changes
        effect(() => {
            const items = this.cartItemsSignal();
            this.saveCartToStorage(items);
        });
    }

    /**
     * Add a product to the cart
     */
    addItem(product: Product, quantity: number = 1, notes?: string): void {
        const currentItems = this.cartItemsSignal();
        const existingIndex = currentItems.findIndex(item => item.product.id === product.id);

        if (existingIndex >= 0) {
            // Update quantity if product already in cart
            const updatedItems = [...currentItems];
            updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + quantity,
            };
            this.cartItemsSignal.set(updatedItems);
        } else {
            // Add new item
            this.cartItemsSignal.set([...currentItems, { product, quantity, notes }]);
        }
    }

    /**
     * Remove an item from the cart
     */
    removeItem(productId: string | number): void {
        const currentItems = this.cartItemsSignal();
        this.cartItemsSignal.set(currentItems.filter(item => item.product.id !== productId));
    }

    /**
     * Update the quantity of an item
     */
    updateQuantity(productId: string | number, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const currentItems = this.cartItemsSignal();
        const updatedItems = currentItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        this.cartItemsSignal.set(updatedItems);
    }

    /**
     * Increment item quantity
     */
    incrementQuantity(productId: string | number): void {
        const item = this.cartItemsSignal().find(i => i.product.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    /**
     * Decrement item quantity
     */
    decrementQuantity(productId: string | number): void {
        const item = this.cartItemsSignal().find(i => i.product.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    /**
     * Clear all items from cart
     */
    clearCart(): void {
        this.cartItemsSignal.set([]);
    }

    /**
     * Get cart items for order creation
     */
    getOrderItems(): { productId: string | number; quantity: number }[] {
        return this.cartItemsSignal().map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
        }));
    }

    /**
     * Load cart from localStorage
     */
    private loadCartFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.CART_KEY);
            if (stored) {
                const items = JSON.parse(stored) as CartItem[];
                this.cartItemsSignal.set(items);
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cartItemsSignal.set([]);
        }
    }

    /**
     * Save cart to localStorage
     */
    private saveCartToStorage(items: CartItem[]): void {
        try {
            localStorage.setItem(this.CART_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }
}
