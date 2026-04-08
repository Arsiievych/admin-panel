import { Component, computed, inject } from '@angular/core';
import { UserRole } from '../../../../core/models/auth.models';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-current-user',
  imports: [],
  templateUrl: './current-user.html',
  styleUrl: './current-user.css',
})
export class CurrentUser {
  private readonly authService = inject(AuthService);
  private readonly maxDisplayNameLength = 20;

  readonly profile = this.authService.profile;
  readonly displayName = computed(() => this.truncateName(this.profile()?.nickname || this.profile()?.email || 'Admin'));
  readonly email = computed(() => this.profile()?.email ?? 'No email');
  readonly roleLabel = computed(() => this.getRoleLabel(this.profile()?.role));
  readonly initials = computed(() => this.getInitials(this.displayName()));

  private truncateName(value: string): string {
    if (value.length <= this.maxDisplayNameLength) {
      return value;
    }

    return `${value.slice(0, this.maxDisplayNameLength - 3)}...`;
  }

  private getRoleLabel(role?: UserRole): string {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MODERATOR':
        return 'Moderator';
      case 'USER':
        return 'User';
      default:
        return role ? role.replace(/_/g, ' ') : 'Unknown role';
    }
  }

  private getInitials(value: string): string {
    const initials = value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return initials.slice(0, 2) || 'A';
  }
}
