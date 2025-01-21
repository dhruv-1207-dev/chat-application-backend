import { Jwt } from '../helpers/jwt';
import { UserUtils } from '../modules/user/userUtils';

export class ChatSocketUtils {
  private userUtils = new UserUtils();
  public async getUserData(token) {
    const decoded = Jwt.decodeAuthToken(token);
    const user = await this.userUtils.getUser(
      { _id: decoded.id },
      { password: 0, __v: 0 }
    );
    return user ?? false;
  }
}
