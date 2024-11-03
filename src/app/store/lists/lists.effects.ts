import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CurrentBoardActions, ListsActions, CardsActions } from 'src/app/store';
import { BoardsFacadeService, ListsFacadeService, ListsRequestsService, ListUpdate } from 'src/app/shared';

@Injectable()
export class ListsEffects {
  constructor(
    private actions$: Actions,
    private boardsFacade: BoardsFacadeService,
    private listsFacade: ListsFacadeService,
    private toastr: ToastrService,
    private listsRequests: ListsRequestsService
  ) {}

  fetchAllLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.fetchAll),
      switchMap(({ boardId }) => {
        return this.listsRequests.getLists(boardId)
          .pipe(
            map((lists) => ListsActions.loadAll({ lists })),
            catchError((error: HttpErrorResponse) => of(ListsActions.requestFailure({ error })))
          );
      })
    );
  });

  fetchCards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.loadAll),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      map(([, boardId]) => CardsActions.fetchAll({ boardId }))
    );
  });

  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.create),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      switchMap(([{ title }, boardId]) => {
        const list = { title, boardId, archived: false, cardIds: [] };

        return this.listsRequests.createList(list)
          .pipe(
            map((list) => ListsActions.loadCreated({ list })),
            catchError((error: HttpErrorResponse) => of(ListsActions.requestFailure({ error })))
          );
      })
    );
  });

  addListIdToBoard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.loadCreated),
      map(({ list: { id } }) => CurrentBoardActions.addListId({ id }))
    );
  });

  updateList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.update),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      switchMap(([{ update }, boardId]) => {
        return this.listsRequests.updateList(update)
          .pipe(
            map((list) =>
              update.archived
                ? ListsActions.loadArchived({ list })
                : ListsActions.fetchAll({ boardId })
            ),
            catchError((error: HttpErrorResponse) => of(ListsActions.requestFailure({ error })))
          );
      })
    );
  });

  addCardId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.addCardId),
      concatLatestFrom(() => this.listsFacade.getLists()),
      switchMap(([{ listId, cardId }, lists]) => {
        const currentList = lists.find(({ id }) => id === listId);
        if (!currentList) throw new Error('List does not exist');

        const update: ListUpdate = {
          id: listId,
          cardIds: currentList.cardIds ? [...currentList.cardIds, cardId] : [cardId],
        };

        return this.listsRequests.updateList(update)
          .pipe(
            map((list) => ListsActions.loadUpdated({ list })),
            catchError((error: HttpErrorResponse) => of(ListsActions.requestFailure({ error })))
          );
      })
    );
  });

  removeCardId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.removeCardId),
      concatLatestFrom(() => this.listsFacade.getLists()),
      switchMap(([{ listId, cardId }, lists]) => {
        const currentList = lists.find((list) => list.id === listId);
        if (!currentList) throw new Error('List does not exist');
        if (!currentList.cardIds) throw new Error('No cardIds on current list');

        const update = {
          id: listId,
          cardIds: currentList.cardIds.filter((id) => id !== cardId),
        };

        return this.listsRequests.updateList(update)
          .pipe(
            map((list) => ListsActions.loadUpdated({ list })),
            catchError((error: HttpErrorResponse) => of(ListsActions.requestFailure({ error })))
          );
      })
    );
  });

  removeListIdFromBoard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.loadArchived),
      map(({ list: { id } }) => CurrentBoardActions.removeListId({ id }))
    );
  });

  updateMultipleLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.updateMultiple),
      switchMap(({ updateForFirstList, updateForSecondList }) => {
        return this.listsRequests.updateList(updateForFirstList)
          .pipe(
            map(() => ListsActions.update({ update: updateForSecondList })),
            catchError((error: HttpErrorResponse) => of(ListsActions.requestFailure({ error })))
          );
      })
    );
  });

  handleErrorOnRequestFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ListsActions.requestFailure),
      tap(() => this.toastr.error('Something went wrong')),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      map(([, boardId]) => ListsActions.fetchAll({ boardId }))
    );
  });
}
