import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormField, ValidationError } from '../enums';

export const confirmPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value[FormField.passwordConf]) {
    return null;
  }

  return control.value[FormField.password] === control.value[FormField.passwordConf]
    ? null
    : { [ValidationError.passwordNoMatch]: true };
};
