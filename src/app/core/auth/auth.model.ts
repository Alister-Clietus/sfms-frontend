export type RoleStatus = 'PENDING_ROLE_ASSIGNMENT' | 'ACTIVE' | 'SUSPENDED';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
  status: RoleStatus;
  roles: string[];
}

export interface ApiResponse<T> {
  timestamp: string;
  success: boolean;
  message: string;
  data: T;
}

export interface OAuthCallbackRequest {
  code: string;
  codeVerifier: string;
}
