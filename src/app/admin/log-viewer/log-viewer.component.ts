import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { AdminService, ApiResponse } from '../../services/admin.service';
import { UserActionLogDtoResponse } from '../../models/user-action-log-dto-response.model';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.css']
})
export class LogViewerComponent implements OnInit, OnDestroy {
  logs: UserActionLogDtoResponse[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  private subscription!: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.subscription = this.adminService.getActionLogs().subscribe({
      next: (response: ApiResponse<UserActionLogDtoResponse[]>) => {
        this.logs = response.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to load logs.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
