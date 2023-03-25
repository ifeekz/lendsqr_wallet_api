import { Model, ModelObject } from 'objection';
import { User } from '@interfaces/users.interface';

export class Users extends Model implements User {
  id!: number;
  name!: string;
  email!: string;
  phone_number!: string;
  password!: string;
  created_at!: Date;

  static tableName = 'users';
  static idColumn = 'id';
}

export type UsersShape = ModelObject<Users>;
