import { Component, OnInit } from '@angular/core';
import { AuthFacadeService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.authFacade.autoLogin();
  }
}
