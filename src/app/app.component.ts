import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sfms-sidenav-container">
      
      <mat-sidenav #sidenav mode="side" opened class="sfms-sidenav">
        <div class="sidenav-header">
          <h2>SFMS</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item href="/">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <div matListItemTitle>Dashboard</div>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="sfms-sidenav-content">
        <mat-toolbar color="primary" class="mat-elevation-z4">
          <button mat-icon-button (click)="sidenav.toggle()" aria-label="Toggle sidenav">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button aria-label="User profile">
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>

        <main class="sfms-main-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
      
    </mat-sidenav-container>
  `,
  styles: [`
    .sfms-sidenav-container {
      height: 100vh;
    }
    .sfms-sidenav {
      width: 260px;
      background-color: #ffffff;
      border-right: 1px solid rgba(0,0,0,0.12);
    }
    .sidenav-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(0,0,0,0.12);
      h2 {
        margin: 0;
        color: #1976D2;
        font-weight: 500;
        letter-spacing: 1px;
      }
    }
    .sfms-sidenav-content {
      display: flex;
      flex-direction: column;
      background-color: #F5F7FA;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .sfms-main-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  `]
})
export class AppComponent {}