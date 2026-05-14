import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardHeaderComponent } from './board-header.component';

describe('BoardHeaderComponent', () => {
  let component: BoardHeaderComponent;
  let fixture: ComponentFixture<BoardHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardHeaderComponent],
      providers: []
    });

    fixture = TestBed.createComponent(BoardHeaderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it.todo('shows board title');
  it.todo('toggles favorite state of the board');
});
