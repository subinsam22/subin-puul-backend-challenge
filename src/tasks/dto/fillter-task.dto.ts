import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { IsArray, IsDate, IsEmail,  IsEnum,  IsOptional,  IsUUID,  MaxLength,  MinLength, ValidateIf,  } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/pagination-query.dto";
import { TaskStatus } from "src/tasks/task.entity";



export class FilterTaskQueryDto extends PaginationQueryDto{
  @IsOptional() 
  @ApiPropertyOptional({ description: 'The title of the task eg Sample Task'})
  @MinLength(1,{message:"The title should be greater than one character"})
  @MaxLength(255,{message:"The title should be less than 255 character"})
  title ?:string 
  
  

  @IsOptional()
  @ApiPropertyOptional({ description: 'The email of the user eg john@example.com' })
  @IsEmail({},{message:'Please enter a valid email'})
  @MaxLength(255,{message:"The email should be less than 255 character"})
  user_email ?:string 

  @IsOptional()
  @ApiPropertyOptional({ example: ['uuid1', 'uuid2'], description: 'Array of user IDs assigned to the task' })
  // @IsArray()
  @IsUUID('all', { each: true }) 
  @IsOptional()
  assignedUserIds?: string[];
  
  @IsOptional()
  @ApiPropertyOptional({type: String,format: 'date',description: 'Provide date in YYYY-MM-DD format' })
  @Type(() => Date) 
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @ApiPropertyOptional({ enum: TaskStatus,  description: 'The status of the task' })
  @ValidateIf((o) => o.email !== '')
  @IsEnum(TaskStatus, {
    message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;
}