import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ContributorService, ContributorProfile, ContributionObligation } from '../../../core/services/contributor.service';
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

export class ProfileComponent implements OnInit 
{
  private readonly contributorService = inject(ContributorService);

  public profile = signal<ContributorProfile | null>(null);
  public obligations = signal<ContributionObligation[]>([]);
  public isLoading = signal<boolean>(true);
  public error = signal<string | null>(null);

  public displayedColumns: string[] = ['cycleLabel', 'amount', 'generatedAt'];

  ngOnInit(): void {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.isLoading.set(true);
    
    this.contributorService.getOwnProfile().subscribe({
      next: (prof) => {
        this.profile.set(prof);
        this.loadObligations(prof.id);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load profile data.');
        this.isLoading.set(false);
      }
    });
  }

  private loadObligations(contributorId: string): void {
    this.contributorService.getObligations(contributorId).subscribe({
      next: (obs) => {
        this.obligations.set(obs);
        this.isLoading.set(false);
      },
      error: () => {
        // Non-fatal error; user can still see profile
        this.isLoading.set(false);
      }
    });
  }
}
