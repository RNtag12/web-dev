import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service'; 

@Component({
  selector: 'app-s-results',
  templateUrl: './s-results.html',
  styleUrls: ['./s-results.scss'],
  imports: [CommonModule], 
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    // Get the search query from the query parameters
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      console.log('Search Query:', this.searchQuery);

      // Perform the search
      this.performSearch();
    });
  }

  private performSearch(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (data) => {
        // Filter products by title matching the search query (case-insensitive)
        this.searchResults = data.filter(product =>
          product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load search results. Please try again later.';
        this.loading = false;
      },
    });
  }
}