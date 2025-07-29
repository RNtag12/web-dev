import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// AuthStateService manages the authentication state across the application
@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  // BehaviorSubject to track authentication status
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  // Observable for components to subscribe to authentication changes
  isAuthenticated$ = this.isAuthenticated.asObservable();

  // On service initialization, check if a token exists to set initial auth state
  constructor() {
    // Check if token exists in localStorage on service initialization
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  }

  // Updates the authentication state
  setAuthenticated(value: boolean) {
    this.isAuthenticated.next(value);
  }
} 