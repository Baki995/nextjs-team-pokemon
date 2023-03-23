import { IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class TeamDTO {
  @IsString()
  @Length(2, 50)
  @Transform(({ value }) => value.trim())
  name: string;

  userId: object;
}
