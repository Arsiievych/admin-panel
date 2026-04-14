export interface ProjectOverviewResponse {
  data: ProjectOverview;
}

export interface ProjectOverview {
  generated_at: string;
  timezone: string;
  today_started_at: string;
  today_ends_at: string;
  total_users: number;
  online_users_now: number;
  active_users_today: number;
  new_users_today: number;
  total_legions: number;
  legions_with_match_activity_today: number;
  matches_played_today: number;
  players_in_queue_now: number;
  queued_players_by_mode: ProjectOverviewModeBreakdown;
  active_matches_now: number;
  active_matches_by_mode: ProjectOverviewModeBreakdown;
  muted_global_chat_users_now: number;
  diamonds_forever: ProjectOverviewEventState;
  domination: ProjectOverviewDominationState;
}

export interface ProjectOverviewModeBreakdown {
  ffa: number;
  team: number;
  domination: number;
  diamonds_forever: number;
}

export interface ProjectOverviewSessionWindow {
  start_at: string;
  end_at: string;
}

export interface ProjectOverviewEventState {
  is_active: boolean;
  current_session: ProjectOverviewSessionWindow | null;
  next_session: ProjectOverviewSessionWindow | null;
  current_window: ProjectOverviewSessionWindow | null;
}

export interface ProjectOverviewDominationState {
  is_active: boolean;
  season_number: number;
  season_start_at: string;
  season_end_at: string;
  current_session: (ProjectOverviewSessionWindow & { session_id?: string }) | null;
  next_session: (ProjectOverviewSessionWindow & { session_id?: string }) | null;
}
