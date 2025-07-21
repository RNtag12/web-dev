import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  error: string = '';
  loading: boolean = false;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    console.log('Routes loaded:', this.router.config);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => console.log('🚦 NavigationEnd:', (e as NavigationEnd).urlAfterRedirects));

    // check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      creditCard: ['', [Validators.required, Validators.minLength(16)]]
    });
  }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  onQuantityChange(event: Event, productId: string) {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    if (!isNaN(newQuantity)) {
      this.updateQuantity(productId, newQuantity);
    }
  }

  updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity === 0) {
      this.removeItem(productId);
    } else {
      this.cartService.updateItemQuantity(productId, newQuantity);
      this.loadCartItems();
    }
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
    this.loadCartItems();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      this.error = '';

      setTimeout(() => {
        this.loading = false;
        this.cartService.clearCart(); // Clear cart after successful order
        this.router.navigate(['/home']);
      }, 1000);
    } else {
      this.error = 'Please complete all required fields.';
    }
  }

  get fullName() { return this.checkoutForm.get('fullName'); }
  get address() { return this.checkoutForm.get('address'); }
  get creditCard() { return this.checkoutForm.get('creditCard'); }
  get fullNameTouched() { return this.fullName && this.fullName.touched; }
  get addressTouched() { return this.address && this.address.touched; }
  get creditCardTouched() { return this.creditCard && this.creditCard.touched; }
}
