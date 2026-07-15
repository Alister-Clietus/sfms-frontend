import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile, ApiResponse, OAuthCallbackRequest } from './auth.model';
import { PkceUtils } from './pkce.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Reactive State using Angular Signals
  private readonly userSignal = signal<UserProfile | null>(null);
  private readonly loadingSignal = signal<boolean>(true);

  // Computed Selectors
  public readonly currentUser = computed(() => this.userSignal());
  public readonly isAuthenticated = computed(() => this.userSignal() !== null);
  public readonly isPendingRole = computed(() => this.userSignal()?.status === 'PENDING_ROLE_ASSIGNMENT');
  public readonly isAuthLoading = computed(() => this.loadingSignal());

  /**
   * Initiates the Google OAuth 2.0 PKCE Flow.
   */
  public async loginWithGoogle(): Promise<void> {
    const state = PkceUtils.generateCodeVerifier(32);
    const verifier = PkceUtils.generateCodeVerifier(64);
    const challenge = await PkceUtils.generateCodeChallenge(verifier);

    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_verifier', verifier);

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', environment.oauth.googleClientId);
    authUrl.searchParams.append('redirect_uri', environment.oauth.redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'openid email profile');
    authUrl.searchParams.append('code_challenge', challenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('state', state);

    window.location.href = authUrl.toString();
  }

  /**
   * Processes the redirect from Google, verifying state and exchanging the code.
   */
  public processAuthCallback(code: string, state: string): Observable<UserProfile> {
    const savedState = sessionStorage.getItem('oauth_state');
    const verifier = sessionStorage.getItem('oauth_verifier');

    if (!savedState || !verifier || state !== savedState) {
      this.clearSessionStorage();
      return throwError(() => new Error('OAuth state mismatch or missing verifier.'));
    }

    const payload: OAuthCallbackRequest = { code, codeVerifier: verifier };

    return this.http.post<ApiResponse<UserProfile>>('/auth/oauth/callback', payload).pipe(
      map(response => response.data),
      tap(profile => {
        this.clearSessionStorage();
        this.userSignal.set(profile);
        this.routeBasedOnStatus(profile);
      }),
      catchError(error => {
        this.clearSessionStorage();
        return throwError(() => error);
      })
    );
  }

  /**
   * Validates the HttpOnly cookie session on application load.
   */
  public checkSession(): Observable<UserProfile | null> {
    this.loadingSignal.set(true);
    return this.http.get<ApiResponse<UserProfile>>('/users/me').pipe(
      map(response => response.data),
      tap(profile => {
        this.userSignal.set(profile);
        this.loadingSignal.set(false);
      }),
      catchError(() => {
        this.userSignal.set(null);
        this.loadingSignal.set(false);
        return [null];
      })
    );
  }

  /**
   * Invalidates the session server-side and clears local state.
   */
  public logout(): void {
    this.http.post('/auth/logout', {}).subscribe({
      next: () => this.executeLocalLogout(),
      error: () => this.executeLocalLogout()
    });
  }

  private executeLocalLogout(): void {
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private clearSessionStorage(): void {
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_verifier');
  }

  private routeBasedOnStatus(profile: UserProfile): void {
    if (profile.status === 'PENDING_ROLE_ASSIGNMENT') {
      this.router.navigate(['/pending-approval']);
    } else if (profile.status === 'ACTIVE') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
