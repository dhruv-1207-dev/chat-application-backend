import * as l10n from 'jm-ez-l10n';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Validate,
} from 'class-validator';
import { Model } from '../../model';
import { IsPasswordMatchesRequirementsConstraint } from './userValidator';

export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export class SignInModel extends Model {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;

  constructor(body: any) {
    super();
    const { email, password } = body;

    this.email = email;
    this.password = password;
  }
}

export class SignUpModel extends Model {
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;

  constructor(body: any) {
    super();
    const { name, email, password } = body;

    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class UpdateUserModel extends Model {
  @IsNotEmpty()
  @IsOptional()
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  public email: string;

  @IsNotEmpty()
  @IsOptional()
  public password: string;

  constructor(body: any) {
    super();
    const { name, email, password } = body;

    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class RefresrhTokenModel extends Model {
  @IsNotEmpty()
  public token: string;

  constructor(body: any) {
    super();
    const { token } = body;

    this.token = token;
  }
}
