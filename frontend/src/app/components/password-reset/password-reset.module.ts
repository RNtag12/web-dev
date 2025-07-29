import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './password-reset.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: PasswordResetComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PasswordResetComponent,
    RouterModule.forChild(routes)
  ]
})
export class PasswordResetModule {} 