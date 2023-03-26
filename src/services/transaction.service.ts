import { CreateTransactionDto } from '@dtos/transactions.dto';
import { HttpException } from '@exceptions/HttpException';
import { Transaction } from '@interfaces/transactions.interface';
import { Transactions } from '@/models/transaction.model';
import { isEmpty } from '@utils/util';

class TransactionService {
  public async findAllTransaction(): Promise<Transaction[]> {
    const transactions: Transaction[] = await Transactions.query().select().from('transactions');
    return transactions;
  }

  public async findTransactionById(transactionId: number): Promise<Transaction> {
    const findTransaction: Transaction = await Transactions.query().findById(transactionId);
    if (!findTransaction) throw new HttpException(409, "Transaction doesn't exist");

    return findTransaction;
  }

  public async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, 'transactionData is empty');

    const createTransactionData: Transaction = await Transactions.query()
      .insert({ ...transactionData })
      .into('transactions');

    return createTransactionData;
  }
}

export default TransactionService;
