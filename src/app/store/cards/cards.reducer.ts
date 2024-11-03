import { createReducer, on } from '@ngrx/store';
import { DEFAULT_CARD, CardResponse } from 'src/app/shared';
import { CardsActions, CurrentCardActions } from 'src/app/store/cards';

export interface CardsState {
  cards: CardResponse[];
  currentCard: CardResponse;
}

const initialState: CardsState = {
  cards: [],
  currentCard: DEFAULT_CARD,
};

export const cardsReducer = createReducer<CardsState>(
  initialState,
  on(CardsActions.loadAll, (state, { cards }): CardsState => {
    return { ...state, cards };
  }),
  on(CardsActions.loadCreated, (state, { card }): CardsState => {
    return { ...state, cards: [...state.cards, card] };
  }),
  on(CardsActions.loadUpdated, CardsActions.loadArchived, (state, { card }): CardsState => {
    const cards = state.cards.map((prevList) => (prevList.id === card.id ? card : prevList));
    return { ...state, cards };
  }),
  on(CurrentCardActions.load, (state, { card }): CardsState => {
    return { ...state, currentCard: card };
  }),
  on(CurrentCardActions.reset, (state): CardsState => {
    return { ...state, currentCard: DEFAULT_CARD };
  })
);
