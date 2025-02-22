import { Component, OnInit } from '@angular/core';
import { PostDtoResponse, PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { LikeDtoRequest, LikeService } from '../../services/like.service';
import { jwtDecode } from 'jwt-decode';
import { LikedUsersDialogComponent } from '../../liked-users-dialog/liked-users-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SummaryDialogComponent } from '../../summary-dialog/summary-dialog.component';
import { AiService } from '../../services/ai.service';

interface JwtPayload {
  sub: string;
  userId: string;
  role: Array<{ authority: string }>;
  exp: number;
}

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './all-posts.component.html'
})

export class AllPostsComponent implements OnInit {
  posts: PostDtoResponse[] = [];
  username: string = '';
  isAdmin: boolean = false;
  likeCounts: { [postUuid: string]: number } = {};
  likedPosts: { [postUuid: string]: boolean } = {};

  constructor(
    private postService: PostService,
    private router: Router,
    private likeService: LikeService,
    private dialog: MatDialog,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    // Önce localStorage'dan username'i alalım
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }

    // Token bilgilerini de alalım (admin kontrolü için)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);
        this.isAdmin = payload.role.some(r => r.authority === 'ROLE_ADMIN');
      } catch (error) {
        console.error('Token decode error:', error);
      }
    }

    // Postları yükleyelim
    if (typeof window !== 'undefined') {
      this.postService.getAllPosts().subscribe({
        next: (data) => {
          this.posts = data;
          // Her post için beğeni sayısını ve liked status'ini yükleyelim
          this.posts.forEach(post => {
            this.loadLikeCount(post.uuid);
            this.loadLikedStatus(post.uuid);
          });
        }
      });
    }
  }

  loadLikeCount(postUuid: string): void {
    console.log(postUuid);
    this.likeService.getLikeCount(postUuid).subscribe({
      next: (count: number) => {
        this.likeCounts[postUuid] = count;
      }
    });
  }

  loadLikedStatus(postUuid: string): void {
    this.likeService.getLikedUsernames(postUuid).subscribe({
      next: (usernames: string[]) => {
        // Eğer beğenen kullanıcılar arasında mevcut username varsa, likedPosts true olsun.
        this.likedPosts[postUuid] = usernames.includes(this.username);
      }
    });
  }

  onLike(postUuid: string): void {
    const request: LikeDtoRequest = { postUuid };
    if (!this.likedPosts[postUuid]) {
      // Eğer post beğenilmemişse beğeni ekle
      this.likeService.likePost(request).subscribe({
        next: () => {
          this.likedPosts[postUuid] = true;
          this.likeCounts[postUuid] = (this.likeCounts[postUuid] || 0) + 1;
        }
      });
    } else {
      // Zaten beğenilmişse beğeniyi kaldır
      this.likeService.unlikePost(request).subscribe({
        next: () => {
          this.likedPosts[postUuid] = false;
          this.likeCounts[postUuid] = Math.max((this.likeCounts[postUuid] || 1) - 1, 0);
        }
      });
    }
  }

  openLikedUsers(postUuid: string): void {
    this.likeService.getLikedUsernames(postUuid).subscribe({
      next: (usernames: string[]) => {
        this.dialog.open(LikedUsersDialogComponent, {
          data: { usernames }
        });
      }
    });
  }

  openSummary(post: PostDtoResponse): void {
    this.aiService.summarizePost(post.content).subscribe({
      next: (summary: string) => {
        this.dialog.open(SummaryDialogComponent, {
          data: { summary }
        });
      }
    });
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
    this.router.navigate(['/login']);
  }

  goToPendingRequests(): void {
    this.router.navigate(['/admin']);
  }

  goToPostDetail(postUuid: string): void {
    this.router.navigate(['/posts', postUuid]);
  }
  
}
