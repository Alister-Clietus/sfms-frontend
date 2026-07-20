import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

export interface ObligationProgress {
  totalObligation: number;
  totalVerified: number;
  totalPending: number;
  remainingBalance: number;
  isFullyPaid: boolean;
  hasOverpaid: boolean;
}

@Component({
  selector: 'app-obligation-progress',
  standalone: true,
  imports: [CommonModule, MatIconModule, CurrencyFormatPipe],
  templateUrl: './obligation-progress.component.html',
  styleUrls: ['./obligation-progress.component.scss']
})
export class ObligationProgressComponent implements OnChanges {
  @Input({ required: true }) progress!: ObligationProgress;

  public verifiedPercentage: number = 0;
  public pendingPercentage: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress'] && this.progress) {
      this.calculatePercentages();
    }
  }

  private calculatePercentages(): void {
    const obligation = this.progress.totalObligation > 0 ? this.progress.totalObligation : 1; // Prevent division by zero
    
    // Calculate raw percentages
    let vPct = (this.progress.totalVerified / obligation) * 100;
    let pPct = (this.progress.totalPending / obligation) * 100;

    // Cap total visual width at 100% to handle overpayments gracefully on the bar UI
    if (vPct + pPct > 100) {
      if (vPct >= 100) {
        vPct = 100;
        pPct = 0;
      } else {
        pPct = 100 - vPct;
      }
    }

    this.verifiedPercentage = vPct;
    this.pendingPercentage = pPct;
  }
}