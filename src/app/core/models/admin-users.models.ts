export type AdminUsersOrder = 'id' | '-id' | 'name' | '-name' | 'role' | '-role' | 'status' | '-status';
export type AdminUsersRoleFilter = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'USER' | '';
export type AdminUsersStatusFilter = 'active' | 'pending_deletion' | 'anonymized' | '';
export type AdminUsersEmailVerifiedFilter = 'true' | 'false' | '';

export interface AdminUsersRequest {
  page: number;
  per_page: number;
  order: AdminUsersOrder;
  role?: Exclude<AdminUsersRoleFilter, ''>;
  status?: Exclude<AdminUsersStatusFilter, ''>;
  email_verified?: boolean;
  search?: string;
}

export interface AdminUsersResponse {
  data: AdminUsersData;
}

export interface AdminUsersData {
  items: AdminUser[];
  page: number;
  per_page: number;
  total_pages: number;
  total: number;
}

export interface AdminUser {
  id: number;
  role: string;
  nickname: string;
  email: string;
  email_verified: boolean;
  is_active: boolean;
}
