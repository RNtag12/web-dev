import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/components/login/login.component';
import { SignupComponent } from './app/components/signup/signup.component';
import { HomeComponent } from './app/components/home/home.component';
import { SearchResultsComponent } from './app/components/search-results/s-results.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authGuard } from './app/guards/auth.guard';
import { PasswordResetComponent } from './app/components/password-reset/password-reset.component';
import { ProfileComponent } from './app/components/profile/profile.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { CheckoutComponent } from './app/components/checkout/checkout.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 's-results', component: SearchResultsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'checkout', component: CheckoutComponent },
  // { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'reset-password', component: PasswordResetComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [
provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
