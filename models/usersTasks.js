const User = require("../models/userSchema");

const usersTasks = {
  getUserByEmail: (email) => {
    return User.findOne({ email });
  },

  createUser: (userData) => {
    return User.create(userData);
  },

  updateUserToken: (userId, token) => {
    return User.findByIdAndUpdate(userId, { token }, { new: true });
  },
};

module.exports = usersTasks;
