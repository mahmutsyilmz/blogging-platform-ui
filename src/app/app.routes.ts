import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { AddPostComponent } from './posts/add-post/add-post.component';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';
import { PendingRequestsComponent } from './admin/pending-requests/pending-requests.component';
import { adminGuard } from './guards/admin.guard';
import { UpdatePostComponent } from './posts/update-post/update-post.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'posts', component: AllPostsComponent },
    { path: 'posts/add', component: AddPostComponent },
    { path: 'posts/my', component: MyPostsComponent },
    { path: 'posts/update/:postId', component: UpdatePostComponent },
    { path: 'admin', component: PendingRequestsComponent, canActivate: [adminGuard] },
    { path: '', redirectTo: '/posts', pathMatch: 'full' },
    { path: '**', redirectTo: '/posts' },
    
    
  ];
