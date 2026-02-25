import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength,IsEmail, isBoolean, IsOptional, IsBoolean, } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty({message:"The name is required"})
  @IsString({message:"The name should be string"})
  @MinLength(2,{message:"The name should be greater than 2"})
  @MaxLength(255,{message:"The name should be less than 255 character"})
  name:string
  
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail({},{message:'Please enter a valid email'})
  @MaxLength(255,{message:"The email should be less than 255 character"})
  email:string

  @IsOptional()
  @ApiProperty({ example: false, description: 'Indicates if the user is an admin' })
  @IsBoolean({message:"The role should be boolean"})
  isAdmin?:boolean = false



}


