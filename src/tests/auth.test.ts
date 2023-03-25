import request from 'supertest';
import App from '@/app';
import { LoginDto } from '@dtos/auth.dto';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRoute from '@routes/auth.route';

let email: string = '';
let phoneNumber: string = '';
beforeAll(async () => {
  phoneNumber = `${Date.now()}`;
  email = `test-${phoneNumber}@email.com`;
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /api/v1/auth/signup', () => {
    it('should create user account and respond with statusCode 201 / created', () => {
      const userData: CreateUserDto = {
        name: 'Test User',
        email,
        password: 'q1w2e3r4',
        phone_number: phoneNumber,
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(201);
    });
  });

  describe('[POST] /api/v1/auth/login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: LoginDto = {
        email,
        password: 'q1w2e3r4',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post('/api/v1/auth/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
