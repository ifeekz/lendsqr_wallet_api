import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  public reference: string;

  @IsString()
  public wallet_id: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsNumber()
  public amount: number;

  @IsString()
  public type: string;

  @IsString()
  public status: string;
}