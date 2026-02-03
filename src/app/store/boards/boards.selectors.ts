import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardsState } from '.';
import { FeatureKey, sortByFavoriteAndTitle } from 'src/app/shared';

const selectBoardsState = createFeatureSelector<BoardsState>(FeatureKey.boards);

const selectBoardStatus = createSelector(selectBoardsState, ({ status }) => status);

const selectBoard = createSelector(selectBoardsState, ({ board }) => board);

const selectBoardId = createSelector(selectBoard, ({ id }) => id);

const selectBoardTitle = createSelector(selectBoard, ({ title }) => title);

const selectBoardIsFavorite = createSelector(selectBoard, ({ isFavorite }) => isFavorite);

const selectBoardListIds = createSelector(selectBoard, ({ listIds }) => listIds);

const selectGeneralBoardsInfo = createSelector(
  selectBoardsState,
  ({ generalBoardsInfo }) => sortByFavoriteAndTitle(generalBoardsInfo)
);

export const BoardsSelectors = {
  selectBoardStatus,
  selectBoard,
  selectBoardId,
  selectBoardTitle,
  selectBoardIsFavorite,
  selectBoardListIds,
  selectGeneralBoardsInfo,
} as const;
