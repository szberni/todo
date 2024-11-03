import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardsState } from '.';
import { FeatureKey } from 'src/app/shared';

const selectCardsState = createFeatureSelector<CardsState>(FeatureKey.cards);

const selectCurrentCard = createSelector(selectCardsState, ({ currentCard }) => currentCard);

const selectCurrentCardId = createSelector(selectCurrentCard, ({ id }) => id);

const selectCards = createSelector(selectCardsState, ({ cards }) => cards);

export const CardsSelectors = {
  selectCurrentCard,
  selectCurrentCardId,
  selectCards,
} as const;
