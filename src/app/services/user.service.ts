import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDtoResponse } from './admin.service';
import { ApiResponse } from './post.service';
import { UpdateUserDtoRequest } from '../models/update-user-dto-request.model';
import { LoginDtoRequest } from '../models/login-dto-request.model';
import { AuthenticationDtoResponse } from '../models/authentication-dto-response.model';
import { RegisterDtoRequest } from '../models/register-dto.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080';
  private authStateSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) { }

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

  // Giriş yapmış kullanıcının profil bilgilerini getirir.
  getMyProfile(): Observable<UserDtoResponse> {
    return this.http
      .get<ApiResponse<UserDtoResponse>>(`${this.baseUrl}/user/myProfile`)
      .pipe(map(response => response.data));
  }

  // Belirtilen userUuid ile kullanıcı profilini getirir.
  getProfile(userUuid: string): Observable<UserDtoResponse> {
    return this.http
      .get<ApiResponse<UserDtoResponse>>(`${this.baseUrl}/user/profile/${userUuid}`)
      .pipe(map(response => response.data));
  }

  // Güncelleme isteği gönderir.
  updateUser(request: UserDtoResponse): Observable<UpdateUserDtoRequest> {
    return this.http
      .post<ApiResponse<UserDtoResponse>>(`${this.baseUrl}/user/update`, request)
      .pipe(map(response => response.data));
  }

  sendVerificationEmail(): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(`${this.baseUrl}/user/sendVerification`, {})
      // Eğer response body'de doğrulama mesajı varsa; aksi takdirde doğrudan dönebilirsiniz.
      .pipe(map(response => response.data));
  }

  // Yeni: E-posta doğrulama işlemi
  verifyEmail(code: string): Observable<UserDtoResponse> {
    return this.http
      .post<ApiResponse<UserDtoResponse>>(`${this.baseUrl}/user/verifyEmail?code=${code}`, {})
      .pipe(map(response => response.data));
  }
}
