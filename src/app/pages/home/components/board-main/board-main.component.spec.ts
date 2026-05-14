import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardMainComponent } from './board-main.component';

describe('BoardMainComponent', () => {
  let component: BoardMainComponent;
  let fixture: ComponentFixture<BoardMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardMainComponent],
      providers: []
    });

    fixture = TestBed.createComponent(BoardMainComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('lists, sorted', () => {
    it.todo('sorts lists based on listIds order');
    it.todo('shows empty board if there are no lists for the board');
    it.todo('does not show archived lists');
    it.todo('waits till lists are loaded');
    it.todo('distinctUntilChanged');
    it.todo('unsubscribes on component destroy');
  });

  describe('drag and drop - onDrop', () => {
    it.todo('moves list within board');
  });

  describe('add a list', () => {
    it.todo('shows add list button, form is not visible');
    it.todo('opens the form');
    it.todo('closes the form');
    it.todo('submits the list and resets the form');
  });
});
