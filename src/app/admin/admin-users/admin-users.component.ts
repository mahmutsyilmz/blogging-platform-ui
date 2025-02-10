import { Component, OnInit } from '@angular/core';
import { AdminService, UserDtoResponse } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: UserDtoResponse[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      }
    });
  }
}
