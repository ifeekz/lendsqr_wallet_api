import { NextFunction, Request, Response } from 'express';
import walletService from '@services/wallets.service';
import { Wallet } from '@/interfaces/wallets.interface';

class WalletController {
  public walletService = new walletService();

  /**
   * Fund wallet method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public fundWallet = async (req: any, res: Response, next: NextFunction): Promise<void> => {
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
}

export default WalletController;
