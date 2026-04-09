import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChartConfiguration, ChartOptions, ScriptableContext } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { finalize } from 'rxjs';
import { ServerHealth, ServerHealthServiceInfo } from '../../core/models/server-health.models';
import { ServerHealthService } from '../../core/services/server-health.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

type DashboardRange = 7 | 30;

interface MetricPoint {
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

  readonly lineChartType: ChartConfiguration<'line'>['type'] = 'line';
  readonly health = signal<ServerHealth | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedUsersRange = signal<DashboardRange>(7);
  readonly selectedLegionsRange = signal<DashboardRange>(7);
  readonly selectedMatchesRange = signal<DashboardRange>(7);
  readonly newUsers7Days: MetricPoint[] = [
    { label: 'Apr 3', fullLabel: 'April 3', value: 14 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 19 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 16 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 24 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 28 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 22 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 31 },
  ];
  readonly newUsers30Days: MetricPoint[] = [
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
  readonly legionsCreated7Days: MetricPoint[] = [
    { label: 'Apr 3', fullLabel: 'April 3', value: 3 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 5 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 4 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 6 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 7 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 6 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 8 },
  ];
  readonly legionsCreated30Days: MetricPoint[] = [
    { label: 'Mar 11', fullLabel: 'March 11', value: 2 },
    { label: 'Mar 12', fullLabel: 'March 12', value: 3 },
    { label: 'Mar 13', fullLabel: 'March 13', value: 2 },
    { label: 'Mar 14', fullLabel: 'March 14', value: 4 },
    { label: 'Mar 15', fullLabel: 'March 15', value: 3 },
    { label: 'Mar 16', fullLabel: 'March 16', value: 4 },
    { label: 'Mar 17', fullLabel: 'March 17', value: 3 },
    { label: 'Mar 18', fullLabel: 'March 18', value: 5 },
    { label: 'Mar 19', fullLabel: 'March 19', value: 4 },
    { label: 'Mar 20', fullLabel: 'March 20', value: 5 },
    { label: 'Mar 21', fullLabel: 'March 21', value: 4 },
    { label: 'Mar 22', fullLabel: 'March 22', value: 6 },
    { label: 'Mar 23', fullLabel: 'March 23', value: 5 },
    { label: 'Mar 24', fullLabel: 'March 24', value: 5 },
    { label: 'Mar 25', fullLabel: 'March 25', value: 6 },
    { label: 'Mar 26', fullLabel: 'March 26', value: 7 },
    { label: 'Mar 27', fullLabel: 'March 27', value: 5 },
    { label: 'Mar 28', fullLabel: 'March 28', value: 6 },
    { label: 'Mar 29', fullLabel: 'March 29', value: 7 },
    { label: 'Mar 30', fullLabel: 'March 30', value: 6 },
    { label: 'Mar 31', fullLabel: 'March 31', value: 7 },
    { label: 'Apr 1', fullLabel: 'April 1', value: 8 },
    { label: 'Apr 2', fullLabel: 'April 2', value: 6 },
    { label: 'Apr 3', fullLabel: 'April 3', value: 7 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 8 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 7 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 9 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 8 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 9 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 10 },
  ];
  readonly matchesPlayed7Days: MetricPoint[] = [
    { label: 'Apr 3', fullLabel: 'April 3', value: 142 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 158 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 149 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 171 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 183 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 176 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 194 },
  ];
  readonly matchesPlayed30Days: MetricPoint[] = [
    { label: 'Mar 11', fullLabel: 'March 11', value: 108 },
    { label: 'Mar 12', fullLabel: 'March 12', value: 114 },
    { label: 'Mar 13', fullLabel: 'March 13', value: 111 },
    { label: 'Mar 14', fullLabel: 'March 14', value: 125 },
    { label: 'Mar 15', fullLabel: 'March 15', value: 119 },
    { label: 'Mar 16', fullLabel: 'March 16', value: 130 },
    { label: 'Mar 17', fullLabel: 'March 17', value: 122 },
    { label: 'Mar 18', fullLabel: 'March 18', value: 136 },
    { label: 'Mar 19', fullLabel: 'March 19', value: 134 },
    { label: 'Mar 20', fullLabel: 'March 20', value: 142 },
    { label: 'Mar 21', fullLabel: 'March 21', value: 146 },
    { label: 'Mar 22', fullLabel: 'March 22', value: 151 },
    { label: 'Mar 23', fullLabel: 'March 23', value: 155 },
    { label: 'Mar 24', fullLabel: 'March 24', value: 148 },
    { label: 'Mar 25', fullLabel: 'March 25', value: 160 },
    { label: 'Mar 26', fullLabel: 'March 26', value: 166 },
    { label: 'Mar 27', fullLabel: 'March 27', value: 158 },
    { label: 'Mar 28', fullLabel: 'March 28', value: 172 },
    { label: 'Mar 29', fullLabel: 'March 29', value: 169 },
    { label: 'Mar 30', fullLabel: 'March 30', value: 174 },
    { label: 'Mar 31', fullLabel: 'March 31', value: 180 },
    { label: 'Apr 1', fullLabel: 'April 1', value: 176 },
    { label: 'Apr 2', fullLabel: 'April 2', value: 182 },
    { label: 'Apr 3', fullLabel: 'April 3', value: 188 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 191 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 184 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 196 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 201 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 198 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 208 },
  ];
  readonly selectedUsersData = computed(() =>
    this.selectedUsersRange() === 7 ? this.newUsers7Days : this.newUsers30Days
  );
  readonly selectedLegionsData = computed(() =>
    this.selectedLegionsRange() === 7 ? this.legionsCreated7Days : this.legionsCreated30Days
  );
  readonly selectedMatchesData = computed(() =>
    this.selectedMatchesRange() === 7 ? this.matchesPlayed7Days : this.matchesPlayed30Days
  );
  readonly usersChartData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.buildChartData(this.selectedUsersData(), this.selectedUsersRange())
  );
  readonly usersChartOptions = computed<ChartOptions<'line'>>(() =>
    this.buildChartOptions(this.selectedUsersData(), this.selectedUsersRange(), 'new users')
  );
  readonly legionsChartData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.buildChartData(this.selectedLegionsData(), this.selectedLegionsRange())
  );
  readonly legionsChartOptions = computed<ChartOptions<'line'>>(() =>
    this.buildChartOptions(this.selectedLegionsData(), this.selectedLegionsRange(), 'legions created')
  );
  readonly matchesChartData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.buildChartData(this.selectedMatchesData(), this.selectedMatchesRange())
  );
  readonly matchesChartOptions = computed<ChartOptions<'line'>>(() =>
    this.buildChartOptions(this.selectedMatchesData(), this.selectedMatchesRange(), 'matches played')
  );

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

  setUsersRange(range: DashboardRange): void {
    this.selectedUsersRange.set(range);
  }

  setLegionsRange(range: DashboardRange): void {
    this.selectedLegionsRange.set(range);
  }

  setMatchesRange(range: DashboardRange): void {
    this.selectedMatchesRange.set(range);
  }

  totalUsers(points: MetricPoint[]): number {
    return points.reduce((sum, point) => sum + point.value, 0);
  }

  averageUsers(points: MetricPoint[]): number {
    return Math.round(this.totalUsers(points) / points.length);
  }

  private buildChartData(points: MetricPoint[], range: DashboardRange): ChartConfiguration<'line'>['data'] {
    return {
      labels: points.map((point) => point.label),
      datasets: [
        {
          data: points.map((point) => point.value),
          fill: true,
          tension: 0.42,
          borderWidth: 3,
          borderColor: (context) => getLineStroke(context),
          backgroundColor: (context) => getLineFill(context),
          pointBackgroundColor: '#94f4ff',
          pointBorderColor: '#182846',
          pointBorderWidth: range === 7 ? 2 : 1.25,
          pointRadius: range === 7 ? 4 : 2.2,
          pointHoverRadius: range === 7 ? 5.5 : 4,
          pointHoverBackgroundColor: '#d7fbff',
          pointHoverBorderColor: '#182846',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }

  private buildChartOptions(points: MetricPoint[], range: DashboardRange, tooltipLabel: string): ChartOptions<'line'> {
    return {
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
            label: (tooltipItem) => `${tooltipItem.parsed.y} ${tooltipLabel}`,
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
            autoSkip: range === 30,
            maxTicksLimit: range === 30 ? 4 : 7,
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: this.chartUpperBound(points),
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
    };
  }

  private maxUsers(points: MetricPoint[]): number {
    return Math.max(...points.map((point) => point.value), 0);
  }

  private chartUpperBound(points: MetricPoint[]): number {
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
