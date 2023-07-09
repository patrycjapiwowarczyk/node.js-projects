const UserSchema = require("./userSchema");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const transporter = require("../nodemailer/nodemailerConfig");

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

  sendVerificationEmail: async (userEmail, userToken) => {
    try {
      const serverUrl = `${process.env.BASE_URL}:${process.env.API_PORT}` || `http://localhost:${process.env.API_PORT}`;
      const verificstionLink = `${serverUrl}/api/users/verify/${userToken}`;

      await UserSchema.findOneAndUpdate({ email: userEmail }, { verificationToken: userToken }, { new: true });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Verification email",
        html: `<p>Click the link to verify your email: <a href="${verificstionLink}">${verificstionLink}</a></p>`,
      };

      const sendingEmail = await transporter.sendMail(mailOptions);
      console.log("Email sent", sendingEmail.messageId, sendingEmail.envelope);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

module.exports = usersTasks;
