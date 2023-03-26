import { Model, ModelObject } from 'objection';
import { Wallet } from '@/interfaces/wallets.interface';

export class Wallets extends Model implements Wallet {
  id!: number;
  wallet_id!: string;
  balance!: number;
  created_at!: Date;
  updated_at!: Date;

  static tableName = 'wallets';
  static idColumn = 'id';
}

export type WalletsShape = ModelObject<Wallets>;
