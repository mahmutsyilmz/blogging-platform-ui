// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LoginDtoRequest } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import jwt_decode, { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  userId: string;
  role: Array<{ authority: string }>;
  exp: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginDtoRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', loginData.username);
          // Token'ı decode ederek admin rolünü kontrol ediyoruz
          try {
            const decoded: JwtPayload = jwtDecode(response.token);
            if (decoded.role.some(r => r.authority === 'ROLE_ADMIN')) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/posts']);
            }
          } catch (error) {
            console.error('Token decode error:', error);
            this.router.navigate(['/posts']);
          }
        },
        error: (error) => {
          if (error.status === 400 && error.error) {
            if (error.error.exception && error.error.exception.message) {
              const message = error.error.exception.message;
              if (typeof message === 'string') {
                this.errorMessage = message;
              } else if (typeof message === 'object') {
                Object.keys(message).forEach(field => {
                  const control = this.loginForm.get(field);
                  if (control) {
                    control.setErrors({ backend: message[field].join(' ') });
                  }
                });
              }
            } else {
              this.errorMessage = 'An error occurred.';
            }
          } else {
            this.errorMessage = 'An error occurred.';
          }
        }
      });
    }
  }
}
