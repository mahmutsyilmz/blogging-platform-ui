import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { AddPostComponent } from './posts/add-post/add-post.component';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'posts', component: AllPostsComponent },
    { path: 'posts/add', component: AddPostComponent },
    { path: 'posts/my', component: MyPostsComponent },
    { path: '', redirectTo: '/posts', pathMatch: 'full' },
    { path: '**', redirectTo: '/posts' }
  ];
