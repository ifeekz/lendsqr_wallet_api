import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import WalletService from '@/services/wallets.service';
import { Wallet } from '@/interfaces/wallets.interface';

class AuthController {
  public authService = new AuthService();
  public walletService = new WalletService();

  /**
   * Register user method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: CreateUserDto = req.body;
      const { password, ...user }: User = await this.authService.signup(payload);
      const walletData: Wallet = await this.walletService.createWallet(user.phone_number);

      res.status(201).json({
        status: true,
        message: 'Signup successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          wallet_id: walletData.wallet_id,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, user } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        status: true,
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user method
   *  @param {any} req express request
   *  @param {Response}  res express response
   * @returns {Promise<void>}
   */
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({
        status: true,
        message: 'Logout successful',
        data: logOutUserData,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
