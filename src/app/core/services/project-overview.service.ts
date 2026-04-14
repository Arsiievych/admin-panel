import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ProjectOverviewResponse } from '../models/project-overview.models';

@Injectable({ providedIn: 'root' })
export class ProjectOverviewService {
  private readonly api = inject(ApiService);

  getOverview() {
    return this.api.get<ProjectOverviewResponse>('project-overview');
  }
}
