import { Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralBoardInfo } from 'src/app/store';
import { BoardsFacadeService, RouteName, trackById } from 'src/app/shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  generalBoardsInfo$: Observable<GeneralBoardInfo[]> | undefined;
  readonly HOME_ROUTE = RouteName.home;
  readonly trackById: TrackByFunction<GeneralBoardInfo> = trackById;

  constructor(private boardsFacade: BoardsFacadeService) {}

  ngOnInit(): void {
    if (localStorage.getItem('isSidebarOpen') === 'true') {
      this.isOpen = true;
    }

    this.generalBoardsInfo$ = this.boardsFacade.getGeneralBoardsInfo();
  }

  toggleFavorite(board: GeneralBoardInfo): void {
    const { id, isFavorite } = board;
    this.boardsFacade.toggleFavorite(id, isFavorite);
  }

  toggleOpenStatus() {
    this.isOpen = !this.isOpen;
    localStorage.setItem('isSidebarOpen', this.isOpen.toString());
  }
}
