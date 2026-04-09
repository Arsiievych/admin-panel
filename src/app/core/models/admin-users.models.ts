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

export interface AdminUserDetailsResponse {
  data: AdminUserDetails;
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

export interface AdminUserDetails {
  id: number;
  role: string;
  nickname: string | null;
  email: string;
  email_verified_at: string | null;
  rank: string | null;
  lang: string | null;
  signature: string | null;
  legacy_firebase_id: string | null;
  profile_free_change_used: boolean;
  status: string;
  deleted_at: string | null;
  restore_until: string | null;
  anonymized_at: string | null;
  profile_paid_change_credits: number;
  profile_flag_id: number | null;
  personal_top_100_count: number;
  clan_top_50_count: number;
  global_chat_muted_until: string | null;
  wallet_balances: {
    exp: number;
    funds: number;
    gems: number;
  };
}
