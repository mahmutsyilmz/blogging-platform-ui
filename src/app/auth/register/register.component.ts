import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, RegisterDtoRequest } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      CommonModule,
      RouterLink
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm: FormGroup;

    errorMessage: string = "";

    
    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) {

      this.registerForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['',Validators.required]
          });
    }
    onSubmit(): void {
      if (this.registerForm.valid) {
        const registerData: RegisterDtoRequest = this.registerForm.value;
        this.authService.register(registerData).subscribe({
          next: (response) => {
            localStorage.removeItem('token');
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', registerData.username);
            this.router.navigate(['/']);
          },
          error: (error) => {
            
            if (error.status === 400 && error.error) {
              
              if (error.error.exception && error.error.exception.message) {
                const message = error.error.exception.message;
                
                
                if (typeof message === 'string') {
                  this.errorMessage = message;
                } 
                
                else if (typeof message === 'object') {
                  Object.keys(message).forEach(field => {
                    const control = this.registerForm.get(field);
                    if (control) {
                      control.setErrors({ backend: message[field].join(' ') });
                    }
                  });
                }
              } else {
                this.errorMessage = 'An error occured.';
              }
            } else {
              this.errorMessage = 'An error occured.';
            }
          }
        });
      }
    }
}
