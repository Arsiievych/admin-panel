import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type RequestOptions = {
  baseUrl?: string;
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean>;
  withCredentials?: boolean;
};

type HttpRequestOptions = Omit<RequestOptions, 'baseUrl'>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly defaultBaseUrl = environment.api.baseUrl;

  get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(path, options?.baseUrl), this.getHttpOptions(options));
  }

  post<T>(path: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(path, options?.baseUrl), body, this.getHttpOptions(options));
  }

  put<T>(path: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(path, options?.baseUrl), body, this.getHttpOptions(options));
  }

  patch<T>(path: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path, options?.baseUrl), body, this.getHttpOptions(options));
  }

  delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path, options?.baseUrl), this.getHttpOptions(options));
  }

  private getHttpOptions(options?: RequestOptions): HttpRequestOptions | undefined {
    if (!options) {
      return undefined;
    }

    const { baseUrl: _baseUrl, ...httpOptions } = options;

    return httpOptions;
  }

  private buildUrl(path: string, baseUrl?: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const normalizedBaseUrl = (baseUrl ?? this.defaultBaseUrl).replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');

    return `${normalizedBaseUrl}/${normalizedPath}`;
  }
}
