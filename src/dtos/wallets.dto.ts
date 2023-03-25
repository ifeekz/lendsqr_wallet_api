import { IsValidWallet } from '@/utils/decorators/wallet.decorator';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  public amount: number;
}
