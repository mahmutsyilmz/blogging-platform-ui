import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-liked-users-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule],
  template: `
    <h2 mat-dialog-title>Users Who Liked This Post</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let username of data.usernames">
          {{ username }}
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class LikedUsersDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { usernames: string[] }) {}
}
