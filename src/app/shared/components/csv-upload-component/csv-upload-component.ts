import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-csv-upload-component',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './csv-upload-component.html',
  styleUrl: './csv-upload-component.scss',
})

export class CsvUploadComponent {
  @Input() title: string = 'Upload CSV File';
  @Input() acceptedTypes: string = '.csv';
  @Input() isUploading: boolean = false;
  @Input() uploadResults: string[] = [];
  
  @Output() fileSelected = new EventEmitter<File>();

  public selectedFile: File | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUploadClick(): void {
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
    }
  }

  reset(): void {
    this.selectedFile = null;
    this.uploadResults = [];
    // A small hack to reset the file input element visually if needed, 
    // though two-way binding on a hidden input usually suffices.
  }
}