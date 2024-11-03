import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments";
import { AuthCredentials, AuthResponse } from "src/app/shared";

@Injectable({ providedIn: 'root' })
export class AuthRequestsService {
  private BASE_URL = environment.BASE_URL;
  private SIGNUP_URL = `${this.BASE_URL}/signup`;
  private LOGIN_URL = `${this.BASE_URL}/login`;

  constructor(private http: HttpClient) {}

  signup(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.SIGNUP_URL, credentials);
  }

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.LOGIN_URL, credentials);
  }
}
