import { Component, Input, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { DocumentService, DocumentVersionResponse } from '../../../core/services/document.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-document-viewer-component',
  imports: [CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule,
    DateFormatPipe],
  templateUrl: './document-viewer-component.html',
  styleUrl: './document-viewer-component.scss',
})

export class DocumentViewerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) documentId!: string;
  @Input() documentTitle: string = 'Attached Document';
  @Input() allowVersioningView: boolean = true;

  private readonly documentService = inject(DocumentService);
  private readonly authService = inject(AuthService);

  public isLoading = signal<boolean>(true);
  public errorMsg = signal<string | null>(null);
  
  public thumbnailUrl = signal<string | null>(null);
  public fullResBlob = signal<Blob | null>(null);
  
  public versions = signal<DocumentVersionResponse[]>([]);
  public canViewVersions = signal<boolean>(false);
  public isVersionsLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.checkPermissions();
    this.loadDocumentThumbnail();
  }

  private checkPermissions(): void {
    const roles = this.authService.getCurrentUserRoles();
    this.canViewVersions.set(roles.includes('ADMIN') || roles.includes('COMMITTEE_OFFICER'));
  }

  /**
   * Loads the bandwidth-friendly thumbnail by default (RESP-013)
   */
  private loadDocumentThumbnail(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.documentService.downloadDocument(this.documentId, true).subscribe({
      next: (blob: Blob) => {
        this.thumbnailUrl.set(URL.createObjectURL(blob));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        // ERR-FE-004: Graceful handling of access denial without breaking the layout
        if (err.status === 404 || err.status === 403) {
          this.errorMsg.set('You do not have permission to view this document, or it has been archived.');
        } else {
          this.errorMsg.set('Failed to load document preview. Please try again later.');
        }
      }
    });
  }

  /**
   * Fetches the full-resolution file in a new tab upon explicit user request.
   */
  public viewFullResolution(): void {
    this.documentService.downloadDocument(this.documentId, false).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
        // Clean up memory after opening
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000); 
      },
      error: () => {
        alert('Failed to load full resolution document.');
      }
    });
  }

  public loadVersionsPanel(): void {
    if (this.versions().length > 0 || this.isVersionsLoading()) return;
    
    this.isVersionsLoading.set(true);
    this.documentService.getDocumentVersions(this.documentId).subscribe({
      next: (data) => {
        this.versions.set(data);
        this.isVersionsLoading.set(false);
      },
      error: () => {
        this.isVersionsLoading.set(false);
      }
    });
  }

  public downloadHistoricalVersion(versionId: string): void {
    this.documentService.downloadDocumentVersion(versionId, false).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000); 
      },
      error: () => alert('Failed to download historical version.')
    });
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    const currentThumb = this.thumbnailUrl();
    if (currentThumb) {
      URL.revokeObjectURL(currentThumb);
    }
  }
}
