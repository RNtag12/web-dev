import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">{{ data.cancelText }}</button>
        <button mat-button color="warn" class="confirm-button" (click)="onConfirm()">{{ data.confirmText }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      background: white;
      border-radius: 4px;
    }

    p {
      margin: 0 0 20px 0;
      color: #666;
    }

    mat-dialog-actions {
      padding: 0;
      margin: 0;
    }

    button {
      margin-left: 8px;
      border-radius: 10px !important;
      padding: 0 20px !important;
    }

    .confirm-button {
      background-color: #f44336 !important;
      color: white !important;
    }

    .confirm-button:hover {
      background-color: #d32f2f !important;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 