import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, TrackByFunction } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatestWith, distinctUntilChanged, map, skipWhile } from 'rxjs';
import { ListsFacadeService, CardsFacadeService, CardResponse, ListResponse, sortById, getIds, trackById } from 'src/app/shared';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnChanges {
  @Input()
  list: ListResponse = { id: 0, title: '', boardId: 0, archived: false, cardIds: [] };
  listTitle: string;
  sortedCards: CardResponse[] = [];
  addCardForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  isAddCardFormShown = false;
  isListTitleBeingEdited = false;
  readonly trackById: TrackByFunction<CardResponse> = trackById;

  constructor(
    private listsFacade: ListsFacadeService,
    private cardsFacade: CardsFacadeService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.cardsFacade.getCards().pipe(
      map((cards) => cards.filter(({ listId }) => listId === this.list.id)),
      skipWhile((cards) => cards.length === 0),
      combineLatestWith(this.listsFacade.getLists().pipe(
        map((lists) => lists.find(({id}) => id === this.list.id)?.cardIds),
        skipWhile((cardIds) => !cardIds?.length || cardIds.length === 0),
      )),
      distinctUntilChanged(([, prevCardIds], [, currCardIds]) => {
        return JSON.stringify(prevCardIds) === JSON.stringify(currCardIds);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([cards, cardIds]) => {
      this.sortedCards = this.sortCards(cards, cardIds);
    });

    this.cardsFacade.getCurrentCard().pipe(
      distinctUntilChanged((prev, curr) => prev.title === curr.title),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ id, title }) => {
      const index = this.sortedCards.findIndex((card) => id === card.id);
      if (index !== -1) {
        const modifiedCards = [...this.sortedCards];
        modifiedCards[index] = { ...this.sortedCards[index], title };
        this.sortedCards = modifiedCards;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const list = changes?.['list'].currentValue;

    if (list) {
      this.listTitle = list.title;
    }
  }

  addCard(): void {
    const title = this.addCardForm.controls.title.value;

    this.sortedCards = [...this.sortedCards, { title, id: 0 } as CardResponse ];
    this.cardsFacade.create(title, this.list.id);

    this.resetForm();
  }

  resetForm(): void {
    this.isAddCardFormShown = false;
    this.addCardForm.reset();
  }

  toggleListTitleEditing(): void {
    this.isListTitleBeingEdited = !this.isListTitleBeingEdited;
  }

  updateListTitle(listTitleTextarea: HTMLTextAreaElement): void {
    const title = listTitleTextarea.value;

    this.listTitle = title;
    this.listsFacade.update({ id: this.list.id, title });

    this.toggleListTitleEditing();
  }

  archiveList(): void {
    this.listsFacade.update({ id: this.list.id, archived: true });
  }

  onDrop(event: CdkDragDrop<CardResponse[]>): void {
    const prevCards = event.previousContainer.data;
    const currentCards = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(currentCards, event.previousIndex, event.currentIndex);
      this.listsFacade.update({ id: this.list.id, cardIds: getIds(currentCards) });
    } else {
      transferArrayItem(prevCards, currentCards, event.previousIndex, event.currentIndex);

      this.cardsFacade.moveCardBetweenLists(
        event.item.data,
        this.list.id,
        getIds(currentCards),
        getIds(prevCards)
      );
    }
  }

  private sortCards<T extends CardResponse>(cards: T[], cardIds: number[]): T[] {
    const activeCards = cards.filter(({ archived }) => !archived);
    return sortById(activeCards, cardIds);
  }
}
