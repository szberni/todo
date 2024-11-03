import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { ListResponse, ListUpdate } from 'src/app/shared';

export const ListsActions = {
  fetchAll: createAction(
    '[Lists] Fetch All',
    props<{ boardId: number }>(),
  ),

  loadAll: createAction(
    '[Lists] Load All',
    props<{ lists: ListResponse[] }>(),
  ),

  create: createAction(
    '[Lists] Create',
    props<{ title: string }>(),
  ),

  loadCreated: createAction(
    '[Lists] Load Created',
    props<{ list: ListResponse }>(),
  ),

  loadArchived: createAction(
    '[Lists] Load Archived',
    props<{ list: ListResponse }>(),
  ),

  loadUpdated: createAction(
    '[Lists] Load Updated',
    props<{ list: ListResponse }>(),
  ),

  update: createAction(
    '[Lists] Update',
    props<{ update: ListUpdate }>(),
  ),

  updateMultiple: createAction(
    '[Lists] Update Multiple',
    props<{ updateForFirstList: ListUpdate; updateForSecondList: ListUpdate }>(),
  ),

  addCardId: createAction(
    '[Lists] Add Card Id',
    props<{ listId: number; cardId: number }>(),
  ),

  removeCardId: createAction(
    '[Lists] Remove Card Id',
    props<{ listId: number; cardId: number }>(),
  ),

  requestFailure: createAction(
    '[Lists] Request Failure',
    props<{ error: HttpErrorResponse }>(),
  ),
} as const;
