import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: ChangePasswordDialogComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChangePasswordDialogComponent,
    RouterModule.forChild(routes)
  ]
})
export class ChangePasswordDialogModule {} 