import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const startDateLessThanEndDate: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const startDate = formGroup.get('targetStartingDate');
  const endDate = formGroup.get('expirationDate');

  if (startDate && endDate) {
    // @ts-ignore
    const start = new Date(startDate.value);
    // @ts-ignore
    const end = new Date(endDate.value);

    if (!startDate || !endDate)
      return null;
    if (start <= end) {
      return null;
    } else {
      endDate.setErrors({ 'dateComparison': true });
      return { 'dateComparison': { message: 'Expiration date must be after target start date' } };
    }
  }
  return null;
};
