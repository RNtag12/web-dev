import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardComponent,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule {} 