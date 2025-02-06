import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'crypto';
import { response } from 'express';
import { map, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080';

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


}
