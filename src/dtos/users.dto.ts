import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public name: string;

  @IsString()
  public surname: string;

  @IsString()
  public password: string;

  @IsString()
  public passwordConfirm: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class EmailResendDto {
  @IsEmail()
  public email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  public email: string;
}

export class ResetPasswordChangeDto {
  @IsString()
  public newPassword: string;

  @IsString()
  public newPasswordConfirm: string;
}
