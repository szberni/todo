import { createReducer, on } from '@ngrx/store';
import { ListResponse, Status } from 'src/app/shared';
import { ListsActions } from '.';

export interface ListsState {
  lists: ListResponse[];
  status: Status;
}

const initialState: ListsState = {
  lists: [],
  status: Status.loading
};

export const listsReducer = createReducer<ListsState>(
  initialState,
  on(ListsActions.fetchAll, (state): ListsState => {
    return { ...state, status: Status.loading };
  }),
  on(ListsActions.loadAll, (state, { lists }): ListsState => {
    return { ...state, lists, status: Status.success };
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
