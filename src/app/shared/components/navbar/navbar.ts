import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  // Simulación de estado (Mañana lo traerás del AuthService)
  isLoggedIn = true;
  userRole: 'USER' | 'ADMIN' = 'USER'; // Cambia a 'ADMIN' para probar el otro menú
  isMobileMenuOpen = false;

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    console.log('Cerrando sesión...');
    // Aquí irá la lógica para limpiar el token
  }
}
