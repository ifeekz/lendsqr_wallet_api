import { Model, ModelObject } from 'objection';
import { Transaction } from '@/interfaces/transactions.interface';

export class Transactions extends Model implements Transaction {
  id!: number;
  wallet_id!: string;
  description!: string;
  amount!: number;
  type!: string;
  status!: string;
  created_at!: Date;
  updated_at!: Date;

  static tableName = 'transactions';
  static idColumn = 'id';
}

export type TransactionsShape = ModelObject<Transactions>;
