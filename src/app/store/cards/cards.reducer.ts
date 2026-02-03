import { createReducer, on } from '@ngrx/store';
import { DEFAULT_CARD, CardResponse, Status } from 'src/app/shared';
import { CardsActions, CurrentCardActions } from 'src/app/store/cards';

export interface CardsState {
  cards: CardResponse[];
  status: Status;
  openedCard: CardResponse;
}

const initialState: CardsState = {
  cards: [],
  status: Status.loading,
  openedCard: DEFAULT_CARD,
};

export const cardsReducer = createReducer<CardsState>(
  initialState,
  on(CardsActions.fetchAll, (state): CardsState => {
    return { ...state, status: Status.loading };
  }),
  on(CardsActions.loadAll, (state, { cards }): CardsState => {
    return { ...state, cards, status: Status.success };
  }),
  on(CardsActions.loadCreated, (state, { card }): CardsState => {
    return { ...state, cards: [...state.cards, card] };
  }),
  on(CardsActions.loadUpdated, CardsActions.loadArchived, (state, { card }): CardsState => {
    const cards = state.cards.map((prevList) => (prevList.id === card.id ? card : prevList));
    return { ...state, cards };
  }),
  on(CurrentCardActions.load, (state, { card }): CardsState => {
    return { ...state, openedCard: card };
  }),
  on(CurrentCardActions.reset, (state): CardsState => {
    return { ...state, openedCard: DEFAULT_CARD  };
  })
);
