import bcryptjs = require('bcryptjs');
import * as uuid from 'node-uuid';
import * as path from 'path';
import * as fs from 'fs';
import { Constants } from '../../config/constants';
import User from '../../models/user';

export class UserUtils {
  public signUp = async (data) => {
    data.password = bcryptjs.hashSync(
      data.password,
      Constants.HASH_STRING_LIMIT
    );
    return await User.create(data);
  };

  public getUser = async (data, projection = {}) => {
    return await User.findOne({ ...data, isDeleted: false }, projection);
  };

  public getUsers = async (data, projection = {}) => {
    return await User.find({ ...data, isDeleted: false }, projection);
  };

  public updateUser = async (data, condition) => {
    if (data.password) {
      data.password = bcryptjs.hashSync(
        data.password,
        Constants.HASH_STRING_LIMIT
      );
    }
    return await User.findOneAndUpdate(
      { ...condition },
      { $set: data },
      { new: true, projection: { password: 0 } }
    );
  };

  public uploadImage = async (file) => {
    try {
      let uploadsDir = path.resolve(
        `${__dirname}/../../../`,
        Constants.UPLOAD_FOLDER
      );
      uploadsDir = `${uploadsDir}/${uuid.v1()}`;
      fs.mkdirSync(uploadsDir);

      const tempLocation = uploadsDir;
      const folderPath = tempLocation
        .substr(tempLocation.lastIndexOf(Constants.UPLOAD_FOLDER))
        .replace('uploads/', ''); 
      const ext = path.extname(file.name);
      const staticFileName = `original${ext}`;
      await file.mv(`${uploadsDir}/${staticFileName}`);
      return `${folderPath}/${staticFileName}`;
    } catch (err) {
      throw err;
    }
  };
}
