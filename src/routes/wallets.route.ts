import { Router } from 'express';
import WalletController from '@controllers/wallet.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { FundWalletDto, TransferToWalletDto, WithdrawFromWalletDto } from '@/dtos/wallets.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import idempotenceMiddleware from '@/middlewares/idempotence.middleware';

class WalletsRoute implements Routes {
  public path = '/v1/wallets';
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/fund`,
      authMiddleware,
      idempotenceMiddleware,
      validationMiddleware(FundWalletDto, 'body'),
      this.walletController.fundWallet,
    );
    this.router.post(
      `${this.path}/transfer`,
      authMiddleware,
      idempotenceMiddleware,
      validationMiddleware(TransferToWalletDto, 'body'),
      this.walletController.transferToWallet,
    );
    this.router.post(
      `${this.path}/withdraw`,
      authMiddleware,
      idempotenceMiddleware,
      validationMiddleware(WithdrawFromWalletDto, 'body'),
      this.walletController.withdrawFromWallet,
    );
    this.router.get(`${this.path}/balance`, authMiddleware, this.walletController.getWalletBalance);
  }
}

export default WalletsRoute;
