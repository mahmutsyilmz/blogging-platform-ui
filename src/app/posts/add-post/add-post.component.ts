import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostDtoRequest, PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatInputModule,MatFormFieldModule,ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  postForm: FormGroup;
  errorMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }


  onSubmit(): void {
    if (this.postForm.valid) {
      const postData: PostDtoRequest = this.postForm.value;
      this.postService.createPost(postData).subscribe({
        next: (response) => {
          // Başarılı eklemeden sonra tüm postların listelendiği sayfaya yönlendir.
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          console.error("Post creation failure", error);
           }  
      });
    }
  }
}