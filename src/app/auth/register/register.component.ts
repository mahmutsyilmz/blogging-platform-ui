import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterDtoRequest } from '../../models/register-dto.model';
import { UserService } from '../../services/user.service';

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
  templateUrl: './register.component.html'
})
export class RegisterComponent {
    registerForm: FormGroup;

    errorMessage: string = '';
    
    constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private router: Router
    ) {

      this.registerForm = this.fb.group({
            username: [''],
            password: [''],
            firstName: [''],
            lastName: [''],
            email: ['']
          });
    }
    onSubmit(): void {
      if (this.registerForm.valid) {
        localStorage.removeItem('token');
        const registerData: RegisterDtoRequest = this.registerForm.value;
        this.userService.register(registerData).subscribe({
          next: (response) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', registerData.username);
            this.userService.setAuthState(true);
            this.router.navigate(['/']);
          }
        });
      }
    }
}
