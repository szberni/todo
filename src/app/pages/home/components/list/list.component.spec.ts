import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';
import { ReplaySubject, of } from 'rxjs';
import { ListComponent } from './list.component';
import { ListTestIds } from './list.test-ids';
import { CardResponse, CardsFacadeService, ListResponse, ListsFacadeService, Status } from 'src/app/shared';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const page = {
    getTitle: () => fixture.debugElement.query(By.css(`[data-testid=${ListTestIds.title}-${component.listId}]`)),
    getTitleInput: () => fixture.debugElement.query(By.css(`[data-testid=${ListTestIds.titleInput}-${component.listId}]`)),
    getArchiveButton: () => fixture.debugElement.query(By.css(`button[data-testid=${ListTestIds.archiveButton}-${component.listId}]`)),
    getCards: () => fixture.debugElement.queryAll(By.directive(RouterLink)),
    getAddCardOpenButton: () => fixture.debugElement.query(By.css(`button[data-testid=${ListTestIds.addCardOpenButton}-${component.listId}]`)),
    getAddCardInput: () => fixture.debugElement.query(By.css(`[data-testid=${ListTestIds.addCardInput}-${component.listId}]`)),
    getAddCardSubmitButton: () => fixture.debugElement.query(By.css(`button[data-testid=${ListTestIds.addCardSubmitButton}-${component.listId}]`)),
    getAddCardCloseButton: () => fixture.debugElement.query(By.css(`button[data-testid=${ListTestIds.addCardCloseButton}-${component.listId}]`)),
  } as const;

  const cardsFacadeServiceMock: Partial<jest.Mocked<CardsFacadeService>> = {
    getCardsWithStatus: jest.fn(),
    getCurrentCard: jest.fn(),
    create: jest.fn(),
  };

  const listsFacadeServiceMock: Partial<jest.Mocked<ListsFacadeService>> = {
    getLists: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    cardsFacadeServiceMock.getCardsWithStatus.mockReturnValue(of());
    cardsFacadeServiceMock.getCurrentCard.mockReturnValue(of());
    listsFacadeServiceMock.getLists.mockReturnValue(of());

    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [ReactiveFormsModule, DragDropModule, RouterLink],
      providers: [
        provideRouter([]),
        { provide: CardsFacadeService, useValue: cardsFacadeServiceMock },
        { provide: ListsFacadeService, useValue: listsFacadeServiceMock },
      ]
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('list', { id: 0, title: '', boardId: 0, archived: false, cardIds: [] });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('title edit', () => {
    describe('opens edit mode', () => {
      it('shows title in non-editing mode', () => {
        fixture.detectChanges();
        expect(page.getTitle()).toBeTruthy();
        expect(page.getTitleInput()).toBeNull();
      });

      it('switches to edit mode on click', () => {
        fixture.detectChanges();
        const title = page.getTitle().nativeElement as HTMLElement;

        title.click();
        fixture.detectChanges();

        expect(page.getTitleInput()).toBeTruthy();
        expect(page.getTitle()).toBeNull();
      });
  
      it('switches to edit mode after pressing space', () => {
        fixture.detectChanges();
        const title = page.getTitle().nativeElement as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: ' ' });
        jest.spyOn(event, 'preventDefault');

        title.dispatchEvent(event);
        fixture.detectChanges();

        expect(page.getTitleInput()).toBeTruthy();
        expect(page.getTitle()).toBeNull();
        expect(event.preventDefault).toHaveBeenCalled(); // no space added to the textarea
      });
  
      it('switches to edit mode after pressing enter', () => {
        fixture.detectChanges();
        const title = page.getTitle().nativeElement as HTMLElement;
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        jest.spyOn(event, 'preventDefault');

        title.dispatchEvent(event);
        fixture.detectChanges();
  
        expect(page.getTitleInput()).toBeTruthy();
        expect(page.getTitle()).toBeNull();
        expect(event.preventDefault).toHaveBeenCalled(); // no enter added to the textarea
      });

      it.each([
        { name: 'escape', getEvent: () => new KeyboardEvent('keydown', { key: 'Escape' }) },
        { name: 'another key', getEvent: () => new KeyboardEvent('keydown', { key: 'a' }) },
      ])('does not switch to edit mode after pressing $name', ({ getEvent }) => {
        fixture.detectChanges();
        const title = page.getTitle().nativeElement as HTMLElement;
        const event = getEvent();
        jest.spyOn(event, 'preventDefault');

        title.dispatchEvent(event);
        fixture.detectChanges();
  
        expect(page.getTitleInput()).toBeNull();
        expect(page.getTitle()).toBeTruthy();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('closes edit mode', () => {
      beforeEach(() => {
        component.toggleListTitleEditing(); // switch to edit mode
        fixture.detectChanges();
      });

      it('shows title in editing mode', () => {
        expect(page.getTitleInput()).toBeTruthy();
        expect(page.getTitle()).toBeNull();
      });

      describe.each([
        { name: 'blur', getEvent: () => new Event('blur') },
        { name: 'escape', getEvent: () => new KeyboardEvent('keydown', { key: 'Escape' })},
      ])('on $name', ({ getEvent }) => {
        it('updates list title', () => {
          const titleInput = page.getTitleInput().nativeElement as HTMLElement;
          const event = getEvent();
  
          titleInput.dispatchEvent(event);
          fixture.detectChanges();
  
          expect(listsFacadeServiceMock.update).toHaveBeenCalledWith({ id: 0, title: '' });
          expect(page.getTitleInput()).toBeNull();
          expect(page.getTitle()).toBeTruthy();
        });

        it('updates list title to the value of the textarea', () => {
          const titleInput = page.getTitleInput().nativeElement as HTMLTextAreaElement;
          const event = getEvent();
  
          titleInput.value = 'test';
          titleInput.dispatchEvent(event);
          fixture.detectChanges();
  
          expect(listsFacadeServiceMock.update).toHaveBeenCalledWith({ id: 0, title: 'test' });
          expect(page.getTitleInput()).toBeNull();
          const title = page.getTitle().nativeElement as HTMLElement;
          expect(title).toBeTruthy();
          expect(title.textContent).toContain('test');
        });
      })

      it.each([
        { name: 'space', getEvent: () => new KeyboardEvent('keydown', { key: ' ' })},
        { name: 'enter', getEvent: () => new KeyboardEvent('keydown', { key: 'Enter' })},
      ])('does not close after pressing $name', ({ getEvent }) => {
        const titleInput = page.getTitleInput().nativeElement as HTMLElement;
        const event = getEvent();

        titleInput.dispatchEvent(event);
        fixture.detectChanges();

        expect(listsFacadeServiceMock.update).not.toHaveBeenCalled();
        expect(page.getTitleInput()).toBeTruthy();
        expect(page.getTitle()).toBeNull();
      });
    });
  });

  describe('archive', () => {
    it('archives the list', () => {
      fixture.detectChanges();
      const archiveButton = page.getArchiveButton().nativeElement as HTMLElement;

      archiveButton.click();

      expect(listsFacadeServiceMock.update).toHaveBeenCalledWith({ id: 0, archived: true });
    });
  });

  describe('cards, sorted', () => {
    const createCardMock = (num: number, archived = false): CardResponse => ({
      id: num,
      title: `Title-${ num }`,
      boardId: 1,
      listId: 1,
      archived,
    });

    it('sorts cards based on cardIds order', () => {
      const cardsMock = [
        createCardMock(1),
        createCardMock(2),
      ];

      const listsMock = [{
        id: 1,
        cardIds: [2, 1],
      }] as ListResponse[];

      fixture.componentRef.setInput('list', { id: 1, title: '' } as ListResponse);
      cardsFacadeServiceMock.getCardsWithStatus.mockReturnValue(of({ cards: cardsMock, status: Status.success }));
      listsFacadeServiceMock.getLists.mockReturnValue(of(listsMock));

      fixture.detectChanges();

      expect(cardsFacadeServiceMock.getCardsWithStatus).toHaveBeenCalled();
      expect(listsFacadeServiceMock.getLists).toHaveBeenCalled();
      const cards = page.getCards();
      expect(cards).toHaveLength(2);
      expect(cards.map((de) => de.injector.get(RouterLink).href)).toEqual(['/2','/1']);
    });

    it('shows empty list if there are no cards for the list', () => {
      const cardsMock = [createCardMock(1)];
      const listsMock = [{
        id: 1,
        cardIds: [],
      }] as ListResponse[];

      fixture.componentRef.setInput('list', { id: 1, title: '' } as ListResponse);
      cardsFacadeServiceMock.getCardsWithStatus.mockReturnValue(of({ cards: cardsMock, status: Status.success }));
      listsFacadeServiceMock.getLists.mockReturnValue(of(listsMock));

      fixture.detectChanges();

      expect(cardsFacadeServiceMock.getCardsWithStatus).toHaveBeenCalled();
      expect(listsFacadeServiceMock.getLists).toHaveBeenCalled();
      expect(page.getCards()).toHaveLength(0);
    });

    it('does not show archived cards', () => {
      const cardsMock = [
        createCardMock(1, true),
      ] as CardResponse[];

      fixture.componentRef.setInput('list', { id: 1, title: '' } as ListResponse);
      cardsFacadeServiceMock.getCardsWithStatus.mockReturnValue(of({ cards: cardsMock, status: Status.success }));
      listsFacadeServiceMock.getLists.mockReturnValue(of([{ id: 1, cardIds: [1] }] as ListResponse[]));

      fixture.detectChanges();

      expect(cardsFacadeServiceMock.getCardsWithStatus).toHaveBeenCalled();
      expect(listsFacadeServiceMock.getLists).toHaveBeenCalled();
      expect(page.getCards()).toHaveLength(0);
    });

    it('waits till cards are loaded', () => {
      const cardMock = createCardMock(1) as CardResponse;

      fixture.componentRef.setInput('list', { id: 1, title: '' } as ListResponse);
      const cardsWithStatusMock$ = new ReplaySubject<{ cards: CardResponse[], status: Status}>(1);
      cardsWithStatusMock$.next({ cards: [], status: Status.loading }),

      cardsFacadeServiceMock.getCardsWithStatus.mockReturnValue(cardsWithStatusMock$);
      listsFacadeServiceMock.getLists.mockReturnValue(of([{ id: 1, cardIds: [1] }] as ListResponse[]));

      fixture.detectChanges();

      expect(cardsFacadeServiceMock.getCardsWithStatus).toHaveBeenCalled();
      expect(listsFacadeServiceMock.getLists).toHaveBeenCalled();
      expect(page.getCards()).toHaveLength(0);

      cardsWithStatusMock$.next({ cards: [cardMock], status: Status.success });
      fixture.detectChanges();

      const cards = page.getCards();
      expect(cards).toHaveLength(1);
      expect(cards[0].injector.get(RouterLink).href).toBe('/1');
    });

    // uses separate state to sync card's title when it is changed on an opened card - TODO remove dependency on currentCard
    it.todo('syncs currentCard title change');
    it.todo('distinctUntilChanged');
    it.todo('unsubscribes on component destroy');
  });

  describe('drag and drop - onDrop', () => {
    it.todo('moves card within list');
    it.todo('transfers card to another list');
  });

  describe('add a card', () => {
    it('shows add card button, form is not visible', () => {
      fixture.detectChanges();
      expect(page.getAddCardOpenButton()).toBeTruthy();
      expect(page.getAddCardInput()).toBeNull();
      expect(page.getAddCardCloseButton()).toBeNull();
      expect(page.getAddCardSubmitButton()).toBeNull();
    });

    it('opens the form', () => {
      fixture.detectChanges();
      const openButton = page.getAddCardOpenButton().nativeElement as HTMLElement;

      openButton.click();
      fixture.detectChanges();

      expect(page.getAddCardOpenButton()).toBeNull();
      expect(page.getAddCardInput()).toBeTruthy();
      expect(page.getAddCardCloseButton()).toBeTruthy();
      expect(page.getAddCardSubmitButton()).toBeTruthy();
    });

    it('closes the form', () => {
      component.isAddCardFormShown = true; // switch to form view
      fixture.detectChanges();
      const closeButton = page.getAddCardCloseButton().nativeElement as HTMLElement;

      closeButton.click();
      fixture.detectChanges();

      expect(page.getAddCardOpenButton()).toBeTruthy();
      expect(page.getAddCardInput()).toBeNull();
      expect(page.getAddCardCloseButton()).toBeNull();
      expect(page.getAddCardSubmitButton()).toBeNull();
    });

    it('submits the card and resets the form', () => {
      component.isAddCardFormShown = true; // switch to form view
      fixture.detectChanges();

      const submitButton = page.getAddCardSubmitButton().nativeElement as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);

      const input = page.getAddCardInput().nativeElement as HTMLTextAreaElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(submitButton.disabled).toBe(false);

      submitButton.click();
      fixture.detectChanges();

      expect(page.getAddCardOpenButton()).toBeTruthy();
      expect(page.getAddCardInput()).toBeNull();
      expect(page.getAddCardCloseButton()).toBeNull();
      expect(page.getAddCardSubmitButton()).toBeNull();

      // mutates sortedCards to prevent flickering - TODO: show loader on button and rerender list after success
      expect(component.sortedCards.at(-1)).toEqual({ title: 'test', id: 0 })
      expect(page.getCards().at(-1).nativeElement.textContent).toBe('test');
      expect(cardsFacadeServiceMock.create).toHaveBeenCalledWith('test', 0);
      expect(component.addCardForm.controls.title.value).toBe('');
    });
  });
});
