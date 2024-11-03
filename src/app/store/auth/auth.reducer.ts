import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared';
import { AuthActions } from '.';

export interface AuthState {
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  error: null,
};

export const authReducer = createReducer<AuthState>(
  initialState,
  on(AuthActions.loginSuccess, AuthActions.autoLoginSuccess, (state, { user }): AuthState => {
    return { ...state, user };
  }),
  on(AuthActions.loginFailure, (state, { error }): AuthState => {
    return { ...state, error };
  }),
  on(AuthActions.resetError, (state): AuthState => {
    return { ...state, error: null };
  }),
  on(AuthActions.logout, (state): AuthState => {
    return { ...state, user: null };
  })
);
