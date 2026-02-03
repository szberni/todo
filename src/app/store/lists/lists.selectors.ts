import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ListsState } from '.';
import { FeatureKey } from 'src/app/shared';

const selectListsState = createFeatureSelector<ListsState>(FeatureKey.lists);

const selectLists = createSelector(selectListsState, ({ lists }) => lists);

const selectListsWithStatus = createSelector(selectListsState, ({ lists, status }) => ({ lists, status }));

export const ListsSelectors = {
  selectLists,
  selectListsWithStatus
} as const;
