import { NextFunction, Request, Response } from 'express';
import walletService from '@services/wallets.service';
import { Wallet } from '@/interfaces/wallets.interface';
import { TransferToWalletDto } from '@/dtos/wallets.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';

class WalletController {
  public walletService = new walletService();

  /**
   * Fund wallet method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public fundWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletId: string = req.user.phone_number;
      const { amount } = req.body;
      const walletData: Wallet = await this.walletService.fundWallet(walletId, amount);

      res.status(200).json({
        status: true,
        message: 'Wallet funded successfully',
        data: walletData,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Transfer to wallet method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public transferToWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletId: string = req.user.phone_number;
      const { receiver_wallet_id, amount, description } = req.body;
      const payload: TransferToWalletDto = { receiver_wallet_id, amount, description };
      const walletData: Wallet = await this.walletService.transferToWallet(walletId, payload);

      res.status(200).json({
        status: true,
        message: 'Wallet transfer successful',
        data: walletData,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Withdraw from wallet method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public withdrawFromWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletId: string = req.user.phone_number;
      const { amount } = req.body;
      const walletData: Wallet = await this.walletService.withdrawFromWallet(walletId, amount);

      res.status(200).json({
        status: true,
        message: 'Wallet withdrawal successfully',
        data: walletData,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *Get user wallet balance method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public getWalletBalance = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletId: string = req.user.phone_number;
      const walletData: Wallet = await this.walletService.getWalletBalance(walletId);

      res.status(200).json({
        status: true,
        message: 'Wallet ballance retrieved successfully',
        data: { balance: walletData.balance },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
