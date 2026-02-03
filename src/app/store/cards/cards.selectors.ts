import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardsState } from '.';
import { FeatureKey } from 'src/app/shared';

const selectCardsState = createFeatureSelector<CardsState>(FeatureKey.cards);

const selectCurrentCard = createSelector(selectCardsState, ({ openedCard }) => openedCard);

const selectCurrentCardId = createSelector(selectCurrentCard, ({ id }) => id);

const selectCards = createSelector(selectCardsState, ({ cards }) => cards);

const selectCardsWithStatus = createSelector(
  selectCardsState,
  ({ cards, status }) => ({ cards, status })
);

export const CardsSelectors = {
  selectCurrentCard,
  selectCurrentCardId,
  selectCards,
  selectCardsWithStatus,
} as const;
