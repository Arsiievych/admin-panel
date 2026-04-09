import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ServerHealth, ServerHealthServiceInfo } from '../../core/models/server-health.models';
import { ServerHealthService } from '../../core/services/server-health.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-dashboard',
  imports: [PageShell],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly serverHealthService = inject(ServerHealthService);

  readonly health = signal<ServerHealth | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadHealth();
  }

  loadHealth(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.serverHealthService
      .getHealth()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.health.set(response.data);
        },
        error: () => {
          this.errorMessage.set('Unable to load server health.');
        },
      });
  }

  isHealthy(status: string): boolean {
    return status.trim().toLowerCase() === 'healthy';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return 'Unknown';
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  formatUptime(uptime: number): string {
    if (!Number.isFinite(uptime) || uptime < 0) {
      return 'Unknown';
    }

    const totalSeconds = Math.floor(uptime);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;
    const parts: string[] = [];

    if (days) {
      parts.push(`${days}d`);
    }

    if (hours || parts.length) {
      parts.push(`${hours}h`);
    }

    if (minutes || parts.length) {
      parts.push(`${minutes}m`);
    }

    parts.push(`${seconds}s`);

    return parts.join(' ');
  }

  serviceLabel(service: ServerHealthServiceInfo): string {
    return service.service.replace(/[_-]+/g, ' ');
  }
}
