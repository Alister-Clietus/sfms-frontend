import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status-badge-component',
  imports: [CommonModule,MatIconModule],
  template: `
    <span class="status-badge" [ngClass]="badgeClass" [attr.aria-label]="'Current status is ' + status">
      <mat-icon class="status-icon" aria-hidden="true">{{ iconName }}</mat-icon>
      <span class="status-text">{{ status | titlecase }}</span>
    </span>
  `,
  styleUrls: ['./status-badge.component.scss']
})

export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  get badgeClass(): string {
    switch (this.status?.toUpperCase()) {
      case 'ACTIVE': return 'badge-active';
      case 'INACTIVE': return 'badge-inactive';
      case 'SUSPENDED': return 'badge-suspended';
      case 'PENDING_ROLE_ASSIGNMENT': return 'badge-pending';
      default: return 'badge-default';
    }
  }

  get iconName(): string {
    switch (this.status?.toUpperCase()) {
      case 'ACTIVE': return 'check_circle';
      case 'INACTIVE': return 'pause_circle_outline';
      case 'SUSPENDED': return 'cancel';
      case 'PENDING_ROLE_ASSIGNMENT': return 'hourglass_empty';
      default: return 'info';
    }
  }
}