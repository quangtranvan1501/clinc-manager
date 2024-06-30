import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environments';
import { AppService } from './app.service';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';
import {  Router } from '@angular/router';
import { User } from '../@types';
import { MessagingService } from './messaging.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = environment.apiUrl; // Thay đổi thành URL của API login
  private loggedIn = false;
  constructor(
    private http: HttpClient,
    private appService: AppService,
    private router: Router,
    private messagingService: MessagingService
  ) { }
  getToken(): string | null {
    let token = sessionStorage.getItem('accesstoken');
    if (token) {
      token = token.replace(/(^"|"$)/g, ''); // Loại bỏ dấu ngoặc kép ở đầu và cuối
    }
    return token;
  }
  login(email: string, password: string) {
    return this.appService.postOption<any, any>({ email, password }, '/auth/login')
      .pipe(
        tap(response => {
          this.loggedIn = true;
          return response; // Add this line to return the response
        }),
        catchError(this.handleError)
      );
  }
  private handleError(error: any): Observable<never> {
    return throwError(() => error); 
  }
  logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('accesstoken');
    sessionStorage.removeItem('expirestoken')
    this.router.navigate(['/']);
    this.loggedIn = false;
  }

  isLoggedIn() {
    const expirestoken = sessionStorage.getItem('expirestoken');
    const accesstoken= sessionStorage.getItem('accesstoken')
    try {
      if(accesstoken){
        const decodedToken: any = jwt_decode(accesstoken);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      }
    } catch (error) {
      console.error('Token không hợp lệ', error);
      return false; 
    }
    return false;
  }

  forgotPass(email:string ){
    return this.appService.postOption<any, any>({ email }, '/auth/forgot-password')
      .pipe(
        map(response => {
          return response;
        })
      );
  }
  register(data: any) {
    return this.appService.postOption<User, Partial<User>>(data, '/auth/register');
  }

  changePassword(data: any) {
      return this.appService.post<any, any>(data, '/auth/reset-password').pipe(
        tap(response => {
          const user = response.body?.data?.user;
          const tokens = response.body?.data?.tokens;
          if (user && tokens) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.setItem('accesstoken', tokens.access.token);
            sessionStorage.setItem('expirestoken', tokens.access.expires);
            this.loggedIn = true;
          }
        }),
        catchError(this.handleError)
      );
  }

  getAuthorizationToken() {
    return 'Bearer ' + this.getToken();
  }
  clearToken(): void {
    sessionStorage.removeItem('accesstoken');
  }
}
