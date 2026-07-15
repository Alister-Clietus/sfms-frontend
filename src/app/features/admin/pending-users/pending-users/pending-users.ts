import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { UserProfile } from '../../../../core/auth/auth.model';
import { AdminService } from '../../../../core/services/admin.service';


@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    DateFormatPipe
  ],
  templateUrl: './pending-users.html',
  styleUrls: ['./pending-users.scss']
})
export class PendingUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly snackBar = inject(MatSnackBar);

  public pendingUsers = signal<UserProfile[]>([]);
  public isLoading = signal<boolean>(true);
  public isSubmitting = signal<string | null>(null); // Tracks the user ID being processed

  public displayedColumns: string[] = ['email', 'displayName', 'createdAt', 'action'];

  public availableRoles = [
    { code: 'CONTRIBUTOR', label: 'Contributor' },
    { code: 'COLLEGE', label: 'College Admin' },
    { code: 'COMMITTEE_OFFICER', label: 'Committee Officer' },
    { code: 'STUDENT', label: 'Student' }
  ];

  ngOnInit(): void {
    this.fetchPendingUsers();
  }

  private fetchPendingUsers(): void {
    this.isLoading.set(true);
    this.adminService.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load pending users.', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  public assignRole(user: UserProfile, roleCode: string): void {
    if (!roleCode) return;

    this.isSubmitting.set(user.id);
    this.adminService.assignRole(user.id, roleCode).subscribe({
      next: () => {
        this.snackBar.open(`Role assigned to ${user.email} successfully.`, 'Success', { duration: 3000 });
        // Remove the user from the local signal to update the UI instantly
        this.pendingUsers.update(users => users.filter(u => u.id !== user.id));
        this.isSubmitting.set(null);
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Failed to assign role.';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isSubmitting.set(null);
      }
    });
  }
}