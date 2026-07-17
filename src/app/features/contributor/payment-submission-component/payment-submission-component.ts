import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentService, PaymentSubmissionRequest } from '../../../core/services/payment.service';
import { FileUploadComponent } from '../../../shared/components/file-upload-component/file-upload-component';

@Component({
  selector: 'app-payment-submission-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    FileUploadComponent
  ],
  templateUrl: './payment-submission-component.html',
  styleUrl: './payment-submission-component.scss',
})

export class PaymentSubmissionComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public paymentForm: FormGroup;
  public isSubmitting = signal<boolean>(false);
  public editModeId = signal<string | null>(null);
  public today = new Date();

  constructor() {
    // UI-FORM-001: Strict client-side validation rules
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      transactionDate: [this.today, [Validators.required]],
      transactionId: ['', [Validators.required, Validators.minLength(5)]],
      screenshot: [null] // Required for new submissions, optional for edits
    });
  }

  ngOnInit(): void {
    const editId = this.route.snapshot.queryParamMap.get('editId');
    if (editId) {
      this.loadPaymentForEdit(editId);
    } else {
      this.paymentForm.get('screenshot')?.setValidators([Validators.required]);
      this.paymentForm.get('screenshot')?.updateValueAndValidity();
    }
  }

  private loadPaymentForEdit(id: string): void {
    this.editModeId.set(id);
    this.paymentService.getPayment(id).subscribe({
      next: (payment) => {
        if (payment.status !== 'PENDING_VERIFICATION') {
          this.snackBar.open('Only pending payments can be edited.', 'Close', { duration: 4000 });
          this.router.navigate(['/contributor/history']);
          return;
        }
        // Extract local date correctly without timezone shifting
        const [year, month, day] = payment.transactionDate.split('-');
        this.paymentForm.patchValue({
          amount: payment.amount,
          transactionDate: new Date(+year, +month - 1, +day),
          transactionId: payment.transactionId
        });
      },
      error: () => {
        this.snackBar.open('Failed to load payment details.', 'Close', { duration: 3000 });
        this.router.navigate(['/contributor/history']);
      }
    });
  }

  public onFileSelected(file: File | null): void {
    this.paymentForm.patchValue({ screenshot: file });
    this.paymentForm.get('screenshot')?.markAsTouched();
  }

  public onSubmit(): void {
    if (this.paymentForm.invalid) return;

    this.isSubmitting.set(true);

    const formDate: Date = this.paymentForm.value.transactionDate;
    const isoDate = `${formDate.getFullYear()}-${String(formDate.getMonth() + 1).padStart(2, '0')}-${String(formDate.getDate()).padStart(2, '0')}`;

    const request: PaymentSubmissionRequest = {
      amount: this.paymentForm.value.amount.toString(),
      transactionDate: isoDate,
      transactionId: this.paymentForm.value.transactionId,
      screenshot: this.paymentForm.value.screenshot || undefined
    };

    const submitObs = this.editModeId() 
      ? this.paymentService.editPayment(this.editModeId()!, request)
      : this.paymentService.submitPayment(request);

    submitObs.subscribe({
      next: () => {
        const msg = this.editModeId() ? 'Payment updated successfully.' : 'Payment submitted for verification.';
        this.snackBar.open(msg, 'Success', { duration: 3000 });
        this.router.navigate(['/contributor/history']);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Submission failed. Please check your data.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        this.isSubmitting.set(false);
      }
    });
  }
}
