import { createReducer, on } from '@ngrx/store';
import { ListResponse } from 'src/app/shared';
import { ListsActions } from '.';

export interface ListsState {
  lists: ListResponse[];
}

const initialState: ListsState = { lists: [] };

export const listsReducer = createReducer<ListsState>(
  initialState,
  on(ListsActions.loadAll, (state, { lists }): ListsState => {
    return { ...state, lists };
  }),
  on(ListsActions.loadCreated, (state, { list }): ListsState => {
    return { ...state, lists: [...state.lists, list] };
  }),
  on(
    ListsActions.loadUpdated,
    ListsActions.loadArchived,
    (state, { list }): ListsState => {
      const lists = state.lists.map((prevList) => (prevList.id === list.id ? list : prevList));

      return { ...state, lists };
    }
  )
);
