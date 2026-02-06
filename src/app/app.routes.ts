import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, adminGuard } from './core/guards';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // Public / Auth Routes (only accessible when NOT logged in)
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register').then((m) => m.Register),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // User Routes (protected - requires authentication)
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list').then(
        (m) => m.ProductList
      ),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'my-orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/pages/order-list/order-list').then((m) => m.OrderList),
  },

  // Admin Routes (protected - requires ADMIN role)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/pages/manage-products/manage-products').then(
            (m) => m.ManageProducts
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/pages/manage-orders/manage-orders').then(
            (m) => m.ManageOrders
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Wildcard - 404 redirect
  { path: '**', redirectTo: 'products' },
];
