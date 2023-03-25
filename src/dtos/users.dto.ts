import { Unique } from '@/utils/validators/unique.validator';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  public name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Validate(Unique, ['users', 'email'], {
    message: 'Email already exist',
  })
  public email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  public password: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Validate(Unique, ['users', 'phone_number'], {
    message: 'Phone number already exist',
  })
  public phone_number: string;
}
