import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="reset-container">
      <div class="reset-card">
        <h2>Reset Password</h2>
        
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="reset-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [ngClass]="{'is-invalid': email?.invalid && email?.touched}"
            >
            <div class="invalid-feedback" *ngIf="email?.invalid && email?.touched">
              <div *ngIf="email?.errors?.['required']">Email is required</div>
              <div *ngIf="email?.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>

          <div class="form-group" *ngIf="emailVerified">
            <label for="password">New Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [ngClass]="{'is-invalid': password?.invalid && password?.touched}"
            >
            <div class="invalid-feedback" *ngIf="password?.invalid && password?.touched">
              <div *ngIf="password?.errors?.['required']">Password is required</div>
              <div *ngIf="password?.errors?.['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>

          <div class="form-group" *ngIf="emailVerified">
            <label for="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [ngClass]="{'is-invalid': confirmPassword?.invalid && confirmPassword?.touched}"
            >
            <div class="invalid-feedback" *ngIf="confirmPassword?.invalid && confirmPassword?.touched">
              <div *ngIf="confirmPassword?.errors?.['required']">Please confirm your password</div>
              <div *ngIf="confirmPassword?.errors?.['passwordMismatch']">Passwords do not match</div>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="error">
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="(emailVerified ? resetForm.invalid : email?.invalid) || loading"
          >
            {{ loading ? 'Processing...' : (emailVerified ? 'Reset Password' : 'Verify Email') }}
          </button>
        </form>

        <div class="login-link">
          Remember your password? <a routerLink="/login">Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .reset-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;

      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
      }
    }

    .reset-form {
      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;

          &:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
          }

          &.is-invalid {
            border-color: #dc3545;
          }
        }

        .invalid-feedback {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      }

      .btn-primary {
        width: 100%;
        padding: 0.75rem;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #0056b3;
        }

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }

    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #666;

      a {
        color: #007bff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  error: string = '';
  loading: boolean = false;
  emailVerified: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (!this.emailVerified) {
      // First step: Verify email
      if (this.email?.valid) {
        this.loading = true;
        this.error = '';
        this.authService.verifyEmail(this.resetForm.get('email')?.value).subscribe({
          next: () => {
            this.emailVerified = true;
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Email not found';
            this.loading = false;
          }
        });
      }
    } else {
      // Second step: Reset password
      if (this.resetForm.valid) {
        this.loading = true;
        this.error = '';
        this.authService.resetPassword(
          this.resetForm.get('email')?.value,
          this.resetForm.get('password')?.value
        ).subscribe({
          next: () => {
            this.router.navigate(['/login'], { 
              queryParams: { message: 'Password reset successful. Please login with your new password.' }
            });
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to reset password';
            this.loading = false;
          }
        });
      }
    }
  }

  get email() { return this.resetForm.get('email'); }
  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }
} 