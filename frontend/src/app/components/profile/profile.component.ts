import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// ProfileComponent allows users to view and update their profile and change their password
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <h1>Profile</h1>
      <div class="profile-content" *ngIf="user && !showChangePassword && !editingField">
        <div class="profile-field">
          <label>First Name:</label>
          <div class="field-content">
            <span>{{ user.firstName }}</span>
            <button class="edit-btn" (click)="startEditing('firstName')">Edit</button>
          </div>
        </div>
        <div class="profile-field">
          <label>Last Name:</label>
          <div class="field-content">
            <span>{{ user.lastName }}</span>
            <button class="edit-btn" (click)="startEditing('lastName')">Edit</button>
          </div>
        </div>
        <div class="profile-field">
          <label>Email:</label>
          <div class="field-content">
            <span>{{ user.email }}</span>
            <button class="edit-btn" (click)="startEditing('email')">Edit</button>
          </div>
        </div>
        <button class="change-password-btn" (click)="showChangePasswordForm()">Change Password</button>
      </div>

      <div class="edit-form" *ngIf="editingField">
        <form [formGroup]="editForm" (ngSubmit)="onEditSubmit()">
          <div class="form-group">
            <label [for]="editingField">{{ editingField === 'email' ? 'Email' : editingField === 'firstName' ? 'First Name' : 'Last Name' }}</label>
            <input
              [type]="editingField === 'email' ? 'email' : 'text'"
              [id]="editingField"
              [formControlName]="editingField"
              class="form-control"
              [ngClass]="{'is-invalid': editForm.get(editingField)?.invalid && editForm.get(editingField)?.touched}"
            >
            <div class="invalid-feedback" *ngIf="editForm.get(editingField)?.invalid && editForm.get(editingField)?.touched">
              <div *ngIf="editForm.get(editingField)?.errors?.['required']">This field is required</div>
              <div *ngIf="editForm.get(editingField)?.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>

          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              formControlName="currentPassword"
              class="form-control"
              [ngClass]="{'is-invalid': editForm.get('currentPassword')?.invalid && editForm.get('currentPassword')?.touched}"
            >
            <div class="invalid-feedback" *ngIf="editForm.get('currentPassword')?.invalid && editForm.get('currentPassword')?.touched">
              <div *ngIf="editForm.get('currentPassword')?.errors?.['required']">Current password is required</div>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="error">
            {{ error }}
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="editForm.invalid || loading"
            >
              {{ loading ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>

      <div class="change-password-form" *ngIf="showChangePassword">
        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              formControlName="currentPassword"
              class="form-control"
              [ngClass]="{'is-invalid': currentPassword?.invalid && currentPassword?.touched}"
            >
            <div class="invalid-feedback" *ngIf="currentPassword?.invalid && currentPassword?.touched">
              <div *ngIf="currentPassword?.errors?.['required']">Current password is required</div>
            </div>
          </div>

          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              formControlName="newPassword"
              class="form-control"
              [ngClass]="{'is-invalid': newPassword?.invalid && newPassword?.touched}"
            >
            <div class="invalid-feedback" *ngIf="newPassword?.invalid && newPassword?.touched">
              <div *ngIf="newPassword?.errors?.['required']">New password is required</div>
              <div *ngIf="newPassword?.errors?.['minlength']">Password must be at least 8 characters</div>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [ngClass]="{'is-invalid': confirmPassword?.invalid && confirmPassword?.touched}"
            >
            <div class="invalid-feedback" *ngIf="confirmPassword?.invalid && confirmPassword?.touched">
              <div *ngIf="confirmPassword?.errors?.['required']">Please confirm your new password</div>
              <div *ngIf="confirmPassword?.errors?.['passwordMismatch']">Passwords do not match</div>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="error">
            {{ error }}
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelChangePassword()">Cancel</button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="passwordForm.invalid || loading"
            >
              {{ loading ? 'Changing Password...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>

      <div class="loading" *ngIf="loading">
        Loading profile information...
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .profile-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .profile-field {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .profile-field:last-child {
      border-bottom: none;
      margin-bottom: 1rem;
      padding-bottom: 0;
    }

    .field-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    label {
      display: block;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    span {
      color: #333;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .edit-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .edit-btn:hover {
      background-color: #0056b3;
    }

    .change-password-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .change-password-btn:hover {
      background-color: #c82333;
    }

    .edit-form,
    .change-password-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
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

    .btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .loading {
      text-align: center;
      color: #666;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error {
      text-align: center;
      color: #dc3545;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;
  showChangePassword = false;
  passwordForm: FormGroup;
  editingField: string | null = null;
  editForm: FormGroup;

  // Add getter methods for form controls
  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }
  get newPassword() {
    return this.passwordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  // Injects services for authentication, navigation, and form building
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize password and edit forms
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    // Initialize editForm with no validators initially
    this.editForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      currentPassword: ['']
    });
  }

  // Lifecycle hook: loads the user profile on component initialization
  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Loads the current user's profile from the backend
  private loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load profile information. Please try again later.';
        }
      }
    });
  }

  // Custom validator to check if new password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  // Shows the change password form
  showChangePasswordForm(): void {
    this.showChangePassword = true;
    this.error = null;
  }

  // Cancels the change password process
  cancelChangePassword(): void {
    this.showChangePassword = false;
    this.passwordForm.reset();
    this.error = null;
  }

  // Handles password change form submission
  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.error = null;

      const { currentPassword, newPassword } = this.passwordForm.value;
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.loading = false;
          this.showChangePassword = false;
          this.passwordForm.reset();
          // Show success message or handle as needed
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }

  // Starts editing a profile field
  startEditing(field: string): void {
    this.editingField = field;
    this.error = null;
    // Reset form and set validators only for the field being edited
    this.editForm.reset();
    // Set validators for current password
    this.editForm.get('currentPassword')?.setValidators([Validators.required]);
    // Set validators for the field being edited
    const fieldControl = this.editForm.get(field);
    if (field === 'email') {
      fieldControl?.setValidators([Validators.required, Validators.email]);
    } else {
      fieldControl?.setValidators([Validators.required]);
    }
    // Update validators
    this.editForm.get('currentPassword')?.updateValueAndValidity();
    fieldControl?.updateValueAndValidity();
    // Set initial values
    this.editForm.patchValue({
      [field]: this.user?.[field as keyof User] || '',
      currentPassword: ''
    });
    // Mark the field as touched to trigger validation
    fieldControl?.markAsTouched();
  }

  // Cancels editing a profile field
  cancelEdit(): void {
    this.editingField = null;
    this.editForm.reset();
    this.error = null;
  }

  // Handles profile update form submission
  onEditSubmit(): void {
    if (this.editForm.valid && this.editingField) {
      this.loading = true;
      this.error = null;

      const updateData: Partial<User> = {};
      const field = this.editingField as keyof User;
      updateData[field] = this.editForm.get(this.editingField)?.value;

      this.authService.updateProfile(updateData, this.editForm.get('currentPassword')?.value).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.loading = false;
          this.editingField = null;
          this.editForm.reset();
        },
        error: (error: any) => {
          this.loading = false;
          this.error = error.error?.message || 'Failed to update profile. Please try again.';
        }
      });
    }
  }
} 