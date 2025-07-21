import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Change Password</h2>
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <mat-form-field appearance="outline" class="password-field">
            <mat-label>Current Password</mat-label>
            <input 
              matInput 
              type="password" 
              formControlName="currentPassword"
              required
              #currentPasswordInput
            >
            <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
              Current password is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="password-field">
            <mat-label>New Password</mat-label>
            <input 
              matInput 
              type="password" 
              formControlName="newPassword"
              required
            >
            <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
              New password is required
            </mat-error>
            <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
              Password must be at least 8 characters long
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="password-field">
            <mat-label>Confirm New Password</mat-label>
            <input 
              matInput 
              type="password" 
              formControlName="confirmPassword"
              required
            >
            <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
              Please confirm your new password
            </mat-error>
            <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="passwordForm.invalid || isLoading"
            class="submit-button"
          >
            {{ isLoading ? 'Changing Password...' : 'Change Password' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      background: white;
      border-radius: 8px;
      min-width: 400px;
    }

    .password-field {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      margin-bottom: 20px;
    }

    .error-message {
      color: #f44336;
      margin-top: 16px;
      padding: 8px;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .submit-button {
      background-color: #1976d2 !important;
      color: white !important;
      border-radius: 8px !important;
      padding: 0 20px !important;
    }

    button {
      margin-left: 8px;
    }
  `]
})
export class ChangePasswordDialogComponent implements AfterViewInit {
  passwordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  @ViewChild('currentPasswordInput') currentPasswordInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.currentPasswordInput.nativeElement.focus();
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.dialogRef.close({ currentPassword, newPassword });
    }
  }
} 