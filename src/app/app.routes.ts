import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PendingRequestsComponent } from './admin/pending-requests/pending-requests.component';
import { adminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { ProfileComponent } from './profile/profile.component';
import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { AddPostComponent } from './posts/add-post/add-post.component';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';
import { UpdatePostComponent } from './posts/update-post/update-post.component';
import { LogViewerComponent } from './admin/log-viewer/log-viewer.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'posts', component: AllPostsComponent },
    { path: 'posts/add', component: AddPostComponent },
    { path: 'posts/my', component: MyPostsComponent },
    { path: 'posts/:postUuid', component: PostDetailComponent },
    { path: 'posts/update/:postId', component: UpdatePostComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard]  }, 
    { path: 'admin/pending', component: PendingRequestsComponent, canActivate: [adminGuard]  },
    { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard]  },
    { path: 'admin/logs/:logType', component: LogViewerComponent, canActivate: [adminGuard]  },
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: '/posts', pathMatch: 'full' },
    { path: '**', redirectTo: '/posts' },
    
    
  ];
