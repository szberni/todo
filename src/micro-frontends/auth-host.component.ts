import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthCredentials, AuthFacadeService } from 'src/app/shared';

interface RouterEvent {
  url: string;
  replaceUrl: boolean;
}

@Component({
  selector: 'app-auth-host',
  template: `
  <mf-auth-entry
    [route]="route$ | async"
    [error]="error$ | async"
    (mfRouteChange)="handleRouteChange($event)"
    (mfResetError)="resetError()"
    (mfLogin)="login($event)"
    (mfSignup)="signup($event)"
  ></mf-auth-entry>`
})
export class AuthHostComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authFacade: AuthFacadeService
  ) {}

  readonly route$: Observable<string> = this.route.url.pipe(map(() => this.router.url));
  readonly error$: Observable<string | null> = this.authFacade.getError();

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      console.log("route url", url);
      console.log("router url", this.router.url);
    });
  }

  handleRouteChange(e: Event): void {
    this.navigateToUrl((e as CustomEvent<RouterEvent>).detail);
  }

  navigateToUrl(e: RouterEvent | undefined): void {
    if (e?.url && e.url.startsWith('/')) {
      this.router.navigateByUrl(e.url, {
        replaceUrl: e.replaceUrl || false,
      });
    } else {
      console.warn('The microFrontendRouting directive received an invalid router event.', e);
    }
  }

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
