import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EncdescService } from '../encdesc.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private encDesc: EncdescService, private router: Router) { }

  get token(): string | null {
    const meta = localStorage.getItem('meta');
    if (!meta) return null;
    const user = this.encDesc.decryptData(meta);
    return user ? user.jwt : null;
  }

  get currentUser(): any {
    const meta = localStorage.getItem('meta');
    if (!meta) return null;
    return this.encDesc.decryptData(meta);
  }

  isLoggedIn(): boolean {
    const token = this.token;
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry;
    } catch (e) {
      return true;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  checkSession() {
    if (localStorage.getItem('meta') && !this.isLoggedIn()) {
      this.logout();
      return false;
    }
    return true;
  }
}
