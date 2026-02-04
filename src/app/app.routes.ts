import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirección inicial
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // Rutas Públicas / Auth
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register) },
    ]
  },

  // Rutas de Usuario (Protegidas por AuthGuard más adelante)
  {
    path: 'products',
    loadComponent: () => import('./features/products/pages/product-list/product-list').then(m => m.ProductList)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/orders/pages/cart/cart').then(m => m.Cart)
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./features/orders/pages/order-list/order-list').then(m => m.OrderList)
  },

  // Rutas de Admin (Protegidas por AuthGuard y RoleGuard)
  {
    path: 'admin',
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'products', loadComponent: () => import('./features/admin/pages/manage-products/manage-products').then(m => m.ManageProducts) },
      { path: 'orders', loadComponent: () => import('./features/admin/pages/manage-orders/manage-orders').then(m => m.ManageOrders) },
    ]
  },

  // Comodín para 404
  { path: '**', redirectTo: 'products' }
];
