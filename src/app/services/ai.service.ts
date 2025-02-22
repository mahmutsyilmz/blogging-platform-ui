import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from './admin.service';



@Injectable({
  providedIn: 'root'
})
export class AiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  summarizePost(content: string): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/ai/summary`, { content })
      .pipe(map(response => response.data));
  }
}
