export type AdminUsersOrder = 'id' | '-id';

export interface AdminUsersRequest {
  page: number;
  per_page: number;
  order: AdminUsersOrder;
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
  signature: string | null;
  rank: string | null;
  created_at: string;
  status: string;
  linked_providers: string[];
}
