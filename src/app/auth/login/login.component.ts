// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { LoginDtoRequest } from '../../models/login-dto-request.model';
import { UserService } from '../../services/user.service';

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
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginDtoRequest = this.loginForm.value;
      this.userService.login(loginData).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', loginData.username);
          this.userService.setAuthState(true);
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
        }
      });
    }
  }
}
