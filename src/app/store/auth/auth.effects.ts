import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequestsService, RouteName, User, calculateExpirationDate } from 'src/app/shared';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private USER_KEY = 'userData';

  constructor(
    private actions$: Actions,
    private router: Router,
    private cookieService: CookieService,
    private authRequestsService: AuthRequestsService,
  ) {}

  signup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ credentials }) =>
        this.authRequestsService.signup(credentials)
          .pipe(
            map(({ user }) => AuthActions.loginSuccess({ user })),
            catchError(({ error }: HttpErrorResponse) => of(AuthActions.loginFailure({ error })))
          )
      )
    );
  });

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authRequestsService.login(credentials)
          .pipe(
            map(({ user }) => AuthActions.loginSuccess({ user })),
            catchError(({ error }: HttpErrorResponse) => of(AuthActions.loginFailure({ error })))
          )
      )
    );
  });

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData = this.cookieService.get(this.USER_KEY);
        if (!userData) {
          return AuthActions.logout();
        }
        const user: User = JSON.parse(userData);

        return AuthActions.autoLoginSuccess({ user });
      })
    );
  });

  setToken$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          const tokenExpirationDate = calculateExpirationDate();
          this.cookieService.set(this.USER_KEY, JSON.stringify(user), tokenExpirationDate, '/');
        })
      )
    },
    { dispatch: false },
  );

  deleteToken$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.cookieService.delete(this.USER_KEY, '/'))
      );
    },
    { dispatch: false },
  );

  navigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.logout),
        tap((action) =>
          this.router.navigate(action.type === AuthActions.loginSuccess.type ? [`/${RouteName.home}`] : ['/'])
        )
      );
    },
    { dispatch: false },
  );
}
