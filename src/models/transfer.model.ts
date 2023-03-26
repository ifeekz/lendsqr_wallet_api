import { Model, ModelObject } from 'objection';
import { Transfer } from '@/interfaces/transfers.interface';

export class Transfers extends Model implements Transfer {
  id!: number;
  sender_wallet_id!: string;
  receiver_wallet_id!: string;
  amount!: number;
  transaction_id!: number;
  created_at!: Date;

  static tableName = 'transfers';
  static idColumn = 'id';
}

export type TransfersShape = ModelObject<Transfers>;
