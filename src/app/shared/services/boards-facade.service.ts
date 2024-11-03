import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BoardsSelectors, BoardsActions, CurrentBoardActions, BoardTitleIsFavorite } from '../../store/boards';
import { Board, BoardResponse } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class BoardsFacadeService {
  constructor(private store: Store) {}

  getBoard(): Observable<BoardResponse> {
    return this.store.select(BoardsSelectors.selectBoard);
  }

  getBoardId(): Observable<number> {
    return this.store.select(BoardsSelectors.selectBoardId);
  }

  getBoardTitle(): Observable<string> {
    return this.store.select(BoardsSelectors.selectBoardTitle);
  }

  getIsBoardFavorite(): Observable<boolean> {
    return this.store.select(BoardsSelectors.selectBoardIsFavorite);
  }

  getListIds(): Observable<number[]> {
    return this.store.select(BoardsSelectors.selectBoardListIds);
  }

  getBoardsTitleIsFavorite(): Observable<BoardTitleIsFavorite[]> {
    return this.store.select(BoardsSelectors.selectBoardsTitleIsFavorite);
  }

  fetchAll(): void {
    this.store.dispatch(BoardsActions.fetchAll());
  }

  create(create: Partial<Board> & Required<Pick<Board, 'title'>>): void {
    this.store.dispatch(BoardsActions.create({ create }));
  }

  toggleFavorite(id?: number, isFavorite?: boolean): void {
    this.store.dispatch(BoardsActions.toggleFavorite({ id, isFavorite }));
  }

  fetch(id: number): void {
    this.store.dispatch(CurrentBoardActions.fetch({ id }));
  }

  updateListIds(listIds: number[]): void {
    this.store.dispatch(CurrentBoardActions.updateListIds({ listIds }));
  }
}
