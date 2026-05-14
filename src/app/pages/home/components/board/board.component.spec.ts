import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      providers: []
    });

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it.todo('fetches board based on route params');
});
