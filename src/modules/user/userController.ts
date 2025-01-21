import { Constants } from '../../config/constants';
import { Jwt } from '../../helpers/jwt';
import { Response } from 'express';
import { UserUtils } from './userUtils';

export class UserController {
  private userUtils = new UserUtils();
  public signIn = async (req: any, res: Response) => {
    try {
      const { email, _id, role, name } = req.body._authentication;
      const userDetails = {
        token: await Jwt.getAuthToken({
          id: _id,
        }),
        referesh: await Jwt.getRefreshToken({
          id: _id,
        }),
        email,
        name,
        role,
        id: _id,
      };
      return res
        .status(Constants.SUCCESS_CODE)
        .json({ data: userDetails, message: 'SignIn successfully' });
    } catch (error) {
      return res
        .status(Constants.INTERNAL_SERVER_ERROR_CODE)
        .json({ error: 'INTERNAL SERVER ERROR' });
    }
  };

  public signUp = async (req: any, res: Response) => {
    try {
      const user = await this.userUtils.signUp(req.body);
      const token = await Jwt.getAuthToken({
        id: user._id,
      });
      const referesh = await Jwt.getRefreshToken({
        id: user._id,
      });
      return res.status(Constants.SUCCESS_CODE).json({
        data: { ...user.toObject(), token, referesh },
        message: 'Signup successfully',
      });
    } catch (error) {
      return res
        .status(Constants.INTERNAL_SERVER_ERROR_CODE)
        .json({ error: 'INTERNAL SERVER ERROR' });
    }
  };

  public getToken = (req, res) => {
    try {
      return res.status(Constants.SUCCESS_CODE).json({
        data: req.user,
      });
    } catch (error) {
      return res
        .status(Constants.INTERNAL_SERVER_ERROR_CODE)
        .json({ error: 'INTERNAL SERVER ERROR' });
    }
  };

  public getProfile = async (req: any, res: Response) => {
    try {
      const user = await this.userUtils.getUser(
        { _id: req.user._id },
        { password: 0, __v: 0 }
      );
      return res.status(Constants.SUCCESS_CODE).json({
        data: user,
      });
    } catch (error) {
      return res
        .status(Constants.INTERNAL_SERVER_ERROR_CODE)
        .json({ error: 'INTERNAL SERVER ERROR' });
    }
  };
  public getUsers = async (req: any, res: Response) => {
    try {
      const users = await this.userUtils.getUsers(
        { _id: { $ne: req.user._id } },
        { password: 0, __v: 0, email: 0 }
      );
      return res.status(Constants.SUCCESS_CODE).json({
        data: users,
      });
    } catch (error) {
      return res
        .status(Constants.INTERNAL_SERVER_ERROR_CODE)
        .json({ error: 'INTERNAL SERVER ERROR' });
    }
  };

  public updateUser = async (req: any, res: Response) => {
    try {
      let profile = req.files?.profile || null;
      const updateObj = { ...req.body };

      if (profile) {
        profile = await this.userUtils.uploadImage(profile);
        updateObj.profile = profile;
      }

      const user = await this.userUtils.updateUser(updateObj, {
        _id: req.user._id,
      });

      return res.status(Constants.SUCCESS_CODE).json({
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      return res
        .status(Constants.INTERNAL_SERVER_ERROR_CODE)
        .json({ error: 'INTERNAL SERVER ERROR' });
    }
  };
}
