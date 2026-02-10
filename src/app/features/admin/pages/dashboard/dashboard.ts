import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../../../core/models/order.model';

// Interfaces para el Dashboard
interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
}

interface OrderItemDisplay {
  id: number;
  productName: string;
  description: string;
  quantity: number;
  price: number;
}

interface OrderDisplay {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: Date;
  status: OrderStatus;
  total: number;
  items: OrderItemDisplay[];
  subtotal: number;
  tax: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Estados del pedido para el select
  readonly orderStatuses = Object.values(OrderStatus);

  // Estado seleccionado para actualizar
  selectedStatus = signal<OrderStatus>(OrderStatus.PENDING);

  // Datos mock de estadísticas
  readonly stats = signal<DashboardStats>({
    totalOrders: 1245,
    pendingOrders: 15,
    todayRevenue: 3450
  });

  // Datos mock de pedidos
  readonly orders = signal<OrderDisplay[]>([
    {
      id: 1024,
      userId: 1,
      userName: 'Alice Smith',
      userEmail: 'alice.smith@example.com',
      userPhone: '+1 (555) 123-4567',
      date: new Date('2024-10-27T14:30:00'),
      status: OrderStatus.PREPARING,
      total: 48.60,
      subtotal: 45.00,
      tax: 3.60,
      items: [
        { id: 1, productName: 'Burger Classico', description: 'Extra cheese, No onions', quantity: 2, price: 24.00 },
        { id: 2, productName: 'Truffle Fries', description: 'Large', quantity: 1, price: 8.00 },
        { id: 3, productName: 'Vanilla Shake', description: '', quantity: 1, price: 5.00 },
        { id: 4, productName: 'Chocolate Cake', description: '', quantity: 1, price: 8.00 },
      ]
    },
    {
      id: 1023,
      userId: 2,
      userName: 'Bob Jones',
      userEmail: 'bob.jones@example.com',
      userPhone: '+1 (555) 234-5678',
      date: new Date('2024-10-27T14:15:00'),
      status: OrderStatus.PENDING,
      total: 12.50,
      subtotal: 11.57,
      tax: 0.93,
      items: [
        { id: 5, productName: 'Caesar Salad', description: 'No croutons', quantity: 1, price: 12.50 },
      ]
    },
    {
      id: 1022,
      userId: 3,
      userName: 'Charlie Day',
      userEmail: 'charlie.day@example.com',
      userPhone: '+1 (555) 345-6789',
      date: new Date('2024-10-27T13:50:00'),
      status: OrderStatus.DELIVERED,
      total: 32.00,
      subtotal: 29.63,
      tax: 2.37,
      items: [
        { id: 6, productName: 'Pepperoni Pizza', description: 'Medium', quantity: 1, price: 18.00 },
        { id: 7, productName: 'Garlic Bread', description: '', quantity: 2, price: 14.00 },
      ]
    },
    {
      id: 1021,
      userId: 4,
      userName: 'Diana Prince',
      userEmail: 'diana.prince@example.com',
      userPhone: '+1 (555) 456-7890',
      date: new Date('2024-10-27T13:45:00'),
      status: OrderStatus.DELIVERED,
      total: 55.00,
      subtotal: 50.93,
      tax: 4.07,
      items: [
        { id: 8, productName: 'Steak Premium', description: 'Medium rare', quantity: 1, price: 35.00 },
        { id: 9, productName: 'Mashed Potatoes', description: '', quantity: 1, price: 8.00 },
        { id: 10, productName: 'Red Wine', description: 'Glass', quantity: 1, price: 12.00 },
      ]
    },
    {
      id: 1020,
      userId: 5,
      userName: 'Evan Wright',
      userEmail: 'evan.wright@example.com',
      userPhone: '+1 (555) 567-8901',
      date: new Date('2024-10-27T13:30:00'),
      status: OrderStatus.PREPARING,
      total: 22.00,
      subtotal: 20.37,
      tax: 1.63,
      items: [
        { id: 11, productName: 'Fish & Chips', description: '', quantity: 1, price: 16.00 },
        { id: 12, productName: 'Coleslaw', description: '', quantity: 1, price: 6.00 },
      ]
    },
  ]);

  // Pedido seleccionado
  readonly selectedOrderId = signal<number | null>(1024);

  // Computed para obtener el pedido seleccionado
  readonly selectedOrder = computed(() => {
    const id = this.selectedOrderId();
    return this.orders().find(order => order.id === id) || null;
  });

  // Paginación
  readonly currentPage = signal<number>(1);
  readonly totalPages = 12;
  readonly itemsPerPage = 5;

  // Seleccionar un pedido
  selectOrder(orderId: number): void {
    this.selectedOrderId.set(orderId);
    const order = this.orders().find(o => o.id === orderId);
    if (order) {
      this.selectedStatus.set(order.status);
    }
  }

  // Actualizar estado del pedido
  updateOrderStatus(): void {
    const orderId = this.selectedOrderId();
    const newStatus = this.selectedStatus();

    if (orderId) {
      // Actualizar el estado en los datos mock
      this.orders.update(orders =>
        orders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
      console.log(`Order #${orderId} status updated to ${newStatus}`);
    }
  }

  // Navegar entre páginas
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.PREPARING:
        return 'status-preparing';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Placeholder para filtro
  openFilter(): void {
    console.log('Filter clicked - placeholder');
  }

  // Placeholder para exportar
  exportData(): void {
    console.log('Export clicked - placeholder');
  }

  // Formatear fecha
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  // Formatear moneda
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
