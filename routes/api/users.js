const express = require("express");
const { signup, login, logout, getCurrentUser } = require("../../models/usersActions");
const authorization = require("../../authorization/userAuth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authorization, logout);
router.get("/current", authorization, getCurrentUser);

module.exports = router;
