import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Logo } from '../../../shared/ui/logo/logo';
import { CurrentUser } from './current-user/current-user';

@Component({
  selector: 'app-header',
  imports: [
    CurrentUser,
    Logo,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isUserMenuOpen = signal(false);

  @HostListener('document:click')
  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  goToProfile(): void {
    this.isUserMenuOpen.set(false);
    void this.router.navigate(['/profile']);
  }

  logout(): void {
    this.isUserMenuOpen.set(false);
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigate(['/login']);
      },
      error: () => {
        void this.router.navigate(['/login']);
      },
    });
  }
}
