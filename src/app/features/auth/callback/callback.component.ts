import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="status-card">
        @if (isProcessing()) {
          <div class="loading-state">
            <div class="spinner-large"></div>
            <h3>Verifying security credentials...</h3>
            <p>Completing secure exchange via PKCE</p>
          </div>
        } @else if (errorReason()) {
          <div class="error-state">
            <div class="error-icon">!</div>
            <h3>Authentication Failed</h3>
            <p class="error-text">{{ errorReason() }}</p>
            <button class="btn-primary" (click)="navigateToLogin()">Return to Login</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  public readonly isProcessing = signal<boolean>(true);
  public readonly errorReason = signal<string | null>(null);

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.handleFailure(`Identity provider returned error: ${error}`);
      return;
    }

    if (!code || !state) {
      this.handleFailure('Authorization exchange token or state missing from request callback.');
      return;
    }

    this.authService.processAuthCallback(code, state).subscribe({
      error: (err) => {
        this.handleFailure(err?.error?.message || 'Cryptographic handshake or verification failed.');
      }
    });
  }

  private handleFailure(message: string): void {
    this.isProcessing.set(false);
    this.errorReason.set(message);
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
