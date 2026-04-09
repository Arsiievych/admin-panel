import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ServerHealthResponse } from '../models/server-health.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ServerHealthService {
  private readonly api = inject(ApiService);

  getHealth() {
    return this.api.get<ServerHealthResponse>(environment.api.healthcheckUrl);
  }
}
