import { Model, ModelObject } from 'objection';
import { User } from '@interfaces/users.interface';

export class Users extends Model implements User {
  id!: number;
  email!: string;
  password!: string;

  static tableName = 'users';
  static idColumn = 'id';
}

export type UsersShape = ModelObject<Users>;
