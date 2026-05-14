import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent],
      providers: []
    });

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it.todo('shows modal for the card based on route params');
  it.todo('shows list title for the current card');
  it.todo('archives card');
  it.todo('closes the modal');
  describe('title edit', () => {
    it.todo('opens edit mode');
    it.todo('closes edit mode');
  });
  describe('description edit', () => {
    it.todo('opens edit mode');
    it.todo('closes edit mode');
  });
});
