import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChartConfiguration, ChartOptions, ScriptableContext } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { finalize } from 'rxjs';
import { ServerHealth, ServerHealthServiceInfo } from '../../core/models/server-health.models';
import { ServerHealthService } from '../../core/services/server-health.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

interface NewUsersPoint {
  label: string;
  fullLabel: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [PageShell, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private readonly serverHealthService = inject(ServerHealthService);

  readonly usersChartType: ChartConfiguration<'line'>['type'] = 'line';
  readonly health = signal<ServerHealth | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedUsersRange = signal<7 | 30>(7);
  readonly newUsers7Days: NewUsersPoint[] = [
    { label: 'Apr 3', fullLabel: 'April 3', value: 14 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 19 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 16 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 24 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 28 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 22 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 31 },
  ];
  readonly newUsers30Days: NewUsersPoint[] = [
    { label: 'Mar 11', fullLabel: 'March 11', value: 8 },
    { label: 'Mar 12', fullLabel: 'March 12', value: 10 },
    { label: 'Mar 13', fullLabel: 'March 13', value: 9 },
    { label: 'Mar 14', fullLabel: 'March 14', value: 13 },
    { label: 'Mar 15', fullLabel: 'March 15', value: 12 },
    { label: 'Mar 16', fullLabel: 'March 16', value: 15 },
    { label: 'Mar 17', fullLabel: 'March 17', value: 11 },
    { label: 'Mar 18', fullLabel: 'March 18', value: 14 },
    { label: 'Mar 19', fullLabel: 'March 19', value: 13 },
    { label: 'Mar 20', fullLabel: 'March 20', value: 17 },
    { label: 'Mar 21', fullLabel: 'March 21', value: 16 },
    { label: 'Mar 22', fullLabel: 'March 22', value: 18 },
    { label: 'Mar 23', fullLabel: 'March 23', value: 20 },
    { label: 'Mar 24', fullLabel: 'March 24', value: 19 },
    { label: 'Mar 25', fullLabel: 'March 25', value: 22 },
    { label: 'Mar 26', fullLabel: 'March 26', value: 21 },
    { label: 'Mar 27', fullLabel: 'March 27', value: 23 },
    { label: 'Mar 28', fullLabel: 'March 28', value: 18 },
    { label: 'Mar 29', fullLabel: 'March 29', value: 25 },
    { label: 'Mar 30', fullLabel: 'March 30', value: 24 },
    { label: 'Mar 31', fullLabel: 'March 31', value: 26 },
    { label: 'Apr 1', fullLabel: 'April 1', value: 28 },
    { label: 'Apr 2', fullLabel: 'April 2', value: 21 },
    { label: 'Apr 3', fullLabel: 'April 3', value: 29 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 32 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 27 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 34 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 36 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 33 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 39 },
  ];
  readonly selectedUsersData = computed(() =>
    this.selectedUsersRange() === 7 ? this.newUsers7Days : this.newUsers30Days
  );
  readonly selectedUsersPeak = computed(() => this.peakUsers(this.selectedUsersData()));
  readonly usersChartData = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.selectedUsersData().map((point) => point.label),
    datasets: [
      {
        data: this.selectedUsersData().map((point) => point.value),
        fill: true,
        tension: 0.42,
        borderWidth: 3,
        borderColor: (context) => getLineStroke(context),
        backgroundColor: (context) => getLineFill(context),
        pointBackgroundColor: '#94f4ff',
        pointBorderColor: '#182846',
        pointBorderWidth: this.selectedUsersRange() === 7 ? 2 : 1.25,
        pointRadius: this.selectedUsersRange() === 7 ? 4 : 2.2,
        pointHoverRadius: this.selectedUsersRange() === 7 ? 5.5 : 4,
        pointHoverBackgroundColor: '#d7fbff',
        pointHoverBorderColor: '#182846',
        pointHoverBorderWidth: 2,
      },
    ],
  }));
  readonly usersChartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 260,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgba(15, 24, 43, 0.94)',
        borderColor: 'rgba(126, 217, 255, 0.18)',
        borderWidth: 1,
        padding: 12,
        titleColor: '#f4f8ff',
        bodyColor: 'rgba(225, 236, 250, 0.86)',
        titleFont: {
          size: 12,
          weight: 600,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.parsed.y} new users`,
        },
      },
    },
    layout: {
      padding: {
        top: 8,
        right: 6,
        left: 6,
        bottom: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'rgba(192, 209, 236, 0.48)',
          font: {
            size: 11,
          },
          maxRotation: 0,
          autoSkip: this.selectedUsersRange() === 30,
          maxTicksLimit: this.selectedUsersRange() === 30 ? 4 : 7,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: this.chartUpperBound(this.selectedUsersData()),
        grid: {
          color: 'rgba(149, 190, 240, 0.08)',
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
          count: 4,
        },
      },
    },
    elements: {
      line: {
        capBezierPoints: true,
      },
    },
  }));

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

  setUsersRange(range: 7 | 30): void {
    this.selectedUsersRange.set(range);
  }

  totalUsers(points: NewUsersPoint[]): number {
    return points.reduce((sum, point) => sum + point.value, 0);
  }

  averageUsers(points: NewUsersPoint[]): number {
    return Math.round(this.totalUsers(points) / points.length);
  }

  peakUsers(points: NewUsersPoint[]): NewUsersPoint {
    return points.reduce((peak, point) => point.value > peak.value ? point : peak, points[0]);
  }

  trendDelta(points: NewUsersPoint[]): number {
    if (points.length < 2) {
      return 0;
    }

    return points[points.length - 1].value - points[0].value;
  }

  trendDirection(points: NewUsersPoint[]): 'up' | 'down' | 'flat' {
    const delta = this.trendDelta(points);

    if (delta > 0) {
      return 'up';
    }

    if (delta < 0) {
      return 'down';
    }

    return 'flat';
  }

  trendLabel(points: NewUsersPoint[]): string {
    const delta = this.trendDelta(points);

    if (delta === 0) {
      return 'Stable period';
    }

    return `${delta > 0 ? '+' : ''}${delta} from start`;
  }

  private maxUsers(points: NewUsersPoint[]): number {
    return Math.max(...points.map((point) => point.value), 0);
  }

  private chartUpperBound(points: NewUsersPoint[]): number {
    const maxValue = this.maxUsers(points);

    return Math.max(10, Math.ceil(maxValue * 1.18));
  }
}

function getLineStroke(context: ScriptableContext<'line'>): CanvasGradient | string {
  const chart = context.chart;
  const gradient = chart.ctx.createLinearGradient(0, 0, chart.chartArea?.right ?? 0, 0);

  gradient.addColorStop(0, '#58dfff');
  gradient.addColorStop(0.55, '#70eeff');
  gradient.addColorStop(1, '#8ef4ff');

  return gradient;
}

function getLineFill(context: ScriptableContext<'line'>): CanvasGradient | string {
  const chart = context.chart;
  const chartArea = chart.chartArea;

  if (!chartArea) {
    return 'rgba(112, 232, 255, 0.18)';
  }

  const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);

  gradient.addColorStop(0, 'rgba(112, 232, 255, 0.34)');
  gradient.addColorStop(1, 'rgba(112, 232, 255, 0)');

  return gradient;
}
