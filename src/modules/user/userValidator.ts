import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPasswordMatchesRequirementsConstraint
  implements ValidatorConstraintInterface
{
  public validate(password: string, args: ValidationArguments) {
    const regex = new RegExp(
      '^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$'
    );
    return regex.test(password);
  }
}
