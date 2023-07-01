const UserSchema = require("./userSchema");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");

const usersTasks = {
  getUserByEmail: (email) => {
    return UserSchema.findOne({ email });
  },

  createUser: (userData) => {
    return UserSchema.create(userData);
  },

  updateUserToken: (userId, token) => {
    return UserSchema.findByIdAndUpdate(userId, { token }, { new: true });
  },

  uploadAvatar: async (file, filename) => {
    const pathTmp = path.join(__dirname, `../tmp/${filename}`);
    const pathAvatar = path.join(__dirname, `../public/avatars/${filename}`);

    try {
      await Jimp.read(file.path);
      const avatar = await Jimp.read(file.path);
      avatar.resize(250, 250);
      await avatar.writeAsync(pathTmp);

      await fs.promises.rename(pathTmp, pathAvatar);
      await fs.promises.unlink(file.path);

      return pathAvatar;
    } catch (error) {
      await fs.promises.unlink(file.path);
      throw error;
    }
  },
};

module.exports = usersTasks;
