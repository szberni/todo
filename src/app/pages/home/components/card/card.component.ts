import { Component, DestroyRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatestWith } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListsFacadeService, CardsFacadeService, DEFAULT_CARD, ModalClass } from 'src/app/shared';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  card = DEFAULT_CARD;
  listTitle = '';
  isTitleEditing = false;
  isDescriptionEditing = false;

  @ViewChild('modal', { static: true })
  modal: TemplateRef<unknown>;
  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private bsModalService: BsModalService,
    private listsFacade: ListsFacadeService,
    private cardsFacade: CardsFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      const cardId = params['cardId'];
      this.cardsFacade.fetch(cardId);
      this.modalRef = this.bsModalService.show(this.modal, { class: ModalClass.large });
    });

    this.bsModalService.onHidden.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cardsFacade.close());

    this.listenCurrentCard();
  }

  toggleTitleEditing(): void {
    this.isTitleEditing = !this.isTitleEditing;
  }

  toggleDescriptionEditing(): void {
    this.isDescriptionEditing = !this.isDescriptionEditing;
  }

  updateTitle(titleTextarea: HTMLTextAreaElement): void {
    const title = titleTextarea.value;

    this.card.title = title;
    this.cardsFacade.update({ id: this.card.id, title });

    this.toggleTitleEditing();
  }

  updateDescription(descriptionTextarea: HTMLTextAreaElement, e?: FocusEvent): void {
    const relatedTarget = e?.relatedTarget as HTMLElement;

    if (!relatedTarget.classList.contains('btn-cancel')) {
      const description = descriptionTextarea.value;

      this.card.description = description;
      this.cardsFacade.update({ id: this.card.id, description });
    }

    this.toggleDescriptionEditing();
  }

  close(): void {
    this.modalRef.hide();
  }

  archive(): void {
    this.cardsFacade.archive();
    this.close();
  }

  private listenCurrentCard(): void {
    this.cardsFacade.getCurrentCard().pipe(
      combineLatestWith(this.listsFacade.getLists()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([card, lists]) => {
      this.card = { ...card };
      const list = lists.find((list) => list.id === card.listId);
      this.listTitle = list?.title ?? '';
    })
  }
}
