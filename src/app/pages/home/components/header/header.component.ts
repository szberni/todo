import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { AuthFacadeService } from 'src/app/shared';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userEmail$: Observable<string | undefined> | undefined;

  constructor(private authFacade: AuthFacadeService, private bsModalService: BsModalService) {}

  ngOnInit(): void {
    this.userEmail$ = this.authFacade.getUserEmail();
  }

  openCreateBoardModal(): void {
    this.bsModalService.show(CreateBoardModalComponent);
  }

  logout(): void {
    this.authFacade.logout();
  }
}
