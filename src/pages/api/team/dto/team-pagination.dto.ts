import { ObjectId } from "mongodb";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class TeamPaginationDTO {
  userId: ObjectId;
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value = +value))
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value = +value))
  @Min(1)
  @Max(200)
  perPage?: number = 10;
}
