import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDtoResponse, PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: PostDtoResponse | null = null;

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    const postUuid = this.route.snapshot.paramMap.get('postUuid');
    if (postUuid) {
      this.postService.getPost(postUuid).subscribe({
        next: (data) => {
          this.post = data;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
