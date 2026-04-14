export interface ServerHealthResponse {
  data: ServerHealth;
}

export interface ServerHealth {
  status: string;
  summary_reason: string;
  timestamp: string;
  version: string;
  uptime: number;
  services: ServerHealthServiceInfo[];
}

export interface ServerHealthServiceInfo {
  service: string;
  status: string;
  response_time: string;
}
