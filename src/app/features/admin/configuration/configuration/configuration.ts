import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService, ConfigParameter, ConfigParameterRequest } from '../../../../core/services/admin.service';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatChipsModule,
    DateFormatPipe,
    CurrencyFormatPipe
  ],
  templateUrl: './configuration.html',
  styleUrl: './configuration.scss',
})
export class ConfigurationComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  public configHistory = signal<ConfigParameter[]>([]);
  public isLoading = signal<boolean>(true);

  public configForm: FormGroup;
  public displayedColumns: string[] = ['parameterKey', 'value', 'effectiveFrom', 'setByEmail', 'setAt'];

  public availableKeys = [
    { code: 'MAX_SCHOLARSHIP_DISBURSEMENT_LIMIT', label: 'Max Scholarship Disbursement Limit' },
    { code: 'FISCAL_YEAR_BUDGET_CAP', label: 'Fiscal Year Budget Cap' },
    { code: 'APPLICATION_LATE_FEE_PENALTY', label: 'Application Late Fee Penalty' }
  ];

  constructor() {
    this.configForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]],
      effectiveFrom: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchConfigHistory();
  }

  private fetchConfigHistory(): void {
    this.isLoading.set(true);
    this.adminService.getConfigHistory().subscribe({
      next: (history) => {
        this.configHistory.set(history);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load configuration history.', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  public onSubmit(): void {
    if (this.configForm.invalid) return;

    const formDate: Date = this.configForm.value.effectiveFrom;
    const isoDate = formDate.toISOString().split('T')[0];

    const request: ConfigParameterRequest = {
      key: this.configForm.value.key,
      value: this.configForm.value.value,
      effectiveFrom: isoDate
    };

    this.adminService.setConfigParameter(request).subscribe({
      next: (newConfig) => {
        this.snackBar.open('Configuration saved successfully.', 'Success', { duration: 3000 });
        this.configHistory.update(history => [newConfig, ...history]);
        this.configForm.reset({ effectiveFrom: new Date() });
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Failed to save configuration. Ensure no timeline conflicts.';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }
}
