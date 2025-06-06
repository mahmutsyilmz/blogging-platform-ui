import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../services/user.service';

interface JwtPayload {
  sub: string;
  userId: string;
  role: Array<{ authority: string }>;
  exp: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  username = '';
  private authSub!: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // AuthService üzerinden dinamik olarak durumu dinliyoruz
    this.authSub = this.userService.authState$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      if (isLogged) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decoded: JwtPayload = jwtDecode(token);
            this.isAdmin = decoded.role.some(r => r.authority === 'ROLE_ADMIN');
          } catch (error) {
            console.error('Token decode error:', error);
          }
        }
        this.username = localStorage.getItem('username') || '';
      } else {
        this.isAdmin = false;
        this.username = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userService.setAuthState(false);
    window.location.href = '/login';
  }
}
