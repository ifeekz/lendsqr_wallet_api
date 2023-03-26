import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { Users } from '@/models/users.model';
import { isEmpty } from '@utils/util';
import { LoginDto } from '@/dtos/auth.dto';

class AuthService {
  /**
   * Register user
   *  @param {CreateUserDto}  userData user data object
   * @returns {Promise<User>}
   */
  public async signup(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await Users.query()
      .insert({ ...userData, password: hashedPassword })
      .into('users');

    delete createUserData.password;

    return createUserData;
  }

  /**
   * Login user
   *  @param {LoginDto}  credentials user credentials object
   * @returns {Promise<{ cookie: string; user: User }>}
   */
  public async login(credentials: LoginDto): Promise<{ cookie: string; user: User }> {
    if (isEmpty(credentials)) throw new HttpException(400, 'credentials is empty');

    const user: User = await Users.query().select().from('users').where('email', '=', credentials.email).first();
    if (!user) throw new HttpException(400, `This email ${credentials.email} was not found`);

    const isPasswordMatching: boolean = await compare(credentials.password, user.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    delete user.password;

    return { cookie, user };
  }

  /**
   * Logout user
   *  @param {CreateUserDto}  userData user data object
   * @returns {Promise<User>}
   */
  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const user: User = await Users.query()
      .select()
      .from('users')
      .where('email', '=', userData.email)
      .andWhere('password', '=', userData.password)
      .first();

    if (!user) throw new HttpException(409, "User doesn't exist");

    return user;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
