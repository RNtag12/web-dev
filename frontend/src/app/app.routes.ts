// Angular routing configuration for the application
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/s-results.component';
import { HomeComponent } from './components/home/home.component';

// Define application routes, using lazy loading for feature modules
const routes: Routes = [
  { path: '', component: HomeComponent },
  // Lazy load the login module
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  // Lazy load the signup module
  { path: 'signup', loadChildren: () => import('./components/signup/signup.module').then(m => m.SignupModule) },
  // Lazy load the profile module
  { path: 'profile', loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule) },
  // Lazy load the password reset module
  { path: 'password-reset', loadChildren: () => import('./components/password-reset/password-reset.module').then(m => m.PasswordResetModule) },
  // Lazy load the change password dialog module
  { path: 'change-password', loadChildren: () => import('./components/change-password-dialog/change-password-dialog.module').then(m => m.ChangePasswordDialogModule) },
  // Lazy load the checkout module
  { path: 'checkout', loadChildren: () => import('./components/checkout/checkout.module').then(m => m.CheckoutModule) },
  // Lazy load the dashboard module
  { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule) },
  // Lazy load the search results module
  { path: 's-results', loadChildren: () => import('./components/search-results/search-results.module').then(m => m.SearchResultsModule) },
];

// AppRoutingModule sets up the router with the application's routes
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
