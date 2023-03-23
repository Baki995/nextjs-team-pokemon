import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDTO {
  @Length(2, 144)
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8)
  password: string;
}

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8)
  password: string;
}
