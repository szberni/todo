import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ListsActions, CardsActions, CurrentCardActions} from 'src/app/store';
import { BoardsFacadeService, CardsFacadeService, CardsRequestsService, RouteName, CardUpdate } from 'src/app/shared';

@Injectable()
export class CardsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private boardsFacade: BoardsFacadeService,
    private cardsFacade: CardsFacadeService,
    private toastr: ToastrService,
    private cardsRequests: CardsRequestsService
  ) {}

  fetchAllCards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardsActions.fetchAll),
      switchMap(({ boardId }) => {
        return this.cardsRequests.getCards(boardId)
          .pipe(
            map((cards) => CardsActions.loadAll({ cards })),
            catchError((error: HttpErrorResponse) => of(CardsActions.requestFailure({ error })))
          );
      })
    );
  });

  fetchCurrentCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentCardActions.fetch),
      switchMap(({ id }) => {
        return this.cardsRequests.getCard(id)
          .pipe(
            map((card) => CurrentCardActions.load({ card })),
            catchError((error: HttpErrorResponse) =>
              of(CardsActions.requestFailure({ error, navigate: [RouteName.home] }))
            )
          );
      })
    );
  });

  closeCurrentCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentCardActions.close),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      tap(([, boardId]) => this.router.navigate([RouteName.home, boardId])),
      map(() => CurrentCardActions.reset())
    );
  });

  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardsActions.create),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      switchMap(([{ title, listId }, boardId]) => {
        const card = { title, boardId, listId, archived: false };

        return this.cardsRequests.createCard(card)
          .pipe(
            map((card) => CardsActions.loadCreated({ card })),
            catchError((error: HttpErrorResponse) => of(CardsActions.requestFailure({ error })))
          );
      })
    );
  });

  addCardIdToList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardsActions.loadCreated),
      map(({ card: { id, listId } }) => ListsActions.addCardId({ listId, cardId: id }))
    );
  });

  updateCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentCardActions.update),
      switchMap(({ update }) => {
        return this.cardsRequests.updateCard(update)
          .pipe(
            map((card) => CurrentCardActions.load({ card })),
            catchError((error: HttpErrorResponse) => of(CardsActions.requestFailure({ error })))
          );
      })
    );
  });

  archiveCard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentCardActions.archive),
      concatLatestFrom(() => this.cardsFacade.getCurrentCardId()),
      switchMap(([, id]) => {
        return this.cardsRequests.updateCard({ id, archived: true })
          .pipe(
            map((card) => CardsActions.loadArchived({ card })),
            catchError((error: HttpErrorResponse) => of(CardsActions.requestFailure({ error })))
          );
      })
    );
  });

  updateCards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentCardActions.load),
      concatLatestFrom(() => this.boardsFacade.getBoardId()),
      map(([, boardId]) => CardsActions.fetchAll({ boardId })),
      catchError((error: HttpErrorResponse) => of(CardsActions.requestFailure({ error })))
    );
  });

  removeCardIdFromList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardsActions.loadArchived),
      map(({ card: { listId, id } }) => ListsActions.removeCardId({ listId, cardId: id }))
    );
  });

  moveCardBetweenLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardsActions.moveCardBetweenLists),
      switchMap(({ card, currentListId, currentCardIds, prevCardIds }) => {
        const prevListId = card.listId;
        const update: CardUpdate = { id: card.id, listId: currentListId };

        return this.cardsRequests.updateCard(update)
          .pipe(
            map((updatedCard) => {
              return CardsActions.loadUpdated({
                card: updatedCard,
                currentListId,
                currentCardIds,
                prevListId,
                prevCardIds,
              });
            }),
            catchError((error: HttpErrorResponse) => of(CardsActions.requestFailure({ error })))
          );
      })
    );
  });

  updateListsOnMoveCardBetweenLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CardsActions.loadUpdated),
      map(({ prevListId, currentListId, currentCardIds, prevCardIds }) => {
        return ListsActions.updateMultiple({
          updateForFirstList: { id: currentListId, cardIds: currentCardIds },
          updateForSecondList: { id: prevListId, cardIds: prevCardIds },
        });
      })
    );
  });

  handleErrorOnRequestFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CardsActions.requestFailure),
        tap((actions) => {
          if (actions.navigate) this.router.navigate(actions.navigate);
          this.toastr.error('Something went wrong');
        })
      );
    },
    { dispatch: false },
  );
}
