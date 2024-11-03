import { BoardResponse } from '../models';

export const DEFAULT_BOARD: BoardResponse = {
  id: 0,
  title: '',
  listIds: [],
  ownerId: 0,
  isFavorite: false,
};
