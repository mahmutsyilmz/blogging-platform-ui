import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostDtoRequest, PostDtoResponse, PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {
  postForm: FormGroup;
  postId: string = '';
  errorMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('postId');
      if (id) {
        this.postId = id;
        this.loadPostData(id);
      } else {
        this.errorMessage = 'No post id provided.';
      }
    });
  }

  loadPostData(id: string): void {
    this.postService.getPost(id).subscribe({
      next: (post: PostDtoResponse) => {
        // Formu mevcut post bilgileriyle dolduruyoruz.
        this.postForm.patchValue({
          title: post.title,
          content: post.content
        });
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData: PostDtoRequest = this.postForm.value;
      this.postService.updatePost(this.postId, postData).subscribe({
        next: (response: PostDtoResponse) => {
          this.router.navigate(['/posts']);
        }
      });
    }
  }
}
