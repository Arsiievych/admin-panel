import { inject, Injectable } from '@angular/core';
import { AdminUsersRequest, AdminUsersResponse } from '../models/admin-users.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly api = inject(ApiService);

  listUsers(params: AdminUsersRequest) {
    return this.api.get<AdminUsersResponse>('users', {
      params: {
        page: params.page,
        per_page: params.per_page,
        order: params.order,
        ...(params.role ? { role: params.role } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.email_verified !== undefined ? { email_verified: params.email_verified } : {}),
        ...(params.search ? { search: params.search } : {}),
      },
    });
  }
}
