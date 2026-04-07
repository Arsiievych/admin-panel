import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminUser, AdminUsersOrder } from '../../core/models/admin-users.models';
import { AdminUsersService } from '../../core/services/admin-users.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, PageShell],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  private readonly adminUsersService = inject(AdminUsersService);
  private readonly route = inject(ActivatedRoute);

  readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Users';
  readonly users = signal<AdminUser[]>([]);
  readonly page = signal(1);
  readonly perPage = signal(10);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly order = signal<AdminUsersOrder>('id');
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

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

  setPerPage(value: string): void {
    this.perPage.set(Number(value));
    this.page.set(1);
    this.loadUsers();
  }

  setOrder(value: AdminUsersOrder): void {
    this.order.set(value);
    this.page.set(1);
    this.loadUsers();
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

  private loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.adminUsersService
      .listUsers({
        page: this.page(),
        per_page: this.perPage(),
        order: this.order(),
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
}
