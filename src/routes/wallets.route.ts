import { Router } from 'express';
import WalletController from '@controllers/wallet.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { FundWalletDto, TransferToWalletDto } from '@/dtos/wallets.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class WalletsRoute implements Routes {
  public path = '/v1/wallets';
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.post(`${this.path}/fund`, authMiddleware, validationMiddleware(FundWalletDto, 'body'), this.walletController.fundWallet);
      this.router.post(`${this.path}/transfer`, authMiddleware, validationMiddleware(TransferToWalletDto, 'body'), this.walletController.transferToWallet);
  }
}

export default WalletsRoute;
