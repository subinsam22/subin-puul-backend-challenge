import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,MaxLength, IsOptional, IsString, MinLength, IsNumber, Min, Max, IsDateString, IsArray, IsUUID, IsEnum, MinDate } from "class-validator";
import { TaskStatus } from "../task.entity";
import { Type } from "class-transformer";


export class CreateTaskDto {
  @ApiProperty({ example: 'Implement Task', description: 'The title of the task' })
  @IsNotEmpty({message:"The title is required"})
  @IsString({message:"The title should be string"})
  @MinLength(1,{message:"The title should be greater than 1 character"})
  @MaxLength(255,{message:"The title should be less than 255 character"})
  title: string

  @ApiProperty({ example: 'This is a sample task description', description: 'The description of the task' })
  @IsOptional()
  @IsString({message:"The description should be string"})
  @MinLength(10,{message:"The description should be greater than 10"})
  description?: string

  @ApiProperty({ example: 10, description: 'The estimated hours for the task' })
  
  @IsNumber()
  @Min(0, { message: 'Hours cannot be negative' })
  @Max(2000, { message: 'Estimated hours seems too high' }) 
  estimatedHours : number;

  @ApiProperty({ example: 100, description: 'The cost associated with the task' })
  
  @IsNumber()
  @Min(0, { message: 'Cost cannot be negative' })
  @Max(99999999, { message: 'Cost cannot be more than 99,999,999' })
  cost: number;

  @ApiProperty({ example: '2026-02-23T14:30:00-06:00', description: 'The due date of the task in ISO 8601 format' })
  @IsDateString() // Validates ISO 8601 strings (e.g., "2026-02-23T14:30:00+06:00")
  dueDate: string;

  @ApiProperty({ example: ['uuid1', 'uuid2'], description: 'Array of user IDs assigned to the task' })
  @IsArray()
  @IsUUID('all', { each: true }) // Validates that each entry in the array is a valid UUID
  @IsOptional()
  assignedUserIds?: string[];
}

export class UpdateTaskDto {
  @ApiProperty({ example: 'Implement Task', description: 'The title of the task' })
  @IsOptional()
  @IsString({message:"The title should be string"})
  @MinLength(1,{message:"The title should be greater than 2 character"})
  @MaxLength(255,{message:"The title should be less than 255 character"})
  title?: string

  @ApiProperty({ example: 'This is a sample task description', description: 'The description of the task' })
  @IsOptional()
  @IsString({message:"The description should be string"})
  @MinLength(10,{message:"The description should be greater than 10"})
  description?: string

  @ApiProperty({ example: 10, description: 'The estimated hours for the task' })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Hours cannot be negative' })
  @Max(2000, { message: 'Estimated hours seems too high' }) 
  estimatedHours ?: number;

  @ApiProperty({ example: 100, description: 'The cost associated with the task' })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Cost cannot be negative' })
  @Max(99999999, { message: 'Cost cannot be more than 99,999,999' })
  cost?: number;

  @ApiProperty({ example: '2026-02-23T14:30:00-06:00', description: 'The due date of the task in ISO 8601 format' })
  @IsDateString() 
  @IsOptional()
  @Type(() => Date) 
  @MinDate(new Date(), { message: 'The due date cannot be in the past' })
  dueDate?: string;

  @ApiProperty({ example: ['uuid1', 'uuid2'], description: 'Array of user IDs assigned to the task' })
  @IsArray()
  @IsUUID('all', { each: true }) 
  @IsOptional()
  assignedUserIds?: string[];

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.ASSIGNED, description: 'The status of the task' })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;
}