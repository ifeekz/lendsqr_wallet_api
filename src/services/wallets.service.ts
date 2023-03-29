import { STATUS, TYPES } from '@/config/transaction';
import { Transactions } from '@/models/transactions.model';
import { Transfers } from '@/models/transfer.model';
import { TransferToWalletDto } from '@dtos/wallets.dto';
import { HttpException } from '@exceptions/HttpException';
import { Wallet } from '@interfaces/wallets.interface';
import { Wallets } from '@/models/wallet.model';
import { generateReference, isEmpty } from '@utils/util';

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
      throw new HttpException(400, 'Wallet does not exist');
    }

    const balance: number = wallet.balance + amount;

    const trx = await Wallets.startTransaction();
    try {
      await Wallets.query(trx).update({ balance, updated_at: new Date() }).where('id', '=', wallet.id).into('wallets');
      await Transactions.query(trx)
        .insert({ reference: generateReference(), wallet_id: wallet.wallet_id, amount, type: TYPES.CREDIT, status: STATUS.COMPLETED })
        .into('transactions');

      await trx.commit();

      const updatedWalletData: Wallet = await Wallets.query().select().from('wallets').where('id', '=', wallet.id).first();
      return updatedWalletData;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error.message);
    }
  }

  /**
   * Transfer fund to user wallet
   *  @param {string} senderWalletId sender wallet id
   *  @param {TransferToWalletDto}  walletData wallet data payload
   * @returns {Promise<Wallet>}
   */
  public async transferToWallet(senderWalletId: string, walletData: TransferToWalletDto): Promise<Wallet> {
    if (isEmpty(walletData)) throw new HttpException(400, 'walletData is empty');

    const senderWallet: Wallet = await Wallets.query().select().from('wallets').where('wallet_id', '=', senderWalletId).first();
    if (!senderWallet) {
      throw new HttpException(400, "Wallet doesn't exist");
    }

    if (senderWallet.balance < walletData.amount) {
      throw new HttpException(401, 'Insufficient wallet balance');
    }

    const receiverWallet: Wallet = await Wallets.query().select().from('wallets').where('wallet_id', '=', walletData.receiver_wallet_id).first();
    if (!senderWallet) {
      throw new HttpException(400, "Wallet doesn't exist");
    }

    const receiverNewWalletBalance: number = receiverWallet.balance + walletData.amount;
    const senderNewWalletBalance: number = senderWallet.balance - walletData.amount;
    const trx = await Wallets.startTransaction();
    try {
      await Wallets.query(trx).update({ balance: receiverNewWalletBalance }).where('wallet_id', '=', walletData.receiver_wallet_id).into('wallets');

      await Transactions.query(trx)
        .insert({
          reference: generateReference(),
          wallet_id: walletData.receiver_wallet_id,
          amount: walletData.amount,
          description: walletData?.description || null,
          type: TYPES.CREDIT,
          status: STATUS.COMPLETED,
          is_transfer: true,
        })
        .into('transactions');

      await Wallets.query(trx).update({ balance: senderNewWalletBalance }).where('wallet_id', '=', senderWalletId).into('wallets');

      const transaction: Transactions = await Transactions.query(trx)
        .insert({
          reference: generateReference(),
          wallet_id: senderWalletId,
          amount: walletData.amount,
          description: walletData?.description || null,
          type: TYPES.DEBIT,
          status: STATUS.COMPLETED,
          is_transfer: true,
        })
        .into('transactions');

      await Transfers.query(trx)
        .insert({
          sender_wallet_id: senderWalletId,
          receiver_wallet_id: walletData.receiver_wallet_id,
          amount: walletData.amount,
          transaction_id: transaction.id,
        })
        .into('transfers');

      await trx.commit();

      const updatedWalletData: Wallet = await Wallets.query().select().from('wallets').where('wallet_id', '=', senderWalletId).first();
      return updatedWalletData;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error.message);
    }
  }

  /**
   * Withdraw from user wallet
   *  @param {string} walletId user wallet id
   *  @param {number}  amount amount to withdraw
   * @returns {Promise<Wallet>}
   */
  public async withdrawFromWallet(walletId: string, amount: number): Promise<Wallet> {
    if (isEmpty(amount)) throw new HttpException(400, 'amount is empty');

    const wallet: Wallet = await this.findByWalletId(walletId);

    if (!wallet) {
      throw new HttpException(400, 'Wallet does not exist');
    }

    if (wallet.balance < amount) {
      throw new HttpException(401, 'Insufficient wallet balance');
    }

    const balance: number = wallet.balance - amount;

    const trx = await Wallets.startTransaction();
    try {
      await Wallets.query(trx).update({ balance, updated_at: new Date() }).where('id', '=', wallet.id).into('wallets');
      await Transactions.query(trx)
        .insert({ reference: generateReference(), wallet_id: wallet.wallet_id, amount, type: TYPES.DEBIT, status: STATUS.COMPLETED })
        .into('transactions');

      await trx.commit();

      const updatedWalletData: Wallet = await Wallets.query().select().from('wallets').where('id', '=', wallet.id).first();
      return updatedWalletData;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error.message);
    }
  }
}

export default WalletService;
