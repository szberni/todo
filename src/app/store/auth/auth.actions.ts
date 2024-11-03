import { createAction, props } from '@ngrx/store';
import { User, AuthCredentials } from 'src/app/shared';

export const AuthActions = {
  signup: createAction(
    '[Auth] Signup',
    props<{ credentials: AuthCredentials }>()
  ),

  login: createAction(
    '[Auth] Login',
    props<{ credentials: AuthCredentials }>()
  ),

  autoLogin:  createAction(
    '[Auth] Auto Login'
  ),

  logout: createAction(
    '[Auth] Logout'
  ),

  loginSuccess: createAction(
    '[Auth] Login Success',
    props<{ user: User }>()
  ),

  autoLoginSuccess: createAction(
    '[Auth] Auto Login Success',
    props<{ user: User }>()
  ),

  loginFailure: createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
  ),

  resetError: createAction(
    '[Auth] Reset Error'
  ),
} as const;
