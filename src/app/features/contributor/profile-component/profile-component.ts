import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ContributorService, ContributorProfile, ContributionObligation, ContributorSummaryResponse } from '../../../core/services/contributor.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge-component/status-badge-component';


@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    StatusBadgeComponent,
    CurrencyFormatPipe,
    DateFormatPipe],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})

export class ProfileComponent implements OnInit {
  private readonly contributorService = inject(ContributorService);

  public summary = signal<ContributorSummaryResponse | null>(null);
  public isLoading = signal<boolean>(true);
  public error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSummaryData();
  }

  private loadSummaryData(): void {
    this.isLoading.set(true);
    
    this.contributorService.getOwnProfileSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load profile summary.');
        this.isLoading.set(false);
      }
    });
  }
}
