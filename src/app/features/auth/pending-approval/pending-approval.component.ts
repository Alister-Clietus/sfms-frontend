import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pending-container">
      <div class="pending-card">
        <div class="icon-container">
          <svg class="icon-clock" viewBox="0 0 24 24" width="48" height="48">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z"/>
          </svg>
        </div>

        <h2>Access Pending Authorization</h2>
        <p class="user-email">{{ userEmail() }}</p>

        <p class="description">
          Your account has been securely authenticated. However, your access level is currently unassigned.
          An administrator must assign a core functional role to your account before you can view system data.
        </p>

        <div class="info-box">
          <p><strong>System Note:</strong> Once role assignments are completed, refresh the application or log back in to activate your access profile.</p>
        </div>

        <button class="btn-secondary" (click)="onSignOut()">Sign Out</button>
      </div>
    </div>
  `,
  styleUrls: ['./pending-approval.component.scss']
})
export class PendingApprovalComponent {
  private readonly authService = inject(AuthService);

  public readonly userEmail = computed(() => this.authService.currentUser()?.email || 'Unknown User');

  public onSignOut(): void {
    this.authService.logout();
  }
}
