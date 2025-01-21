import * as jwt from 'jsonwebtoken';

export class Jwt {
  /*
   * getAuthToken
   */
  public static getAuthToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  public static getRefreshToken(data) {
    return jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  public static decodeRefreshToken(token: string) {
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  /*
   * decodeAuthToken
   */
  public static decodeAuthToken(token: string) {
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return false;
      }
    }
    return false;
  }
}
