import { createReducer, on } from '@ngrx/store';
import { DEFAULT_BOARD, BoardResponse } from 'src/app/shared';
import { BoardsActions, CurrentBoardActions } from 'src/app/store/boards';

export type BoardTitleIsFavorite = Pick<BoardResponse, 'id' | 'title' | 'isFavorite'>;

export interface BoardsState {
  boardsTitleIsFavorite: BoardTitleIsFavorite[];
  currentBoard: BoardResponse;
}

const initialState: BoardsState = {
  boardsTitleIsFavorite: [],
  currentBoard: DEFAULT_BOARD,
};

export const boardsReducer = createReducer<BoardsState>(
  initialState,
  on(CurrentBoardActions.load, CurrentBoardActions.loadAndFetchLists, (state, { board }): BoardsState => {
    const boardsTitleIsFavorite = state.boardsTitleIsFavorite.map(
      (partialBoard: BoardTitleIsFavorite) => {
        if (partialBoard.id === board.id) {
          return { ...partialBoard, title: board.title, isFavorite: board.isFavorite };
        }

        return partialBoard;
      }
    );

    return { ...state, boardsTitleIsFavorite, currentBoard: { ...board } };
  }),
  on(BoardsActions.loadAllTitleIsFavorite, (state, { boards }): BoardsState => {
    const boardsTitleIsFavorite = boards.map(({ id, title, isFavorite }) => {
      return { id, title, isFavorite };
    });

    return { ...state, boardsTitleIsFavorite };
  })
);
