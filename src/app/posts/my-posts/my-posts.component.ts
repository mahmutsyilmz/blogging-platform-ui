// my-posts.component.ts
import { Component, OnInit } from '@angular/core';
import { PostDtoResponse, PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  posts: PostDtoResponse[] = [];
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    // Sadece tarayıcı ortamında istek yapıyoruz.
    if (typeof window !== 'undefined') {
      const userId = this.getUserIdFromToken();
      if (userId) {
        this.postService.getMyPosts(userId).subscribe({
          next: (data) => {
            this.posts = data;
            this.loading = false;
          },
          error: (err) => {
            this.errorMessage = err.error?.exception?.message;
            console.error("Post loading failure: ", err);
            this.loading = false;
          }
        });
      } else {
        this.errorMessage = 'User information not found';
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  getUserIdFromToken(): string | null {
    // Tarayıcı ortamında mı kontrol ediyoruz.
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }
}
