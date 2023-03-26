import { IsValidWallet } from '@/utils/decorators/wallet.decorator';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  public amount: number;
}

export class TransferToWalletDto {
  @IsString()
  @IsNotEmpty({ message: 'Receiver wallet id is required' })
  @IsValidWallet({ message: 'Receiver wallet does not exist' })
  public receiver_wallet_id: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  public amount: number;

  @IsString()
  @IsOptional()
  public description: string;
}

export class WithdrawFromWalletDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  public amount: number;
}
