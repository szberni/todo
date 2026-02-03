import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ListsSelectors } from '../../store/lists/lists.selectors';
import { ListsActions } from '../../store/lists/lists.actions';
import { ListResponse, ListUpdate, Status } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class ListsFacadeService {
  constructor(private store: Store) {}

  getLists(): Observable<ListResponse[]> {
    return this.store.select(ListsSelectors.selectLists);
  }

  getListsWithStatus(): Observable<{ lists: ListResponse[], status: Status }> {
    return this.store.select(ListsSelectors.selectListsWithStatus)
  }

  create(title: string): void {
    this.store.dispatch(ListsActions.create({ title }));
  }

  update(update: ListUpdate): void {
    this.store.dispatch(ListsActions.update({ update }));
  }
}
