import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiResponse, PostDtoResponse } from './post.service';

export interface AuthenticationDtoResponse{
  token: string;
}

export interface LoginDtoRequest{
  username:string;
  password:string;
}

export interface RegisterDtoRequest{
  username:string;
  firstName:string;
  lastName:string;
  email:string;
  password:string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  // Başlangıçta token varsa true, yoksa false
  private authStateSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  authState$ = this.authStateSubject.asObservable();


  constructor(private http:HttpClient) { }

  // Login işlemi sonrasında çağrılacak
  setAuthState(isLoggedIn: boolean): void {
    this.authStateSubject.next(isLoggedIn);
  }


  login(loginData: LoginDtoRequest): Observable<AuthenticationDtoResponse> {
    return this.http.post<AuthenticationDtoResponse>(`${this.baseUrl}/user/login`,loginData);
  }

  register(registerData: RegisterDtoRequest): Observable<AuthenticationDtoResponse> {
    return this.http.post<AuthenticationDtoResponse>(`${this.baseUrl}/user/register`, registerData);
  }
}
