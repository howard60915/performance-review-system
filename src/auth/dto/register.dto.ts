import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.USER; // 預設為一般員工
}
