import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './s-results.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: SearchResultsComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SearchResultsComponent,
    RouterModule.forChild(routes)
  ]
})
export class SearchResultsModule {} 