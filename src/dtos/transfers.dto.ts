import { IsNumber, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  public wallet_id: string;

  @IsNumber()
  public amount: number;

  @IsNumber()
  public transaction_id: number;
}
