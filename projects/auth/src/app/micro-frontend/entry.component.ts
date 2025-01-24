import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth.service';

interface RouterEvent {
  url: string;
  replaceUrl: boolean;
}

@Component({
  template: '<mf-root></mf-root>'
})
export class EntryComponent implements OnInit, OnChanges {
  @Input() route?: string;
  @Input() error?: string | null;
  @Output() mfRouteChange = new EventEmitter<RouterEvent>();
  @Output() mfResetError = new EventEmitter<void>();
  @Output() mfLogin = new EventEmitter<{ email: string, password: string }>();
  @Output() mfSignup = new EventEmitter<{ email: string, password: string }>();

  constructor(private router: Router, private authService: AuthService, private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.registerOutgoingRouting();

    this.authService.resetError$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.mfResetError.emit());

    this.authService.login$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((credentials) => this.mfLogin.emit(credentials));

    this.authService.signup$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((credentials) => this.mfSignup.emit(credentials));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['route'] && this.route) {
      this.router.navigateByUrl(this.route, { state: { fromPlatform: true } });
    }

    if (changes['error'] && this.error) {
      this.authService.setError(this.error);
    }
  }

  private registerOutgoingRouting(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
        if (
          e instanceof RoutesRecognized &&
          (!this.isRouteChangeFromPlatform() || this.isRedirect(e))
        ) {
          this.mfRouteChange.next({
            url: e.urlAfterRedirects,
            replaceUrl: this.isRedirect(e),
          });
        }
      });
  }

  private isRouteChangeFromPlatform(): boolean {
    return this.router.getCurrentNavigation()?.extras?.state?.['fromPlatform'];
  }

  private isRedirect(e: RoutesRecognized): boolean {
    return e.url !== e.urlAfterRedirects;
  }
}
