import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  brand: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private pendingItem: CartItem | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Load cart data from local storage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }

    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // User logged in, merge any pending items
        this.mergePendingItems();
      }
    });
  }

  addToCart(item: CartItem): boolean {
    if (!this.authService.isLoggedIn()) {
      // Store the pending item and redirect to login
      this.pendingItem = item;
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url,
          pendingCart: 'true'
        }
      });
      return false;
    }

    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.cartItems.next([...currentItems]);
    this.saveToLocalStorage();
    return true;
  }

  private mergePendingItems(): void {
    if (this.pendingItem) {
      this.addToCart(this.pendingItem);
      this.pendingItem = null;
    }
  }

  updateItemQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => i.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveToLocalStorage();
    }
  }

  removeItem(productId: string): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    this.cartItems.next(updatedItems);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.pendingItem = null;
    localStorage.removeItem('cart');
  }

  getPendingItem(): CartItem | null {
    return this.pendingItem;
  }

  clearPendingItem(): void {
    this.pendingItem = null;
  }
}
