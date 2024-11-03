import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Board, BoardResponse } from 'src/app/shared';

export const BoardsActions = {
  fetchAll: createAction(
    '[Boards] Fetch All'
  ),

  loadAllTitleIsFavorite: createAction(
    '[Boards] Load All Title IsFavorite',
    props<{ boards: BoardResponse[] }>()
  ),

  create: createAction(
    '[Boards] Create',
    props<{ create: Partial<Board> & Required<Pick<Board, 'title'>> }>()
  ),

  toggleFavorite: createAction(
    '[Boards] Toggle Favorite',
    props<{ id?: number; isFavorite?: boolean }>()
  ),

  requestFailure: createAction(
    '[Boards] Request Failure',
    props<{ error: HttpErrorResponse; navigate?: string[] }>()
  ),
} as const;

export const CurrentBoardActions = {
  fetch: createAction(
    '[CurrentBoard] Fetch',
    props<{ id: number }>(),
  ),

  load: createAction(
    '[CurrentBoard] Load',
    props<{ board: BoardResponse }>(),
  ),

  loadAndFetchLists: createAction(
    '[CurrentBoard] Load And Fetch Lists',
    props<{ board: BoardResponse }>(),
  ),

  addListId: createAction(
    '[CurrentBoard] Add ListId',
    props<{ id: number }>(),
  ),

  updateListIds: createAction(
    '[CurrentBoard] Update ListIds',
    props<{ listIds: number[] }>(),
  ),

  removeListId: createAction(
    '[CurrentBoard] Remove ListId',
    props<{ id: number }>(),
  )
} as const;
