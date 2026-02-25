import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max,  Min,  } from "class-validator";

export class PaginationQueryDto{
  @ApiPropertyOptional({ description: 'The page number', example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt({message:"The page should be integer"})
  @Min(1,{message:"The page should be greater than one"})
  page ?:number = 1
  
  @ApiPropertyOptional({ description: 'The page size or limit', example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt({message:"The limit should be integer"})
  @Min(1,{message:"The limit should be greater than one"})
  @Max(100,{message:"The limit should not be greater than 100"})
  limit ?:number = 100
}