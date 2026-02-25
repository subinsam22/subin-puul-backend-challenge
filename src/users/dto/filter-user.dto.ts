import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsEmail,  IsEnum,  IsOptional,  IsString,  MaxLength,  MinLength, ValidateIf,  } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/pagination-query.dto";
import { TaskStatus } from "src/tasks/task.entity";
import { UserRole } from "../user.entity";


export class FilterQueryDto extends PaginationQueryDto{
  @IsOptional() 
  @ApiPropertyOptional({ description: 'The name of the user eg John'})
  @ValidateIf((o) => o.name !== '')
  @MinLength(1,{message:"The name should be greater than one character"})
  @MaxLength(255,{message:"The name should be less than 255 character"})
  name ?:string = ""
  
  @IsOptional()
  @ApiPropertyOptional({ description: 'The email of the user eg john@example.com' })
  @ValidateIf((o) => o.email !== '')
  @IsEmail({},{message:'Please enter a valid email'})
  @MaxLength(255,{message:"The email should be less than 255 character"})
  email ?:string = ""

  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER, description: 'The role of the user' })
  @ValidateIf((o) => o.email !== '')
  @IsEnum(UserRole, {
    message: `Status must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;
}

export class UsersFilterDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsEnum(UserRole) role?: UserRole;
}