import { Component, EventEmitter, Input, Output, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload-component',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './file-upload-component.html',
  styleUrl: './file-upload-component.scss',
})

export class FileUploadComponent implements OnDestroy {
  @Input() label: string = 'Upload Document';
  @Input() hint: string = 'JPG or PNG only. Max size 5MB.';
  @Input() accept: string = 'image/jpeg, image/png';
  @Input() capture: 'environment' | 'user' | 'none' = 'environment'; // RESP-008 Mobile Camera Support
  @Input() maxSizeBytes: number = 5 * 1024 * 1024; // 5MB Default
  @Input() disabled: boolean = false;

  @Output() fileSelected = new EventEmitter<File | null>();

  public selectedFile = signal<File | null>(null);
  public previewUrl = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  /**
   * Handles the DOM file input change event.
   */
  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateAndSetFile(file);
    }
  }

  /**
   * Performs client-side validation mirroring the backend constraints.
   */
  private validateAndSetFile(file: File): void {
    this.errorMessage.set(null);

    // 1. MIME Validation
    const allowedTypes = this.accept.split(',').map(type => type.trim());
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set(`Invalid file type. Allowed: ${this.accept}`);
      this.clearFile();
      return;
    }

    // 2. Size Validation
    if (file.size > this.maxSizeBytes) {
      const maxSizeMB = this.maxSizeBytes / (1024 * 1024);
      this.errorMessage.set(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      this.clearFile();
      return;
    }

    // 3. Accept File & Generate Preview
    this.selectedFile.set(file);
    this.generatePreview(file);
    this.fileSelected.emit(file);
  }

  /**
   * Generates a local Object URL to preview the image without hitting a server.
   */
  private generatePreview(file: File): void {
    this.revokePreviewUrl(); // Clean up existing URL to prevent memory leaks
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      this.previewUrl.set(url);
    }
  }

  /**
   * Clears the current selection and notifies the parent.
   */
  public clearFile(): void {
    this.selectedFile.set(null);
    this.revokePreviewUrl();
    this.previewUrl.set(null);
    this.fileSelected.emit(null);
  }

  /**
   * Prevents memory leaks by revoking the blob URL.
   */
  private revokePreviewUrl(): void {
    const currentUrl = this.previewUrl();
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }
}