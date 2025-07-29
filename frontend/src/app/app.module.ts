// Main application module definition
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authInterceptor } from './interceptors/auth.interceptor';

// Define basic routes for login and signup
const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];

// AppModule is the root module that bootstraps the Angular application
@NgModule({
    imports: [
        BrowserModule, // Provides browser-specific services
        ReactiveFormsModule, // Enables reactive forms
        HttpClientModule, // Enables HTTP communication
        RouterModule.forRoot(routes), // Configures the router
        AppComponent,
        LoginComponent,
        SignupComponent
    ],
    bootstrap: [AppComponent] // Bootstraps the root component
})
export class AppModule { }
