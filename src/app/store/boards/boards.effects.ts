import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, map, tap, of } from 'rxjs';
import { BoardsActions, ListsActions, CurrentBoardActions } from 'src/app/store';
import { AuthFacadeService, BoardsFacadeService, BoardsRequestsService, RouteName, Board, BoardResponse } from 'src/app/shared';

@Injectable()
export class BoardEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private toastr: ToastrService,
    private boardsRequests: BoardsRequestsService,
    private authFacade: AuthFacadeService,
    private boardsFacade: BoardsFacadeService
  ) {}

  fetchBoard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentBoardActions.fetch),
      switchMap(({ id }) => {
        return this.boardsRequests.getBoard(id)
          .pipe(
            map((board) => CurrentBoardActions.loadAndFetchLists({ board })),
            catchError((error: HttpErrorResponse) =>
              of(BoardsActions.requestFailure({ error, navigate: [RouteName.home] }))
            )
          );
      })
    );
  });

  fetchLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentBoardActions.loadAndFetchLists),
      map(({ board: { id } }) => ListsActions.fetchAll({ boardId: id }))
    );
  });

  fetchAllBoards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BoardsActions.fetchAll),
      switchMap(() => {
        return this.boardsRequests.getAllBoards()
          .pipe(
            map((boards) => BoardsActions.loadAllTitleIsFavorite({ boards })),
            catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
          );
      })
    );
  });

  createBoard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BoardsActions.create),
      concatLatestFrom(() => this.authFacade.getUserId()),
      switchMap(([{ create }, userId]) => {
        const board: Board = { listIds: [], ownerId: userId ?? 0, isFavorite: false, ...create };

        return this.boardsRequests.createBoard(board)
          .pipe(
            tap(({ id }) => this.router.navigate([RouteName.home, id])),
            map(() => BoardsActions.fetchAll()),
            catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
          );
      })
    );
  });

  toggleFavorite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BoardsActions.toggleFavorite),
      concatLatestFrom(() => this.boardsFacade.getBoard()),
      switchMap(([{ id, isFavorite }, board]) => {
        if (!id || id === board.id) {
          const updatedboard: BoardResponse = { ...board, isFavorite: !board.isFavorite };

          return this.boardsRequests.replaceBoard(updatedboard)
            .pipe(
              map((board) => CurrentBoardActions.load({ board })),
              catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
            );
        }

        return this.boardsRequests.updateBoard({ id, isFavorite: !isFavorite })
          .pipe(
            map(() => BoardsActions.fetchAll()),
            catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
          );
      })
    );
  });

  addListId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentBoardActions.addListId),
      concatLatestFrom(() => this.boardsFacade.getBoard()),
      switchMap(([{ id }, board]) => {
        const updatedBoard: BoardResponse = {
          ...board,
          listIds: board.listIds ? [...board.listIds, id] : [id],
        };

        return this.boardsRequests.replaceBoard(updatedBoard)
          .pipe(
            map((board) => CurrentBoardActions.load({ board })),
            catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
          );
      })
    );
  });

  removeListId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentBoardActions.removeListId),
      concatLatestFrom(() => this.boardsFacade.getBoard()),
      switchMap(([{ id }, board]) => {
        const updatedBoard: BoardResponse = {
          ...board,
          listIds: board.listIds?.filter((listId) => listId !== id),
        };

        return this.boardsRequests.replaceBoard(updatedBoard)
          .pipe(
            map((board) => CurrentBoardActions.load({ board })),
            catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
          );
      })
    );
  });

  updateListIds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrentBoardActions.updateListIds),
      concatLatestFrom(() => this.boardsFacade.getBoard()),
      switchMap(([{ listIds }, board]) => {
        const updatedBoard: BoardResponse = { ...board, listIds };

        return this.boardsRequests.replaceBoard(updatedBoard)
          .pipe(
            map((board) => CurrentBoardActions.load({ board })),
            catchError((error: HttpErrorResponse) => of(BoardsActions.requestFailure({ error })))
          );
      })
    );
  });

  handleErrorOnRequestFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BoardsActions.requestFailure),
        tap((actions) => {
          if (actions.navigate) this.router.navigate(actions.navigate);
          this.toastr.error('Something went wrong');
        })
      );
    },
    { dispatch: false },
  );
}
