import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor() {
    // Check if token exists in localStorage on service initialization
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  }

  setAuthenticated(value: boolean) {
    this.isAuthenticated.next(value);
  }
} 