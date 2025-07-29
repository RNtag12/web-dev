import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// AuthResponse interface defines the structure of the authentication response from the backend
export interface AuthResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
// AuthService handles authentication logic such as login, signup, logout, and user state management
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'token';
  private apiUrl = 'http://localhost:3000/api';

  // Injects required services and loads user from storage if available
  constructor(
    private http: HttpClient,
    private router: Router,
    private authState: AuthStateService
  ) {
    this.loadStoredUser();
  }

  // Loads user from localStorage if token exists
  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.authState.setAuthenticated(true);
      this.getCurrentUser().subscribe();
    }
  }

  // Registers a new user and stores token on success
  signup(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, userData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.authState.setAuthenticated(true);
          this.currentUserSubject.next({
            _id: response._id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email
          });
        }
      })
    );
  }

  // Logs in a user and stores token on success
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.authState.setAuthenticated(true);
          this.currentUserSubject.next({
            _id: response._id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email
          });
        }
      })
    );
  }

  // Logs out the user and clears authentication state
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authState.setAuthenticated(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']);
  }

  // Fetches the current user's profile from the backend
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  // Checks if a user is authenticated by verifying token existence
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Retrieves the stored authentication token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Sends a request to verify if an email exists
  verifyEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email`, { email });
  }

  // Sends a request to reset the user's password
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      email,
      newPassword
    });
  }

  // Sends a request to change the user's password
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // Updates the user's profile information
  updateProfile(userData: Partial<User>, currentPassword: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/auth/update-profile`, {
      ...userData,
      currentPassword
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  // Alias for isAuthenticated, checks if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
} 