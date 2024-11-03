import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthSelectors, AuthActions } from '../../store/auth';
import { User } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  constructor(private store: Store) {}

  getUser(): Observable<User | null> {
    return this.store.select(AuthSelectors.selectUser);
  }

  getUserEmail(): Observable<string | undefined> {
    return this.store.select(AuthSelectors.selectUserEmail);
  }

  getUserId(): Observable<number | undefined> {
    return this.store.select(AuthSelectors.selectUserId);
  }

  getError(): Observable<string | null> {
    return this.store.select(AuthSelectors.selectError);
  }

  autoLogin(): void {
    this.store.dispatch(AuthActions.autoLogin());
  }

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ credentials: { email, password } }));
  }

  signup(email: string, password: string): void {
    this.store.dispatch(AuthActions.signup({ credentials: { email, password } }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  resetError(): void {
    this.store.dispatch(AuthActions.resetError());
  }
}
