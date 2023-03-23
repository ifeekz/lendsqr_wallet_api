import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { Users } from '@models/users.model';

class UserService {
  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await Users.query().findById(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}

export default UserService;
