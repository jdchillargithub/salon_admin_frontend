import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noLeadingSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.trimStart().length === 0) {
        return { 'noLeadingSpace': true };
      }
      return null;
    };
  }