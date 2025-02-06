import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface PostDtoResponse {
  uuid: string;
  title: string;
  content: string;
  username: string;
  createdDate: string;
  updatedDate: string;
}

export interface ApiResponse<T> {
  createdDate: string;
  data: T;
  message: string;
  path: string;
}

export interface PostDtoRequest {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<PostDtoResponse[]> {
    return this.http
      .get<ApiResponse<PostDtoResponse[]>>(`${this.baseUrl}/post/getAll`)
      .pipe(map(response => response.data));
  }

  createPost(postData: PostDtoRequest): Observable<PostDtoResponse> {
    return this.http
      .post<PostDtoResponse>(`${this.baseUrl}/post/create`, postData);
  }

  getMyPosts(userId: string): Observable<PostDtoResponse[]> {
    return this.http
      .get<ApiResponse<PostDtoResponse[]>>(`${this.baseUrl}/post/getAllPostsByUserId/${userId}`)
      .pipe(map(response => response.data));
  }

  updatePost(postId: string, request: PostDtoRequest): Observable<PostDtoResponse> {
    return this.http
      .post<ApiResponse<PostDtoResponse>>(`${this.baseUrl}/post/update/${postId}`, request)
      .pipe(map(response => response.data));
  }

  deletePost(postId: string): Observable<PostDtoResponse> {
    return this.http
      .delete<ApiResponse<PostDtoResponse>>(`${this.baseUrl}/post/delete/${postId}`)
      .pipe(map(response => response.data));
  }

  // Belirtilen postId'ye ait post bilgisini getirir.
  getPost(postId: string): Observable<PostDtoResponse> {
    return this.http
      .get<ApiResponse<PostDtoResponse>>(`${this.baseUrl}/post/get/${postId}`)
      .pipe(map(response => response.data));
  }
}
