import { Component, OnInit } from '@angular/core';
import { PostDtoResponse, PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { MatCardActions, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule,MatCardActions,MatCardContent,MatCardModule,MatIconModule],
  templateUrl: './my-posts.component.html'
})
export class MyPostsComponent implements OnInit {
  posts: PostDtoResponse[] = [];

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    // Sadece tarayıcı ortamında istek yapıyoruz.
    if (typeof window !== 'undefined') {
      const userId = this.getUserIdFromToken();
      if (userId) {
        this.postService.getMyPosts(userId).subscribe({
          next: (data) => {
            this.posts = data;
          }
        });
      }
    }
  }

  getUserIdFromToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (error) {
      return null;
    }
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/posts/update', postId]);
  }

  onDeletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe({
      next: (response) => {
        this.posts = this.posts.filter(post => post.uuid !== postId);
      }
    });
  }
}
