import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardsState } from '.';
import { FeatureKey, sortByFavoriteAndTitle } from 'src/app/shared';

const selectBoardsState = createFeatureSelector<BoardsState>(FeatureKey.boards);

const selectBoard = createSelector(selectBoardsState, ({ currentBoard }) => currentBoard);

const selectBoardId = createSelector(selectBoard, ({ id }) => id);

const selectBoardTitle = createSelector(selectBoard, ({ title }) => title);

const selectBoardIsFavorite = createSelector(selectBoard, ({ isFavorite }) => isFavorite);

const selectBoardListIds = createSelector(selectBoard, ({ listIds }) => listIds);

const selectBoardsTitleIsFavorite = createSelector(
  selectBoardsState,
  ({ boardsTitleIsFavorite }) => sortByFavoriteAndTitle(boardsTitleIsFavorite)
);

export const BoardsSelectors = {
  selectBoard,
  selectBoardId,
  selectBoardTitle,
  selectBoardIsFavorite,
  selectBoardListIds,
  selectBoardsTitleIsFavorite,
} as const;
