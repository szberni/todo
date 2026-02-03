import { createReducer, on } from '@ngrx/store';
import { DEFAULT_BOARD, BoardResponse, Status } from 'src/app/shared';
import { BoardsActions, CurrentBoardActions } from 'src/app/store/boards';

export type GeneralBoardInfo = Pick<BoardResponse, 'id' | 'title' | 'isFavorite'>;

export interface BoardsState {
  board: BoardResponse;
  status: Status;
  generalBoardsInfo: GeneralBoardInfo[];
}

const initialState: BoardsState = {
  board: DEFAULT_BOARD,
  status: Status.loading,
  generalBoardsInfo: [],
};

export const boardsReducer = createReducer<BoardsState>(
  initialState,
  on(CurrentBoardActions.fetch, (state): BoardsState => {
    return { ...state, status: Status.loading };
  }),
  on(CurrentBoardActions.load, CurrentBoardActions.loadAndFetchLists, (state, { board }): BoardsState => {
    const generalBoardsInfo = state.generalBoardsInfo.map(
      (partialBoard: GeneralBoardInfo) => {
        if (partialBoard.id === board.id) {
          return { ...partialBoard, title: board.title, isFavorite: board.isFavorite };
        }

        return partialBoard;
      }
    );

    return { ...state, generalBoardsInfo, board, status: Status.success };
  }),
  on(BoardsActions.loadGeneralBoardsInfo, (state, { boards }): BoardsState => {
    const generalBoardsInfo = boards.map(({ id, title, isFavorite }) => {
      return { id, title, isFavorite };
    });

    return { ...state, generalBoardsInfo };
  })
);
