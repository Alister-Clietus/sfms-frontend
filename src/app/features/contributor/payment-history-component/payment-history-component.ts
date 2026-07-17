import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentService, PaymentResponse } from '../../../core/services/payment.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge-component/status-badge-component';

@Component({
  selector: 'app-payment-history-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    StatusBadgeComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './payment-history-component.html',
  styleUrl: './payment-history-component.scss',
})
export class PaymentHistoryComponent implements OnInit 
{
  private readonly paymentService = inject(PaymentService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  public payments = signal<PaymentResponse[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchPayments();
  }

  private fetchPayments(): void {
    this.isLoading.set(true);
    this.paymentService.getMyPayments().subscribe({
      next: (data) => {
        this.payments.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load payment history.', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  public editPayment(id: string): void {
    this.router.navigate(['/contributor/payment-submission'], { queryParams: { editId: id } });
  }

  public withdrawPayment(id: string): void {
    if (!confirm('Are you sure you want to withdraw this payment submission? This cannot be undone.')) {
      return;
    }

    this.paymentService.withdrawPayment(id).subscribe({
      next: () => {
        this.snackBar.open('Payment withdrawn successfully.', 'Success', { duration: 3000 });
        this.payments.update(list => list.filter(p => p.id !== id));
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Failed to withdraw payment.', 'Close', { duration: 4000 });
      }
    });
  }
}