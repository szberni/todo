import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { CardResponse, CardUpdate } from 'src/app/shared';

export const CardsActions = {
  fetchAll: createAction(
    '[Cards] Fetch All',
    props<{ boardId: number }>(),
  ),

  loadAll: createAction(
    '[Cards] Load All',
    props<{ cards: CardResponse[] }>(),
  ),

  create: createAction(
    '[Cards] Create',
    props<{ title: string; listId: number }>(),
  ),

  loadCreated: createAction(
    '[Cards] Load Created',
    props<{ card: CardResponse }>(),
  ),

  loadArchived: createAction(
    '[Cards] Load Archived',
    props<{ card: CardResponse }>(),
  ),

  moveCardBetweenLists: createAction(
    '[Cards] Move Card Between Lists',
    props<{
      card: CardResponse;
      currentListId: number;
      currentCardIds: number[];
      prevCardIds: number[];
    }>(),
  ),

  loadUpdated: createAction(
    '[Cards] Load Updated',
    props<{
      card: CardResponse;
      currentListId: number;
      currentCardIds: number[];
      prevListId: number;
      prevCardIds: number[];
    }>(),
  ),

  requestFailure: createAction(
    '[Cards] Request Failure',
    props<{ error: HttpErrorResponse; navigate?: string[] }>(),
  ),
} as const;

export const CurrentCardActions = {
  fetch: createAction(
    '[CurrentCard] Fetch',
    props<{ id: number }>(),
  ),

  load: createAction(
    '[CurrentCard] Load',
    props<{ card: CardResponse }>(),
  ),

  update: createAction(
    '[CurrentCard] Update',
    props<{ update: CardUpdate }>(),
  ),

  archive: createAction(
    '[CurrentCard] Archive',
  ),

  close: createAction(
    '[CurrentCard] Close',
  ),

  reset: createAction(
    '[CurrentCard] Reset',
  ),
} as const;
