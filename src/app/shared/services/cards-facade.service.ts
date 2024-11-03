import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CardsSelectors } from '../../store/cards/cards.selectors';
import { CardsActions, CurrentCardActions } from '../../store/cards/cards.actions';
import { CardResponse, CardUpdate } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class CardsFacadeService {
  constructor(private store: Store) {}

  getCurrentCard(): Observable<CardResponse> {
    return this.store.select(CardsSelectors.selectCurrentCard);
  }

  getCurrentCardId(): Observable<number> {
    return this.store.select(CardsSelectors.selectCurrentCardId);
  }

  getCards(): Observable<CardResponse[]> {
    return this.store.select(CardsSelectors.selectCards);
  }

  fetch(id: number): void {
    this.store.dispatch(CurrentCardActions.fetch({ id }));
  }

  create(title: string, listId: number): void {
    this.store.dispatch(CardsActions.create({ title, listId }));
  }

  moveCardBetweenLists(
    card: CardResponse,
    currentListId: number,
    currentCardIds: number[],
    prevCardIds: number[]
  ): void {
    this.store.dispatch(
      CardsActions.moveCardBetweenLists({
        card,
        currentListId,
        currentCardIds,
        prevCardIds,
      })
    );
  }

  update(update: CardUpdate): void {
    this.store.dispatch(CurrentCardActions.update({ update }));
  }

  archive(): void {
    this.store.dispatch(CurrentCardActions.archive());
  }

  close(): void {
    this.store.dispatch(CurrentCardActions.close());
  }
}
