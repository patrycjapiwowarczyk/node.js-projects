const express = require("express");
const { signup, login, logout, getCurrentUser, updateAvatar, verifyEmail, resendVerificationEmail } = require("../../models/usersActions");
const authorization = require("../../authorization/userAuth");
const avatarUpload = require("../../avatars/avatarUpload");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authorization, logout);
router.get("/current", authorization, getCurrentUser);
router.patch("/avatars", authorization, avatarUpload, updateAvatar);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmail);

module.exports = router;
