import { Component, DestroyRef, OnInit, TrackByFunction } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { combineLatestWith, distinctUntilChanged, skipWhile } from 'rxjs';
import { BoardsFacadeService, ListsFacadeService, ListResponse, sortById, getIds, trackById } from 'src/app/shared';

@Component({
  selector: 'app-board-main',
  templateUrl: './board-main.component.html',
  styleUrls: ['./board-main.component.scss'],
})
export class BoardMainComponent implements OnInit {
  sortedLists: ListResponse[] = [];
  addListForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  isAddListFormShown = false;
  readonly trackById: TrackByFunction<ListResponse> = trackById;

  constructor(
    private boardsFacade: BoardsFacadeService,
    private listsFacade: ListsFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.listsFacade.getLists().pipe(
      combineLatestWith(this.boardsFacade.getListIds()),
      skipWhile(([lists, listIds]) => lists.length === 0 || listIds.length === 0),
      distinctUntilChanged(([, prevListIds], [, currListIds]) => {
        return JSON.stringify(prevListIds) === JSON.stringify(currListIds);
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(([lists, listIds]) => {
      const activeLists = lists.filter(({ archived }) => !archived);
      this.sortedLists = sortById(activeLists, listIds);
    });
  }

  addList(): void {
    const title = this.addListForm.controls.title.value;

    this.sortedLists = [...this.sortedLists, { title, id: 0 } as ListResponse];
    this.listsFacade.create(title);

    this.resetForm();
  }

  resetForm(): void {
    this.isAddListFormShown = false;
    this.addListForm.reset();
  }

  onDrop(event: CdkDragDrop<ListResponse[]>): void {
    moveItemInArray(this.sortedLists, event.previousIndex, event.currentIndex);
    const listIds = getIds(this.sortedLists);
    this.boardsFacade.updateListIds(listIds);
  }
}
