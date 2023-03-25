import { STATUS, TYPES } from '@/config/transaction';
import { Transactions } from '@/models/transactions.model';
import { HttpException } from '@exceptions/HttpException';
import { Wallet } from '@interfaces/wallets.interface';
import { Wallets } from '@models/wallets.model';
import { isEmpty } from '@utils/util';

class WalletService {
  public async findById(id: number): Promise<Wallet> {
    const findWallet: Wallet = await Wallets.query().findById(id);
    if (!findWallet) throw new HttpException(409, "Wallet doesn't exist");

    return findWallet;
  }

  /**
   * Find user wallet
   *  @param {string} id user wallet id
   * @returns {Promise<Wallet>}
   */
  public async findByWalletId(id: string): Promise<Wallet> {
    const wallet: Wallet = await Wallets.query().select().from('wallets').where('wallet_id', '=', id).first();
    if (!wallet) throw new HttpException(409, "Wallet doesn't exist");

    return wallet;
  }

  /**
   * Create user wallet
   *  @param {string} walletId user wallet id
   * @returns {Promise<Wallet>}
   */
  public async createWallet(walletId: string): Promise<Wallet> {
    if (isEmpty(walletId)) throw new HttpException(400, 'Wallet id is empty');
    const date = new Date();

    const createWalletData: Wallet = await Wallets.query()
      .insert({
        wallet_id: walletId,
        created_at: date,
        updated_at: date,
      })
      .into('wallets');

    return createWalletData;
  }

  /**
   * Fund user wallet
   *  @param {string} walletId user wallet id
   *  @param {number}  amount amount to fund
   * @returns {Promise<Wallet>}
   */
  public async fundWallet(walletId: string, amount: number): Promise<Wallet> {
    if (isEmpty(amount)) throw new HttpException(400, 'amount is empty');

    const wallet: Wallet = await this.findByWalletId(walletId);

    if (!walletId) {
      throw new HttpException(409, 'Wallet does not exist');
    }

    const balance: number = wallet.balance + amount;

    await Wallets.query().update({ balance, updated_at: new Date() }).where('id', '=', wallet.id).into('wallets');
    await Transactions.query().insert({ wallet_id: wallet.wallet_id, amount, type: TYPES.CREDIT, status: STATUS.COMPLETED }).into('transactions');

    const updateWalletData: Wallet = await Wallets.query().select().from('wallets').where('id', '=', wallet.id).first();
    return updateWalletData;
  }
}

export default WalletService;
