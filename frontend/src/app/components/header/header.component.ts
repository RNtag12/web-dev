import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

// HeaderComponent displays the navigation bar and handles user session actions
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  template: `
    <header class="header">
      <div class="header-content">
        <button class="btn btn-link" routerLink="/home">OldPhoneDeals</button>
        <div class="header-buttons">
          <ng-container *ngIf="!isLoggedIn(); else loggedIn">
            <button class="btn btn-primary" routerLink="/login">Login</button>
            <button class="btn btn-secondary" routerLink="/signup">Sign Up</button>
          </ng-container>
          <ng-template #loggedIn>
            <button class="btn btn-secondary" routerLink="/profile">Profile</button>
            <button class="btn btn-primary" (click)="logout()">Logout</button>
          </ng-template>
          <button class="checkout-btn" routerLink="/checkout">Checkout</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #ffffff;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-link {
      background: none;
      color: #333;
      font-size: 1.5rem;
      font-weight: bold;
      padding: 0;
    }

    .btn-link:hover {
      color: #007bff;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .checkout-btn {
      background-color: #28a745;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .checkout-btn:hover {
      background-color: #218838;
    }
  `]
})
export class HeaderComponent {
  // Injects services for authentication, dialogs, and navigation
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  // Checks if the user is logged in
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Navigates to checkout if logged in, otherwise to login
  goToCheckout() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Opens a confirmation dialog and logs out the user if confirmed
  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        confirmText: 'Logout',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
} 