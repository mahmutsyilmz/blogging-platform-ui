import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardDto } from '../../models/dashboard-dto.model';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dashboard: DashboardDto | null = null;
  errorMessage: string = '';

  constructor(private adminService: AdminService, private router:Router) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
      },
      error: (error) => {
        this.errorMessage = error.error?.exception?.message || 'Failed to load dashboard.';
      }
    });
  }

  goToPendingRequests(): void {
    this.router.navigate(['/admin/pending']);
  }

  goToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  goToActionLogs(): void {
    this.router.navigate(['/admin/logs/action']);
  }
  
  
}
