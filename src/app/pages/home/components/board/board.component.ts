import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BoardsFacadeService } from 'src/app/shared';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private boardsFacade: BoardsFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params) => {
        const boardId = params['boardId'];
        this.boardsFacade.fetch(boardId);
      });
  }
}
