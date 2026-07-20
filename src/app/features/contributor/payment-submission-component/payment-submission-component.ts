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
  public isExtractingOcr = signal<boolean>(false);
  public ocrMessage = signal<string | null>(null);
  public ocrSuccess = signal<boolean>(false);
  public editModeId = signal<string | null>(null);
  public today = new Date();

  constructor() {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      transactionDate: [this.today, [Validators.required]],
      transactionId: ['', [Validators.required, Validators.minLength(5)]],
      screenshot: [null]
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
        const [year, month, day] = payment.transactionDate.split('-');
        this.paymentForm.patchValue({
          amount: payment.amount,
          transactionDate: new Date(+year, +month - 1, +day),
          transactionId: payment.transactionId
        });
      },
      error: () => {
        this.snackBar.open('Failed to load payment details.', 'Close');
        this.router.navigate(['/contributor/history']);
      }
    });
  }

  public onFileSelected(file: File | null): void {
    this.paymentForm.patchValue({ screenshot: file });
    this.paymentForm.get('screenshot')?.markAsTouched();
    
    // Reset OCR state
    this.ocrMessage.set(null);
    this.ocrSuccess.set(false);

    // Trigger OCR only for new valid files (FR-PAY-005)
    if (file && !this.editModeId()) {
      this.performOcrExtraction(file);
    }
  }

  private performOcrExtraction(file: File): void {
    this.isExtractingOcr.set(true);
    
    this.paymentService.extractOcrDetails(file).subscribe({
      next: (response) => {
        this.isExtractingOcr.set(false);
        this.ocrSuccess.set(response.extractionSuccessful);
        this.ocrMessage.set(response.message);

        if (response.extractionSuccessful) {
          const patchData: any = {};
          if (response.suggestedAmount) patchData.amount = response.suggestedAmount;
          if (response.suggestedTransactionId) patchData.transactionId = response.suggestedTransactionId;
          if (response.suggestedDate) {
             const [year, month, day] = response.suggestedDate.split('-');
             patchData.transactionDate = new Date(+year, +month - 1, +day);
          }
          
          // Pre-fill form fields (UI-SCR-005) - requires manual submission by user
          this.paymentForm.patchValue(patchData);
          this.paymentForm.markAsDirty();
        }
      },
      error: () => {
        // UC-01 A1: Graceful fallback. We just stop extracting and let the user type manually.
        this.isExtractingOcr.set(false);
        this.ocrSuccess.set(false);
        this.ocrMessage.set("Auto-extraction unavailable. Please enter details manually.");
      }
    });
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

    if (this.editModeId()) {
      this.paymentService.editPayment(this.editModeId()!, request).subscribe({
        next: () => {
          this.snackBar.open('Payment updated successfully.', 'Success', { duration: 3000 });
          this.router.navigate(['/contributor/history']);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.paymentService.submitPayment(request).subscribe({
        next: (response) => {
          // Utilizes the backend's tailored message containing the UC-01 A2 overpayment warning if applicable
          this.snackBar.open(response.message || 'Payment submitted successfully.', 'Close', { duration: 5000 });
          this.router.navigate(['/contributor/history']);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    this.snackBar.open(err?.error?.message || 'Submission failed. Please check your data.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
    this.isSubmitting.set(false);
  }
}