import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import {
  AdminUserDetails,
  AdminUser,
  AdminUsersEmailVerifiedFilter,
  AdminUsersOrder,
  AdminUsersRoleFilter,
  AdminUsersStatusFilter,
} from '../../core/models/admin-users.models';
import { AdminUsersService } from '../../core/services/admin-users.service';
import { AuthService } from '../../core/services/auth.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-admin-users',
  imports: [PageShell],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit, OnDestroy {
  private readonly adminUsersService = inject(AdminUsersService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Users';
  readonly users = signal<AdminUser[]>([]);
  readonly page = signal(1);
  readonly perPage = signal(25);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly order = signal<AdminUsersOrder>('-id');
  readonly roleFilter = signal<AdminUsersRoleFilter>('');
  readonly statusFilter = signal<AdminUsersStatusFilter>('');
  readonly emailVerifiedFilter = signal<AdminUsersEmailVerifiedFilter>('');
  readonly searchDraft = signal('');
  readonly search = signal('');
  readonly filtersOpen = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedUserDetails = signal<AdminUserDetails | null>(null);
  readonly isDetailsOpen = signal(false);
  readonly isDetailsLoading = signal(false);
  readonly detailsErrorMessage = signal<string | null>(null);
  readonly activeDetailsTab = signal<'general' | 'legion' | 'inventory'>('general');
  readonly canViewDetails = computed(() => {
    const role = this.authService.profile()?.role;

    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  });
  readonly appliedFilters = computed(() => {
    const filters: Array<{ label: string; value: string }> = [];
    const roleFilter = this.roleFilter();
    const statusFilter = this.statusFilter();
    const emailVerifiedFilter = this.emailVerifiedFilter();

    if (this.search()) {
      filters.push({ label: 'Search', value: this.search() });
    }

    if (roleFilter) {
      filters.push({ label: 'Role', value: this.formatRole(roleFilter) });
    }

    if (statusFilter) {
      filters.push({ label: 'Status', value: this.formatStatus(statusFilter) });
    }

    if (emailVerifiedFilter) {
      filters.push({
        label: 'Email',
        value: emailVerifiedFilter === 'true' ? 'Verified' : 'Not verified',
      });
    }

    return filters;
  });

  readonly rangeLabel = computed(() => {
    const total = this.total();

    if (!total) {
      return '0 users';
    }

    const start = (this.page() - 1) * this.perPage() + 1;
    const end = Math.min(this.page() * this.perPage(), total);

    return `${start}-${end} of ${total}`;
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  sortBy(column: 'id' | 'name' | 'role' | 'status'): void {
    const currentOrder = this.order();
    const nextOrder = currentOrder === column ? (`-${column}` as AdminUsersOrder) : column;

    this.order.set(nextOrder);
    this.page.set(1);
    this.loadUsers();
  }

  setRoleFilter(value: AdminUsersRoleFilter): void {
    this.roleFilter.set(value);
    this.page.set(1);
    this.loadUsers();
  }

  setStatusFilter(value: AdminUsersStatusFilter): void {
    this.statusFilter.set(value);
    this.page.set(1);
    this.loadUsers();
  }

  setEmailVerifiedFilter(value: AdminUsersEmailVerifiedFilter): void {
    this.emailVerifiedFilter.set(value);
    this.page.set(1);
    this.loadUsers();
  }

  setSearchDraft(value: string): void {
    this.searchDraft.set(value);
    this.scheduleSearch();
  }

  toggleFilters(): void {
    this.filtersOpen.update((value) => !value);
  }

  sortDirection(column: 'id' | 'name' | 'role' | 'status'): 'asc' | 'desc' | null {
    const currentOrder = this.order();

    if (currentOrder === column) {
      return 'asc';
    }

    if (currentOrder === `-${column}`) {
      return 'desc';
    }

    return null;
  }

  previousPage(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.loadUsers();
  }

  reload(): void {
    this.loadUsers();
  }

  openDetails(userId: number): void {
    if (!this.canViewDetails()) {
      this.detailsErrorMessage.set('User details are available only for Admin and Super Admin accounts.');
      this.isDetailsOpen.set(true);
      this.selectedUserDetails.set(null);
      this.activeDetailsTab.set('general');
      return;
    }

    this.isDetailsOpen.set(true);
    this.activeDetailsTab.set('general');
    this.selectedUserDetails.set(null);
    this.detailsErrorMessage.set(null);
    this.isDetailsLoading.set(true);

    this.adminUsersService
      .getUserDetails(userId)
      .pipe(finalize(() => this.isDetailsLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.selectedUserDetails.set(response.data);
        },
        error: (error: unknown) => {
          const status = error instanceof HttpErrorResponse ? error.status : 0;

          if (status === 403) {
            this.detailsErrorMessage.set('User details are available only for Admin and Super Admin accounts.');
            return;
          }

          if (status === 404) {
            this.detailsErrorMessage.set('This user no longer exists.');
            return;
          }

          this.detailsErrorMessage.set('Unable to load user details.');
        },
      });
  }

  closeDetails(): void {
    this.isDetailsOpen.set(false);
    this.detailsErrorMessage.set(null);
    this.selectedUserDetails.set(null);
    this.activeDetailsTab.set('general');
  }

  setDetailsTab(tab: 'general' | 'legion' | 'inventory'): void {
    this.activeDetailsTab.set(tab);
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.adminUsersService
      .listUsers({
        page: this.page(),
        per_page: this.perPage(),
        order: this.order(),
        role: this.roleFilter() || undefined,
        status: this.statusFilter() || undefined,
        email_verified: this.toEmailVerifiedParam(this.emailVerifiedFilter()),
        search: this.search() || undefined,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const data = response.data;

          this.users.set(data.items);
          this.page.set(data.page);
          this.perPage.set(data.per_page);
          this.totalPages.set(data.total_pages);
          this.total.set(data.total);
        },
        error: () => {
          this.users.set([]);
          this.errorMessage.set('Unable to load users.');
        },
      });
  }

  private scheduleSearch(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      const normalizedSearch = this.searchDraft().trim();

      if (normalizedSearch === this.search()) {
        return;
      }

      this.search.set(normalizedSearch);
      this.page.set(1);
      this.loadUsers();
    }, 250);
  }

  private toEmailVerifiedParam(value: AdminUsersEmailVerifiedFilter): boolean | undefined {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return undefined;
  }

  private formatRole(value: Exclude<AdminUsersRoleFilter, ''>): string {
    return value.toLowerCase().replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private formatStatus(value: Exclude<AdminUsersStatusFilter, ''>): string {
    return value.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  formatValue(value: string | number | boolean | null): string {
    if (value === null || value === '') {
      return '—';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  }

  formatDate(value: string | null): string {
    if (!value) {
      return '—';
    }

    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }
}
