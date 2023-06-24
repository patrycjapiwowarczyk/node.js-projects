const express = require("express");

const router = express.Router();
const { getContacts, getContactById, getFavoriteContacts, addContact, removeContact, updateContact, toggleFavourite } = require("../../models/contactsActions");

router.get("/", getContacts);

router.get("/:id", getContactById);

router.get("/favorite", getFavoriteContacts);

router.post("/", addContact);

router.delete("/:id", removeContact);

router.put("/:id", updateContact);

router.patch("/:contactId/favorite", toggleFavourite);

module.exports = router;
