import request from 'supertest';
import App from '@/app';
import { LoginDto } from '@dtos/auth.dto';
import { CreateUserDto } from '@dtos/users.dto';
import { FundWalletDto, WithdrawFromWalletDto, TransferToWalletDto } from '@dtos/wallets.dto';
import WalletRoute from '@routes/wallets.route';
import AuthRoute from '@routes/auth.route';

let email: string = '';
let phoneNumber: string = '';
let token: string = '';
beforeAll(async () => {
    let cookies = {};
    phoneNumber = `${Date.now()}`;
    email = `test-${phoneNumber}@email.com`;
    const signupData: CreateUserDto = {
      name: 'Test User',
      email,
      password: 'q1w2e3r4',
      phone_number: phoneNumber,
    };
    const loginData: LoginDto = {
        email,
        password: 'q1w2e3r4',
    };

    const authRoute = new AuthRoute();
    const app = new App([authRoute]);
    await request(app.getServer()).post('/v1/auth/signup').send(signupData).then(async () => {
        const response = await request(app.getServer()).post('/v1/auth/login').send(loginData);
        const cookiesArray = response.headers['set-cookie'][0].split(';');
        cookiesArray.forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookies[key] = value;
        });

        token = cookies['Authorization'];
    });
    
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Wallet', () => {
    describe('[POST] /v1/wallets/fund', () => {
        it('should fund user wallet and respond with statusCode 200 / created', () => {
            const walletData: FundWalletDto = { amount: 2000 };

            const walletRoute = new WalletRoute();
            const app = new App([walletRoute]);
            return request(app.getServer())
                .post('/v1/wallets/fund')
                .send(walletData)
                .set('Authorization', `Bearer ${token}`)
                .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc100')
                .expect(200);
        });
    });
    
    describe('[POST] /v1/wallets/fund', () => {
        it('should respond with statusCode 304 / Not modified for duplicate transaction', () => {
            const walletData: FundWalletDto = { amount: 2000 };

            const walletRoute = new WalletRoute();
            const app = new App([walletRoute]);
            return request(app.getServer())
                .post('/v1/wallets/fund')
                .send(walletData)
                .set('Authorization', `Bearer ${token}`)
                .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc100')
                .expect(304);
        });
    });

    describe('[POST] /v1/wallets/withdraw', () => {
        it('should withdraw from user wallet and respond with statusCode 200 / created', () => {
            const walletData: WithdrawFromWalletDto = { amount: 100 };

            const walletRoute = new WalletRoute();
            const app = new App([walletRoute]);
            return request(app.getServer())
                .post('/v1/wallets/withdraw')
                .send(walletData)
                .set('Authorization', `Bearer ${token}`)
                .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc200')
                .expect(200);
        });
    });

    describe('[POST] /v1/wallets/withdraw', () => {
        it('should respond with statusCode 304 / Not modified for duplicate transaction', () => {
            const walletData: WithdrawFromWalletDto = { amount: 100 };

            const walletRoute = new WalletRoute();
            const app = new App([walletRoute]);
            return request(app.getServer())
                .post('/v1/wallets/withdraw')
                .send(walletData)
                .set('Authorization', `Bearer ${token}`)
                .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc200')
                .expect(304);
        });
    });

    describe('[POST] /v1/wallets/withdraw', () => {
        it('should respond with statusCode 401 / Insufficient wallet balance', () => {
            const walletData: WithdrawFromWalletDto = { amount: 5100 };

            const walletRoute = new WalletRoute();
            const app = new App([walletRoute]);
            return request(app.getServer())
                .post('/v1/wallets/withdraw')
                .send(walletData)
                .set('Authorization', `Bearer ${token}`)
                .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc210')
                .expect(401);
        });
    });

    describe('[POST] /v1/wallets/transfer', () => {
      it('should transfer fund to user wallet and respond with statusCode 200 / created', () => {
          const walletData: TransferToWalletDto = {
              receiver_wallet_id: '1679864104113',
              amount: 100,
              description: 'transfer fund'
          };

        const walletRoute = new WalletRoute();
        const app = new App([walletRoute]);
        return request(app.getServer())
            .post('/v1/wallets/transfer')
            .send(walletData)
            .set('Authorization', `Bearer ${token}`)
            .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc300')
            .expect(200);
      });
    });

    describe('[POST] /v1/wallets/transfer', () => {
      it('should respond with statusCode 304 / Not modified for duplicate transaction', () => {
          const walletData: TransferToWalletDto = {
              receiver_wallet_id: '1679864104113',
              amount: 100,
              description: 'transfer fund'
          };

        const walletRoute = new WalletRoute();
        const app = new App([walletRoute]);
        return request(app.getServer())
            .post('/v1/wallets/transfer')
            .send(walletData)
            .set('Authorization', `Bearer ${token}`)
            .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc300')
            .expect(304);
      });
    });

    describe('[POST] /v1/wallets/transfer', () => {
      it('should respond with statusCode 401 / Insufficient wallet balance', () => {
          const walletData: TransferToWalletDto = {
              receiver_wallet_id: '1679864104113',
              amount: 6100,
              description: 'transfer fund'
          };

        const walletRoute = new WalletRoute();
        const app = new App([walletRoute]);
        return request(app.getServer())
            .post('/v1/wallets/transfer')
            .send(walletData)
            .set('Authorization', `Bearer ${token}`)
            .set('x-idempotence-key', '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc310')
            .expect(401);
      });
    });
});
