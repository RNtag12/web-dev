import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: ProfileComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileComponent,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule {} 