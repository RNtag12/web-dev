import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';

// HomeComponent displays the main landing page, product lists, and handles search and cart actions
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // Arrays to hold product data for different sections
  products: any[] = [];
  lowStockProducts: any[] = [];
  bestRatedProducts: any[] = [];
  loading = true;
  error: string | null = null;
  searchQuery: string = ''; // Property to hold the search input
  showQuantityDialog = false;
  selectedProduct: any = null;
  quantity: number = 1;
  quantityError: string | null = null;

  // Injects services for product data, navigation, and cart management
  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  // Lifecycle hook: called after component initialization
  ngOnInit(): void {
    this.loadProducts();
  }

  // Loads products and populates low stock and best rated lists
  private loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (data) => {
        // Sort by stock (ascending) and take the first 5, discard out of stock.
        this.lowStockProducts = data
          .filter(product => product.stock > 0)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);

        // Sort by average rating (descending) and take the top-rated products, discard those with no reviews.
        this.bestRatedProducts = data
          .filter(product => product.reviews && product.reviews.length > 1)
          .sort((a, b) => {
            const avgRatingA = b.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / b.reviews.length;
            const avgRatingB = a.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / a.reviews.length;
            return avgRatingA - avgRatingB;
          })
          .slice(0, 5);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  // Handles search action and navigates to search results page
  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Navigate to the s-results page with the search query as a parameter
      this.router.navigate(['/s-results'], { queryParams: { q: this.searchQuery } });
    }
  }

  // Opens the quantity dialog for a selected product
  openQuantityDialog(product: any): void {
    this.selectedProduct = product;
    this.quantity = 1;
    this.quantityError = null;
    this.showQuantityDialog = true;
  }

  // Closes the quantity dialog and resets related state
  closeQuantityDialog(): void {
    this.showQuantityDialog = false;
    this.selectedProduct = null;
    this.quantity = 1;
    this.quantityError = null;
  }

  // Validates the quantity input for adding to cart
  validateQuantity(): boolean {
    if (!this.quantity || isNaN(this.quantity)) {
      this.quantityError = 'Please enter a valid quantity';
      return false;
    }
    if (this.quantity <= 0) {
      this.quantityError = 'Quantity must be greater than 0';
      return false;
    }
    if (this.quantity > this.selectedProduct.stock) {
      this.quantityError = 'Quantity cannot exceed available stock';
      return false;
    }
    this.quantityError = null;
    return true;
  }

  // Adds the selected product and quantity to the cart
  addToCart(): void {
    if (!this.validateQuantity()) {
      return;
    }

    const cartItem: CartItem = {
      productId: this.selectedProduct.id,
      title: this.selectedProduct.title,
      price: this.selectedProduct.price,
      quantity: this.quantity,
      brand: this.selectedProduct.brand
    };

    this.cartService.addToCart(cartItem);
    this.closeQuantityDialog();
  }

  // trackBy functions for ngFor performance optimization
  trackByProductId(index: number, product: any): any {
    return product.id || product._id || index;
  }
  trackByReviewIndex(index: number, review: any): number {
    return index;
  }
}