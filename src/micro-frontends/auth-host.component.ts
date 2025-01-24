import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthCredentials, AuthFacadeService } from 'src/app/shared';

@Component({
  selector: 'app-auth-host',
  template: `
  <mf-auth-entry
    [route]="route$ | async"
    [error]="error$ | async"
    (mfResetError)="resetError()"
    (mfLogin)="login($event)"
    (mfSignup)="signup($event)"
  ></mf-auth-entry>`
})
export class AuthHostComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authFacade: AuthFacadeService
  ) {}

  readonly route$: Observable<string> = this.route.url.pipe(map(() => this.router.url));
  readonly error$: Observable<string | null> = this.authFacade.getError();

  resetError(): void {
    this.authFacade.resetError();
  }

  login(e: Event): void {
    this.authFacade.login((e as CustomEvent<AuthCredentials>).detail);
  }

  signup(e: Event): void {
    this.authFacade.signup((e as CustomEvent<AuthCredentials>).detail);
  }
}