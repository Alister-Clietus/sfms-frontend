import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContributorService, ContributorProfile } from '../../../core/services/contributor.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge-component/status-badge-component';
import { CsvUploadComponent } from '../../../shared/components/csv-upload-component/csv-upload-component';

@Component({
  selector: 'app-admin-contributors-component',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    StatusBadgeComponent,
    CsvUploadComponent,
    DateFormatPipe],
  templateUrl: './admin-contributors-component.html',
  styleUrl: './admin-contributors-component.scss',
})

export class AdminContributorsComponent implements OnInit {
  private readonly contributorService = inject(ContributorService);
  private readonly snackBar = inject(MatSnackBar);

  public contributors = signal<ContributorProfile[]>([]);
  public isLoading = signal<boolean>(true);
  
  // CSV Import State
  public isUploading = signal<boolean>(false);
  public uploadResults = signal<string[]>([]);

  public displayedColumns: string[] = ['displayName', 'email', 'joinDate', 'status', 'actions'];

  ngOnInit(): void {
    this.fetchContributors();
  }

  public fetchContributors(): void {
    this.isLoading.set(true);
    this.contributorService.getAllContributors().subscribe({
      next: (data) => {
        this.contributors.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load contributors.', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  public toggleStatus(contributor: ContributorProfile): void {
    const newStatus = contributor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    this.contributorService.updateStatus(contributor.id, newStatus).subscribe({
      next: (updatedProfile) => {
        // Optimistic UI Update
        this.contributors.update(list => 
          list.map(c => c.id === updatedProfile.id ? updatedProfile : c)
        );
        this.snackBar.open(`Status updated to ${newStatus}`, 'Success', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Failed to update status', 'Close', { duration: 4000 });
      }
    });
  }

  public handleBulkImport(file: File): void {
    this.isUploading.set(true);
    this.uploadResults.set([]);

    this.contributorService.bulkImport(file).subscribe({
      next: (results) => {
        this.uploadResults.set(results);
        this.isUploading.set(false);
        this.fetchContributors(); // Refresh the table automatically
      },
      error: (err) => {
        this.uploadResults.set([`Fatal Import Error: ${err?.error?.message || 'Unknown error'}`]);
        this.isUploading.set(false);
      }
    });
  }
}
