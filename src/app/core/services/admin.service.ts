import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, UserProfile } from '../auth/auth.model';

export interface ConfigParameter {
  id: string;
  parameterKey: string;
  value: number;
  effectiveFrom: string;
  setByEmail: string;
  setAt: string;
}

export interface ConfigParameterRequest {
  key: string;
  value: number;
  effectiveFrom: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);

  // --- IAM Role Management ---
  public getPendingUsers(): Observable<UserProfile[]> {
    return this.http.get<ApiResponse<UserProfile[]>>('/users/pending')
      .pipe(map(response => response.data));
  }

  public assignRole(userId: string, roleCode: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`/users/${userId}/roles`, { roleCode })
      .pipe(map(() => void 0));
  }

  // --- Configuration Management ---
  public getConfigHistory(): Observable<ConfigParameter[]> {
    return this.http.get<ApiResponse<ConfigParameter[]>>('/config/parameters')
      .pipe(map(response => response.data));
  }

  public setConfigParameter(request: ConfigParameterRequest): Observable<ConfigParameter> {
    return this.http.post<ApiResponse<ConfigParameter>>('/config/parameters', request)
      .pipe(map(response => response.data));
  }
}
