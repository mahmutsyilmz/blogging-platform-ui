import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LikeDtoResponse {
  uuid: string;       
  postUuid: string;
  userUuid: string;
  username: string;
  email: string;
  createdDate: string;
}

export interface LikeDtoRequest {
  postUuid: string; 
}

export interface ApiResponse<T> {
  createdDate: string;
  data: T;
  message: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  likePost(request: LikeDtoRequest): Observable<LikeDtoResponse> {
    return this.http
      .post<ApiResponse<LikeDtoResponse>>(`${this.baseUrl}/like/create`, request)
      .pipe(map(response => response.data));
  }

  unlikePost(request: LikeDtoRequest): Observable<LikeDtoResponse> {
    return this.http
      .delete<ApiResponse<LikeDtoResponse>>(`${this.baseUrl}/like/delete`, { body: request })
      .pipe(map(response => response.data));
  }

  getLikeCount(postUuid: string): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.baseUrl}/like/count/${postUuid}`)
      .pipe(map(response => response.data));
  }

  getLikedUsernames(postUuid: string): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.baseUrl}/like/likedUsers/${postUuid}`)
      .pipe(map(response => response.data));
  }
}
