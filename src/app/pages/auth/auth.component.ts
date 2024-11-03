import { Component, DestroyRef, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { confirmPassword } from './validators';
import { FormField, ValidationError } from './enums';
import { AuthFacadeService, RouteName } from 'src/app/shared';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLogin = false;
  authForm!: FormGroup;
  error$: Observable<string | null> | undefined;
  readonly PASSWORD_MIN_LENGTH = 8;
  readonly SIGNUP_ROUTE = `../${RouteName.signup}`;
  readonly LOGIN_ROUTE = `../${RouteName.login}`;

  constructor(
    private route: ActivatedRoute,
    private authFacade: AuthFacadeService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params) => {
        this.isLogin = params['name'] === RouteName.login;
        this.createForm();
        this.authFacade.resetError();
      });

    this.error$ = this.authFacade.getError();
  }

  createForm(): void {
    const INCLUDE_LOWERCASE_UPPERCASE_DIGIT_SPECIALCHAR = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).*$';
    this.authForm = new FormGroup(
      {
        [FormField.email]: new FormControl('', [Validators.required, Validators.email]),
        [FormField.password]: new FormControl(
          '',
          this.isLogin
            ? [Validators.required]
            : [
                Validators.required,
                Validators.minLength(this.PASSWORD_MIN_LENGTH),
                Validators.pattern(INCLUDE_LOWERCASE_UPPERCASE_DIGIT_SPECIALCHAR),
              ]
        ),
        ...(!this.isLogin && {
          [FormField.passwordConf]: new FormControl('', [Validators.required]),
        }),
      },
      this.isLogin ? null : { validators: confirmPassword },
    );
  }

  get emailControl(): AbstractControl {
    return this.authForm.get(FormField.email) as AbstractControl;
  }

  get passwordControl(): AbstractControl {
    return this.authForm.get(FormField.password) as AbstractControl;
  }

  get passwordConfControl(): AbstractControl | null {
    return this.authForm.get(FormField.passwordConf);
  }

  get isEmailErrorShown(): boolean {
    return !this.emailControl.valid && this.emailControl.touched;
  }

  get isPasswordErrorShown(): boolean {
    return !this.passwordControl.valid && this.passwordControl.touched;
  }

  get passwordContainsLowercase(): boolean {
    return /[a-z]/.test(this.passwordControl.value);
  }

  get passwordContainsUppercase(): boolean {
    return /[A-Z]/.test(this.passwordControl.value);
  }

  get passwordContainsDigit(): boolean {
    return /\d/.test(this.passwordControl.value);
  }

  get passwordContainsSpecialChar(): boolean {
    return /[\W_]/.test(this.passwordControl.value);
  }

  get passwordReachedMinLength(): boolean {
    return !(
      this.passwordControl.hasError('minlength') || this.passwordControl.hasError('required')
    );
  }

  get isConfirmationErrorShown(): boolean {
    return !!(
      this.passwordConfControl?.touched && this.authForm.hasError(ValidationError.passwordNoMatch)
    );
  }

  get isConfirmPasswordRequiredErrorShown(): boolean {
    return !!(this.passwordConfControl?.touched && this.passwordConfControl.hasError('required'));
  }

  onSubmit(): void {
    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    this.isLogin ? this.authFacade.login(email, password) : this.authFacade.signup(email, password);
  }
}
