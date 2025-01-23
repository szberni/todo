import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-auth-host',
  template: '<mf-auth-entry [route]="route$ | async"></mf-auth-entry>'
})
export class AuthHostComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  route$: Observable<string> = this.route.url.pipe(map(() => this.router.url));
}