require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registrationValidate, loginValidate } = require("./usersValidate");
const UserSchema = require("./userSchema");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs");
const usersTasks = require("../models/usersTasks");

const userActions = {
  signup: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { error } = registrationValidate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const userAlreadyExist = await UserSchema.findOne({ email });
      if (userAlreadyExist) {
        return res.status(400).json({ message: `User with email ${email} already exist` });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = {
        email,
        password: hashPassword,
        subscription: "starter",
        avatarURL: gravatar.url(email, {
          protocol: "http",
          s: "250",
          r: "pg",
        }),
      };

      const createdUser = await UserSchema.create(newUser);
      res.status(201).json({ user: createdUser });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { error } = loginValidate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: `User with email ${email} doesn't exist` });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: `Incorrect email or password` });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      user.token = token;
      await user.save();
      res.json({ token, user });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      req.user.token = null;
      await req.user.save();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = req.user;
      res.json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (error) {
      next(error);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      const { user } = req;
      const avatar = req.file;

      if (!user) {
        return res.status(401).json({ message: `User not authorized` });
      }

      const avatarFileName = `${user._id}${path.extname(avatar.originalname)}`;
      const avatarFolder = "./public/avatars";

      if (!fs.existsSync(avatarFolder)) {
        fs.mkdirSync(avatarFolder, { recursive: true });
      }

      await usersTasks.uploadAvatar(avatar, avatarFileName);

      user.avatarURL = `/avatars/${avatarFileName}`;
      await user.save();
      res.json({ avatarURL: user.avatarURL });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userActions;
