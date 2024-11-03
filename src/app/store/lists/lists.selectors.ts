import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ListsState } from '.';
import { FeatureKey } from 'src/app/shared';

const selectListsState = createFeatureSelector<ListsState>(FeatureKey.lists);

const selectLists = createSelector(selectListsState, ({ lists }) => lists);

export const ListsSelectors = {
  selectLists,
} as const;
