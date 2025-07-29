import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// DashboardComponent displays a success message after login
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="success-message">
        <h1>Login Successful!</h1>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }
    .success-message {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #28a745;
      font-size: 2.5rem;
      margin: 0;
    }
  `]
})
export class DashboardComponent {} 