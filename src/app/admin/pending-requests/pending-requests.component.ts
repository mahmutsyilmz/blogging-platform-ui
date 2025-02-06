import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, PostRequestDtoResponse } from '../../services/admin.service';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {
  pendingRequests: PostRequestDtoResponse[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.loading = true;
    this.adminService.getPendingRequests().subscribe({
      next: (data) => {
        this.pendingRequests = data;
        this.loading = false;
      }
    });
  }

  onApprove(requestUuid: string): void {
    this.adminService.approveRequest(requestUuid).subscribe({
      next: (updatedRequest) => {
        this.pendingRequests = this.pendingRequests.filter(req => req.uuid !== requestUuid);
      }
    });
  }

  onReject(requestUuid: string): void {
    this.adminService.rejectRequest(requestUuid).subscribe({
      next: (updatedRequest) => {
        this.pendingRequests = this.pendingRequests.filter(req => req.uuid !== requestUuid);
      }
    });
  }
}
