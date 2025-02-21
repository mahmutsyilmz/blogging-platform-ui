import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserDtoResponse } from '../services/admin.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserDtoResponse | null = null;
  profileForm: FormGroup;
  showVerificationForm: boolean = false;
  verificationCode: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      email: [''],
      firstName: [''],
      lastName: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
  this.userService.getMyProfile().subscribe({
    next: (data) => {
      this.profile = data;
      if (this.profile) {
        this.profileForm.patchValue({
          username: this.profile.username,
          email: this.profile.email,
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          bio: this.profile.bio
        });
      }
    }
  });
}

  sendVerificationCode(): void {
    // İsteği backend'e göndererek doğrulama kodu e-posta gönderilmesini tetikleyin
    this.userService.sendVerificationEmail().subscribe({
      next: (response) => {
        // Butonu gizlemeden önce doğrulama formunu gösterin
        this.showVerificationForm = true;
      }
      
    });
  }

  verifyEmail(): void {
    this.userService.verifyEmail(this.verificationCode).subscribe({
      next: (response) => {
        // Doğrulama başarılı ise profil güncellensin
        this.loadProfile();
        this.showVerificationForm = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.getRawValue();
      this.userService.updateUser(updatedProfile).subscribe({
        next: () => {
          this.router.navigate(['/']);
        }
      });
    }

    
  }
}
