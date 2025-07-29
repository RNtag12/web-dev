import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// User interface defines the structure of user data
export interface User {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// UserService provides methods to interact with user data from the backend
@Injectable({
    providedIn: 'root'
})
export class UserService {
    // API endpoint for user data
    private apiUrl = `${environment.apiUrl}/users`;

    // Injects HttpClient for making HTTP requests
    constructor(private http: HttpClient) { }

    // Fetches all users from the backend
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    // Fetches a single user by ID
    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    // Creates a new user
    createUser(user: User & { password: string }): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    // Updates an existing user
    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    // Deletes a user by ID
    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
} 