import { Component, OnInit } from '@angular/core';
import { PostDtoRequest, PostDtoResponse, PostService } from '../../services/post.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { jwtDecode } from 'jwt-decode';


// jwt-payload.model.ts
export interface MyJwtPayload {
  sub: string;
  userId: string;
  iat: number;
  exp: number;
  role: { authority: string }[];
}



@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css'
})
export class AllPostsComponent implements OnInit {
  posts: PostDtoResponse[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  username: string = '';
  isAdmin: boolean = false;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.postService.getAllPosts().subscribe({
        next: (data) => {
          this.posts = data;
          
          
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
    const token = localStorage.getItem('token');
    if (token) {
        const payload = jwtDecode<MyJwtPayload>(token);
        // role alanı bir dizi, bu yüzden admin olup olmadığını kontrol etmek için some() kullanıyoruz.
        this.isAdmin = payload.role.some(r => r.authority === 'ROLE_ADMIN');
    }

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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Logout sonrası login sayfasına yönlendir.
    this.router.navigate(['/login']);
  }

  goToPendingRequests(): void {
    this.router.navigate(['/admin']);
  }

}