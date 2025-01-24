import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _login$ = new Subject<{ email: string, password: string }>();
  private readonly _signup$ = new Subject<{ email: string, password: string }>();
  private readonly _error$ = new Subject<string>();
  private readonly _resetError$ = new Subject<void>();
  readonly login$ = this._login$.asObservable();
  readonly signup$ = this._signup$.asObservable();
  readonly error$ = this._error$.asObservable();
  readonly resetError$ = this._error$.asObservable();

  login(email: string, password: string): void {
    this._login$.next({ email, password });
  }

  signup(email: string, password: string): void {
    this._signup$.next({ email, password });
  }

  setError(error: string | null): void {
    this._error$.next(error);
  }

  resetError(): void {
    this._resetError$.next();
  }
}
