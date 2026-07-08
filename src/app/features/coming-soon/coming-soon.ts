// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-coming-soon',
//   imports: [],
//   templateUrl: './coming-soon.html',
//   styleUrl: './coming-soon.scss',
// })
// export class ComingSoon {}


import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="coming-soon-container">
      <mat-card class="coming-soon-card">
        <mat-card-header>
          <div mat-card-avatar>
            <mat-icon color="primary" class="large-icon">rocket_launch</mat-icon>
          </div>
          <mat-card-title>SFMS Portal Pipeline Validated</mat-card-title>
          <mat-card-subtitle>Module Under Construction</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            The Scholarship and Financial Management System UI environment has been successfully provisioned. 
            Role-based routing and domain features will be activated in subsequent sprints.
          </p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button color="primary" disabled>Login (Pending Auth Module)</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .coming-soon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 2rem;
    }
    .coming-soon-card {
      max-width: 600px;
      width: 100%;
    }
    .large-icon {
      transform: scale(1.5);
      margin-top: 8px;
    }
    mat-card-content {
      margin-top: 16px;
      margin-bottom: 16px;
      line-height: 1.6;
    }
  `]
})
export class ComingSoonComponent {}