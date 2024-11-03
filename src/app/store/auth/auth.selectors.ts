import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '.';
import { FeatureKey } from 'src/app/shared';

const selectAuthState = createFeatureSelector<AuthState>(FeatureKey.auth);

const selectUser = createSelector(selectAuthState, (auth) => auth.user);

const selectUserEmail = createSelector(selectUser, (user) => user?.email);

const selectUserId = createSelector(selectUser, (user) => user?.id);

const selectError = createSelector(selectAuthState, (auth) => auth.error);

export const AuthSelectors = {
  selectUser,
  selectUserEmail,
  selectUserId,
  selectError,
} as const;
