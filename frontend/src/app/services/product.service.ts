// ProductService provides methods to interact with product data from the backend
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // API endpoint for product data
  private apiUrl = 'http://localhost:3000/api/products'; // Ensure this matches the backend route

  // Injects HttpClient for making HTTP requests
  constructor(private http: HttpClient) {}

  // Fetches all products from the backend
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}