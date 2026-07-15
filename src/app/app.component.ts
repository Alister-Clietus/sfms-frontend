import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './core/auth/auth.service';
import { HasRoleDirective } from './shared/directives/has-role.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    HasRoleDirective
  ],
  template: `
    <mat-sidenav-container class="sfms-sidenav-container">
      
      <mat-sidenav #sidenav mode="side" opened class="sfms-sidenav" [fixedInViewport]="true">
        <div class="sidenav-header">
          <h2>SFMS</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-nav">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <div matListItemTitle>Dashboard</div>
          </a>
          
          <ng-container *appHasRole="['ADMIN']">
            <div mat-subheader>Administration</div>
            <a mat-list-item routerLink="/admin/pending-users" routerLinkActive="active-nav">
              <mat-icon matListItemIcon>person_add</mat-icon>
              <div matListItemTitle>Pending Users</div>
            </a>
            <a mat-list-item routerLink="/admin/configuration" routerLinkActive="active-nav">
              <mat-icon matListItemIcon>settings</mat-icon>
              <div matListItemTitle>Configuration</div>
            </a>
          </ng-container>

        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="sfms-sidenav-content">
        <mat-toolbar color="primary" class="mat-elevation-z4">
          <button mat-icon-button (click)="sidenav.toggle()" aria-label="Toggle sidenav">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-spacer"></span>
          
          @if (authService.isAuthenticated()) {
            <span class="user-greeting">Hello, {{ authService.currentUser()?.displayName || 'User' }}</span>
            <button mat-icon-button (click)="authService.logout()" aria-label="Sign out" title="Sign out">
              <mat-icon>logout</mat-icon>
            </button>
          }
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
    .user-greeting {
      font-size: 14px;
      margin-right: 16px;
    }
    .sfms-main-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
    .active-nav {
      background-color: rgba(25, 118, 210, 0.1);
      color: #1976D2 !important;
    }
    .active-nav mat-icon {
      color: #1976D2;
    }
  `]
})
export class AppComponent implements OnInit {
  public readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.checkSession().subscribe();
  }
}