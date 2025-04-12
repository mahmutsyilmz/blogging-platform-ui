import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'crypto';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { DashboardDto } from '../models/dashboard-dto.model';
import { UserActionLogDtoResponse } from '../models/user-action-log-dto-response.model';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  createdDate: string;
  data: T;
  message: string;
  path: string;
}

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RequestType = "CREATE" | "UPDATE" | "DELETE";

export interface PostRequestDtoResponse {
  id: string;
  uuid: string;
  title: string;
  content: string;
  username: string;
  targetPostId: string;
  createdDate: string;
  requestStatus: RequestStatus;
  requestType: RequestType;
}

export interface UserDtoResponse {
  uuid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdDate: string;
  role: string;
  bio: string;
  emailVerified: boolean;
  postCount: number;
  likeCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPendingRequests(): Observable<PostRequestDtoResponse[]> {
    return this.http
      .get<ApiResponse<PostRequestDtoResponse[]>>(`${this.baseUrl}/admin/pending`)
      .pipe(
        map(response => response.data)
      )
  }

  approveRequest(requestUuid: string): Observable<PostRequestDtoResponse> {
    return this.http
      .post<PostRequestDtoResponse>(`${this.baseUrl}/admin/approve/${requestUuid}`, {})
  }

  rejectRequest(requestUuid: string): Observable<PostRequestDtoResponse> {
    return this.http
    .post<ApiResponse<PostRequestDtoResponse>>(`${this.baseUrl}/admin/reject/${requestUuid}`, {})
      .pipe(
        map(response => response.data)
      );
  }

  getAllUsers(): Observable<UserDtoResponse[]> {
    return this.http
      .get<ApiResponse<UserDtoResponse[]>>(`${this.baseUrl}/admin/users`)
      .pipe(map(response => response.data));
  }

  getDashboard(): Observable<ApiResponse<DashboardDto>> {
    return this.http.get<ApiResponse<DashboardDto>>(`${this.baseUrl}/admin/dashboard`);
  }

  getActionLogs(): Observable<ApiResponse<UserActionLogDtoResponse[]>> {
    return this.http.get<ApiResponse<UserActionLogDtoResponse[]>>(`${this.baseUrl}/admin/actionLogs`);
  }

  


}
