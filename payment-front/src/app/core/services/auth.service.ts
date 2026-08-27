import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

interface LoginResponse { token: string; }
export interface LoginCredentials { username: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'payment_access_token';
  private readonly usernameKey = 'payment_username';
  readonly isAuthenticated = signal(Boolean(localStorage.getItem(this.tokenKey)));
  readonly errorMessage = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials) {
    this.errorMessage.set(null);
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((response) => { localStorage.setItem(this.tokenKey, response.token); localStorage.setItem(this.usernameKey, credentials.username); this.isAuthenticated.set(true); }),
      catchError((error: Error) => { const message = error.message || 'Authentication failed. Check your credentials and try again.'; this.errorMessage.set(message); return throwError(() => new Error(message)); })
    );
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  getUsername(): string | null { return localStorage.getItem(this.usernameKey); }
  logout(): void { localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.usernameKey); this.isAuthenticated.set(false); }
}