import { Component, OnInit } from '@angular/core';
import { PostDtoRequest, PostDtoResponse, PostService } from '../../services/post.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 




@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [MatCardModule, CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css'
})
export class AllPostsComponent implements OnInit {
  posts: PostDtoResponse[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  username: string = '';

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.postService.getAllPosts().subscribe({
        next: (data) => {
          this.posts = data;
          
          const storedUsername = localStorage.getItem('username');
                    
          this.username = storedUsername || '';
          this.loading = false;

        },
        error: (err) => {
          this.errorMessage = err.error?.exception?.message;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  goToAddPost(): void {
    this.router.navigate(['/posts/add']);
  }

  goToMyPosts(): void {
    this.router.navigate(['/posts/my']);
  }


}