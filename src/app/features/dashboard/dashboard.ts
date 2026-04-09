import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChartConfiguration, ChartOptions, ScriptableContext } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { finalize } from 'rxjs';
import { ServerHealth, ServerHealthServiceInfo } from '../../core/models/server-health.models';
import { ServerHealthService } from '../../core/services/server-health.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

type DashboardRange = 7 | 30 | 365;
type MatchesRange = 1 | DashboardRange;

interface MetricPoint {
  label: string;
  fullLabel: string;
  value: number;
}

interface GeneralInfoStat {
  label: string;
  value: string;
  helper: 'All time' | 'Current' | 'Today';
  emphasis?: 'live';
}

interface GeneralInfoStatus {
  label: string;
  value: string;
  tone: 'healthy' | 'warning';
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
  readonly selectedActiveUsersRange = signal<DashboardRange>(7);
  readonly selectedMatchesRange = signal<MatchesRange>(7);
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
  readonly newUsers1Year: MetricPoint[] = [
    { label: 'May', fullLabel: 'May', value: 312 },
    { label: 'Jun', fullLabel: 'June', value: 356 },
    { label: 'Jul', fullLabel: 'July', value: 401 },
    { label: 'Aug', fullLabel: 'August', value: 438 },
    { label: 'Sep', fullLabel: 'September', value: 392 },
    { label: 'Oct', fullLabel: 'October', value: 465 },
    { label: 'Nov', fullLabel: 'November', value: 512 },
    { label: 'Dec', fullLabel: 'December', value: 584 },
    { label: 'Jan', fullLabel: 'January', value: 621 },
    { label: 'Feb', fullLabel: 'February', value: 548 },
    { label: 'Mar', fullLabel: 'March', value: 676 },
    { label: 'Apr', fullLabel: 'April', value: 704 },
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
  readonly legionsCreated1Year: MetricPoint[] = [
    { label: 'May', fullLabel: 'May', value: 72 },
    { label: 'Jun', fullLabel: 'June', value: 88 },
    { label: 'Jul', fullLabel: 'July', value: 94 },
    { label: 'Aug', fullLabel: 'August', value: 106 },
    { label: 'Sep', fullLabel: 'September', value: 91 },
    { label: 'Oct', fullLabel: 'October', value: 118 },
    { label: 'Nov', fullLabel: 'November', value: 123 },
    { label: 'Dec', fullLabel: 'December', value: 137 },
    { label: 'Jan', fullLabel: 'January', value: 144 },
    { label: 'Feb', fullLabel: 'February', value: 129 },
    { label: 'Mar', fullLabel: 'March', value: 156 },
    { label: 'Apr', fullLabel: 'April', value: 163 },
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
  readonly matchesPlayedToday: MetricPoint[] = [
    { label: '00:00', fullLabel: '12:00 AM', value: 4 },
    { label: '01:00', fullLabel: '1:00 AM', value: 3 },
    { label: '02:00', fullLabel: '2:00 AM', value: 2 },
    { label: '03:00', fullLabel: '3:00 AM', value: 2 },
    { label: '04:00', fullLabel: '4:00 AM', value: 3 },
    { label: '05:00', fullLabel: '5:00 AM', value: 5 },
    { label: '06:00', fullLabel: '6:00 AM', value: 6 },
    { label: '07:00', fullLabel: '7:00 AM', value: 7 },
    { label: '08:00', fullLabel: '8:00 AM', value: 9 },
    { label: '09:00', fullLabel: '9:00 AM', value: 11 },
    { label: '10:00', fullLabel: '10:00 AM', value: 14 },
    { label: '11:00', fullLabel: '11:00 AM', value: 16 },
    { label: '12:00', fullLabel: '12:00 PM', value: 18 },
    { label: '13:00', fullLabel: '1:00 PM', value: 17 },
    { label: '14:00', fullLabel: '2:00 PM', value: 19 },
    { label: '15:00', fullLabel: '3:00 PM', value: 21 },
    { label: '16:00', fullLabel: '4:00 PM', value: 18 },
    { label: '17:00', fullLabel: '5:00 PM', value: 14 },
    { label: '18:00', fullLabel: '6:00 PM', value: 11 },
    { label: '19:00', fullLabel: '7:00 PM', value: 8 },
    { label: '20:00', fullLabel: '8:00 PM', value: 6 },
    { label: '21:00', fullLabel: '9:00 PM', value: 4 },
    { label: '22:00', fullLabel: '10:00 PM', value: 3 },
    { label: '23:00', fullLabel: '11:00 PM', value: 2 },
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
  readonly activeUsers7Days: MetricPoint[] = [
    { label: 'Apr 3', fullLabel: 'April 3', value: 5210 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 5634 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 5482 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 6071 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 6318 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 5984 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 6642 },
  ];
  readonly activeUsers30Days: MetricPoint[] = [
    { label: 'Mar 11', fullLabel: 'March 11', value: 4112 },
    { label: 'Mar 12', fullLabel: 'March 12', value: 4298 },
    { label: 'Mar 13', fullLabel: 'March 13', value: 4386 },
    { label: 'Mar 14', fullLabel: 'March 14', value: 4521 },
    { label: 'Mar 15', fullLabel: 'March 15', value: 4462 },
    { label: 'Mar 16', fullLabel: 'March 16', value: 4695 },
    { label: 'Mar 17', fullLabel: 'March 17', value: 4581 },
    { label: 'Mar 18', fullLabel: 'March 18', value: 4822 },
    { label: 'Mar 19', fullLabel: 'March 19', value: 4898 },
    { label: 'Mar 20', fullLabel: 'March 20', value: 5055 },
    { label: 'Mar 21', fullLabel: 'March 21', value: 5126 },
    { label: 'Mar 22', fullLabel: 'March 22', value: 5212 },
    { label: 'Mar 23', fullLabel: 'March 23', value: 5349 },
    { label: 'Mar 24', fullLabel: 'March 24', value: 5298 },
    { label: 'Mar 25', fullLabel: 'March 25', value: 5481 },
    { label: 'Mar 26', fullLabel: 'March 26', value: 5564 },
    { label: 'Mar 27', fullLabel: 'March 27', value: 5423 },
    { label: 'Mar 28', fullLabel: 'March 28', value: 5714 },
    { label: 'Mar 29', fullLabel: 'March 29', value: 5661 },
    { label: 'Mar 30', fullLabel: 'March 30', value: 5823 },
    { label: 'Mar 31', fullLabel: 'March 31', value: 5974 },
    { label: 'Apr 1', fullLabel: 'April 1', value: 5892 },
    { label: 'Apr 2', fullLabel: 'April 2', value: 6025 },
    { label: 'Apr 3', fullLabel: 'April 3', value: 6188 },
    { label: 'Apr 4', fullLabel: 'April 4', value: 6271 },
    { label: 'Apr 5', fullLabel: 'April 5', value: 6114 },
    { label: 'Apr 6', fullLabel: 'April 6', value: 6482 },
    { label: 'Apr 7', fullLabel: 'April 7', value: 6593 },
    { label: 'Apr 8', fullLabel: 'April 8', value: 6418 },
    { label: 'Apr 9', fullLabel: 'April 9', value: 6824 },
  ];
  readonly activeUsers1Year: MetricPoint[] = [
    { label: 'May', fullLabel: 'May', value: 112_400 },
    { label: 'Jun', fullLabel: 'June', value: 118_200 },
    { label: 'Jul', fullLabel: 'July', value: 126_500 },
    { label: 'Aug', fullLabel: 'August', value: 131_800 },
    { label: 'Sep', fullLabel: 'September', value: 127_300 },
    { label: 'Oct', fullLabel: 'October', value: 139_600 },
    { label: 'Nov', fullLabel: 'November', value: 144_900 },
    { label: 'Dec', fullLabel: 'December', value: 153_700 },
    { label: 'Jan', fullLabel: 'January', value: 161_400 },
    { label: 'Feb', fullLabel: 'February', value: 156_800 },
    { label: 'Mar', fullLabel: 'March', value: 168_200 },
    { label: 'Apr', fullLabel: 'April', value: 173_900 },
  ];
  readonly generalInfoStats: GeneralInfoStat[] = [
    { label: 'Total Users', value: '284.5K', helper: 'All time' },
    { label: 'Online Now', value: '18.4K', helper: 'Current', emphasis: 'live' },
    { label: 'Active Users', value: '62.1K', helper: 'Today' },
    { label: 'Total Legions', value: '14.9K', helper: 'All time' },
    { label: 'Active Legions', value: '1,248', helper: 'Today' },
    { label: 'Active Matches', value: '2,416', helper: 'Current', emphasis: 'live' },
    { label: 'Matches Played', value: '18.9K', helper: 'Today' },
    { label: 'Chat Messages', value: '146.3K', helper: 'Today' },
  ];
  readonly generalInfoStatuses: GeneralInfoStatus[] = [
    { label: 'Muted Users Now', value: '24', tone: 'warning' },
    { label: 'Domination Active', value: 'On', tone: 'healthy' },
    { label: 'Diamonds Forever', value: 'On', tone: 'healthy' },
  ];
  readonly selectedUsersData = computed(() =>
    this.selectedUsersRange() === 7
      ? this.newUsers7Days
      : this.selectedUsersRange() === 30
        ? this.newUsers30Days
        : this.newUsers1Year
  );
  readonly selectedLegionsData = computed(() =>
    this.selectedLegionsRange() === 7
      ? this.legionsCreated7Days
      : this.selectedLegionsRange() === 30
        ? this.legionsCreated30Days
        : this.legionsCreated1Year
  );
  readonly selectedActiveUsersData = computed(() =>
    this.selectedActiveUsersRange() === 7
      ? this.activeUsers7Days
      : this.selectedActiveUsersRange() === 30
        ? this.activeUsers30Days
        : this.activeUsers1Year
  );
  readonly selectedMatchesData = computed(() =>
    this.selectedMatchesRange() === 1
      ? this.matchesPlayedToday
      : this.selectedMatchesRange() === 7
        ? this.matchesPlayed7Days
        : this.matchesPlayed30Days
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
  readonly activeUsersChartData = computed<ChartConfiguration<'line'>['data']>(() =>
    this.buildChartData(this.selectedActiveUsersData(), this.selectedActiveUsersRange())
  );
  readonly activeUsersChartOptions = computed<ChartOptions<'line'>>(() =>
    this.buildChartOptions(this.selectedActiveUsersData(), this.selectedActiveUsersRange(), 'active users')
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

    return new Intl.DateTimeFormat('en-US', {
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

  setActiveUsersRange(range: DashboardRange): void {
    this.selectedActiveUsersRange.set(range);
  }

  setMatchesRange(range: MatchesRange): void {
    this.selectedMatchesRange.set(range);
  }

  activityAverageLabel(range: DashboardRange): string {
    return range === 365 ? 'Avg. per month' : 'Avg. per day';
  }

  matchesAverageLabel(): string {
    return this.selectedMatchesRange() === 1 ? 'Avg. per hour' : 'Avg. per day';
  }

  activeUsersAverageLabel(): string {
    return this.selectedActiveUsersRange() === 365 ? 'Avg. per month' : 'Avg. per day';
  }

  totalUsers(points: MetricPoint[]): number {
    return points.reduce((sum, point) => sum + point.value, 0);
  }

  averageUsers(points: MetricPoint[]): number {
    return Math.round(this.totalUsers(points) / points.length);
  }

  private buildChartData(points: MetricPoint[], range: MatchesRange): ChartConfiguration<'line'>['data'] {
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
          pointBorderWidth: range === 1 ? 1.4 : range === 7 ? 2 : range === 365 ? 1.6 : 1.25,
          pointRadius: range === 1 ? 2.2 : range === 7 ? 4 : range === 365 ? 2.8 : 2.2,
          pointHoverRadius: range === 1 ? 4 : range === 7 ? 5.5 : range === 365 ? 4.6 : 4,
          pointHoverBackgroundColor: '#d7fbff',
          pointHoverBorderColor: '#182846',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }

  private buildChartOptions(points: MetricPoint[], range: MatchesRange, tooltipLabel: string): ChartOptions<'line'> {
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
            autoSkip: range === 1 || range === 30 || range === 365,
            maxTicksLimit: range === 1 ? 6 : range === 365 ? 12 : range === 30 ? 4 : 7,
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
