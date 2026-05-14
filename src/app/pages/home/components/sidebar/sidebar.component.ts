import { Component, Inject, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralBoardInfo } from 'src/app/store';
import { BoardsFacadeService, RouteName, trackById, LOCAL_STORAGE } from 'src/app/shared';
import { SidebarTestIds } from './sidebar.test-ids';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  static readonly LOCAL_STORAGE_KEY = 'isSidebarOpen';
  isOpen = false;
  generalBoardsInfo$: Observable<GeneralBoardInfo[]> | undefined;
  readonly HOME_ROUTE = RouteName.home;
  readonly trackById: TrackByFunction<GeneralBoardInfo> = trackById;
  readonly testIds = SidebarTestIds;

  constructor(@Inject(LOCAL_STORAGE) private storage: Storage, private boardsFacade: BoardsFacadeService) {}

  ngOnInit(): void {
    if (this.storage.getItem(SidebarComponent.LOCAL_STORAGE_KEY) === 'true') {
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
    this.storage.setItem(SidebarComponent.LOCAL_STORAGE_KEY, this.isOpen.toString());
  }
}
