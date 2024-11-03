import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardsFacadeService } from 'src/app/shared';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
})
export class BoardHeaderComponent implements OnInit {
  boardTitle$: Observable<string> | undefined;
  isBoardFavorite$: Observable<boolean> | undefined;

  constructor(private boardsFacade: BoardsFacadeService) {}

  ngOnInit(): void {
    this.boardTitle$ = this.boardsFacade.getBoardTitle();
    this.isBoardFavorite$ = this.boardsFacade.getIsBoardFavorite();
  }

  toggleFavorite(): void {
    this.boardsFacade.toggleFavorite();
  }
}
